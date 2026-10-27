import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function RestorFXBand() {
  return (
    <section aria-labelledby="restorfx-heading" className="bg-surface-900 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative grid overflow-hidden rounded-[32px] bg-surface-800 ring-1 ring-white/5 lg:grid-cols-12">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, rgba(248,200,0,0.18), transparent)" }}
            aria-hidden="true"
          />

          <div className="relative p-8 sm:p-12 lg:col-span-7 lg:p-16">
            <div className="flex flex-wrap items-center gap-4">
              {/* RestorFX's own wordmark is black + yellow, so it sits on a white badge */}
              <span className="inline-flex rounded-full bg-white px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/branding/restorfx-logo.svg" alt="RestorFX" width={140} height={13} className="h-3.5 w-auto" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500">Trusted partner</span>
            </div>

            <h2 id="restorfx-heading" className="mt-8 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-balance text-white md:text-5xl">
              Faded or scratched paint? <span className="text-gold-gradient">We bring it back.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              For paint restoration we work alongside RestorFX, our partner for specialized clear-coat repair. Whether
              your paint needs correcting before a wrap or PPF, or it&apos;s faded and oxidized, RestorFX restores it to a
              like-new finish without a repaint.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="/quote?ref=restorfx" className="btn-gold" aria-label="Book a RestorFX consultation through KAR FX">
                Book through KAR FX
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="https://restorfx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label="Visit the RestorFX website (opens in new tab)"
              >
                Visit RestorFX
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-black/30 p-10 lg:col-span-5">
            <figure className="text-center">
              <div className="relative mx-auto h-56 w-60 md:h-64 md:w-72">
                <Image
                  src="/images/services/partners/restorfx/tarifa-comercial.jpg"
                  alt="Best of Business 2025 — Auto Restoration Service, Raleigh NC"
                  fill
                  className="rounded-2xl object-contain"
                  sizes="288px"
                />
              </div>
              <figcaption className="mt-5 text-sm font-semibold text-white">
                Best of Business 2025
                <span className="mt-1 block text-xs font-normal text-white/50">Auto restoration · BusinessRate · Raleigh, NC</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
