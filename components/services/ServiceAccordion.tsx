"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ServiceItem } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/services-images";

function ServicePanel({
  service,
  categorySlug,
  isExpanded,
  onHover,
}: {
  service: ServiceItem;
  categorySlug: string;
  isExpanded: boolean;
  onHover: () => void;
}) {
  const imageSet = SERVICE_IMAGES[`${categorySlug}/${service.slug}`];
  const heroImage = imageSet?.hero;
  const heroAlt = imageSet?.heroAlt ?? service.name;

  return (
    <motion.a
      href={`/services/${categorySlug}/${service.slug}`}
      className="relative h-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      animate={{ flexGrow: isExpanded ? 3 : 1 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={onHover}
      aria-label={`Explore ${service.name}`}
    >
      {/* ── Background ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: service.cardGradient }}>
        {heroImage && (
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            className="object-cover"
            sizes="60vw"
          />
        )}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* ── Collapsed — vertical name ────────────────────────────────────────── */}
      {!isExpanded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <h3
            className="font-display text-lg font-semibold tracking-widest text-white/70 select-none"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {service.name}
          </h3>
        </motion.div>
      )}

      {/* ── Expanded — full content ──────────────────────────────────────────── */}
      {isExpanded && (
        <motion.div
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.18 }}
        >
          {/* Tagline */}
          <motion.p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/70"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {service.tagline}
          </motion.p>

          {/* Service name */}
          <motion.h3
            className="font-display text-3xl font-bold tracking-[-0.01em] text-white mb-4 md:text-4xl"
            initial={{ x: -32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            {service.name}
          </motion.h3>

          {/* Gold divider */}
          <motion.div
            className="mb-5 h-[1px] w-10 bg-gradient-to-r from-gold-500 to-gold-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, delay: 0.38, ease: "easeOut" }}
            style={{ originX: 0 }}
          />

          {/* Benefits preview */}
          <motion.div
            className="mb-7 space-y-2.5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.42 },
              },
            }}
          >
            {service.benefits.slice(0, 3).map((benefit) => (
              <motion.div
                key={benefit}
                className="flex items-start gap-3"
                variants={{
                  hidden: { x: -20, opacity: 0 },
                  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
                }}
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <span className="text-sm text-white/75 leading-snug">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="w-fit"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.62 }}
          >
            <motion.span
              className="group relative inline-flex items-center gap-2 overflow-hidden border-2 border-gold-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              whileHover="hovered"
            >
              <motion.span
                className="absolute inset-0 z-0 bg-gold-500"
                variants={{ hovered: { x: 0 }, initial: { x: "-100%" } }}
                initial="initial"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              />
              <motion.span
                className="relative z-10 flex items-center gap-2"
                variants={{ hovered: { color: "#0a0a0a" }, initial: { color: "#ffffff" } }}
                initial="initial"
              >
                View Service
                <ChevronRight size={16} />
              </motion.span>
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </motion.a>
  );
}

export default function ServiceAccordion({
  services,
  categorySlug,
}: {
  services: ServiceItem[];
  categorySlug: string;
}) {
  const [expanded, setExpanded] = useState<string>(services[0]?.slug ?? "");

  return (
    <div
      className="flex overflow-hidden border border-white/5"
      style={{ height: 480 }}
    >
      {services.map((service) => (
        <ServicePanel
          key={service.slug}
          service={service}
          categorySlug={categorySlug}
          isExpanded={expanded === service.slug}
          onHover={() => setExpanded(service.slug)}
        />
      ))}
    </div>
  );
}
