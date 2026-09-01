import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { SERVICE_SELECT } from "../lib/selects";

const router = Router();

const slotSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
});

router.post("/", requireAuth, async (req, res) => {
  const schema = z.object({
    serviceIds: z.array(z.string()).min(1, "Select at least one service"),
    slots: z.array(slotSchema).length(3, "Please share 3 preferred date & time options"),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { serviceIds, slots, notes } = parsed.data;
  const userId = req.auth!.userId;

  const [user, services] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.service.findMany({ where: { id: { in: serviceIds } } }),
  ]);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (services.length === 0) return res.status(400).json({ error: "Unknown service selected" });

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      notes,
      services: { connect: services.map((s) => ({ id: s.id })) },
      slots: { create: slots.map((s, i) => ({ rank: i + 1, date: s.date, time: s.time })) },
    },
    include: { services: { select: SERVICE_SELECT }, slots: true },
  });

  const salonNumber = process.env.SALON_WHATSAPP_NUMBER || "";
  const serviceNames = services.map((s) => s.name).join(", ");
  const slotLines = slots
    .map((s, i) => `Option ${i + 1}: ${s.date} at ${s.time}`)
    .join("\n");
  const message = [
    `Hi Tejas Salon, I'd like to book an appointment.`,
    `Name: ${user.name || "Guest"}`,
    `Mobile: ${user.mobile}`,
    `Service(s): ${serviceNames}`,
    `Preferred slots:\n${slotLines}`,
  ].join("\n");

  const whatsappLink = salonNumber
    ? `https://wa.me/${salonNumber}?text=${encodeURIComponent(message)}`
    : null;

  res.json({ appointment, whatsappLink });
});

router.get("/me", requireAuth, async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId: req.auth!.userId },
    include: { services: { select: SERVICE_SELECT }, slots: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ appointments });
});

export default router;
