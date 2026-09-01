import Hero from "@/components/Hero";
import OurCraft from "@/components/OurCraft";
import AboutStory from "@/components/AboutStory";
import Gallery from "@/components/Gallery";
import StyleReels from "@/components/StyleReels";
import Team from "@/components/Team";
import ProductsSection from "@/components/ProductsSection";
import FeedbackSection from "@/components/FeedbackSection";
import EnquirySupport from "@/components/EnquirySupport";
import ContactMap from "@/components/ContactMap";
import { getApprovedFeedback, getProducts, getServices } from "@/lib/data";

const HOME_SERVICE_LIMIT = 4;
const HOME_PRODUCT_LIMIT = 4;

export default async function HomePage() {
  const [services, products, feedback] = await Promise.all([
    getServices(),
    getProducts(),
    getApprovedFeedback(),
  ]);

  const featuredServices = services.filter((s) => s.featured);
  const homeServices =
    featuredServices.length > 0 ? featuredServices.slice(0, HOME_SERVICE_LIMIT) : services.slice(0, HOME_SERVICE_LIMIT);

  return (
    <>
      <Hero />
      <OurCraft services={homeServices} />
      <AboutStory />
      <Gallery />
      <StyleReels />
      <Team />
      <ProductsSection products={products.slice(0, HOME_PRODUCT_LIMIT)} viewAllHref="/products" />
      <FeedbackSection feedback={feedback} />
      <EnquirySupport />
      <ContactMap />
    </>
  );
}
