import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(1),
    mobile: z.string().trim().min(6),
    email: z.string().trim().email().optional().or(z.literal("")),
    message: z.string().trim().min(1).max(2000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const enquiry = await prisma.enquiry.create({
    data: { ...parsed.data, email: parsed.data.email || undefined },
  });
  res.json({ enquiry });
});

export default router;
