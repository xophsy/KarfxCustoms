import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";

const FACTS = [
  { value: `${BUSINESS_INFO.reviewRating} ★`, label: `Google rating · ${BUSINESS_INFO.reviewCount} reviews` },
  { value: "24 hours", label: "Quote replies on weekdays" },
  { value: "Veteran", label: "Owned & operated" },
  { value: "Raleigh, NC", label: "Shop visits by appointment" },
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
        className="hero-zoom object-cover object-[72%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-black/10 to-black/60" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-40 sm:px-6 md:pt-48 lg:px-8">
        <p className="eyebrow">
          {/* one span so the eyebrow's flex gap doesn't split the line */}
          <span>
            <span className="hidden sm:inline">{BUSINESS_INFO.brandName} · </span>Raleigh, NC
          </span>
        </p>
        <h1 className="mt-7 font-editorial text-[clamp(3.4rem,8.4vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.01em] text-white">
          The Detail Makes
          <br />
          <span className="text-gold-gradient italic">the Difference.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
          Paint protection film, wraps, tint, ceramic coating and detailing for vehicles that deserve more than ordinary
          care.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/quote" className="btn-gold">
            Get a quote
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link href="/portfolio" className="btn-ghost">
            View our work
          </Link>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-y-6 border-t border-white/15 pt-7 md:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.value} className="pr-4 md:border-l md:border-white/10 md:pl-6 md:first:border-l-0 md:first:pl-0">
              <dt className="sr-only">{fact.label}</dt>
              <dd className="text-2xl font-bold text-white md:text-[1.6rem]">{fact.value}</dd>
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
