"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";
import HeroBackground from "@/components/HeroBackground";

const PARTICLES = [
  { top: 12, left: 8, delay: 0 },
  { top: 23, left: 72, delay: 0.6 },
  { top: 38, left: 31, delay: 1.1 },
  { top: 55, left: 88, delay: 0.3 },
  { top: 68, left: 15, delay: 1.8 },
  { top: 77, left: 54, delay: 0.9 },
  { top: 14, left: 47, delay: 2.1 },
  { top: 44, left: 63, delay: 1.4 },
  { top: 85, left: 79, delay: 0.5 },
  { top: 91, left: 35, delay: 1.7 },
];

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(24px, -24px) scale(1.06); }
          66% { transform: translate(-18px, 16px) scale(0.96); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.55; }
        }
        @keyframes heroParticle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1); }
        }
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(24px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.42) 0%, rgba(212,175,55,0.12) 45%, transparent 70%);
          filter: blur(72px);
          animation: heroFloat 9s ease-in-out infinite, heroPulse 5s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #D4AF37;
          border-radius: 50%;
          animation: heroParticle 3s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-item {
          animation: heroSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
          opacity: 0;
        }
        .hero-item-1 { animation-delay: 0.12s; }
        .hero-item-2 { animation-delay: 0.28s; }
        .hero-item-3 { animation-delay: 0.42s; }
        .hero-item-4 { animation-delay: 0.56s; }
        .hero-item-5 { animation-delay: 0.7s; }
      `}</style>

      <section
        id="home"
        className="relative flex flex-col justify-start overflow-hidden bg-surface-900 md:min-h-dvh md:justify-center"
        aria-label="Homepage hero"
      >
        <HeroBackground />

        <div
          className="hero-orb hidden md:block"
          style={{ width: 420, height: 420, top: "8%", left: "12%" }}
          aria-hidden="true"
        />
        <div
          className="hero-orb hidden md:block"
          style={{ width: 320, height: 320, top: "58%", right: "12%", animationDelay: "3s, 1.5s" }}
          aria-hidden="true"
        />

        {PARTICLES.map((particle, index) => (
          <div
            key={index}
            className="hero-particle"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-7 px-6 pb-14 pt-10 [text-shadow:0_2px_18px_rgba(0,0,0,0.3)] md:gap-8 md:pb-28 md:pt-24">
          <div className="hero-item hero-item-1 flex items-center gap-3">
            <div className="h-px w-8 bg-gold-500" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              {BUSINESS_INFO.brandName} | {BUSINESS_INFO.serviceAreaLabel}
            </span>
          </div>

          <div className="hero-item hero-item-2 max-w-5xl">
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              The Detail Makes
              <br />
              <span className="text-gold-gradient italic">the Difference.</span>
            </h1>
          </div>

          <p className="hero-item hero-item-3 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            We protect and transform vehicles in Raleigh — and we take the work
            seriously enough that the results speak for themselves.
          </p>

          <div className="hero-item hero-item-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link href="/quote" className="btn-gold inline-flex items-center gap-2">
              Get a Quote
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors duration-200 hover:text-white/90"
            >
              View Our Work
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="hero-item hero-item-5 hidden max-w-3xl border-t border-white/5 pt-5 md:block">
            <p className="text-sm leading-relaxed text-white/65">
              Raleigh-based.&nbsp; Serious about the work.&nbsp; Quick to respond.
            </p>
          </div>
        </div>

      </section>
    </>
  );
}
