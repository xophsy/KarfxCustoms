"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { GalleryImage } from "@/lib/services-images";
import { cn } from "@/lib/utils";

type Props = {
  images: GalleryImage[];
  serviceName: string;
};

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const lightboxImageVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

export default function ServiceGallery({ images, serviceName }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));

  // Determine grid layout based on count
  const count = images.length;
  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : count === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";

  return (
    <>
      {/* ── Gallery Grid ──────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className={cn("grid gap-3 md:gap-4", gridClass)}
      >
        {images.map((img, i) => {
          // First image in a 4+ count grid spans full width on mobile
          const isFeature = count >= 4 && i === 0;

          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className={cn(
                "group relative overflow-hidden",
                isFeature ? "sm:col-span-2" : "",
                count <= 2 ? "aspect-[4/3]" : "aspect-[4/3]"
              )}
            >
              {/* Badges */}
              <div className="absolute left-3 top-3 z-10 flex gap-2">
                {img.isBeforeAfter && (
                  <span className="rounded-sm border border-gold-500/40 bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold-500 backdrop-blur-sm">
                    Before / After
                  </span>
                )}
                {img.isDetail && (
                  <span className="rounded-sm border border-white/20 bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/60 backdrop-blur-sm">
                    Detail
                  </span>
                )}
              </div>

              {/* Zoom icon overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-gold-500 backdrop-blur-sm">
                  <ZoomIn size={18} />
                </div>
              </div>

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 z-[5] bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

              {/* Image */}
              <motion.div
                className="h-full w-full"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onClick={() => openLightbox(i)}
                  style={{ cursor: "zoom-in" }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:top-6"
              onClick={closeLightbox}
              aria-label="Close image"
            >
              <X size={18} />
            </button>

            {/* Counter */}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest text-white/40">
              {(lightboxIndex ?? 0) + 1} / {images.length}
            </span>

            {/* Prev */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous image"
                >
                  <span className="rotate-180 inline-block text-lg leading-none">→</span>
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next image"
                >
                  <span className="text-lg leading-none">→</span>
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                variants={lightboxImageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative mx-auto max-h-[85vh] max-w-[90vw] md:max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  width={1200}
                  height={800}
                  className="max-h-[85vh] w-auto object-contain"
                  priority
                />
                {/* Alt text caption */}
                <p className="mt-3 text-center text-xs text-white/35">
                  {images[lightboxIndex].alt}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
