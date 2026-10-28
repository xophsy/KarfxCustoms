import Image from "next/image";
import { ArrowRight } from "lucide-react";

// KAR FX Customs and RestorFX Raleigh are one shop: same team, same address, same phone.
export default function RestorFXBand() {
  return (
    <section id="restorfx" aria-labelledby="restorfx-heading" className="scroll-mt-20 bg-surface-900 pt-20 md:pt-28">
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500">Raleigh · Same shop, same team</span>
            </div>

            <h2 id="restorfx-heading" className="mt-8 font-editorial text-[2.75rem] font-semibold leading-[1.02] text-balance text-white md:text-[3.75rem]">
              We are also <span className="text-gold-gradient italic">RestorFX Raleigh.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              KAR FX Customs and RestorFX Raleigh are the same shop, under one roof. If your paint is faded, oxidized or
              scratched, we restore the clear coat to a like-new finish without repainting. In 2025 our shop was named
              Best of Business for auto restoration in Raleigh, based on our Google reviews.
            </p>

            <div className="mt-9">
              <a href="/quote?ref=restorfx" className="btn-gold">
                Ask about RestorFX
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-black/30 p-10 lg:col-span-5">
            <figure className="text-center">
              {/* The awards are cut out of their white backdrop, so they sit straight on the dark panel */}
              <div className="relative mx-auto aspect-[1033/969] w-64 sm:w-80 lg:w-96">
                <Image
                  src="/images/services/partners/restorfx/best-of-business-2025.png"
                  alt="Best of Business 2025 awards for RestorFX Raleigh, Auto Restoration Service"
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 256px"
                />
              </div>
              <figcaption className="mt-5 text-base font-semibold text-white">
                Best of Business 2025
                <span className="mt-1 block text-sm font-normal text-white/55">Auto restoration in Raleigh · BusinessRate</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
