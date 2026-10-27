import { SERVICE_CATEGORIES } from "@/lib/services-data";

const NAMES = [...SERVICE_CATEGORIES.flatMap((c) => c.services.map((s) => s.name)), "RestorFX paint restoration"];

// Decorative gold band of every service name; the real list lives in the Services section.
export default function ServiceTicker() {
  return (
    <div className="overflow-hidden border-y border-black bg-gold-500 py-4 text-black" aria-hidden="true">
      <div className="flex w-max animate-marquee [animation-duration:60s]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {NAMES.map((name) => (
              <span key={name} className="flex items-center whitespace-nowrap font-display text-lg font-bold tracking-tight">
                <span className="px-6">{name}</span>
                <span className="text-sm">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
