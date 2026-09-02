import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signAuthToken, AUTH_COOKIE_NAME } from "../lib/auth";
import { requireAuth } from "../middleware/auth";
import { SERVICE_SELECT } from "../lib/selects";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  secure: isProduction,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number");

const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

router.post("/register", async (req, res) => {
  const schema = z.object({
    mobile: mobileSchema,
    password: newPasswordSchema,
    name: z.string().trim().min(1, "Name is required"),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { mobile, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { mobile } });
  if (existing) {
    return res.status(409).json({ error: "An account with this mobile number already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { mobile, passwordHash, name },
  });

  const token = signAuthToken({ userId: user.id, isAdmin: false });
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
  res.json({
    token,
    user: { id: user.id, mobile: user.mobile, name: user.name, onboarded: user.onboarded },
  });
});

router.post("/onboarding", requireAuth, async (req, res) => {
  const schema = z.object({
    serviceIds: z.array(z.string()),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const userId = req.auth!.userId;
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      onboarded: true,
      serviceInterests: { set: parsed.data.serviceIds.map((id) => ({ id })) },
    },
  });

  res.json({ user: { id: user.id, mobile: user.mobile, name: user.name, onboarded: user.onboarded } });
});

router.post("/login", async (req, res) => {
  const schema = z.object({ mobile: mobileSchema, password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { mobile, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) return res.status(401).json({ error: "Invalid mobile number or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid mobile number or password" });

  const token = signAuthToken({ userId: user.id, isAdmin: user.isAdmin });
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
  res.json({
    token,
    user: { id: user.id, mobile: user.mobile, name: user.name, onboarded: user.onboarded, isAdmin: user.isAdmin },
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    include: { serviceInterests: { select: SERVICE_SELECT } },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    user: {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      onboarded: user.onboarded,
      isAdmin: user.isAdmin,
      serviceInterests: user.serviceInterests,
    },
  });
});

export default router;
