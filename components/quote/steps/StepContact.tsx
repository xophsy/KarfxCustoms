"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { ContactInfo, SelectedService } from "../QuoteFlow";
import QuoteChip from "../QuoteChip";
import { BUSINESS_INFO } from "@/lib/business";
import { normalizePhone } from "@/lib/admin/phone";

type Props = {
  selectedServices: SelectedService[];
  onRemoveService: (slug: string) => void;
  onAddAnother: () => void;
  onSubmit: (contact: ContactInfo, website: string) => void;
  isSubmitting: boolean;
  submitError: boolean;
};

export default function StepContact({
  selectedServices,
  onRemoveService,
  onAddAnother,
  onSubmit,
  isSubmitting,
  submitError,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real people never see it
  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  function validate(): boolean {
    const e: Partial<ContactInfo> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!normalizePhone(phone)) e.phone = "Please enter a 10-digit phone number.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Please check your email address, or leave it blank.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(
      { name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() || undefined },
      website
    );
  }

  return (
    <div>
      {/* ── Heading ────────────────────────────────────────────────────── */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500/60">
          Almost there
        </p>
        <h2 className="font-editorial text-4xl font-semibold text-white sm:text-5xl">
          Your request looks good.
        </h2>
        <p className="mt-3 text-sm text-white/45">
          Just leave your contact info and we&apos;ll be in touch within 24
          hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-10">
        {/* ── Left: Contact form ─────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="order-2 space-y-4 lg:order-1"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="quote-name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60"
            >
              Your Name
            </label>
            <input
              id="quote-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="First and last name"
              className={`input-gold w-full border bg-surface-800 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors duration-200 focus:border-gold-500 focus:outline-none focus:ring-0 ${
                errors.name ? "border-red-400/60" : "border-white/10"
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400/80">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="quote-phone"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60"
            >
              Phone Number
            </label>
            <input
              id="quote-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone)
                  setErrors((p) => ({ ...p, phone: undefined }));
              }}
              placeholder="(555) 000-0000"
              className={`input-gold w-full border bg-surface-800 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors duration-200 focus:border-gold-500 focus:outline-none focus:ring-0 ${
                errors.phone ? "border-red-400/60" : "border-white/10"
              }`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-400/80">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="quote-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60"
            >
              Email Address <span className="normal-case tracking-normal text-white/25">(optional)</span>
            </label>
            <input
              id="quote-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="you@example.com"
              className={`input-gold w-full border bg-surface-800 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors duration-200 focus:border-gold-500 focus:outline-none focus:ring-0 ${
                errors.email ? "border-red-400/60" : "border-white/10"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400/80">{errors.email}</p>
            )}
          </div>

          {/* Message / car details */}
          <div>
            <label
              htmlFor="quote-message"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60"
            >
              Car & Notes <span className="normal-case tracking-normal text-white/25">(optional)</span>
            </label>
            <textarea
              id="quote-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Year, make, model — or anything else you'd like us to know"
              className="input-gold w-full resize-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-white/20 transition-colors duration-200 focus:border-gold-500 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Honeypot — hidden from people and screen readers, catches form bots */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* Privacy reassurance */}
          <p className="pt-1 text-xs leading-relaxed text-white/30">
            Your information is safe with us and will only be used to contact
            you about your request.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold mt-2 flex w-full items-center justify-center gap-2 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Get My Quote
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {submitError && (
            <p role="alert" className="text-center text-sm leading-relaxed text-red-400/90">
              We couldn&apos;t send your request. Please try again, or call us at{" "}
              <a href={BUSINESS_INFO.phoneHref} className="font-semibold text-gold-500 underline">
                {BUSINESS_INFO.phoneDisplay}
              </a>
              .
            </p>
          )}
        </form>

        {/* ── Right: Selected services summary ──────────────────────── */}
        <div className="order-1 lg:order-2">
          <div className="border border-white/5 bg-surface-800/50 p-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              Your Request ({selectedServices.length}{" "}
              {selectedServices.length === 1 ? "service" : "services"})
            </p>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedServices.map((s) => (
                  <QuoteChip
                    key={s.serviceSlug}
                    service={s}
                    onRemove={onRemoveService}
                  />
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={onAddAnother}
              className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-white/30 transition-colors duration-200 hover:text-gold-500"
            >
              <span className="text-base leading-none">+</span>
              Add Another Service
            </button>
          </div>

          {/* Contact reassurance on desktop */}
          <div className="mt-4 hidden space-y-2.5 lg:block">
            {[
              "We'll reply within 24 hours on weekdays",
              "No commitment required — just a quote",
              "Raleigh-based shop, serving local clients",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 text-gold-500/60 text-sm">✓</span>
                <span className="text-xs leading-relaxed text-white/35">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
