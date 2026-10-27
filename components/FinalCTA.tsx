import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";

const CONTACTS = [
  { Icon: MapPin, label: "Visit by appointment", value: BUSINESS_INFO.fullAddress, href: BUSINESS_INFO.mapHref, external: true },
  { Icon: Phone, label: "Call or text", value: BUSINESS_INFO.phoneDisplay, href: BUSINESS_INFO.phoneHref },
  { Icon: Mail, label: "Email", value: BUSINESS_INFO.email, href: BUSINESS_INFO.emailHref },
];

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
          <p className="eyebrow">Ready when you are</p>
          <h2 id="cta-heading" className="mt-6 font-display text-[clamp(2.6rem,6vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white">
            Let&apos;s make your car <span className="text-gold-500">look its best.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Tell us about your vehicle and we&apos;ll get back to you within 24 hours on weekdays.
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

        <ul className="mx-auto mt-16 grid max-w-5xl gap-3 md:grid-cols-3">
          {CONTACTS.map(({ Icon, label, value, href, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="glass-card flex h-full items-start gap-4 p-5 backdrop-blur-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-500">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{label}</span>
                  <span className="mt-1 block text-[15px] font-medium text-white">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
