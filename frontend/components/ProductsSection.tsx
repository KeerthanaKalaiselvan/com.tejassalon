"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductsSection({
  products,
  viewAllHref,
}: {
  products: Product[];
  viewAllHref?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<string>("");

  async function addToCart(product: Product) {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      setStatus(`${product.name} added to your cart.`);
      setTimeout(() => setStatus(""), 2500);
    } catch (err) {
      setStatus(err instanceof ApiError ? err.message : "Could not add to cart.");
    }
  }

  return (
    <section id="products" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Take Care Home</p>
            <h2 className="section-heading mt-3">Salon-Grade Hair Care Products</h2>
          </div>
          {status && (
            <p className="rounded-pill border border-gold/40 bg-white px-4 py-2 text-sm text-navy shadow-soft">
              {status}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <p className="mt-12 rounded-card border border-gold/20 bg-white px-6 py-10 text-center text-ink/60">
            Products are loading — if this stays empty, the backend may be offline or the
            database needs seeding (<code className="text-sm">npm run prisma:seed</code>).
          </p>
        ) : (
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-card border border-gold/20 bg-white shadow-soft"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-serif text-base text-navy">{product.name}</p>
                <p className="mt-1 flex-1 text-xs text-ink/55">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gold-dark">₹{product.price}</span>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-3 rounded-pill border border-gold/60 py-2 text-xs font-semibold tracking-wide text-navy transition-colors hover:bg-gold hover:text-ink"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {viewAllHref && (
          <div className="mt-12 text-center">
            <Link href={viewAllHref} className="gold-button">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
