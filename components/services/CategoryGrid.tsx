import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

// Every service is listed right here and opens its own page in one tap, with no in-between category menu.
export default function CategoryGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICE_CATEGORIES.map((cat) => {
        const img = CARD_IMAGES[cat.slug];
        return (
          <li key={cat.slug} className="flex flex-col overflow-hidden rounded-3xl bg-surface-800 ring-1 ring-white/5">
            <div className="relative flex aspect-[16/11] flex-col justify-end p-6">
              {img && (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" aria-hidden="true" />
              <div className="relative">
                <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.01em] text-white">{cat.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{cat.tagline}</p>
              </div>
            </div>

            <ul className="divide-y divide-white/10 px-6 py-2">
              {cat.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${cat.slug}/${s.slug}`}
                    className="group flex items-center justify-between gap-3 py-3.5 text-base font-medium text-white/85 transition-colors hover:text-gold-500 focus-visible:text-gold-500 focus-visible:outline-none"
                  >
                    {s.name}
                    <ArrowRight size={16} className="shrink-0 text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
