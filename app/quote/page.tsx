import type { Metadata } from "next";
import QuoteFlow from "@/components/quote/QuoteFlow";

export const metadata: Metadata = {
  title: "Get a Quote | KAR FX Customs — Raleigh",
  description:
    "Tell us what you're looking for — PPF, wraps, tint, detailing, or custom upgrades — and we'll get back to you with a quote within 24 hours.",
};

type Props = {
  searchParams: {
    category?: string; // e.g. ?category=protection
    service?: string;  // e.g. ?service=ppf
    ref?: string;      // e.g. ?ref=restorfx
  };
};

export default function QuotePage({ searchParams }: Props) {
  return (
    <>
      {/* Slim page header — keeps the page focused on the flow */}
      <div className="border-b border-white/5 bg-surface-900/80 px-5 py-5 text-center md:px-8">
        <a
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 transition-colors duration-200 hover:text-gold-500"
        >
          ← KAR FX Customs
        </a>
      </div>

      {/* Quote flow — receives pre-selection params from any CTA */}
      <QuoteFlow
        preselectedCategory={searchParams.category}
        preselectedService={searchParams.service}
        source={searchParams.ref}
      />
    </>
  );
}
