"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/services/ScrollReveal";
import { BUSINESS_INFO } from "@/lib/business";

// ─────────────────────────────────────────────────────────────────────────────
// VALUE POINTS DATA
// ─────────────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    label: "Precision on every work performed",
    body: "We don't rush. The time it takes to do it right is included into how we work.",
  },
  {
    label: "Real communication",
    body: "You'll know what's happening with your vehicle — before, during, and after.",
  },
  {
    label: "Consistent standards across the team",
    body: "The eagerness of meticulousness doesn't change based on who's handling your vehicle.",
  },
  {
    label: "Raleigh-based, by appointment",
    body: "We work with clients directly, not through a revolving door of volume.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="bg-surface-900">

      {/* ── HERO BAND ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5 px-6 pb-16 pt-24 md:px-12 md:pb-20 md:pt-28">

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-32 left-1/4 h-[380px] w-[520px] opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.14) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* ── Left: copy ─────────────────────────────────────────────── */}
            <div>
              <ScrollReveal>
                {/* Label */}
                <div className="mb-7 flex items-center gap-3">
                  <div className="h-px w-8 bg-gold-500" aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/70">
                    About KAR FX Customs
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                  Standards of Excellence,
                  <br />
                  <span className="text-gold-gradient">Not a Slogan.</span>
                </h1>
              </ScrollReveal>

              {/* Opening paragraph */}
              <ScrollReveal delay={0.1}>
                <p className="mt-8 text-base leading-relaxed text-white/55 md:text-lg">
                  Most shops can do the work. What separates KAR FX Customs is the
                  standard behind it. In Raleigh, Carlos and Mauricio have created
                  a team where excellence and precision aren&apos;t occasional — it&apos;s
                  the baseline. Every vehicle that comes through this shop is
                  treated like a &quot;proud possession&quot;. Each individual in our
                  workshop matters about it as it was one of our own vehicles.
                </p>
              </ScrollReveal>
            </div>

            {/* ── Right: photo ────────────────────────────────────────────── */}
            <ScrollReveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/5 bg-surface-800">
                <Image
                  src="/images/about/8a8aaa_6f012fad3b3f44b99697004c5779a706~mv2.avif"
                  alt="Custom red and black Toyota Supra inside the KAR FX Customs workshop"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-900/60 to-transparent" />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── THE STANDARD STARTS HERE ───────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* ── Left: photo ─────────────────────────────────────────────── */}
            <ScrollReveal delay={0.05}>
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/5 bg-surface-800">
                <Image
                  src="/images/gallery/all/IMG_9575.jpg"
                  alt="Black SUV inside the KAR FX Customs workshop"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-900/60 to-transparent" />
              </div>
            </ScrollReveal>

            {/* ── Right: copy ─────────────────────────────────────────────── */}
            <div>
              <ScrollReveal>
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
                  The Standard Starts Here
                </p>

                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  Carlos and Mauricio founded this business around one idea: Superior
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="my-7 h-px w-14 bg-gradient-to-r from-gold-500 to-gold-600" />

                <div className="space-y-5 text-base leading-relaxed text-white/55">
                  <p>
                    Carlos and Mauricio are the reason KAR FX Customs runs the way
                    it does. Between them, they&apos;ve shaped a culture where
                    attention to detail isn&apos;t a selling point — it&apos;s an
                    expectation. Every product choice, every installation process,
                    every interaction with a customer reflects what they&apos;ve put
                    into this shop.
                  </p>
                  <p>
                    Carlos brings a level of precision to his work that customers
                    notice immediately. He doesn&apos;t just complete jobs — he cares
                    how the final results are presented. Mauricio brings the same
                    high expectations to how the shop runs: how customers are
                    communicated with, how timelines are managed, how the final
                    result is presented.
                  </p>
                  <p>
                    Together, they&apos;ve created an environment where the work is taken
                    seriously at every step — not only because..... but also
                    because satisfaction is their main goal.
                  </p>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── TEAM STANDARD ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-surface-800/40 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

            {/* ── Left: copy ─────────────────────────────────────────────── */}
            <div>
              <ScrollReveal>
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
                  The Whole Team Holds the Same Bar
                </p>

                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  What they&apos;ve framed isn&apos;t just good technicians — it&apos;s a team
                  that operates by the same ethics.
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="my-7 h-px w-14 bg-gradient-to-r from-gold-500 to-gold-600" />

                <div className="space-y-5 text-base leading-relaxed text-white/55">
                  <p>
                    When a vehicle comes in for a full color change wrap, a PPF
                    installation, a tinting job, or a restoration, every person involved
                    understands what the finished result needs to look like. That
                    expectation doesn&apos;t change based on who&apos;s on the job.
                  </p>
                  <p>
                    This consistency is what keeps customers coming back and
                    referring others. It&apos;s not a policy. It&apos;s a culture —
                    and it is shown in the work.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* ── Right: photo ────────────────────────────────────────────── */}
            <ScrollReveal delay={0.05}>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/5 bg-surface-800">
                <Image
                  src="/images/gallery/all/IMG_9397.jpg"
                  alt="Vehicles inside the KAR FX Customs workshop in Raleigh"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-800/60 to-transparent" />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── VALUE POINTS ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="mb-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
              What That Looks in Practice
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.label} delay={i * 0.08}>
                <div className="border border-white/5 bg-surface-800/50 p-6 transition-colors duration-300 hover:border-gold-500/20">
                  {/* Gold accent tick */}
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="text-gold-500" aria-hidden="true">✓</span>
                    <h3 className="font-display text-base font-semibold text-white">
                      {v.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/45">
                    {v.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-surface-800/30 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

              {/* Left: copy */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
                  See for Yourself
                </p>
                <h2 className="font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
                  The work is the reputation.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
                  Browse our gallery of jobs or get in touch {"\u2014"} whichever path makes
                  you more confident. We are here to serve you.
                </p>
              </div>

              {/* Right: CTAs */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/portfolio"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  View Portfolio
                  <ArrowRight size={13} />
                </Link>
                <Link href="/quote" className="btn-ghost">
                  Get a Quote
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Location footnote */}
          <ScrollReveal delay={0.12}>
            <p className="mt-10 border-t border-white/5 pt-6 text-xs text-white/25">
              {BUSINESS_INFO.fullAddress} &nbsp;·&nbsp;{" "}
              {BUSINESS_INFO.appointmentOnlyLabel} &nbsp;·&nbsp;{" "}
              <a
                href={BUSINESS_INFO.phoneHref}
                className="transition-colors duration-200 hover:text-gold-500/60"
              >
                {BUSINESS_INFO.phoneDisplay}
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
