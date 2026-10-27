import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_PORTFOLIO_IMAGES } from "@/lib/gallery";

const FEATURED = [
  { file: "0898a7e4-0d03-4d39-a746-8d58b7f6fa84.jpg", alt: "McLaren Senna outside KAR FX Customs", tag: "Protection" },
  { file: "IMG_6719.jpg", alt: "Glossy blue BMW XM front three-quarter", tag: "Protection" },
  { file: "IMG_2806.jpg", alt: "Orange Ford Mustang with black rear stripes and louvers", tag: "Wraps" },
  { file: "IMG_6065.jpg", alt: "Yamaha 212X boat with green and white graphics", tag: "Boats" },
  { file: "IMG_1531.jpg", alt: "Black Chevrolet Chevelle SS front view", tag: "Detailing" },
  { file: "IMG_5960.jpg", alt: "White Rolls-Royce Ghost with custom wheels", tag: "Wheels" },
];

export default function WorkShowcase() {
  return (
    <section aria-labelledby="work-heading" className="bg-surface-900 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Our work</p>
            <h2 id="work-heading" className="mt-5 max-w-2xl font-editorial text-[2.75rem] font-semibold leading-[1.02] text-balance text-white md:text-[3.75rem]">
              Some of the vehicles <span className="text-gold-gradient italic">we have worked on.</span>
            </h2>
          </div>
          <Link href="/portfolio" className="btn-ghost self-start md:self-auto">
            See all {ALL_PORTFOLIO_IMAGES.length} photos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {FEATURED.map((item, i) => (
            <li
              key={item.file}
              className={
                i === 0
                  ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto"
                  : // The 6th tile would sit alone on the phone grid's last row
                    `aspect-square md:aspect-[4/3] ${i === FEATURED.length - 1 ? "hidden md:block" : ""}`
              }
            >
              <Link
                href="/portfolio"
                className="group relative block h-full overflow-hidden rounded-2xl bg-surface-800 md:rounded-3xl"
              >
                <Image
                  src={`/images/gallery/all/${item.file}`}
                  alt={item.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-3 bottom-3 md:inset-x-5 md:bottom-5">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500">
                    {item.tag}
                  </span>
                  <p className="mt-2 hidden text-sm font-medium text-white sm:block">{item.alt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
