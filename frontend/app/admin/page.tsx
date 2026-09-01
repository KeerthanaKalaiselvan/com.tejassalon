"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";

type Captcha = { mode: "math" | "hcaptcha"; token?: string; question?: string };

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadCaptcha() {
    apiFetch<Captcha>("/api/captcha").then(setCaptcha);
  }

  useEffect(() => {
    loadCaptcha();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          mobile,
          password,
          captchaToken: captcha?.token,
          captchaAnswer: captchaAnswer ? Number(captchaAnswer) : undefined,
        }),
      });
      await refreshUser();
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in.");
      setCaptchaAnswer("");
      loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-20">
      <p className="eyebrow">Salon Admin</p>
      <h1 className="section-heading mt-3 text-3xl">Admin Login</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Admin mobile number"
          className="rounded-xl border border-gold/30 bg-white px-4 py-3 text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-xl border border-gold/30 bg-white px-4 py-3 text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none"
        />

        {captcha?.mode === "math" && (
          <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-white px-4 py-3">
            <span className="font-serif text-lg text-navy">{captcha.question} =</span>
            <input
              required
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-20 rounded-lg border border-gold/30 px-2 py-1 text-navy focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={loadCaptcha}
              className="ml-auto text-xs text-ink/40 hover:text-gold-dark"
            >
              Refresh
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="gold-button mt-2">
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/40">
        First time setting up? Use the seeded admin account, or create one via the
        <code className="mx-1 rounded bg-navy/5 px-1.5 py-0.5">/api/admin/bootstrap</code>
        endpoint documented in the backend README.
      </p>
    </section>
  );
}
