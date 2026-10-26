"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { addLead } from "../actions";

const field =
  "input-gold w-full border border-white/10 bg-surface-800 px-4 py-3 text-base text-white placeholder-white/25 focus:border-gold-500 focus:outline-none focus:ring-0";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/60";
const optional = <span className="normal-case tracking-normal text-white/30">(optional)</span>;

const SOURCES = [
  ["phone", "Phone call"],
  ["walk-in", "Walk-in"],
  ["instagram", "Instagram"],
  ["google", "Google"],
  ["referral", "Referral"],
  ["email", "Email"],
  ["other", "Other"],
];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full py-3.5 sm:w-auto disabled:opacity-60">
      {pending ? "Saving…" : "Add to New"}
    </button>
  );
}

export default function NewLeadPage() {
  const [state, action] = useFormState(addLead, undefined);

  return (
    <div className="max-w-xl">
      <Link href="/admin/leads" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
        ← Leads
      </Link>
      <h1 className="mb-8 mt-3 font-display text-3xl font-semibold">Add a lead</h1>

      <form action={action} className="space-y-5">
        <div>
          <label htmlFor="lead-name" className={label}>Name</label>
          <input id="lead-name" name="name" required autoComplete="off" placeholder="First and last name" className={field} />
        </div>
        <div>
          <label htmlFor="lead-phone" className={label}>Phone</label>
          <input id="lead-phone" name="phone" type="tel" inputMode="tel" required autoComplete="off" placeholder="(919) 555-0100" className={field} />
        </div>
        <div>
          <label htmlFor="lead-source" className={label}>Came from</label>
          <select id="lead-source" name="source" defaultValue="phone" className={field}>
            {SOURCES.map(([value, text]) => (
              <option key={value} value={value}>{text}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-service" className={label}>Service {optional}</label>
          <select id="lead-service" name="service" defaultValue="" className={field}>
            <option value="">Not sure yet</option>
            {SERVICE_CATEGORIES.map((category) => (
              <optgroup key={category.slug} label={category.name}>
                {category.services.map((service) => (
                  <option key={service.slug} value={`${category.slug}/${service.slug}`}>{service.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-vehicle" className={label}>Vehicle {optional}</label>
          <input id="lead-vehicle" name="vehicle" autoComplete="off" placeholder="Year, make, model, color" className={field} />
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>Email {optional}</label>
          <input id="lead-email" name="email" type="email" autoComplete="off" className={field} />
        </div>
        <div>
          <label htmlFor="lead-notes" className={label}>Notes {optional}</label>
          <textarea id="lead-notes" name="notes" rows={3} className={`${field} resize-y`} />
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-red-400">{state.error}</p>
        )}
        <SaveButton />
      </form>
    </div>
  );
}
