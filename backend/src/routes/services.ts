import { Router } from "express";
import { prisma } from "../lib/prisma";
import { SERVICE_SELECT } from "../lib/selects";

const router = Router();

router.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    select: SERVICE_SELECT,
  });
  res.json({ services });
});

router.get("/:slug", async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { slug: req.params.slug },
    select: SERVICE_SELECT,
  });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ service });
});

export default router;
