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
      {/* Quote flow — receives pre-selection params from any CTA */}
      <QuoteFlow
        preselectedCategory={searchParams.category}
        preselectedService={searchParams.service}
        source={searchParams.ref}
      />
    </>
  );
}
