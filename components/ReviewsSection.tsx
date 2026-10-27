import { Star } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/business";

// ─────────────────────────────────────────────────────────────────────────────
// DATA — real reviews, lightly trimmed for display. Do not alter text.
// ─────────────────────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: "cassey-valerio",
    name: "Cassey V.",
    initials: "CV",
    stars: 5,
    service: "Paint Restoration",
    text: "Carlos done an amazing job on my Rav 4! I wish I would have taken a before and after picture. The difference is night and day! He made my car look like a new car! 10/10",
  },
  {
    id: "paulo",
    name: "Paulo",
    initials: "PA",
    stars: 5,
    service: "Headlight Restoration",
    text: "Carlos did an amazing job restoring my headlights! He is very professional and extremely particular about the small details. My car is 14 years old with 14 years of headlight oxidation. He saved me from having to buy a new pair!",
  },
  {
    id: "toya",
    name: "Toya",
    initials: "T.",
    stars: 5,
    service: "Wraps & Styling",
    text: "My car was serviced here a few months ago and still looks great. The paint on my car was faded pretty badly although I had it repainted about 3 years ago. Carlos took a look at it and recommended a customized package — and my car still looks amazing.",
  },
  {
    id: "kevin-nunez",
    name: "Kevin N.",
    initials: "KN",
    stars: 5,
    service: "Paint Reconditioning",
    text: "We use RestorFX on a weekly basis for all of our vehicles that require deep reconditioning — removing swirls or even deep scratches. Somehow they find a way to remove them without repaint, and as always they come back looking brand new.",
  },
  {
    id: "yesenia-terrell",
    name: "Yesenia T.",
    initials: "YT",
    stars: 5,
    service: "Headlight Restoration",
    text: "I came across RestorFX while searching for a shop that offers headlight restoration, and I'm very glad I did. The service was quick and efficient, and my headlights look brand new when the job was finished. I'm extremely happy with the results.",
  },
  {
    id: "jessica-waters",
    name: "Jessica W.",
    initials: "JW",
    stars: 5,
    service: "Headlight Restoration",
    text: "I attempted many DIY kits as well as a previous local detailing business and none could get the job done. They let me take a look after they were done to make sure they were to my liking. It took under two hours. They are also reasonably priced. I will be back for future needs.",
  },
  {
    id: "daniel-bar",
    name: "Daniel B.",
    initials: "DB",
    stars: 5,
    service: "Paint Detail",
    text: "They did an amazing job on my X3M. The attention to detail was on point! They have a great team and have gained a lifetime customer. 10/10 recommend.",
  },
] as const;

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-gold-500 text-gold-500" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-20 bg-surface-900 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Reviews</p>
            <h2 id="reviews-heading" className="mt-5 font-editorial text-[2.75rem] font-semibold leading-[1.02] text-balance text-white md:text-[3.75rem]">
              Don&apos;t take our word for it.
            </h2>
            <div className="mt-10 flex items-end gap-4">
              <span className="font-display text-8xl font-bold leading-none tracking-[-0.03em] text-white">
                {BUSINESS_INFO.reviewRating}
              </span>
              <div className="pb-2">
                <Stars count={5} size={18} />
                <p className="mt-2 text-sm text-white/60">{BUSINESS_INFO.reviewCount} Google reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phones: swipe sideways. Larger screens: two-column masonry. */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:block md:columns-2 md:gap-4 md:overflow-visible md:px-0 lg:col-span-8">
          {REVIEWS.map((review) => (
            <li
              key={review.id}
              className="glass-card w-[85%] shrink-0 snap-start p-7 md:mb-4 md:w-auto md:break-inside-avoid"
            >
              <figure>
                <Stars count={review.stars} />
                <blockquote className="mt-5 text-[16px] leading-relaxed text-white/85">&ldquo;{review.text}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-[10px] font-bold text-black"
                    aria-hidden="true"
                  >
                    {review.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{review.name}</span>
                    <span className="block text-xs text-white/50">{review.service}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
