import Section from "./Section";
import Reveal from "./Reveal";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/types";

/**
 * "What our specialists recommend" — take-home care, framed as advice from the
 * team rather than a shop window. Renders whatever the studio has published;
 * when nothing is published it degrades to an honest invitation (see ProductGrid).
 */
export default function SpecialistPicks({
  products,
  viewAllHref,
}: {
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <Section id="products" eyebrow="Take Home">
      <Reveal delay={0.06}>
        <h2 className="section-heading">What our specialists recommend.</h2>
      </Reveal>

      {products.length > 0 && (
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[58ch] text-muted">
            Picked by the team for the treatments they actually do &mdash; so what you use at
            home carries on the work you paid for in the chair.
          </p>
        </Reveal>
      )}

      <Reveal delay={0.18}>
        <div className="mt-[clamp(28px,3.6vw,44px)]">
          <ProductGrid products={products} viewAllHref={viewAllHref} />
        </div>
      </Reveal>
    </Section>
  );
}
