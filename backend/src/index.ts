import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import productRoutes from "./routes/products";
import appointmentRoutes from "./routes/appointments";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import feedbackRoutes from "./routes/feedback";
import enquiryRoutes from "./routes/enquiry";
import captchaRoutes from "./routes/captcha";
import adminRoutes from "./routes/admin";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/captcha", captchaRoutes);
app.use("/api/admin", adminRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Tejas Salon API listening on http://localhost:${PORT}`);
});
