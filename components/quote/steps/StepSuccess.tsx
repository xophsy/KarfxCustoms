"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SelectedService } from "../QuoteFlow";
import { BUSINESS_INFO } from "@/lib/business";

type Props = {
  selectedServices: SelectedService[];
};

export default function StepSuccess({ selectedServices }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-10 text-center md:py-16"
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/30 bg-surface-800">
          <CheckCircle2 size={38} className="text-gold-500" />
          {/* Glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(248,200,0,0.15) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Heading */}
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
        Request Received
      </p>
      <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
        We&apos;ve got your request.
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/50">
        We&apos;ll be in touch within 24 hours on weekdays at the contact info
        you provided.
      </p>

      {/* Gold divider */}
      <div className="mx-auto my-8 gold-divider" />

      {/* Services summary */}
      {selectedServices.length > 0 && (
        <div className="mx-auto mb-10 max-w-sm text-left">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35 text-center">
            Services in your request
          </p>
          <ul className="space-y-2">
            {selectedServices.map((s) => (
              <li
                key={s.serviceSlug}
                className="flex items-start gap-2.5 border border-white/5 bg-surface-800/50 px-4 py-3"
              >
                <span className="mt-0.5 shrink-0 text-gold-500 text-sm">✓</span>
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {s.serviceName}
                  </p>
                  <p className="text-[11px] text-white/35 mt-0.5">{s.categoryName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/" className="btn-gold">
          Back to Home
        </a>
        <a href="/portfolio" className="btn-ghost">
          View Our Work
        </a>
      </div>

      {/* Contact fallback */}
      <p className="mt-8 text-xs text-white/25">
        Need faster help?{" "}
        <a
          href={BUSINESS_INFO.phoneHref}
          className="text-gold-500/60 hover:text-gold-500 transition-colors"
        >
          Call {BUSINESS_INFO.phoneDisplay}
        </a>
      </p>
    </motion.div>
  );
}
