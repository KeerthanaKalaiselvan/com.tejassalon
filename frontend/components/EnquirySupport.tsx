"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

export default function EnquirySupport() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await apiFetch("/api/enquiry", { method: "POST", body: JSON.stringify(form) });
      setStatus("done");
      setForm({ name: "", mobile: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not send your enquiry.");
    }
  }

  return (
    <section id="support" className="bg-ink py-24">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <p className="eyebrow">Enquiry &amp; Support</p>
        <h2 className="section-heading mt-3">Have a Question? Ask Us Anything</h2>
        <p className="mt-3 text-muted">
          From treatment recommendations to product advice, our team usually replies within a
          few hours.
        </p>

        {status === "done" ? (
          <p className="mt-8 rounded-card border border-gold/30 bg-ink-soft p-6 text-cream shadow-soft">
            Thank you — we&apos;ve received your message and will get back to you shortly.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="rounded-xl border border-gold/30 bg-ink-soft px-4 py-3 text-cream placeholder:text-muted-dim focus:border-gold focus:outline-none"
            />
            <input
              required
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              placeholder="Mobile number"
              className="rounded-xl border border-gold/30 bg-ink-soft px-4 py-3 text-cream placeholder:text-muted-dim focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email (optional)"
              className="rounded-xl border border-gold/30 bg-ink-soft px-4 py-3 text-cream placeholder:text-muted-dim focus:border-gold focus:outline-none sm:col-span-2"
            />
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="How can we help?"
              rows={4}
              className="rounded-xl border border-gold/30 bg-ink-soft px-4 py-3 text-cream placeholder:text-muted-dim focus:border-gold focus:outline-none sm:col-span-2"
            />
            {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="gold-button sm:col-span-2"
            >
              {status === "submitting" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
