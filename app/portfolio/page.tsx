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
      <div className="mx-auto w-full max-w-7xl shrink-0 px-5 pb-4 pt-8 sm:px-6 md:pt-12 lg:px-8">
        <p className="eyebrow">Our work</p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance text-white md:text-5xl">
          Real jobs, real vehicles, and a wider look at the shop.
        </h1>

        <div
          className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
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
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                filter === id
                  ? "border-gold-500 bg-gold-500 text-black"
                  : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
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
