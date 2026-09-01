import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  res.json({ products });
});

router.get("/:slug", async (req, res) => {
  const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product });
});

export default router;
