"use client";

import { useState } from "react";
import PortfolioGrid from "@/components/PortfolioGrid";
import {
  ALL_PORTFOLIO_IMAGES,
  PORTFOLIO_BY_CATEGORY,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const FILTERS: { id: PortfolioCategory | "all"; label: string; count: number }[] = [
  { id: "all", label: "All work", count: ALL_PORTFOLIO_IMAGES.length },
  ...PORTFOLIO_CATEGORIES.map(({ id, label }) => ({
    id,
    label,
    count: PORTFOLIO_BY_CATEGORY[id].length,
  })),
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");
  const images = filter === "all" ? ALL_PORTFOLIO_IMAGES : PORTFOLIO_BY_CATEGORY[filter];

  return (
    <section className="bg-surface-900 pb-24">
      <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-6 md:pt-20 lg:px-8">
        <h1 className="font-editorial text-4xl font-semibold leading-[1.05] text-balance text-white md:text-6xl">
          Real jobs, real vehicles, and a wider look at the shop.
        </h1>

        <div
          className="-mx-5 mb-8 mt-7 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
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
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
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

        {/* key resets the viewer when the filter changes */}
        <PortfolioGrid key={filter} images={images} />
      </div>
    </section>
  );
}
