import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Take-Home Care",
  description:
    "Take-home hair and skin care recommended by the specialists at Tejas Beauty Lounge & Makeup Studio, Mugalivakkam, Chennai.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5.2vw,72px)] pt-10">
        <p className="eyebrow">Take Home</p>
        <h1 className="section-heading mt-3">What our specialists recommend.</h1>
        <div className="mt-[clamp(28px,3.6vw,44px)]">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
