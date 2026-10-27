"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Layers, Gauge, Sparkles, type LucideIcon } from "lucide-react";
import { ServiceCategory } from "@/lib/services-data";
import { CATEGORY_IMAGES } from "@/lib/services-images";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "protection":               Shield,
  "wraps-styling":            Layers,
  "wheels-calipers-lighting": Gauge,
  "detailing":                Sparkles,
};

type Props = {
  category: ServiceCategory;
  index?: number;
  onSelect: (slug: string) => void;
};

export default function QuoteCategoryCard({
  category,
  index = 0,
  onSelect,
}: Props) {
  const img = CATEGORY_IMAGES[category.slug];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(category.slug)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.07,
      }}
      className="group relative flex min-h-[180px] w-full cursor-pointer flex-col overflow-hidden border border-white/10 text-left transition-colors duration-400 hover:border-gold-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 sm:min-h-[200px]"
      style={{ background: category.gradient }}
      aria-label={`Select ${category.name}`}
    >
      {/* Background photo */}
      {img && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover opacity-60 transition-opacity duration-400 group-hover:opacity-75"
              sizes="(max-width: 640px) 100vw, 50vw"
              aria-hidden
            />
          </motion.div>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Gold top-edge sweep on hover */}
      <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />

      {/* Inner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 60px rgba(212,175,55,0.07)" }}
      />

      {/* Icon badge */}
      {(() => {
        const Icon = CATEGORY_ICONS[category.slug];
        return Icon ? (
          <div className="relative z-10 p-5 pb-0">
            <div
              className="flex w-10 h-10 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10"
              style={{ boxShadow: "0 0 14px rgba(212,175,55,0.15)" }}
            >
              <Icon size={18} className="text-gold-500" strokeWidth={1.5} />
            </div>
          </div>
        ) : null;
      })()}

      {/* Content */}
      <div className="relative z-10 mt-auto p-6 md:p-7">
        <h3 className="font-display text-xl font-semibold text-white transition-colors duration-300 group-hover:text-white sm:text-2xl">
          {category.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/45 transition-colors duration-300 group-hover:text-white/60">
          {category.tagline}
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-500">
          <span>Select</span>
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.button>
  );
}
