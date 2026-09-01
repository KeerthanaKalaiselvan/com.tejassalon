"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Service } from "@/lib/types";
import { formatDateLabel, generateTimeSlots } from "@/lib/booking";
import MiniCalendar from "@/components/MiniCalendar";
import Celebration from "@/components/Celebration";
import LoginGate from "@/components/LoginGate";

type Step = "services" | "slots" | "done";
type SlotChoice = { date: string; time: string };

export default function BookAppointmentPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<Step>("services");

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotChoice[]>([]);
  const [notes, setNotes] = useState("");

  const timeSlots = useMemo(() => generateTimeSlots(pendingDate ?? undefined), [pendingDate]);

  function selectPendingDate(dateKey: string) {
    setPendingDate(dateKey);
    setPendingTime(null);
  }

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ services: Service[] }>("/api/services")
      .then((data) => setServices(data.services))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (user?.serviceInterests?.length) {
      setSelectedServices((prev) =>
        prev.length ? prev : user.serviceInterests!.map((s) => s.id)
      );
    }
  }, [user]);

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function addSlot() {
    if (!pendingDate || !pendingTime) return;
    if (slots.length >= 3) return;
    if (slots.some((s) => s.date === pendingDate && s.time === pendingTime)) return;
    setSlots((prev) => [...prev, { date: pendingDate, time: pendingTime }]);
    setPendingDate(null);
    setPendingTime(null);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitBooking() {
    setSubmitting(true);
    setError("");
    try {
      const data = await apiFetch<{ whatsappLink: string | null }>("/api/appointments", {
        method: "POST",
        body: JSON.stringify({ serviceIds: selectedServices, slots, notes: notes || undefined }),
      });
      setWhatsappLink(data.whatsappLink);
      setStep("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your booking.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-navy">Loading…</div>;
  }

  if (!user) {
    return (
      <LoginGate
        eyebrow="Reserve Your Spot"
        title="Log In to Book Your Appointment"
        subtitle="Create a free account or log in so we know who to confirm your appointment with."
        next="/book"
      />
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <p className="eyebrow">Reserve Your Spot</p>
      <h1 className="section-heading mt-3">Book Your Appointment</h1>

      <StepIndicator step={step} />

      {step === "services" && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-navy">What are you looking for?</h2>
          <p className="mt-1 text-sm text-ink/60">Select one or more services.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {services.map((service) => {
              const active = selectedServices.includes(service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`rounded-2xl border px-4 py-5 text-left transition-all ${
                    active
                      ? "border-gold bg-gold/15 shadow-glow"
                      : "border-gold/20 bg-white hover:border-gold/50"
                  }`}
                >
                  <span className="block font-serif text-base text-navy">{service.name}</span>
                  <span className="mt-1 block text-xs text-ink/50">From ₹{service.priceFrom}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={selectedServices.length === 0}
            onClick={() => setStep("slots")}
            className="gold-button mt-8 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === "slots" && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-navy">Pick 3 preferred date &amp; time options</h2>
          <p className="mt-1 text-sm text-ink/60">
            We'll try our best to confirm your first choice — pick a date, then a time between
            9 AM and 11 PM.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <MiniCalendar selectedDate={pendingDate} onSelect={selectPendingDate} />

            <div>
              <p className="mb-3 text-sm font-semibold text-navy">Available Times</p>
              <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
                {timeSlots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    disabled={!pendingDate}
                    onClick={() => setPendingTime(time)}
                    className={`rounded-lg border px-2 py-2 text-xs transition-colors disabled:opacity-30 ${
                      pendingTime === time
                        ? "border-gold bg-gold text-ink font-semibold"
                        : "border-gold/20 bg-white text-navy hover:border-gold/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!pendingDate || !pendingTime || slots.length >= 3}
                onClick={addSlot}
                className="mt-4 w-full rounded-pill border border-gold/60 px-7 py-3 text-sm font-semibold tracking-wide text-navy transition-colors duration-300 hover:bg-gold hover:text-ink disabled:opacity-40"
              >
                Add This Slot ({slots.length}/3)
              </button>
            </div>
          </div>

          {slots.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2">
              {slots.map((slot, i) => (
                <li
                  key={`${slot.date}-${slot.time}`}
                  className="flex items-center justify-between rounded-xl border border-gold/25 bg-white px-4 py-3 text-sm"
                >
                  <span className="text-navy">
                    Option {i + 1}: {formatDateLabel(slot.date)} at {slot.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    className="text-xs text-ink/50 hover:text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything you'd like us to know? (optional)"
            rows={3}
            className="mt-6 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none"
          />

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setStep("services")}
              className="rounded-pill border border-gold/50 px-7 py-3 text-sm font-semibold tracking-wide text-navy transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              Back
            </button>
            <button
              type="button"
              disabled={slots.length !== 3 || submitting}
              onClick={submitBooking}
              className="gold-button disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="mt-10">
          <Celebration />
          {whatsappLink && (
            <div className="mt-6 text-center">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="gold-button">
                Confirm on WhatsApp
              </a>
              <p className="mt-3 text-sm text-ink/60">
                Optional — send us a WhatsApp message so we can confirm faster.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "services", label: "1. Services" },
    { key: "slots", label: "2. Date & Time" },
    { key: "done", label: "3. Confirmation" },
  ];
  return (
    <div className="mt-6 flex gap-6 text-xs uppercase tracking-widest text-ink/40">
      {steps.map((s) => (
        <span key={s.key} className={s.key === step ? "text-gold-dark font-semibold" : ""}>
          {s.label}
        </span>
      ))}
    </div>
  );
}
