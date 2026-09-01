import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.post("/checkout", async (req, res) => {
  const userId = req.auth!.userId;
  const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  if (cartItems.length === 0) return res.status(400).json({ error: "Your cart is empty" });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtOrder: item.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  res.json({ order });
});

router.get("/me", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.auth!.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
});

export default router;
