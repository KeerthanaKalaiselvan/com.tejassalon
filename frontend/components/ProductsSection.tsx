import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";

export default function ProductsSection({
  products,
  viewAllHref,
}: {
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section id="products" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="eyebrow">Take Care Home</p>
        <h2 className="section-heading mt-3">Salon-Grade Hair Care Products</h2>

        <div className="mt-12">
          <ProductGrid products={products} viewAllHref={viewAllHref} />
        </div>
      </div>
    </section>
  );
}
