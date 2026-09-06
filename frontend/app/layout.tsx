import type { Metadata } from "next";
import { Marcellus, Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { siteUrl } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Marcellus ships a single weight and no italic - never request others,
// or the browser synthesises them and the Roman letterforms fall apart.
const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

// Same resolver as sitemap/robots, so canonical + OG can never disagree with them.
const SITE_URL = siteUrl();

const NAME = "Tejas Beauty Lounge & Makeup Studio";
const DESC =
  "A women-owned beauty salon in Mugalivakkam, Chennai — eyebrow threading, hair, hair spa, " +
  "pedicure, skin care and makeup. 4.7 on Google. Call +91 90030 09080.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: NAME, template: `%s | Tejas` },
  description: DESC,
  keywords: [
    "beauty salon Mugalivakkam",
    "salon near me Chennai",
    "eyebrow threading Chennai",
    "hair spa Mugalivakkam",
    "pedicure Chennai",
    "makeup studio Chennai",
    "women owned salon Chennai",
    "Tejas Beauty Lounge",
  ],
  openGraph: {
    title: `${NAME} — Mugalivakkam, Chennai`,
    description: DESC,
    url: SITE_URL,
    siteName: NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: NAME,
    description: DESC,
    images: ["/images/og.jpg"],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#150E13",
  width: "device-width",
  initialScale: 1,
};

/**
 * NOTE: openingHoursSpecification and priceRange are deliberately omitted.
 * v1 carried Mon-Fri 10:00-21:00 / Sat-Sun 10:00-22:00, which contradicts the
 * booking calendar's 9AM-11PM window - so neither is verified. Add them back
 * only once the studio confirms real trading hours.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: NAME,
  description: DESC,
  image: `${SITE_URL}/images/og.jpg`,
  url: SITE_URL,
  telephone: "+91 90030 09080",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Udhaya Nagar Main Rd, opposite Amala Annai Stores, Sabari Nagar, Mugalivakkam",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600116",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 13.0271627, longitude: 80.1702193 },
  hasMap: "https://maps.app.goo.gl/NL2qqdzwNhRThxXy7",
  areaServed: "Mugalivakkam, Chennai",
  currenciesAccepted: "INR",
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
      <body className="font-sans bg-ink text-cream antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
