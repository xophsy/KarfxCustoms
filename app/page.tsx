import type { Metadata } from "next";
import FinalCTA from "@/components/FinalCTA";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ReviewsSection from "@/components/ReviewsSection";
import ServiceTicker from "@/components/ServiceTicker";
import CategoryGrid from "@/components/services/CategoryGrid";
import ScrollReveal from "@/components/services/ScrollReveal";
import RestorFXBand from "@/components/services/RestorFXBand";
import WorkShowcase from "@/components/WorkShowcase";

export const metadata: Metadata = {
  title: "KAR FX Customs | PPF, Wraps, Tint & Detailing in Raleigh, NC",
  description:
    "PPF, wraps, tint, ceramic coating & detailing in Raleigh, NC. 5.0 stars from 69 reviews. Appointment-based shop — call or text to book.",
  alternates: { canonical: "https://karfxcustoms.com" },
  openGraph: {
    title: "KAR FX Customs | Vehicle Protection & Styling in Raleigh, NC",
    description:
      "PPF, wraps, tint, ceramic coating, detailing, and RestorFX paint restoration. Raleigh-based. 5.0 stars from 69 reviews.",
    url: "https://karfxcustoms.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceTicker />

      <section id="services" aria-labelledby="services-heading" className="scroll-mt-20 bg-surface-900 pt-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Services</p>
              <h2 id="services-heading" className="mt-5 max-w-2xl font-editorial text-[2.75rem] font-semibold leading-[1.02] text-balance text-white md:text-[3.75rem]">
                Everything your vehicle needs, <span className="text-gold-gradient italic">under one roof.</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-base leading-relaxed text-white/60">
                For us it is important to understand your needs first. If you are not sure which service is right for your vehicle, we will gladly help you decide.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CategoryGrid />
          </ScrollReveal>
        </div>
      </section>

      <WorkShowcase />
      <HowItWorks />
      <ReviewsSection />
      <RestorFXBand />
      <FinalCTA />
    </>
  );
}
