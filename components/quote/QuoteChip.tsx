"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { SelectedService } from "./QuoteFlow";

type Props = {
  service: SelectedService;
  onRemove: (slug: string) => void;
};

export default function QuoteChip({ service, onRemove }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex min-w-0 items-center gap-2 border border-gold-500/30 bg-surface-700/60 px-3 py-2 backdrop-blur-sm"
    >
      {/* Service info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-white leading-snug">
          {service.serviceName}
        </p>
        <p className="truncate text-[10px] text-white/35 leading-none mt-0.5">
          {service.categoryName}
        </p>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(service.serviceSlug)}
        className="shrink-0 text-white/30 transition-colors duration-150 hover:text-gold-400"
        aria-label={`Remove ${service.serviceName}`}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
