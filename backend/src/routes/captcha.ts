import { Router } from "express";
import { generateMathCaptcha, HCAPTCHA_ENABLED } from "../lib/captcha";

const router = Router();

router.get("/", (_req, res) => {
  if (HCAPTCHA_ENABLED) {
    return res.json({ mode: "hcaptcha" });
  }
  const challenge = generateMathCaptcha();
  res.json({ mode: "math", ...challenge });
});

export default router;
