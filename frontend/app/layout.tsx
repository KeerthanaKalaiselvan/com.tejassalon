import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfferBanner from "@/components/OfferBanner";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tejas Salon — Hair, Skin & Bridal Makeup Salon",
    template: "%s | Tejas Salon",
  },
  description:
    "Tejas Salon is a premium hair, skin and makeup salon offering haircuts, hair color, keratin treatment, hair spa, facials, bridal makeup, nail art and salon-grade hair care products.",
  keywords: [
    "salon near me",
    "hair salon",
    "hair treatment",
    "hair spa",
    "hair color salon",
    "keratin treatment",
    "bridal makeup artist",
    "skin care salon",
    "facial salon",
    "nail art salon",
    "hair care products",
    "Tejas Salon",
  ],
  openGraph: {
    title: "Tejas Salon — Hair, Skin & Bridal Makeup Salon",
    description:
      "Book haircuts, hair color, keratin treatment, hair spa, facials, bridal makeup and more at Tejas Salon.",
    url: siteUrl,
    siteName: "Tejas Salon",
    type: "website",
    images: ["/images/hero-banner.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejas Salon — Hair, Skin & Bridal Makeup Salon",
    description:
      "Book haircuts, hair color, keratin treatment, hair spa, facials, bridal makeup and more at Tejas Salon.",
    images: ["/images/hero-banner.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Tejas Salon",
  image: `${siteUrl}/images/hero-banner.jpg`,
  url: siteUrl,
  telephone: "+91-90030-09080",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Udhaya Nagar Main Rd, opp. to Amala Annai Stores, Sabari Nagar, Mugalivakkam",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600116",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.0271627,
    longitude: 80.1702193,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "22:00",
    },
  ],
  sameAs: ["https://maps.app.goo.gl/NL2qqdzwNhRThxXy7"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-cream text-ink">
        <AuthProvider>
          <OfferBanner />
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
