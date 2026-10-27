import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons/SocialIcons";
import { BUSINESS_INFO } from "@/lib/business";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Get a Quote", href: "/quote" },
];

const socials = [
  { label: "Instagram", href: BUSINESS_INFO.instagramHref, Icon: InstagramIcon },
  { label: "Facebook", href: BUSINESS_INFO.facebookHref, Icon: FacebookIcon },
  { label: "TikTok", href: BUSINESS_INFO.tiktokHref, Icon: TikTokIcon },
];


export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div>
              <Image
                src="/images/branding/Logo.png"
                alt="KAR FX Customs"
                width={320}
                height={100}
                className="h-28 w-auto object-contain"
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {BUSINESS_INFO.summary}
            </p>
            <div className="h-px w-8 bg-gold-500/40" aria-hidden="true" />
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold-500/60">★★★★★</span>
                <span className="text-xs text-white/40">{BUSINESS_INFO.reviewSummary}</span>
              </div>
              <p className="text-xs text-white/35">
                {BUSINESS_INFO.appointmentNote}. Reply within 24 hours on weekdays.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-gold-500"
                  >
                    <span
                      className="h-px w-0 shrink-0 bg-gold-500 transition-all duration-300 group-hover:w-4"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Connect
            </h3>
            <address className="mb-8 space-y-2.5 not-italic">
              <a
                href={BUSINESS_INFO.emailHref}
                className="block text-sm text-white/60 transition-colors duration-200 hover:text-white"
              >
                {BUSINESS_INFO.email}
              </a>
              <a
                href={BUSINESS_INFO.phoneHref}
                className="block text-sm text-white/60 transition-colors duration-200 hover:text-white"
              >
                {BUSINESS_INFO.phoneDisplay}
              </a>
              <a
                href={BUSINESS_INFO.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/60 transition-colors duration-200 hover:text-white"
              >
                {BUSINESS_INFO.locationName}
              </a>
              <p className="text-sm text-white/40">
                {BUSINESS_INFO.fullAddress}
              </p>
              <p className="text-sm text-white/40">
                {BUSINESS_INFO.serviceAreaMessage}
              </p>
            </address>

            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/50 transition-all duration-200 hover:border-gold-500/50 hover:text-gold-500"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.brandName}. All
            rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/portfolio"
              className="text-xs text-white/20 transition-colors duration-200 hover:text-gold-500/60"
            >
              View Portfolio
            </Link>
            {/* Quiet staff entrance to the shop admin */}
            <Link
              href="/admin"
              aria-label="Staff login"
              title="Staff login"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/20 transition-colors duration-200 hover:text-gold-500 focus-visible:text-gold-500"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
