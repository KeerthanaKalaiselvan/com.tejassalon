"use client";

import { useState } from "react";

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative z-[60] bg-navy text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2.5 text-center text-xs sm:text-sm">
        <span className="font-serif text-glow text-base">Festive Glow Offer —</span>
        <span className="font-sans tracking-wide">
          20% off on your first hair color or facial. Reserve your spot before slots fill up.
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ml-2 shrink-0 rounded-full border border-cream/30 px-2 py-0.5 text-[11px] tracking-wide text-cream/70 transition-colors hover:border-gold hover:text-gold"
          aria-label="Dismiss offer banner"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
