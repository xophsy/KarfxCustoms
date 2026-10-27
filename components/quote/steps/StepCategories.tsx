"use client";

import { AnimatePresence } from "framer-motion";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { SelectedService } from "../QuoteFlow";
import QuoteCategoryCard from "../QuoteCategoryCard";
import QuoteChip from "../QuoteChip";

type Props = {
  onSelectCategory: (slug: string) => void;
  selectedServices: SelectedService[];
  onRemoveService: (slug: string) => void;
};

export default function StepCategories({
  onSelectCategory,
  selectedServices,
  onRemoveService,
}: Props) {
  return (
    <div>
      {/* ── Heading ────────────────────────────────────────────────────── */}
      <div className="mb-8 text-center md:mb-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
          Step 1 of 2
        </p>
        <h1 className="font-display text-3xl font-bold tracking-[-0.01em] text-white sm:text-4xl">
          What are you looking for?
        </h1>
        <p className="mt-3 text-sm text-white/45">
          Choose a category to see the services inside it.
        </p>
      </div>

      {/* ── Previously selected services (if adding more) ─────────────── */}
      {selectedServices.length > 0 && (
        <div className="mb-6 rounded-sm border border-white/5 bg-surface-800/50 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
            Services in your request
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedServices.map((s) => (
                <QuoteChip
                  key={s.serviceSlug}
                  service={s}
                  onRemove={onRemoveService}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Category grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {SERVICE_CATEGORIES.map((cat, i) => (
          <QuoteCategoryCard
            key={cat.slug}
            category={cat}
            index={i}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
}
