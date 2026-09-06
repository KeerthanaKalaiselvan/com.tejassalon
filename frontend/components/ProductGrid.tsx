"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { SITE, telHref } from "@/lib/site";
import type { Product } from "@/lib/types";

export default function ProductGrid({
  products,
  viewAllHref,
}: {
  products: Product[];
  viewAllHref?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("");

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

  /**
   * Empty state is written for a CUSTOMER, not a developer. The old copy leaked
   * "the backend may be offline… npm run prisma:seed" onto the public page.
   */
  if (products.length === 0) {
    return (
      <div className="curved-card flex flex-col items-start gap-5 p-[clamp(26px,3.4vw,44px)]">
        <p className="max-w-[54ch] text-[1.02rem] leading-relaxed text-cream-dim">
          Our specialists match take-home care to your hair and skin at the end of an
          appointment, rather than selling off a shelf. The shelf list isn&rsquo;t online yet
          &mdash; call the studio and they&rsquo;ll tell you what&rsquo;s in stock and what
          they&rsquo;d suggest for you.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={telHref} className="gold-button">
            Call {SITE.phoneDisplay}
          </a>
          <Link href="/book" className="outline-button">
            Book an appointment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {status && (
        <p
          role="status"
          className="mb-6 inline-flex rounded-pill border border-gold/40 bg-ink-soft px-4 py-2 font-sans text-sm text-cream"
        >
          {status}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-card border border-gold/20 bg-ink-soft transition-colors duration-500 hover:border-gold/45"
          >
            <div className="aspect-square overflow-hidden bg-ink">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-serif text-base leading-tight text-cream">{product.name}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">
                {product.description}
              </p>
              <p className="mt-3 font-sans text-sm tabular-nums text-gold-light">
                ₹{product.price}
              </p>
              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="mt-3 rounded-pill border border-gold/50 py-2 font-sans text-[0.66rem] uppercase tracking-[0.16em] text-glow transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:border-cream/15 disabled:text-muted-dim disabled:hover:bg-transparent"
              >
                {product.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          </article>
        ))}

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-gold/35 p-4 text-center font-sans text-[0.7rem] uppercase tracking-[0.16em] text-glow transition-colors hover:border-gold hover:text-gold-light"
          >
            View all
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
