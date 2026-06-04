import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { BUSINESS_INFO } from "@/lib/business";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const SITE_URL = "https://karfxcustoms.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KAR FX Customs | PPF, Wraps, Tint & Detailing in Raleigh, NC",
    template: "%s | KAR FX Customs — Raleigh",
  },
  description:
    "PPF, wraps, tint, ceramic coating & detailing in Raleigh, NC. 5.0 stars from 69 reviews. Appointment-based shop — call or text to book.",
  keywords: [
    "Raleigh PPF",
    "paint protection film Raleigh NC",
    "vehicle wraps Raleigh",
    "car wrap Raleigh NC",
    "window tint Raleigh",
    "ceramic coating Raleigh",
    "car detailing Raleigh",
    "chrome delete Raleigh",
    "auto customization Raleigh",
    "KAR FX Customs",
    "RestorFX Raleigh",
  ],
  openGraph: {
    title: "KAR FX Customs | Raleigh Auto Customization",
    description:
      "Premium PPF, wraps, tint, ceramic coating, detailing, and RestorFX paint restoration in Raleigh, NC. 5.0 Google rating from 69 reviews.",
    url: SITE_URL,
    siteName: "KAR FX Customs",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/home/hero/background.jpg",
        width: 1200,
        height: 630,
        alt: "KAR FX Customs — Vehicle Wraps, PPF & Detailing in Raleigh NC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAR FX Customs | Raleigh Auto Customization",
    description:
      "Premium PPF, wraps, tint, ceramic coating, and detailing in Raleigh, NC.",
    images: ["/images/home/hero/background.jpg"],
  },
  icons: {
    icon: "/images/branding/Logo.png",
    apple: "/images/branding/Logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "@id": SITE_URL,
    name: BUSINESS_INFO.brandName,
    url: SITE_URL,
    telephone: "+19195260818",
    email: BUSINESS_INFO.email,
    image: `${SITE_URL}/images/home/hero/background.jpg`,
    description: BUSINESS_INFO.summary,
    priceRange: "$$–$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.streetAddress,
      addressLocality: "Raleigh",
      addressRegion: "NC",
      postalCode: "27615",
      addressCountry: "US",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS_INFO.reviewRating,
      reviewCount: BUSINESS_INFO.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      BUSINESS_INFO.instagramHref,
      BUSINESS_INFO.facebookHref,
      BUSINESS_INFO.tiktokHref,
    ],
    hasMap: BUSINESS_INFO.mapHref,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      description: "By appointment only — call or message to confirm availability.",
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paint Protection Film (PPF)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vehicle Wraps" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Window Tint" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ceramic Coating" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car Detailing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Chrome Delete" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wheel & Caliper Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "RestorFX Paint Restoration" } },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${bodoni.variable} ${jost.variable}`}>
      <body className="bg-surface-900 text-white font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-surface-900 focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen pt-20">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
