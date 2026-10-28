import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    title: "Tell us what you need",
    body: "Send us a quote request, a text or a call. We will reply within 24 hours on weekdays to learn more about your vehicle and what you are looking for.",
  },
  {
    title: "We coordinate a visit",
    body: "We find a time that works for you. At drop-off, we walk around the vehicle with you and note its condition on an inspection sheet you sign.",
  },
  {
    title: "We review the work together",
    body: "Before you leave, we go over everything with you to make sure it is exactly what you wanted.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="process-heading" className="border-y border-white/10 bg-surface-800 py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <h2 id="process-heading" className="font-editorial text-[2.75rem] font-semibold leading-[1.02] text-balance text-white md:text-[3.75rem]">
            How we <span className="whitespace-nowrap text-gold-gradient italic">work with you.</span>
          </h2>
          <Link href="/quote" className="btn-gold mt-8">
            Tell us about your vehicle
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ol className="grid gap-4 md:grid-cols-3 lg:col-span-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="glass-card flex flex-col p-7">
              <span className="font-display text-5xl font-bold leading-none text-gold-gradient">0{i + 1}</span>
              <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
