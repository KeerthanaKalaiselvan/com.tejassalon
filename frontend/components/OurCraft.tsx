import Link from "next/link";
import type { Service } from "@/lib/types";
import ServiceGrid from "@/components/ServiceGrid";

export default function OurCraft({ services }: { services: Service[] }) {
  return (
    <section id="craft" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Our Craft</p>
          <h2 className="section-heading mt-3">
            Hair, Skin &amp; Makeup — Crafted Around You
          </h2>
          <p className="mt-4 text-ink/70">
            Every treatment starts with a real conversation about your hair and skin, then draws
            on trained hands and salon-grade products to deliver results that last.
          </p>
        </div>

        <div className="mt-12">
          <ServiceGrid services={services} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/services"
            className="rounded-pill border border-gold/60 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-navy transition-colors duration-300 hover:bg-gold hover:text-ink"
          >
            View All Services
          </Link>
          <Link href="/book" className="gold-button">
            Reserve Your Spot
          </Link>
        </div>
      </div>
    </section>
  );
}
