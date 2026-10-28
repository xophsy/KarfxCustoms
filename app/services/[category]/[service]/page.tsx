import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  getCategoryBySlug,
  getServiceBySlug,
} from "@/lib/services-data";
import { getServiceImages } from "@/lib/services-images";
import ServiceGallery from "@/components/services/ServiceGallery";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.flatMap((cat) =>
    cat.services.map((s) => ({ category: cat.slug, service: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; service: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.category, params.service);
  if (!service) return {};
  const images = getServiceImages(params.category, params.service);
  return {
    title: `${service.name} | KAR FX Customs — Raleigh`,
    description: `${service.tagline} Professional ${service.name} in Raleigh, NC by KAR FX Customs.`,
    openGraph: images?.hero
      ? { images: [{ url: images.hero, alt: images.heroAlt }] }
      : undefined,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { category: string; service: string };
}) {
  const cat = getCategoryBySlug(params.category);
  const service = getServiceBySlug(params.category, params.service);
  if (!cat || !service) notFound();

  const images = getServiceImages(params.category, params.service);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: service.heroGradient }}
        aria-label={service.name}
      >
        {images?.hero && (
          <div className="absolute inset-0">
            <Image
              src={images.hero}
              alt={images.heroAlt}
              fill
              className="object-cover opacity-50"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-28 lg:px-8">
          {service.isB2B && (
            <span className="mt-5 inline-block border border-gold-500/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-500/70">
              For Business
            </span>
          )}

          <h1 className="mt-5 font-editorial text-5xl font-semibold leading-[1] text-balance text-white sm:text-6xl md:text-7xl">
            {service.name}
          </h1>
          <div className="gold-divider mt-4 mb-5" />
          <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {service.tagline}
          </p>
        </div>
      </section>

      {/* ── BODY: four plain sections, nothing to open or click through ─────── */}
      <div className="mx-auto max-w-3xl space-y-16 px-5 py-14 md:px-8 md:py-20">
        <section aria-labelledby="what-heading">
          <h2 id="what-heading" className="font-display text-3xl font-bold tracking-[-0.01em] text-white">
            What you get
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">{service.description[0]}</p>
          <ul className="mt-6 space-y-3">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-lg leading-relaxed text-white/90">
                <CheckCircle2 size={22} className="mt-1 shrink-0 text-gold-500" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        {images && images.gallery.length > 0 && (
          <section aria-labelledby="work-heading">
            <h2 id="work-heading" className="mb-6 font-display text-3xl font-bold tracking-[-0.01em] text-white">
              Our work
            </h2>
            <ServiceGallery images={images.gallery} serviceName={service.name} />
          </section>
        )}

        {service.faq.length > 0 && (
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-3xl font-bold tracking-[-0.01em] text-white">
              Common questions
            </h2>
            {/* Answers are shown, not folded away, so there is nothing to open */}
            <dl className="mt-6 space-y-7">
              {service.faq.map(({ q, a }) => (
                <div key={q}>
                  <dt className="text-lg font-semibold text-white">{q}</dt>
                  <dd className="mt-1.5 text-lg leading-relaxed text-white/75">{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

      </div>
    </>
  );
}
