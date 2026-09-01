"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { CartItem, Order } from "@/lib/types";
import LoginGate from "@/components/LoginGate";

export default function CartPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ items: CartItem[] }>("/api/cart")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setFetching(false));
  }, [user]);

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      await apiFetch(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update quantity.");
    }
  }

  async function removeItem(productId: string) {
    try {
      await apiFetch(`/api/cart/${productId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove item.");
    }
  }

  async function checkout() {
    setCheckingOut(true);
    setError("");
    try {
      const data = await apiFetch<{ order: Order }>("/api/orders/checkout", { method: "POST" });
      setPlacedOrder(data.order);
      setItems([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not place your order.");
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl px-6 py-24 text-center">Loading…</div>;

  if (!user) {
    return (
      <LoginGate
        eyebrow="Your Cart"
        title="Log In to View Your Cart"
        subtitle="Your saved products and checkout are just a login away."
        next="/cart"
      />
    );
  }

  if (placedOrder) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="eyebrow">Order Placed</p>
        <h1 className="section-heading mt-3">Thank You!</h1>
        <p className="mt-4 text-ink/65">
          Your order #{placedOrder.id.slice(-6).toUpperCase()} for ₹{placedOrder.total} has been
          placed. Pay at the salon on pickup. We&apos;ll notify you once it&apos;s ready.
        </p>
        <Link href="/history" className="gold-button mt-8 inline-flex">
          View My History
        </Link>
      </section>
    );
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <p className="eyebrow">Your Cart</p>
      <h1 className="section-heading mt-3">Review &amp; Checkout</h1>

      {fetching ? (
        <p className="mt-10 text-ink/60">Loading your cart…</p>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink/60">Your cart is empty.</p>
          <Link href="/products" className="gold-button mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-card border border-gold/20 bg-white p-4 shadow-soft"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-serif text-lg text-navy">{item.product.name}</p>
                <p className="text-sm text-ink/50">₹{item.product.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-gold/40 text-navy"
                >
                  −
                </button>
                <span className="w-6 text-center text-navy">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-gold/40 text-navy"
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right font-semibold text-navy">
                ₹{item.product.price * item.quantity}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.product.id)}
                className="text-xs text-ink/40 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4 flex items-center justify-between rounded-card border border-gold/30 bg-navy p-6 text-cream">
            <p className="font-serif text-xl">Total: ₹{total}</p>
            <button
              type="button"
              onClick={checkout}
              disabled={checkingOut}
              className="gold-button"
            >
              {checkingOut ? "Placing Order…" : "Place Order"}
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </section>
  );
}
