import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/services-data";

// Homepage card photos: one car per category, none repeating the hero.
const CARD_IMAGES: Record<string, { src: string; alt: string }> = {
  protection: { src: "/images/gallery/all/maserati-ppf.jpg", alt: "White Maserati MC20 with satin paint protection film" },
  "wraps-styling": { src: "/images/gallery/all/IMG_5019.jpg", alt: "Purple color-change wrap on a Toyota Camry" },
  "wheels-calipers-lighting": {
    src: "/images/gallery/all/b3de50a9-2058-4e57-b44c-b38be9a220ff.jpg",
    alt: "Forged drag wheel on the wrapped Toyota Supra",
  },
  detailing: { src: "/images/gallery/all/IMG_9881.jpg", alt: "Front of an orange Corvette C6" },
};

export default function CategoryGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICE_CATEGORIES.map((cat, i) => {
        const img = CARD_IMAGES[cat.slug];
        return (
          <li key={cat.slug}>
            <Link
              href={`/services/${cat.slug}`}
              className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl bg-surface-800 p-6 ring-1 ring-white/5 transition-shadow duration-300 hover:ring-gold-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:aspect-[4/5] lg:aspect-[3/4.2]"
            >
              {img && (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/45" aria-hidden="true" />

              <span className="absolute left-6 top-6 text-[11px] font-semibold tracking-[0.3em] text-gold-500">
                0{i + 1}
              </span>
              <span
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-black"
                aria-hidden="true"
              >
                <ArrowUpRight size={18} />
              </span>

              <div className="relative">
                <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.01em] text-white">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{cat.tagline}</p>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  {cat.services.map((s) => s.name).join(" · ")}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
