"use client";

import { useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";
import { normalizePhone } from "@/lib/admin/phone";
import { SERVICE_CATEGORIES } from "@/lib/services-data";

type Props = {
  preselectedCategory?: string; // from ?category= query param
  preselectedService?: string;  // from ?service= query param
  source?: string;              // from ?ref= (e.g. restorfx)
};

const key = (categorySlug: string, serviceSlug: string) => `${categorySlug}/${serviceSlug}`;

const label = "block text-lg font-semibold text-white";
const input =
  "input-gold mt-2 w-full rounded-xl border bg-surface-800 px-4 py-4 text-lg text-white placeholder-white/30 focus:border-gold-500 focus:outline-none focus:ring-0";

// One short page, big text, only name and phone required: built so anyone can finish it in a minute.
export default function QuoteFlow({ preselectedCategory, preselectedService, source }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [picked, setPicked] = useState<Set<string>>(() => {
    const known = SERVICE_CATEGORIES.find((c) => c.slug === preselectedCategory)?.services.some((s) => s.slug === preselectedService);
    return new Set(known ? [key(preselectedCategory!, preselectedService!)] : []);
  });
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: real people never see it
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  // One id per request, reused on retry so the shop never gets duplicate emails.
  const submissionId = useRef<string>();

  function toggle(k: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (!next.delete(k)) next.add(k);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (name.trim().length < 2) found.name = "Please enter your name.";
    if (!normalizePhone(phone)) found.phone = "Please enter your 10-digit phone number.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    setFailed(false);
    submissionId.current ??= crypto.randomUUID();
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: Array.from(picked, (k) => {
            const [categorySlug, serviceSlug] = k.split("/");
            return { categorySlug, serviceSlug };
          }),
          contact: { name: name.trim(), phone: phone.trim(), email: "", message: notes.trim() || undefined },
          source,
          website,
          submissionId: submissionId.current,
        }),
      });
      if (!res.ok) throw new Error(`Quote request failed: ${res.status}`);
      setSent(true);
      window.scrollTo({ top: 0 });
    } catch {
      // Keep their details on screen and point them to the phone, never a fake success.
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-20 text-center md:pt-28" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-black">
          <Check size={32} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-editorial text-5xl font-semibold text-white">Thank you, {name.trim().split(" ")[0]}.</h1>
        <p className="mt-4 text-xl leading-relaxed text-white/80">
          We got your request. We will call or text you at {phone.trim()} within 24 hours on weekdays.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-14 md:pt-20">
      <h1 className="font-editorial text-5xl font-semibold text-white sm:text-6xl">Get a quote</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/80">
        Leave your name and number and we will call or text you back within 24 hours on weekdays. No commitment.
      </p>
      {/* Phones hide the header's number on this page, so the call option is here instead */}
      <p className="mt-3 text-lg text-white/80 md:hidden">
        Prefer to talk?{" "}
        <a href={BUSINESS_INFO.phoneHref} className="font-semibold text-gold-500 underline underline-offset-4">
          Call {BUSINESS_INFO.phoneDisplay}
        </a>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-9">
        <div>
          <label htmlFor="quote-name" className={label}>Your name</label>
          <input
            id="quote-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "quote-name-error" : undefined}
            className={`${input} ${errors.name ? "border-red-400" : "border-white/20"}`}
          />
          {errors.name && <p id="quote-name-error" className="mt-2 text-base text-red-300">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="quote-phone" className={label}>Phone number</label>
          <input
            id="quote-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(919) 555-0123"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "quote-phone-error" : undefined}
            className={`${input} ${errors.phone ? "border-red-400" : "border-white/20"}`}
          />
          {errors.phone && <p id="quote-phone-error" className="mt-2 text-base text-red-300">{errors.phone}</p>}
        </div>

        <fieldset>
          <legend className={label}>What can we help with?</legend>
          <p className="mt-1 text-base text-white/60">Tap any that apply, or skip this if you are not sure.</p>
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat.slug} className="mt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/50">{cat.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cat.services.map((s) => {
                  const k = key(cat.slug, s.slug);
                  const on = picked.has(k);
                  return (
                    <label key={k} className="cursor-pointer">
                      <input type="checkbox" checked={on} onChange={() => toggle(k)} className="peer sr-only" />
                      <span className="flex min-h-[52px] items-center gap-2 rounded-xl border border-white/20 px-4 text-base text-white/90 transition-colors peer-checked:border-gold-500 peer-checked:bg-gold-500 peer-checked:font-semibold peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500">
                        {on && <Check size={18} aria-hidden="true" />}
                        {s.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </fieldset>

        <div>
          <label htmlFor="quote-notes" className={label}>
            Your vehicle and anything else <span className="font-normal text-white/60">(optional)</span>
          </label>
          <textarea
            id="quote-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="For example: 2022 Toyota Camry, black"
            className={`${input} resize-y border-white/20`}
          />
        </div>

        {/* Honeypot: hidden from people and screen readers, catches form bots */}
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

        <div>
          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-5 text-xl font-semibold text-black transition-[filter] hover:brightness-105 disabled:opacity-60"
          >
            {sending && <Loader2 size={22} className="animate-spin" aria-hidden="true" />}
            {sending ? "Sending…" : "Send my request"}
          </button>
          {failed && (
            <p role="alert" className="mt-4 text-center text-lg leading-relaxed text-red-300">
              We couldn&apos;t send your request. Please try again, or call us at{" "}
              <a href={BUSINESS_INFO.phoneHref} className="font-semibold text-gold-500 underline">
                {BUSINESS_INFO.phoneDisplay}
              </a>
              .
            </p>
          )}
          <p className="mt-4 text-center text-base text-white/60">We only use your number to reply to your request.</p>
        </div>
      </form>
    </div>
  );
}
