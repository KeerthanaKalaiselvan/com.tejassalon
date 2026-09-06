import "dotenv/config";
// Express 4 does not forward errors thrown inside async handlers to the error
// middleware — they surface as unhandled rejections and kill the process.
// This patches Router so a failed query returns 500 instead of a dead API.
import "express-async-errors";
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
import paymentRoutes from "./routes/payments";

const app = express();

/**
 * CORS.
 *
 * Production: exactly one origin, no exceptions.
 * Development: any localhost/127.0.0.1 port. "localhost:3070" and
 * "127.0.0.1:3070" are DIFFERENT origins to a browser, and pinning a single
 * spelling means opening the site the other way silently blocks every API call
 * — which looks to the user like the server is down.
 */
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "http://localhost:3070").replace(/\/$/, "");
const IS_PROD = process.env.NODE_ENV === "production";
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / curl / server-to-server requests send no Origin header.
      if (!origin) return callback(null, true);
      const clean = origin.replace(/\/$/, "");
      if (clean === FRONTEND_ORIGIN) return callback(null, true);
      if (!IS_PROD && LOCAL_ORIGIN.test(clean)) return callback(null, true);
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
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
app.use("/api/payments", paymentRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Tejas Salon API listening on http://localhost:${PORT}`);
});
