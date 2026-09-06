import Hero from "@/components/Hero";
import AboutStory from "@/components/AboutStory";
import ServicesIndex from "@/components/ServicesIndex";
import SpecialistPicks from "@/components/SpecialistPicks";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import VisitSection from "@/components/VisitSection";
import FeedbackSection from "@/components/FeedbackSection";
import { getApprovedFeedback, getProducts, getServices } from "@/lib/data";

const HOME_PRODUCT_LIMIT = 4;

export default async function HomePage() {
  const [services, products, feedback] = await Promise.all([
    getServices(),
    getProducts(),
    getApprovedFeedback(),
  ]);

  return (
    <>
      <Hero />
      <hr className="hairline" />
      <AboutStory />
      <hr className="hairline" />
      <ServicesIndex services={services} />
      <hr className="hairline" />
      <SpecialistPicks
        products={products.slice(0, HOME_PRODUCT_LIMIT)}
        viewAllHref={products.length > HOME_PRODUCT_LIMIT ? "/products" : undefined}
      />
      <hr className="hairline" />
      <Gallery />
      <hr className="hairline" />
      <Reviews />
      <hr className="hairline" />
      <VisitSection />
      {feedback.length > 0 && (
        <>
          <hr className="hairline" />
          <FeedbackSection feedback={feedback} />
        </>
      )}
    </>
  );
}
