import { Router, raw } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import {
  RAZORPAY_KEY_ID,
  getRazorpayClient,
  isRazorpayConfigured,
  isWebhookConfigured,
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from "../lib/razorpay";

const router = Router();

/** Public: lets the client know whether to offer online payment at all. */
router.get("/config", (_req, res) => {
  res.json({ enabled: isRazorpayConfigured(), keyId: RAZORPAY_KEY_ID });
});

/**
 * Marks an order paid. Shared by the browser callback and the webhook so both
 * converge on identical state. Idempotent: an already-paid order short-circuits,
 * so Razorpay's webhook retries cannot double-apply.
 */
async function settleOrder(orderId: string, razorpayPaymentId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;
  if (order.status === "PAID") return order;

  return prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", razorpayPaymentId, paidAt: new Date() },
  });
}

/**
 * Create a Razorpay order for the signed-in user's cart.
 * The amount is computed HERE from the database — never taken from the client,
 * so a tampered request cannot change the price.
 */
router.post("/order", requireAuth, async (req, res) => {
  const razorpay = getRazorpayClient();
  if (!razorpay) return res.status(503).json({ error: "Online payment is not enabled." });

  const userId = req.auth!.userId;
  const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  if (cartItems.length === 0) return res.status(400).json({ error: "Your cart is empty" });

  const outOfStock = cartItems.find((i) => i.product.stock < i.quantity);
  if (outOfStock) {
    return res.status(400).json({ error: `${outOfStock.product.name} is out of stock.` });
  }

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  if (total <= 0) return res.status(400).json({ error: "Cart total is not valid for checkout." });

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "PENDING_PAYMENT",
      paymentMethod: "RAZORPAY",
      items: {
        create: cartItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          priceAtOrder: i.product.price,
        })),
      },
    },
  });

  try {
    // Razorpay works in the smallest currency unit: paise.
    const rzpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `tejas-${order.id}`.slice(0, 40),
      notes: { orderId: order.id, userId },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    res.status(201).json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    res.status(502).json({ error: "Could not start payment. Please try again." });
  }
});

/** Browser callback after checkout. Scoped to the signed-in user. */
router.post("/verify", requireAuth, async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_signature } = req.body ?? {};
  if (!orderId || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: req.auth!.userId },
  });
  if (!order || !order.razorpayOrderId) return res.status(404).json({ error: "Order not found" });
  if (order.status === "PAID") return res.json({ order });

  if (!verifyCheckoutSignature(order.razorpayOrderId, razorpay_payment_id, razorpay_signature)) {
    return res.status(400).json({ error: "Payment signature verification failed" });
  }

  const settled = await settleOrder(order.id, razorpay_payment_id);
  await prisma.cartItem.deleteMany({ where: { userId: req.auth!.userId } });
  res.json({ order: settled });
});

/**
 * Razorpay webhook — the safety net the browser callback cannot provide. If the
 * customer pays then closes the tab or loses signal, /verify is never called and
 * the order would sit unpaid forever despite the money being captured.
 *
 * No auth (Razorpay holds no session) and the signature is checked against the
 * RAW bytes, so this route parses its own body before the global express.json().
 */
router.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  if (!isWebhookConfigured()) {
    return res.status(503).json({ error: "Webhook secret not configured" });
  }

  const raw = req.body as Buffer;
  const signature = req.get("x-razorpay-signature");
  if (!Buffer.isBuffer(raw) || !verifyWebhookSignature(raw, signature)) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  let event: any;
  try {
    event = JSON.parse(raw.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Malformed payload" });
  }

  const payment = event?.payload?.payment?.entity;
  // 200 anything we don't act on, so Razorpay stops retrying it.
  if (event?.event !== "payment.captured" || !payment?.order_id) {
    return res.json({ received: true });
  }

  try {
    const order = await prisma.order.findFirst({ where: { razorpayOrderId: payment.order_id } });
    if (!order) return res.json({ received: true }); // unknown order won't resolve on retry

    await settleOrder(order.id, payment.id);
    await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
    res.json({ received: true });
  } catch {
    // 5xx so Razorpay retries a transient failure.
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
