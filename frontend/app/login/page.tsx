"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Service } from "@/lib/types";
import CenteredCardBackdrop from "@/components/CenteredCardBackdrop";

type View = "login" | "register" | "onboarding";

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_HINT = "At least 8 characters, with a number, a capital letter and a special character";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const { user, loading, login, register, completeOnboarding } = useAuth();
  const [view, setView] = useState<View>("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && user?.onboarded) {
      router.replace(next);
    } else if (!loading && user && !user.onboarded) {
      setView("onboarding");
    }
  }, [loading, user, next, router]);

  useEffect(() => {
    if (view !== "onboarding" || services.length > 0) return;
    setServicesLoading(true);
    apiFetch<{ services: Service[] }>("/api/services")
      .then((data) => setServices(data.services))
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, [view, services.length]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedInUser = await login(mobile, password);
      if (!loggedInUser.onboarded) {
        setView("onboarding");
      } else {
        router.replace(next);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      setError(PASSWORD_HINT);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await register(mobile, password, name.trim());
      setView("onboarding");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOnboardingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (services.length > 0 && selectedServices.length === 0) {
      setError("Pick at least one service you're interested in.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await completeOnboarding(selectedServices);
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your preferences.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-navy">Loading…</div>;
  }

  return (
    <CenteredCardBackdrop>
      {view === "login" && (
        <>
          <p className="eyebrow">Welcome Back</p>
          <h1 className="section-heading mt-1 text-navy md:text-4xl">Log In</h1>
          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <FieldMobile mobile={mobile} setMobile={setMobile} />
            <FieldPassword
              label="Password"
              password={password}
              setPassword={setPassword}
              hint={null}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={submitting} className="gold-button mt-2 w-full">
              {submitting ? "Logging in…" : "Log In"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-ink/60">
            New here?{" "}
            <button
              type="button"
              className="text-gold-dark underline underline-offset-4"
              onClick={() => {
                setError("");
                setView("register");
              }}
            >
              Create an account
            </button>
          </p>
        </>
      )}

      {view === "register" && (
        <>
          <h1 className="section-heading mt-1 text-navy md:text-4xl">Create Your Account</h1>
          <form onSubmit={handleRegisterStep1} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-ink/60">
                Name <span className="text-gold-dark">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={INPUT_CLASS}
              />
            </div>
            <FieldMobile mobile={mobile} setMobile={setMobile} required />
            <FieldPassword
              label="Create a password"
              password={password}
              setPassword={setPassword}
              hint={PASSWORD_HINT}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={submitting} className="gold-button mt-2 w-full">
              {submitting ? "Creating account…" : "Continue"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <button
              type="button"
              className="text-gold-dark underline underline-offset-4"
              onClick={() => {
                setError("");
                setView("login");
              }}
            >
              Log in
            </button>
          </p>
        </>
      )}

      {view === "onboarding" && (
        <>
          <p className="eyebrow">Step 2 of 2</p>
          <h1 className="section-heading mt-1 text-navy md:text-4xl">What Brings You In?</h1>
          <p className="mt-2 text-sm text-ink/60">
            Select everything you&apos;re interested in — we&apos;ll tailor recommendations for you.
          </p>
          <form onSubmit={handleOnboardingSubmit} className="mt-6">
            {servicesLoading ? (
              <p className="text-sm text-ink/50">Loading services…</p>
            ) : services.length === 0 ? (
              <p className="rounded-2xl border border-gold/20 bg-cream-dim px-4 py-4 text-sm text-ink/60">
                No services to choose from yet — you can still continue, and we&apos;ll follow up
                to hear what you&apos;re looking for.
              </p>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                {services.map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`rounded-2xl border px-3 py-4 text-left transition-all duration-200 ${
                        active
                          ? "border-gold bg-gold/15 shadow-glow"
                          : "border-gold/20 bg-cream-dim hover:border-gold/50"
                      }`}
                    >
                      <span className="block font-serif text-base text-navy">{service.name}</span>
                      <span className="mt-1 block text-xs text-ink/45">{service.category}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={submitting} className="gold-button mt-6 w-full">
              {submitting ? "Saving…" : "Save & Continue"}
            </button>
          </form>
        </>
      )}
    </CenteredCardBackdrop>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-24 text-center">Loading…</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

const INPUT_CLASS =
  "rounded-xl border border-gold/30 bg-cream-dim px-4 py-3 text-navy placeholder:text-navy/40 focus:border-gold focus:bg-white focus:outline-none transition-colors";

function FieldMobile({
  mobile,
  setMobile,
  required,
}: {
  mobile: string;
  setMobile: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-ink/60">
        Mobile number {required && <span className="text-gold-dark">*</span>}
      </label>
      <input
        required={required}
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
        placeholder="10-digit mobile number"
        inputMode="numeric"
        className={INPUT_CLASS}
      />
    </div>
  );
}

function FieldPassword({
  label,
  password,
  setPassword,
  hint,
  required,
}: {
  label: string;
  password: string;
  setPassword: (v: string) => void;
  hint: string | null;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-ink/60">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      <input
        required={required}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={hint ? "Create a password" : "Enter your password"}
        className={INPUT_CLASS}
      />
      {hint && <p className="text-xs text-ink/45">{hint}</p>}
    </div>
  );
}
