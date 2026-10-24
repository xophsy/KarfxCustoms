"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BUSINESS_INFO } from "@/lib/business";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 overflow-visible transition-all duration-500",
          scrolled
            ? "border-b border-gold-500/20 bg-black/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            : "border-b border-white/5 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-md"
        )}
      >
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 overflow-visible">
          <Link
            href="/"
            aria-label="KAR FX Customs home"
            className="relative z-10 shrink-0 self-start"
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/images/branding/Logo.png"
                alt="KAR FX Customs"
                width={160}
                height={160}
                className="h-32 w-32 object-contain md:h-40 md:w-40"
                priority
              />
            </motion.div>
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gold-500 transition-all duration-300 group-hover:w-4" />
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <a href="tel:+19195260818" className="btn-ghost inline-flex items-center gap-2">
              <Phone size={13} strokeWidth={2} />
              Call Us
            </a>
            <Link href="/quote" className="btn-gold">
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="cursor-pointer p-2 text-white/60 transition-colors hover:text-gold-500 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={cn(
            "absolute right-0 top-0 flex h-full w-72 flex-col gap-1 border-l border-gold-500/20 bg-black/90 px-8 pt-24 backdrop-blur-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
          aria-label="Mobile navigation"
        >
          <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-gold-500/60 via-gold-500/20 to-transparent" />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-white/5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition-all duration-200 hover:border-gold-500/20 hover:text-white"
            >
              {link.label}
              <span className="h-[1px] w-0 bg-gold-500 transition-all duration-300 group-hover:w-5" />
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/#services"
              onClick={() => setMenuOpen(false)}
              className="btn-ghost text-center"
            >
              Services
            </Link>
            <Link
              href="/quote"
              onClick={() => setMenuOpen(false)}
              className="btn-gold text-center"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>

      {/* Phones hide the header buttons, so keep Call / Quote one tap away */}
      {pathname !== "/quote" && !menuOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-gold-500/20 bg-black/85 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
          <a
            href={BUSINESS_INFO.phoneHref}
            className="btn-ghost inline-flex items-center justify-center gap-2"
          >
            <Phone size={13} strokeWidth={2} />
            Call Us
          </a>
          <Link href="/quote" className="btn-gold text-center">
            Get a Quote
          </Link>
        </div>
      )}
    </>
  );
}
