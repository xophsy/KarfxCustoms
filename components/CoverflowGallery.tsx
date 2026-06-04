"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ImageLightbox, { type LightboxImage } from "@/components/ImageLightbox";

export type CoverflowImage = {
  src: string;
  alt: string;
};

// How many receding cards to mount to the right of the focused card.
const WINDOW = 6;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Measure the stage's rendered size so cards can be sized to fit the available
// height (keeps the whole gallery within one screen) and stay responsive.
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 1280, height: 600 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export default function CoverflowGallery({
  images,
}: {
  images: CoverflowImage[];
}) {
  // Start focused on the second image (so a card peeks on the left immediately).
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(1, images.length - 1)
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [stageRef, { width: stageW, height: stageH }] =
    useElementSize<HTMLDivElement>();

  const lastIndex = images.length - 1;
  const isMobile = stageW < 768;

  // Size cards from the available HEIGHT (so the whole gallery fits one screen),
  // capped by width. Keeps the 3:4 portrait ratio. Explicit px so framer owns
  // the transform; margins center it.
  const cardH = Math.min(stageH * 0.82, stageW * 0.42 * (4 / 3));
  const cardW = cardH * 0.75;

  // Spacing + anchor scale with card/stage size (responsive across widths).
  const GAP = cardW * 1.12;
  const anchorX = -stageW * 0.04;

  const clamp = useCallback(
    (value: number) => Math.max(0, Math.min(lastIndex, value)),
    [lastIndex]
  );

  const step = useCallback(
    (delta: number) => setActiveIndex((current) => clamp(current + delta)),
    [clamp]
  );

  useEffect(() => {
    if (lightboxIndex !== null) return; // lightbox owns the keys while open
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, lightboxIndex]);

  // Mouse-wheel navigation: scroll down → right (next), up → left (prev).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || lightboxIndex !== null) return;
    let accum = 0;
    let cooling = false;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return; // horizontal → ignore
      event.preventDefault();
      if (cooling) return;
      accum += event.deltaY;
      if (Math.abs(accum) < 40) return;
      step(accum > 0 ? 1 : -1);
      accum = 0;
      cooling = true;
      setTimeout(() => {
        cooling = false;
      }, 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step, lightboxIndex]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const throw_ = info.offset.x + info.velocity.x * 0.2;
    const moved = Math.round(-throw_ / GAP);
    if (moved !== 0) setActiveIndex((current) => clamp(current + moved));
  }

  const lightboxImages: LightboxImage[] = useMemo(
    () => images.map(({ src, alt }) => ({ src, alt })),
    [images]
  );

  return (
    <div ref={rootRef} className="flex h-full flex-col">
      <div
        className="relative min-h-0 w-full flex-1 select-none overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {/* 3D stage — draggable; a tap (no move) still reaches the card beneath */}
        <motion.div
          ref={stageRef}
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
        >
          {images.map((image, index) => {
            // Directional recession: focused card (k=0) sits left and is largest;
            // following cards (k>0) step smaller, further back, leaning the same
            // way, receding to the right. k=-1 is the card animating out.
            const k = index - activeIndex;
            if (k < -2 || k > WINDOW) return null;

            const isFront = k === 0;
            const ak = Math.abs(k);
            const isLeft = k < 0; // previous cards: stay full-size, just peek

            const target = reducedMotion
              ? {
                  x: isLeft ? anchorX + k * GAP * 1.2 : anchorX + k * GAP,
                  rotateY: 0,
                  rotateZ: 0,
                  skewY: 0,
                  z: 0,
                  scale: isLeft ? 1.25 : Math.max(0.45, 1 - ak * 0.13),
                  opacity: ak > WINDOW ? 0 : 1,
                }
              : {
                  x: isLeft ? anchorX + k * GAP * 1.2 : anchorX + k * GAP,
                  rotateY: 20,
                  rotateZ: 1,
                  skewY: 0,
                  z: isLeft ? 0 : -ak * 190,
                  scale: isLeft ? 1.25 : Math.max(0.45, 1 - ak * 0.13),
                  opacity: ak > WINDOW ? 0 : 1,
                };

            return (
              <motion.button
                key={image.src}
                type="button"
                onClick={() =>
                  isFront ? setLightboxIndex(index) : setActiveIndex(index)
                }
                className="group absolute left-1/2 top-1/2 overflow-hidden bg-surface-800 shadow-2xl shadow-black/60 focus:outline-none focus:ring-2 focus:ring-gold-500"
                style={{
                  zIndex: 100 - ak,
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={target}
                transition={{ type: "spring", stiffness: 260, damping: 34 }}
                aria-label={
                  isFront ? "Open image" : `Bring image ${index + 1} to front`
                }
                aria-hidden={ak > WINDOW}
                tabIndex={isFront ? 0 : -1}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 72vw, 400px"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gold-500/0 transition-colors duration-300 group-hover:bg-gold-500/10" />
                <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-gold-500/40" />
                {/* Darken the receding cards so the focused one stands out */}
                <div
                  className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-300"
                  style={{ opacity: isFront || isLeft ? 0 : Math.min(ak * 0.12, 0.5) }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Controls + counter */}
      <div className="mt-4 flex shrink-0 items-center justify-center gap-6 pb-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={activeIndex === 0}
          className="btn-ghost gap-2 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous image"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="min-w-[5rem] text-center text-sm tabular-nums text-white/40">
          {activeIndex + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={activeIndex === lastIndex}
          className="btn-ghost gap-2 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next image"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <ImageLightbox
        activeIndex={lightboxIndex}
        images={lightboxImages}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </div>
  );
}
