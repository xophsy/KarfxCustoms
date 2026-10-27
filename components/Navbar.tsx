"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BUSINESS_INFO } from "@/lib/business";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Our work", href: "/portfolio" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation, and stop the page scrolling behind it.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled || menuOpen ? "border-b border-white/10 bg-surface-900/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
          {/* The badge hangs half below the 80px bar: its top margin is 80px minus half its height. */}
          <Link href="/" aria-label="KAR FX Customs home" className="group flex shrink-0 items-start gap-3 self-start md:gap-4">
            <Image
              src="/images/branding/Logo.png"
              alt=""
              width={256}
              height={256}
              priority
              className="mt-9 h-[5.5rem] w-[5.5rem] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:rotate-[-8deg] md:mt-4 md:h-32 md:w-32"
            />
            <span className="mt-[22px] leading-none md:mt-5">
              <span className="block font-brand text-xl font-extrabold tracking-tight text-white md:text-2xl">KAR FX</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500">Customs · Raleigh</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-gold-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center gap-2 text-[15px] font-medium text-white/80 transition-colors hover:text-gold-500"
            >
              <Phone size={15} strokeWidth={2} aria-hidden="true" />
              {BUSINESS_INFO.phoneDisplay}
            </a>
            <Link href="/quote" className="btn-gold !py-3">
              Get a quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Full-screen menu below lg */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-surface-900 px-5 pb-10 pt-36 transition-opacity duration-300 sm:px-6 lg:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-white/10 py-5"
            >
              <span className="flex items-baseline gap-4">
                <span className="text-xs font-semibold text-gold-500">0{i + 1}</span>
                <span className="font-display text-3xl font-bold tracking-[-0.01em] text-white">{link.label}</span>
              </span>
              <ArrowRight size={20} className="text-white/40 transition-colors group-hover:text-gold-500" />
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Link href="/quote" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} className="btn-gold">
            Get a quote
          </Link>
          <a href={BUSINESS_INFO.phoneHref} tabIndex={menuOpen ? 0 : -1} className="btn-ghost">
            <Phone size={15} strokeWidth={2} aria-hidden="true" />
            Call {BUSINESS_INFO.phoneDisplay}
          </a>
          <p className="mt-3 text-center text-sm text-white/45">{BUSINESS_INFO.fullAddress}</p>
        </div>
      </div>

      {/* Phones hide the header buttons, so keep Call / Quote one tap away */}
      {pathname !== "/quote" && !menuOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-surface-900/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
          <a href={BUSINESS_INFO.phoneHref} className="btn-ghost !px-4">
            <Phone size={15} strokeWidth={2} aria-hidden="true" />
            Call us
          </a>
          <Link href="/quote" className="btn-gold !px-4">
            Get a quote
          </Link>
        </div>
      )}
    </>
  );
}
