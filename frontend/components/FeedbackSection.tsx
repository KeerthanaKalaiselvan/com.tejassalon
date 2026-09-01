"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { Feedback } from "@/lib/types";

export default function FeedbackSection({ feedback }: { feedback: Feedback[] }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await apiFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ name, rating, message }),
      });
      setStatus("done");
      setName("");
      setMessage("");
      setRating(5);
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not submit your feedback.");
    }
  }

  return (
    <section className="bg-navy py-24 text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:px-8">
        <div>
          <p className="eyebrow text-glow">Feedback</p>
          <h2 className="section-heading mt-3 text-cream">What Our Guests Say</h2>
          <div className="mt-8 flex flex-col gap-5">
            {feedback.length === 0 && (
              <p className="text-cream/60">
                Be the first to share how your visit to Tejas Salon went.
              </p>
            )}
            {feedback.map((item) => (
              <div key={item.id} className="curved-card border-gold/15 bg-navy-light/60 p-5">
                <p className="font-serif text-gold">{"★".repeat(item.rating)}</p>
                <p className="mt-2 text-sm text-cream/80">{item.message}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-cream/40">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="curved-card border-gold/20 bg-navy-light/40 p-7">
          <h3 className="font-serif text-2xl text-cream">Share Your Experience</h3>
          {status === "done" ? (
            <p className="mt-4 text-sm text-glow">
              Thank you! Your feedback has been received and will appear here once reviewed.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-cream/20 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-cream/70">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="rounded-xl border border-cream/20 bg-navy px-3 py-2 text-cream focus:border-gold focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your visit"
                rows={4}
                className="rounded-xl border border-cream/20 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
              />
              {error && <p className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={status === "submitting"} className="gold-button">
                {status === "submitting" ? "Sending…" : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
