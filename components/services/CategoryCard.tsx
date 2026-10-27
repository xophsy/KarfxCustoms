"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceCategory } from "@/lib/services-data";
import { CATEGORY_IMAGES } from "@/lib/services-images";

// ── Entrance animation — blur + lift, same spring feel ────────────────────────
const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 48, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)"  },
};

const SPRING = {
  type: "spring" as const,
  stiffness: 90,
  damping: 18,
  mass: 0.8,
};

type Props = {
  category: ServiceCategory;
  index?: number;
};

export default function CategoryCard({ category, index = 0 }: Props) {
  const cardRef      = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered]           = useState(false);
  const [mouse, setMouse]               = useState({ x: 0, y: 0 });
  const [arrowDelta, setArrowDelta]     = useState({ x: 0, y: 0 });

  const img          = CATEGORY_IMAGES[category.slug];
  const serviceNames = category.services.map((s) => s.name);

  // ── Mouse tracking for spotlight + magnetic arrow ──────────────────────────
  useEffect(() => {
    if (!hovered) return;

    const handleMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouse({ x, y });

      // Magnetic pull on arrow — only within 160 px
      const arrow = card.querySelector<HTMLElement>(".arrow-target");
      if (arrow) {
        const ar = arrow.getBoundingClientRect();
        const ax = ar.left + ar.width  / 2 - rect.left;
        const ay = ar.top  + ar.height / 2 - rect.top;
        const dx = x - ax;
        const dy = y - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const MAX  = 160;
        if (dist < MAX) {
          const force = (MAX - dist) / MAX;
          setArrowDelta({ x: (dx / dist) * force * 18, y: (dy / dist) * force * 18 });
        } else {
          setArrowDelta({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [hovered]);

  const handleLeave = () => {
    setHovered(false);
    setArrowDelta({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={cardRef}
      href={`/services/${category.slug}`}
      variants={cardVariants}
      transition={{ ...SPRING, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col overflow-hidden border border-white/5 transition-colors duration-500 hover:border-gold-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      aria-label={`Explore ${category.name} services`}
      style={{ minHeight: 340 }}
    >
      {/* ── Background image ──────────────────────────────────────────────── */}
      {img && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="h-full w-full"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-55"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
            />
          </motion.div>
        </div>
      )}

      {/* ── Static gradient / fallback ────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: img
            ? "linear-gradient(160deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.38) 50%, rgba(10,10,10,0.82) 100%)"
            : category.gradient,
        }}
      />
      {/* Bottom scrim */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* ── Cursor spotlight ──────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: hovered
            ? `radial-gradient(circle 320px at ${mouse.x}px ${mouse.y}px, rgba(248,200,0,0.13), transparent 70%)`
            : "transparent",
        }}
      />

      {/* ── Gold top-edge reveal ──────────────────────────────────────────── */}
      <div className="absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mt-auto p-7 md:p-9">
        {/* Service names — animate in one-by-one on hover */}
        <div className="mb-4 space-y-1.5 overflow-hidden">
          {serviceNames.map((name, i) => (
            <motion.div
              key={name}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -14 }}
              transition={{ duration: 0.28, delay: hovered ? i * 0.06 : 0, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-gold-500/70" />
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">
                {name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Category name */}
        <h2 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
          {category.name}
        </h2>

        {/* Gold divider — expands on hover */}
        <div className="my-4 h-[1px] w-8 bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-500 group-hover:w-16" />

        {/* CTA — magnetic arrow */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">
          <span>Explore</span>
          <motion.span
            className="arrow-target inline-flex"
            animate={{ x: arrowDelta.x, y: arrowDelta.y }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
          >
            <ArrowRight size={13} />
          </motion.span>
        </div>
      </div>

      {/* ── Spacer ────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none h-44 sm:h-52 md:h-56" aria-hidden />
    </motion.a>
  );
}
