import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  SERVICE_CATEGORIES,
  getCategoryBySlug,
} from "@/lib/services-data";
import { CATEGORY_IMAGES } from "@/lib/services-images";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceBreadcrumb from "@/components/services/ServiceBreadcrumb";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} | KAR FX Customs — Raleigh`,
    description: `${cat.tagline} ${cat.services.map((s) => s.name).join(", ")}. KAR FX Customs, Raleigh NC.`,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) notFound();

  const catImg = CATEGORY_IMAGES[cat.slug];

  const cardGridClass =
    cat.services.length === 1
      ? "grid-cols-1 sm:max-w-sm"
      : cat.services.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: cat.gradient }}
        aria-label={cat.name}
      >
        {catImg && (
          <div className="absolute inset-0">
            <Image
              src={catImg.src}
              alt={catImg.alt}
              fill
              className="object-cover opacity-50"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface-900 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-28 lg:px-8">
          <ServiceBreadcrumb
            crumbs={[
              { label: "Services", href: "/#services" },
              { label: cat.name },
            ]}
          />
          <h1 className="mt-5 font-editorial text-5xl font-semibold leading-[1] text-balance text-white sm:text-6xl md:text-7xl">
            {cat.name}
          </h1>
          <div className="gold-divider mt-4 mb-5" />
          <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {cat.description}
          </p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section aria-label={`${cat.name} services`} className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">

          <div className={`grid gap-5 ${cardGridClass}`}>
            {cat.services.map((service, i) => (
              <ServiceCard
                key={service.slug}
                service={service}
                categorySlug={cat.slug}
                index={i}
              />
            ))}
          </div>

        </div>
      </section>

      <div className="px-5 pb-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <a
            href="/#services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/25 transition-colors duration-200 hover:text-gold-500"
          >
            <span className="rotate-180 inline-block">→</span>
            All services
          </a>
        </div>
      </div>
    </>
  );
}
