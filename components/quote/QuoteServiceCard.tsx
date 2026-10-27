"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { ServiceItem } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/services-images";

type Props = {
  service: ServiceItem;
  categorySlug: string;
  isAdded: boolean;
  index?: number;
  onAdd: () => void;
  onRemove: () => void;
};

export default function QuoteServiceCard({
  service,
  categorySlug,
  isAdded,
  index = 0,
  onAdd,
  onRemove,
}: Props) {
  const imageSet = SERVICE_IMAGES[`${categorySlug}/${service.slug}`];
  const heroImage = imageSet?.hero;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.06,
      }}
      className={`group relative flex flex-col overflow-hidden border transition-all duration-300 ${
        isAdded
          ? "border-gold-500/60 bg-surface-700"
          : "border-white/5 bg-surface-800/60 hover:border-white/15"
      }`}
    >
      {/* ── Image area ──────────────────────────────────────────────────── */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-44">
        {/* Gradient fallback */}
        <div
          className="absolute inset-0"
          style={{ background: service.cardGradient }}
          aria-hidden
        />

        {/* Photo */}
        {heroImage && (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={heroImage}
              alt={service.name}
              fill
              className="object-cover opacity-70"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        )}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-800/80 to-transparent" />

        {/* Added checkmark badge */}
        {isAdded && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500">
            <Check size={14} className="text-surface-900" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-white">
          {service.name}
        </h3>
        <div className="my-2.5 h-px w-6 bg-gradient-to-r from-gold-500 to-gold-600" />
        <p className="flex-1 text-xs leading-relaxed text-white/45">
          {service.tagline}
        </p>

        {/* CTA button */}
        <div className="mt-4">
          {isAdded ? (
            <button
              type="button"
              onClick={onRemove}
              className="w-full border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-gold-500 transition-all duration-200 hover:bg-surface-700"
            >
              ✓ Added — Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="btn-gold flex w-full items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Plus size={13} strokeWidth={2.5} />
              Add Service
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
