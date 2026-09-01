import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.auth!.userId },
    include: { product: true },
  });
  res.json({ items });
});

router.post("/", async (req, res) => {
  const schema = z.object({ productId: z.string(), quantity: z.number().int().min(1).default(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { productId, quantity } = parsed.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Product not found" });

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.auth!.userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: req.auth!.userId, productId, quantity },
    include: { product: true },
  });
  res.json({ item });
});

router.patch("/:productId", async (req, res) => {
  const schema = z.object({ quantity: z.number().int().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: req.auth!.userId, productId: req.params.productId } },
    data: { quantity: parsed.data.quantity },
    include: { product: true },
  });
  res.json({ item });
});

router.delete("/:productId", async (req, res) => {
  await prisma.cartItem.delete({
    where: { userId_productId: { userId: req.auth!.userId, productId: req.params.productId } },
  });
  res.json({ ok: true });
});

export default router;
