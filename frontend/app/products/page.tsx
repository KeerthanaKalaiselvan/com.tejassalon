import type { Metadata } from "next";
import ProductsSection from "@/components/ProductsSection";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hair Care Products",
  description:
    "Shop salon-grade shampoo, conditioner, hair serum, hair masks and styling products from Tejas Salon.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="pt-8">
      <div className="mx-auto max-w-6xl px-6 pt-8 md:px-8">
        <p className="eyebrow">Shop</p>
        <h1 className="section-heading mt-3">All Hair Care Products</h1>
      </div>
      <ProductsSection products={products} />
    </div>
  );
}
