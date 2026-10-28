import Image from "next/image";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/business";

const FACTS = [
  { value: `${BUSINESS_INFO.reviewRating} ★`, label: `Google rating · ${BUSINESS_INFO.reviewCount} reviews` },
  { value: "24 hours", label: "Quote replies on weekdays" },
  { value: "Veteran", label: "Owned & operated" },
];

export default function Hero() {
  return (
    // -mt-20 slides the photo up under the see-through navbar (main has pt-20).
    <section
      id="home"
      aria-label="Homepage hero"
      className="relative -mt-20 flex min-h-[100svh] flex-col justify-end overflow-hidden bg-surface-900"
    >
      <Image
        src="/images/gallery/all/IMG_6716.jpg"
        alt="Blue BMW XM under the hexagon lights at KAR FX Customs"
        fill
        priority
        sizes="100vw"
        className="hero-zoom object-cover object-[72%_center] brightness-110"
      />
      {/* Light shading only where the text sits (left), the navbar (top) and the stats (bottom) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-black/35" aria-hidden="true" />
      {/* Phones stack the text over the car, so they get a touch more shade */}
      <div className="absolute inset-0 bg-black/25 md:hidden" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-40 sm:px-6 md:pt-48 lg:px-8">
        {/* The award, first thing on the page; taps through to the RestorFX section that explains it */}
        <a
          href="#restorfx"
          className="mb-8 inline-flex items-center gap-4 rounded-2xl bg-black/50 p-2 pr-5 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:ring-gold-500/60"
        >
          <Image
            src="/images/services/partners/restorfx/best-of-business-2025.jpg"
            alt=""
            width={1131}
            height={1067}
            priority
            className="h-16 w-auto rounded-xl md:h-20"
          />
          <span className="leading-tight">
            <span className="block text-base font-semibold text-white md:text-lg">Best of Business 2025</span>
            <span className="mt-1 block text-sm text-white/75">Auto restoration in Raleigh · RestorFX Raleigh</span>
          </span>
        </a>
        <h1 className="font-editorial text-[clamp(3.4rem,8.4vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
          The Detail Makes
          <br />
          <span className="inline-block text-gold-gradient italic [text-shadow:none] drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">the Difference.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
          Paint protection film, wraps, tint, ceramic coating and detailing in Raleigh. Tell us about your vehicle, and we
          will help you find the best option for it.
        </p>

        {/* Get a quote lives in the header and the phone bar; "Our work" is in the header from lg up */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:hidden">
          <Link href="/portfolio" className="btn-ghost">
            View our work
          </Link>
        </div>

        <dl className="mt-16 grid [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] grid-cols-3 gap-y-6 border-t border-white/15 pt-7">
          {FACTS.map((fact) => (
            <div key={fact.value} className="border-l border-white/10 pl-4 pr-2 first:border-l-0 first:pl-0 md:pl-6">
              <dt className="sr-only">{fact.label}</dt>
              <dd className="text-xl font-bold text-white sm:text-2xl md:text-[1.6rem]">{fact.value}</dd>
              <dd className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {fact.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
