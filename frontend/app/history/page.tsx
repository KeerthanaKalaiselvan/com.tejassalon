"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Appointment, Order } from "@/lib/types";
import { formatDateLabel } from "@/lib/booking";
import LoginGate from "@/components/LoginGate";

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"appointments" | "orders">("appointments");

  useEffect(() => {
    if (!user) return;
    apiFetch<{ appointments: Appointment[] }>("/api/appointments/me").then((d) =>
      setAppointments(d.appointments)
    );
    apiFetch<{ orders: Order[] }>("/api/orders/me").then((d) => setOrders(d.orders));
  }, [user]);

  if (loading) return <div className="mx-auto max-w-3xl px-6 py-24 text-center">Loading…</div>;

  if (!user) {
    return (
      <LoginGate
        eyebrow="Your Account"
        title="Log In to View Your History"
        subtitle="See your past appointments and orders in one place."
        next="/history"
      />
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <p className="eyebrow">Your Account</p>
      <h1 className="section-heading mt-3">History</h1>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setTab("appointments")}
          className={`rounded-pill px-5 py-2 text-sm ${
            tab === "appointments" ? "bg-gold text-ink" : "border border-gold/30 text-cream"
          }`}
        >
          Appointments
        </button>
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`rounded-pill px-5 py-2 text-sm ${
            tab === "orders" ? "bg-gold text-ink" : "border border-gold/30 text-cream"
          }`}
        >
          Orders
        </button>
      </div>

      {tab === "appointments" ? (
        <div className="mt-8 flex flex-col gap-4">
          {appointments.length === 0 && <p className="text-muted">No appointments yet.</p>}
          {appointments.map((appt) => (
            <div key={appt.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg text-cream">
                  {appt.services.map((s) => s.name).join(", ")}
                </p>
                <StatusBadge status={appt.status} />
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
                {appt.slots.map((slot) => (
                  <li key={slot.rank}>
                    Option {slot.rank}: {formatDateLabel(slot.date)} at {slot.time}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
          {orders.map((order) => (
            <div key={order.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg text-cream">
                  Order #{order.id.slice(-6).toUpperCase()}
                </p>
                <StatusBadge status={order.status} />
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.product.name} × {item.quantity} — ₹{item.priceAtOrder * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-right font-semibold text-cream">Total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-pill border border-gold/40 px-3 py-1 text-xs uppercase tracking-widest text-gold">
      {status}
    </span>
  );
}
