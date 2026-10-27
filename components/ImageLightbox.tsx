"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useEffect, useRef } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  activeIndex: number | null;
  images: LightboxImage[];
  onClose: () => void;
  onChange: (nextIndex: number) => void;
};

const roundButton =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500";

export default function ImageLightbox({ activeIndex, images, onClose, onChange }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const open = activeIndex !== null && Boolean(images[activeIndex]);

  const step = (delta: number) => {
    if (activeIndex !== null) onChange((activeIndex + delta + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Lock the page behind the viewer and move focus into it while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || activeIndex === null) return null;
  const image = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-surface-900"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <span className="text-sm tabular-nums text-white/60">
          {activeIndex + 1} / {images.length}
        </span>
        <button ref={closeRef} type="button" className={roundButton} onClick={onClose} aria-label="Close photo viewer">
          <X size={20} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-4 md:px-24" onClick={(event) => event.stopPropagation()}>
        <div className="relative h-full w-full">
          {/* Sits behind the photo, so it only shows while the photo is still loading */}
          <Loader2 className="absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 animate-spin text-white/30" aria-hidden="true" />
          <Image key={image.src} src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" priority />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-5 md:px-8" onClick={(event) => event.stopPropagation()}>
        <button type="button" className={roundButton} onClick={() => step(-1)} aria-label="Previous photo">
          <ChevronLeft size={22} />
        </button>
        <p className="line-clamp-2 text-center text-sm text-white/80">{image.alt}</p>
        <button type="button" className={roundButton} onClick={() => step(1)} aria-label="Next photo">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
