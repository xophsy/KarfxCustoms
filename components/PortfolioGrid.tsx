"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import { PORTFOLIO_CATEGORIES, type PortfolioImage } from "@/lib/gallery";
import { GALLERY_SIZES } from "@/lib/gallery-sizes";

const CATEGORY_LABEL = Object.fromEntries(PORTFOLIO_CATEGORIES.map((c) => [c.id, c.label]));

// Masonry grid: every photo keeps its own shape; tapping one opens the full-screen viewer.
export default function PortfolioGrid({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {images.map((image, i) => {
          // Photos added without rerunning scripts/gallery-sizes.mjs fall back to 4:3 until they load.
          const [width, height] = GALLERY_SIZES[image.src.split("/").pop() ?? ""] ?? [1600, 1200];
          return (
            <li key={image.src} className="mb-3 break-inside-avoid md:mb-4">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View photo: ${image.alt}`}
                className="group relative block w-full overflow-hidden rounded-2xl bg-surface-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={width}
                  height={height}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span
                  className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-500">
                    {CATEGORY_LABEL[image.category]}
                  </span>
                  <span className="mt-1 text-sm font-medium leading-snug text-white">{image.alt}</span>
                </span>
                <span
                  className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <Expand size={14} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <ImageLightbox activeIndex={active} images={images} onClose={() => setActive(null)} onChange={setActive} />
    </>
  );
}
