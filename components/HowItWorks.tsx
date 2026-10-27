import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    title: "Tell us about your car",
    body: "Send a quote request or give us a call. You'll hear back within 24 hours on weekdays.",
  },
  {
    title: "Drop it off by appointment",
    body: "We walk around the car with you and note its condition on an inspection sheet you sign.",
  },
  {
    title: "Drive away with the finish",
    body: "Before you leave, we go over the work together so you know it's right.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="process-heading" className="border-y border-white/10 bg-surface-800 py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <p className="eyebrow">How it works</p>
          <h2 id="process-heading" className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-balance text-white md:text-[3.4rem]">
            Three steps. <span className="whitespace-nowrap text-gold-gradient italic">No guesswork.</span>
          </h2>
          <Link href="/quote" className="btn-gold mt-8">
            Start step one
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ol className="grid gap-4 md:grid-cols-3 lg:col-span-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="glass-card flex flex-col p-7">
              <span className="font-display text-6xl font-medium italic leading-none text-gold-gradient">0{i + 1}</span>
              <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
