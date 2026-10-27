import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";

const FACTS = [
  { value: BUSINESS_INFO.reviewRating, label: `${BUSINESS_INFO.reviewCount} Google reviews`, star: true },
  { value: "24h", label: "Quote replies on weekdays" },
  { value: "Veteran", label: "Owned in Raleigh, NC" },
];

export default function Hero() {
  return (
    <section id="home" aria-label="Homepage hero" className="relative overflow-hidden">
      {/* Soft gold light behind the headline */}
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[720px] opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.16), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-6 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pb-10">
        <div className="lg:col-span-6">
          <p className="eyebrow">Raleigh, NC</p>
          <h1 className="mt-6 font-display text-[clamp(2.9rem,7vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
            The detail makes the <span className="text-gold-500">difference.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Paint protection film, wraps, tint, ceramic coating and detailing, done by a team that treats every car like
            its own.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="btn-gold">
              Get a quote
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/portfolio" className="btn-ghost">
              See our work
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {FACTS.map((fact) => (
              <div key={fact.label} className="px-4 first:pl-0">
                <dt className="sr-only">{fact.label}</dt>
                <dd className="flex items-center gap-1.5 font-display text-2xl font-bold text-white sm:text-3xl">
                  {fact.value}
                  {fact.star && <Star size={18} className="fill-gold-500 text-gold-500" aria-hidden="true" />}
                </dd>
                <dd className="mt-1 text-xs leading-snug text-white/55 sm:text-sm">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 sm:aspect-[5/4] lg:aspect-auto lg:h-[min(78svh,760px)]">
            <Image
              src="/images/gallery/all/hero.jpg"
              alt="Fade-wrapped Toyota Supra inside the KAR FX Customs shop"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_60%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
            <Link
              href="/portfolio"
              className="group absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md transition-colors hover:border-gold-500/60 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:min-w-[320px]"
            >
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Recent build</span>
                <span className="mt-1 block text-sm font-medium text-white">Red-to-black fade wrap · Toyota Supra</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors group-hover:bg-gold-500">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
