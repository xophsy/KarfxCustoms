"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Curated image sets — one standout shot per project, mixed across services ─
const ROW_1 = [
  "/images/gallery/all/2583cccd.jpg",
  "/images/gallery/all/IMG_6719.jpg",
  "/images/gallery/all/IMG_6065.jpg",
  "/images/gallery/all/0898a7e4-0d03-4d39-a746-8d58b7f6fa84.jpg",
  "/images/gallery/all/photo-mar-20-2025.jpg",
  "/images/gallery/all/IMG_1531.jpg",
  "/images/gallery/all/IMG_9471.jpg",
  "/images/gallery/all/IMG_2252.jpg",
  "/images/gallery/all/IMG_5960.jpg",
  "/images/gallery/all/IMG_9397.jpg",
];

const ROW_2 = [
  "/images/gallery/all/IMG_1443.jpg",
  "/images/gallery/all/IMG_5019.jpg",
  "/images/gallery/all/ambient-lighting.jpg",
  "/images/gallery/all/IMG_9575.jpg",
  "/images/gallery/all/IMG_2321.jpg",
  "/images/gallery/all/IMG_6124.jpg",
  "/images/gallery/all/IMG_20190212_155553210.jpg",
  "/images/gallery/all/IMG_7774.jpg",
  "/images/gallery/all/IMG_9881.jpg",
  "/images/gallery/all/IMG_6738.jpg",
];

// Target duration for one full loop — frame-rate independent
const LOOP_DURATION_MS = 200_000; // 200 seconds

function MarqueeRow({
  images,
  reverse = false,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const doubled   = [...images, ...images];
  const stripRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  const rafRef    = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    // Respect prefers-reduced-motion — freeze strip, don't animate (WCAG 2.2.2)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hover pause — only on pointer devices (not touch)
    const canHover = window.matchMedia("(hover: hover)").matches;
    const row = strip.parentElement!;
    const onEnter = () => { if (canHover) pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };
    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);

    // ResizeObserver re-measures whenever the strip grows (lazy images loading in)
    // This fixes mobile: images load after mount → scrollWidth was 0 at useEffect time
    let loopWidth = 0;
    const measureLoop = () => { loopWidth = strip.scrollWidth / 2; };
    const ro = new ResizeObserver(measureLoop);
    ro.observe(strip);

    const tick = (now: number) => {
      if (!pausedRef.current && loopWidth > 0 && lastTimeRef.current !== null) {
        // Time-based: correct speed regardless of 60 Hz / 120 Hz / etc.
        // Cap delta to 100 ms so a stall (tab hidden, slow image load) doesn't jump
        const delta = Math.min(now - lastTimeRef.current, 100);
        const pxPerMs = loopWidth / LOOP_DURATION_MS;
        posRef.current += (reverse ? -1 : 1) * pxPerMs * delta;
        // Wrap
        if (posRef.current >= loopWidth) posRef.current -= loopWidth;
        if (posRef.current < 0)          posRef.current += loopWidth;
        strip.style.transform = `translateX(${-posRef.current}px)`;
      }
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [reverse]);

  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div ref={stripRef} className="flex gap-3 will-change-transform">
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative h-48 w-72 shrink-0 overflow-hidden rounded-sm"
          >
            <Image
              src={src}
              alt=""
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out hover:scale-110"
              sizes="288px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkShowcase() {
  return (
    <section
      aria-label="Our work showcase"
      className="overflow-hidden bg-surface-900 py-16 md:py-20"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-6">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500">
            Our Work
          </p>
          <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Fashioned in Raleigh. Finished Right.
          </h2>
          <div className="gold-divider mt-4" />
          <p className="mt-3 text-sm text-white/60">Every photo is a real job on a real vehicle.</p>
        </div>
        <Link
          href="/portfolio"
          className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/55 transition-colors duration-200 hover:text-white/90 sm:inline-flex"
        >
          View All Work
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* ── Marquee rows ──────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-3">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface-900 to-transparent" />

        <MarqueeRow images={ROW_1} />
        <MarqueeRow images={ROW_2} reverse />
      </div>

      {/* ── Mobile CTA ────────────────────────────────────────────────────── */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/55 transition-colors duration-200 hover:text-white/90">
          View All Work
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
