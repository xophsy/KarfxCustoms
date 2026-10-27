"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceItem } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/services-images";

type Props = {
  service: ServiceItem;
  categorySlug: string;
  index?: number;
};

export default function ServiceCard({ service, categorySlug, index = 0 }: Props) {
  const imageSet = SERVICE_IMAGES[`${categorySlug}/${service.slug}`];
  const heroImage = imageSet?.hero;
  const heroAlt = imageSet?.heroAlt ?? service.name;

  return (
    <motion.a
      href={`/services/${categorySlug}/${service.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.07,
      }}
      className="group glass-card relative flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      aria-label={`Learn more about ${service.name}`}
    >
      {/* ── Image area ──────────────────────────────────────────────────── */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden">
        {/* Gradient fallback — always rendered behind the image */}
        <div
          className="absolute inset-0"
          style={{ background: service.cardGradient }}
          aria-hidden
        />

        {/* Real photo — fades in over gradient */}
        {heroImage && (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        )}

        {/* Bottom fade to card body */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-surface-800/90 to-transparent" />

        {/* B2B badge */}
        {service.isB2B && (
          <span className="absolute right-3 top-3 z-10 rounded-sm border border-gold-500/30 bg-surface-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold-500/80 backdrop-blur-sm">
            For Business
          </span>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Service name */}
        <h3 className="font-display text-lg font-semibold leading-snug text-white">
          {service.name}
        </h3>

        {/* Gold divider — expands on hover */}
        <div className="my-3 h-[1px] w-7 bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-400 group-hover:w-12" />

        {/* Tagline */}
        <p className="flex-1 text-sm leading-relaxed text-white/45 transition-colors duration-300 group-hover:text-white/62">
          {service.tagline}
        </p>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">
          <span>Learn More</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </div>
      </div>
    </motion.a>
  );
}
