import crypto from "crypto";
import Razorpay from "razorpay";

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

/** null when keys are absent, so callers can degrade to pay-at-salon. */
export function getRazorpayClient(): Razorpay | null {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

export const isRazorpayConfigured = () => Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
export const isWebhookConfigured = () => Boolean(RAZORPAY_WEBHOOK_SECRET);

/**
 * Constant-time compare. A plain !== leaks, through timing, how many leading
 * characters of the expected signature were correct.
 */
export function signaturesMatch(expected: string, received: string | undefined): boolean {
  if (!received) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Checkout callback signature: HMAC-SHA256 of "<order_id>|<payment_id>". */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string | undefined) {
  if (!RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return signaturesMatch(expected, signature);
}

/** Webhook signature: HMAC-SHA256 over the RAW request bytes. */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined) {
  if (!RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
  return signaturesMatch(expected, signature);
}
