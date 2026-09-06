"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatDateLabel } from "@/lib/booking";

type Stats = {
  users: number;
  appointments: number;
  orders: number;
  enquiries: number;
  pendingFeedback: number;
};

type AdminAppointment = {
  id: string;
  status: string;
  user: { mobile: string; name: string | null };
  services: { name: string }[];
  slots: { rank: number; date: string; time: string }[];
};

type AdminEnquiry = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  message: string;
  status: string;
  createdAt: string;
};

type AdminFeedback = {
  id: string;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
};

type AdminOrder = {
  id: string;
  total: number;
  status: string;
  user: { mobile: string; name: string | null };
  items: { quantity: number; priceAtOrder: number; product: { name: string } }[];
};

type Tab = "overview" | "appointments" | "enquiries" | "feedback" | "orders";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [feedback, setFeedback] = useState<AdminFeedback[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user?.isAdmin) {
      router.replace("/admin");
      return;
    }
    apiFetch<Stats>("/api/admin/stats").then(setStats);
    apiFetch<{ appointments: AdminAppointment[] }>("/api/admin/appointments").then((d) =>
      setAppointments(d.appointments)
    );
    apiFetch<{ enquiries: AdminEnquiry[] }>("/api/admin/enquiries").then((d) =>
      setEnquiries(d.enquiries)
    );
    apiFetch<{ feedback: AdminFeedback[] }>("/api/admin/feedback").then((d) =>
      setFeedback(d.feedback)
    );
    apiFetch<{ orders: AdminOrder[] }>("/api/admin/orders").then((d) => setOrders(d.orders));
  }, [loading, user, router]);

  async function updateAppointmentStatus(id: string, status: string) {
    await apiFetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function updateEnquiryStatus(id: string, status: string) {
    await apiFetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  async function toggleFeedbackApproval(id: string, approved: boolean) {
    await apiFetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, approved } : f)));
  }

  if (loading || !user?.isAdmin) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center">Loading…</div>;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "appointments", label: "Appointments" },
    { key: "enquiries", label: "Enquiries" },
    { key: "feedback", label: "Feedback" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Salon Admin</p>
          <h1 className="section-heading mt-2 text-3xl">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={() => logout().then(() => router.push("/admin"))}
          className="rounded-pill border border-gold/40 px-5 py-2 text-sm text-cream"
        >
          Log Out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-pill px-5 py-2 text-sm ${
              tab === t.key ? "bg-gold text-ink" : "border border-gold/30 text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="Customers" value={stats.users} />
          <StatCard label="Appointments" value={stats.appointments} />
          <StatCard label="Orders" value={stats.orders} />
          <StatCard label="New Enquiries" value={stats.enquiries} />
          <StatCard label="Pending Feedback" value={stats.pendingFeedback} />
        </div>
      )}

      {tab === "appointments" && (
        <div className="mt-8 flex flex-col gap-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-cream">
                    {appt.user.name || "Guest"} · {appt.user.mobile}
                  </p>
                  <p className="text-sm text-muted">
                    {appt.services.map((s) => s.name).join(", ")}
                  </p>
                </div>
                <select
                  value={appt.status}
                  onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                  className="rounded-lg border border-gold/30 px-3 py-2 text-sm text-cream"
                >
                  {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-dim">
                {appt.slots.map((slot) => (
                  <li key={slot.rank}>
                    Option {slot.rank}: {formatDateLabel(slot.date)} at {slot.time}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-muted">No appointments yet.</p>}
        </div>
      )}

      {tab === "enquiries" && (
        <div className="mt-8 flex flex-col gap-4">
          {enquiries.map((enq) => (
            <div key={enq.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-lg text-cream">
                  {enq.name} · {enq.mobile}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    updateEnquiryStatus(enq.id, enq.status === "NEW" ? "RESPONDED" : "NEW")
                  }
                  className="rounded-pill border border-gold/40 px-4 py-1.5 text-xs text-cream"
                >
                  {enq.status === "NEW" ? "Mark Responded" : "Mark New"}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted">{enq.message}</p>
            </div>
          ))}
          {enquiries.length === 0 && <p className="text-muted">No enquiries yet.</p>}
        </div>
      )}

      {tab === "feedback" && (
        <div className="mt-8 flex flex-col gap-4">
          {feedback.map((f) => (
            <div key={f.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-lg text-cream">
                  {f.name} · {"★".repeat(f.rating)}
                </p>
                <button
                  type="button"
                  onClick={() => toggleFeedbackApproval(f.id, !f.approved)}
                  className={`rounded-pill px-4 py-1.5 text-xs ${
                    f.approved ? "border border-gold/40 text-cream" : "bg-gold text-ink"
                  }`}
                >
                  {f.approved ? "Unpublish" : "Approve & Publish"}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted">{f.message}</p>
            </div>
          ))}
          {feedback.length === 0 && <p className="text-muted">No feedback yet.</p>}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-card border border-gold/20 bg-ink-soft p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-lg text-cream">
                  {order.user.name || "Guest"} · {order.user.mobile}
                </p>
                <span className="text-sm font-semibold text-gold">₹{order.total}</span>
              </div>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-muted">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-gold/20 bg-ink-soft p-5 text-center shadow-soft">
      <p className="font-serif text-3xl text-cream">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-dim">{label}</p>
    </div>
  );
}
