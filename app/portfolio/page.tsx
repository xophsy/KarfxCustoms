"use client";

import CoverflowGallery, {
  type CoverflowImage,
} from "@/components/CoverflowGallery";
import { ALL_GALLERY_IMAGES } from "@/lib/gallery";

export default function PortfolioPage() {
  const archiveImages: CoverflowImage[] = ALL_GALLERY_IMAGES.map(
    (src, index) => ({
      src,
      alt: `Completed vehicle work from the KAR FX Customs gallery ${index + 1}`,
    })
  );

  return (
    <section className="flex h-[calc(100dvh-5rem)] flex-col bg-surface-900">
      <div className="shrink-0 px-6 pb-4 pt-6 md:px-8 lg:px-16">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/70">
          Portfolio
        </p>
        <h1 className="font-display text-2xl font-semibold leading-tight text-white md:text-4xl">
          Real jobs, real vehicles, and a wider look at the shop.
        </h1>
      </div>

      <div className="min-h-0 flex-1">
        <CoverflowGallery images={archiveImages} />
      </div>
    </section>
  );
}
