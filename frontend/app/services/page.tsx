import type { Metadata } from "next";
import ServiceGrid from "@/components/ServiceGrid";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore every hair, skin and makeup service at Tejas Salon — haircuts, hair color, keratin treatment, hair spa, facials, bridal makeup, nail art and threading.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="bg-cream pb-24 pt-8">
      <div className="mx-auto max-w-6xl px-6 pt-8 md:px-8">
        <p className="eyebrow">Our Craft</p>
        <h1 className="section-heading mt-3">All Services</h1>
        <p className="mt-4 max-w-2xl text-ink/70">
          Every treatment starts with a real conversation about your hair and skin, then draws on
          trained hands and salon-grade products to deliver results that last.
        </p>
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-12 md:px-8">
        <ServiceGrid services={services} />
      </div>
    </div>
  );
}
