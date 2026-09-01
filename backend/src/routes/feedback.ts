import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const feedback = await prisma.feedback.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  res.json({ feedback });
});

router.post("/", optionalAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(1),
    rating: z.number().int().min(1).max(5),
    message: z.string().trim().min(1).max(1000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const feedback = await prisma.feedback.create({
    data: { ...parsed.data, userId: req.auth?.userId },
  });
  res.json({ feedback });
});

export default router;
