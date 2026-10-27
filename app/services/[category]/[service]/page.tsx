import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  getCategoryBySlug,
  getServiceBySlug,
  getRelatedServices,
} from "@/lib/services-data";
import { getServiceImages } from "@/lib/services-images";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceBreadcrumb from "@/components/services/ServiceBreadcrumb";
import FAQAccordion from "@/components/services/FAQAccordion";
import ServiceGallery from "@/components/services/ServiceGallery";
import ScrollReveal from "@/components/services/ScrollReveal";

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
  const relatedServices = getRelatedServices(service.relatedSlugs);

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
          <ServiceBreadcrumb
            crumbs={[
              { label: "Services", href: "/services" },
              { label: cat.name, href: `/services/${cat.slug}` },
              { label: service.name },
            ]}
          />

          {service.isB2B && (
            <span className="mt-5 inline-block border border-gold-500/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-500/70">
              For Business
            </span>
          )}

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] text-balance text-white sm:text-5xl md:text-7xl">
            {service.name}
          </h1>
          <div className="gold-divider mt-4 mb-5" />
          <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {service.tagline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`/quote?category=${params.category}&service=${params.service}`}
              className="btn-gold inline-flex items-center justify-center gap-2"
            >
              Get a quote
              <ArrowRight size={14} />
            </a>
            <a href="/contact" className="btn-ghost inline-flex justify-center">
              Ask a question
            </a>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 md:px-8 lg:px-10">

        {/* ── Description + Benefits ─────────────────────────────────────── */}
        <ScrollReveal>
          <section className="py-8 md:py-14">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Description */}
              <div className="space-y-4">
                {service.description.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-white/70 md:text-base">
                    {p}
                  </p>
                ))}
              </div>
              {/* Benefits */}
              <ul className="space-y-3" role="list">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-gold-500"
                      aria-hidden
                    />
                    <span className="text-[15px] leading-relaxed text-white/80">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ScrollReveal>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        {images && images.gallery.length > 0 && (
          <>
            <section className="py-8 md:py-14">
              <ScrollReveal>
                <h2 className="font-display text-3xl font-semibold text-white mb-8">
                  Our work
                </h2>
              </ScrollReveal>
              <ServiceGallery images={images.gallery} serviceName={service.name} />
            </section>
            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </>
        )}

        {/* ── Process ──────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <h2 className="font-display text-3xl font-semibold text-white mb-8">
              The process
            </h2>
            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 grid-cols-1 sm:grid-cols-3">
              {service.steps.map((step, i) => (
                <div key={i} className="relative bg-surface-900 p-5 md:p-8">
                  <span className="mb-3 block text-xs font-bold tracking-[0.3em] text-gold-500/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 font-display text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/45">
                    {step.desc}
                  </p>
                  {i < service.steps.length - 1 && (
                    <div
                      className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-gold-500/20 sm:block"
                      aria-hidden
                    >
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {service.faq.length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <ScrollReveal>
              <section className="py-8 md:py-14">
                <h2 className="font-display text-3xl font-semibold text-white mb-8">
                  FAQ
                </h2>
                <div className="border-t border-white/5">
                  <FAQAccordion items={service.faq} />
                </div>
                <p className="mt-6 text-sm text-white/35">
                  More questions?{" "}
                  <a href="/contact" className="text-gold-500 hover:underline underline-offset-2">
                    Get in touch
                  </a>
                  .
                </p>
              </section>
            </ScrollReveal>
          </>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="border border-gold-500/20 bg-surface-800 px-6 py-10 text-center sm:px-10 md:py-14">
              <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
                Tell us about your vehicle and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="mt-7 flex justify-center">
                <a
                  href={`/quote?service=${service.slug}`}
                  className="btn-gold inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  Get a quote
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Related Services ─────────────────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <ScrollReveal>
            <section className="pb-16 md:pb-20">
              <h2 className="font-display text-2xl font-semibold text-white mb-6">
                You might also like
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.slice(0, 3).map((related, i) => (
                  <ServiceCard
                    key={related.slug}
                    service={related}
                    categorySlug={related.categorySlug}
                    index={i}
                  />
                ))}
              </div>
              <div className="mt-8">
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/25 transition-colors duration-200 hover:text-gold-500"
                >
                  <span className="rotate-180 inline-block">→</span>
                  All Services
                </a>
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </>
  );
}
