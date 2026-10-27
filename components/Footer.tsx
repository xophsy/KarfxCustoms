import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { BUSINESS_INFO } from "@/lib/business";
import { SERVICE_CATEGORIES } from "@/lib/services-data";

const shopLinks = [
  { label: "Our work", href: "/portfolio" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/about" },
  { label: "Get a quote", href: "/quote" },
];

const socials = [
  { label: "Instagram", href: BUSINESS_INFO.instagramHref, Icon: InstagramIcon },
  { label: "Facebook", href: BUSINESS_INFO.facebookHref, Icon: FacebookIcon },
  { label: "TikTok", href: BUSINESS_INFO.tiktokHref, Icon: TikTokIcon },
];

const heading = "text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500";
const link = "text-[15px] text-white/70 transition-colors hover:text-gold-500";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="KAR FX Customs home">
              <Image src="/images/branding/Logo.png" alt="" width={160} height={160} className="h-20 w-20 object-contain" />
              <span className="leading-none">
                <span className="block font-brand text-2xl font-extrabold tracking-tight text-white">KAR FX</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500">Customs · Raleigh</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/55">{BUSINESS_INFO.summary}</p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold-500 hover:text-gold-500"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className={heading}>Services</h3>
            <ul className="mt-5 space-y-3">
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/services/${cat.slug}`} className={link}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={heading}>Shop</h3>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic md:col-span-3">
            <h3 className={heading}>Contact</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={BUSINESS_INFO.phoneHref} className={link}>
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={BUSINESS_INFO.emailHref} className={link}>
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li>
                <a href={BUSINESS_INFO.mapHref} target="_blank" rel="noopener noreferrer" className={link}>
                  {BUSINESS_INFO.streetAddress}
                  <br />
                  {BUSINESS_INFO.cityStateZip}
                </a>
              </li>
              <li className="text-sm text-white/45">{BUSINESS_INFO.appointmentNote}.</li>
            </ul>
          </address>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/35 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>
              ★ {BUSINESS_INFO.reviewSummary}
            </span>
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
