import jwt from "jsonwebtoken";

const CAPTCHA_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const HCAPTCHA_ENABLED = Boolean(process.env.HCAPTCHA_SECRET);

export type CaptchaChallenge = {
  token: string;
  question: string;
};

/**
 * Built-in, dependency-free captcha: a simple arithmetic question. The
 * answer never reaches the client in plain text — it's embedded in a
 * short-lived signed token and re-checked server-side on submit.
 */
export function generateMathCaptcha(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  const ops = ["+", "x"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  const answer = op === "+" ? a + b : a * b;

  const token = jwt.sign({ answer }, CAPTCHA_SECRET, { expiresIn: "5m" });
  return { token, question: `${a} ${op} ${b}` };
}

export function verifyMathCaptcha(token: string, answer: number): boolean {
  try {
    const decoded = jwt.verify(token, CAPTCHA_SECRET) as { answer: number };
    return decoded.answer === answer;
  } catch {
    return false;
  }
}

export async function verifyHCaptcha(responseToken: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return false;

  const body = new URLSearchParams({ secret, response: responseToken });
  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
