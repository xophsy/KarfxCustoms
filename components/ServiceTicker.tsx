import { SERVICE_CATEGORIES } from "@/lib/services-data";

const NAMES = [...SERVICE_CATEGORIES.flatMap((c) => c.services.map((s) => s.name)), "RestorFX paint restoration"];

// Decorative band of every service name; the real list lives in the Services section.
export default function ServiceTicker() {
  return (
    <div className="overflow-hidden bg-gold-500 py-5 text-black" aria-hidden="true">
      <div className="flex w-max animate-marquee [animation-duration:90s]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {NAMES.map((name) => (
              <span
                key={name}
                className="flex items-center whitespace-nowrap font-brand text-xs font-bold uppercase tracking-[0.25em]"
              >
                <span className="px-8">{name}</span>
                <span className="text-[9px]">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
