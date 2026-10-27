import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";

export default function FinalCTA() {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="relative overflow-hidden">
      <Image
        src="/images/gallery/all/IMG_9397.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/75" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-surface-900" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-6 md:py-36 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Get in touch</p>
          <h2 id="cta-heading" className="mt-6 font-editorial text-[clamp(3rem,6.4vw,5.5rem)] font-semibold leading-[0.98] text-white">
            We look forward to <span className="text-gold-gradient italic">hearing from you.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Tell us a little about your vehicle and what you are looking for.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/quote" className="btn-gold">
              Get a quote
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={BUSINESS_INFO.phoneHref} className="btn-ghost">
              <Phone size={15} aria-hidden="true" />
              {BUSINESS_INFO.phoneDisplay}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
