import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signAuthToken, AUTH_COOKIE_NAME } from "../lib/auth";
import { requireAdmin } from "../middleware/auth";
import { HCAPTCHA_ENABLED, verifyHCaptcha, verifyMathCaptcha } from "../lib/captcha";
import { SERVICE_SELECT } from "../lib/selects";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 12 * 60 * 60 * 1000,
};

router.post("/bootstrap", async (req, res) => {
  const schema = z.object({
    mobile: z.string().trim().min(6),
    password: z.string().min(8),
    setupKey: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  if (parsed.data.setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({ error: "Invalid setup key" });
  }
  const existingAdmin = await prisma.user.findFirst({ where: { isAdmin: true } });
  if (existingAdmin) {
    return res.status(409).json({ error: "An admin account already exists" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const admin = await prisma.user.create({
    data: { mobile: parsed.data.mobile, passwordHash, isAdmin: true, onboarded: true, name: "Admin" },
  });
  res.json({ ok: true, mobile: admin.mobile });
});

router.post("/login", async (req, res) => {
  const schema = z.object({
    mobile: z.string().trim().min(6),
    password: z.string().min(1),
    captchaToken: z.string().optional(),
    captchaAnswer: z.number().optional(),
    hcaptchaToken: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { mobile, password, captchaToken, captchaAnswer, hcaptchaToken } = parsed.data;

  const captchaOk = HCAPTCHA_ENABLED
    ? hcaptchaToken
      ? await verifyHCaptcha(hcaptchaToken)
      : false
    : captchaToken !== undefined && captchaAnswer !== undefined
    ? verifyMathCaptcha(captchaToken, captchaAnswer)
    : false;

  if (!captchaOk) return res.status(400).json({ error: "Captcha verification failed" });

  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user || !user.isAdmin) return res.status(401).json({ error: "Invalid admin credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid admin credentials" });

  const token = signAuthToken({ userId: user.id, isAdmin: true });
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
  res.json({ token, user: { id: user.id, mobile: user.mobile, name: user.name } });
});

router.use(requireAdmin);

router.get("/stats", async (_req, res) => {
  const [users, appointments, orders, enquiries, pendingFeedback] = await Promise.all([
    prisma.user.count({ where: { isAdmin: false } }),
    prisma.appointment.count(),
    prisma.order.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.feedback.count({ where: { approved: false } }),
  ]);
  res.json({ users, appointments, orders, enquiries, pendingFeedback });
});

router.get("/appointments", async (_req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: {
      user: { select: { id: true, mobile: true, name: true } },
      services: { select: SERVICE_SELECT },
      slots: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ appointments });
});

router.patch("/appointments/:id", async (req, res) => {
  const schema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const appointment = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
  });
  res.json({ appointment });
});

router.get("/enquiries", async (_req, res) => {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ enquiries });
});

router.patch("/enquiries/:id", async (req, res) => {
  const schema = z.object({ status: z.enum(["NEW", "RESPONDED"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const enquiry = await prisma.enquiry.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
  });
  res.json({ enquiry });
});

router.get("/feedback", async (_req, res) => {
  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ feedback });
});

router.patch("/feedback/:id", async (req, res) => {
  const schema = z.object({ approved: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const feedback = await prisma.feedback.update({
    where: { id: req.params.id },
    data: { approved: parsed.data.approved },
  });
  res.json({ feedback });
});

router.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, mobile: true, name: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
});

export default router;
