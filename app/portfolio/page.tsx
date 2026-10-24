"use client";

import { useState } from "react";
import CoverflowGallery from "@/components/CoverflowGallery";
import {
  ALL_PORTFOLIO_IMAGES,
  PORTFOLIO_BY_CATEGORY,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const FILTERS: { id: PortfolioCategory | "all"; label: string; count: number }[] = [
  { id: "all", label: "All Work", count: ALL_PORTFOLIO_IMAGES.length },
  ...PORTFOLIO_CATEGORIES.map(({ id, label }) => ({
    id,
    label,
    count: PORTFOLIO_BY_CATEGORY[id].length,
  })),
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");
  const images =
    filter === "all" ? ALL_PORTFOLIO_IMAGES : PORTFOLIO_BY_CATEGORY[filter];

  return (
    <section className="flex h-[calc(100dvh-10rem)] flex-col bg-surface-900 md:h-[calc(100dvh-5rem)]">
      {/* top padding clears the navbar logo, which hangs below the bar */}
      <div className="shrink-0 px-6 pb-4 pt-16 md:px-8 md:pt-24 lg:px-16">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/70">
          Portfolio
        </p>
        <h1 className="font-display text-2xl font-semibold leading-tight text-white md:text-4xl">
          Real jobs, real vehicles, and a wider look at the shop.
        </h1>

        <div
          className="-mx-6 mt-5 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter by type of work"
        >
          {FILTERS.map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={cn(
                "shrink-0 whitespace-nowrap border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                filter === id
                  ? "border-gold-500 bg-gold-500/10 text-gold-500"
                  : "border-white/10 text-white/55 hover:border-white/30 hover:text-white/90"
              )}
            >
              {label}
              <span className="ml-2 tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {/* key remounts the gallery so each filter starts from its first photos */}
        <CoverflowGallery key={filter} images={images} />
      </div>
    </section>
  );
}
