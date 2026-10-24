// ─────────────────────────────────────────────────────────────────────────────
// KAR FX Customs — Service Image Mapping
//
// HOW TO SWAP IMAGES:
// 1. Drop your new photo into the correct folder under /public/images/services/
// 2. Name it exactly as shown below (hero.jpg, gallery-01.jpg, etc.)
// 3. The site updates automatically — no code changes needed.
//
// FOLDER STRUCTURE:
// /public/images/services/{category-slug}/{service-slug}/
//   hero.jpg          ← main hero/banner image
//   gallery-01.jpg    ← first gallery image
//   gallery-02.jpg    ← second gallery image
//   gallery-03.jpg    ← third gallery image (add more as needed)
//   detail-01.jpg     ← close-up / detail shot
//   before-after-01.jpg ← before/after where applicable
//
// EXISTING REAL IMAGES (already in project):
// All catalog images live at:  /images/services/catalog/{name}.jpg
// All gallery images live at:  /images/gallery/all/{name}.jpg
// ─────────────────────────────────────────────────────────────────────────────

export type GalleryImage = {
  src: string;
  alt: string;
  isBeforeAfter?: boolean;
  isDetail?: boolean;
};

export type ServiceImageSet = {
  hero: string;
  heroAlt: string;
  categoryImage?: string;    // used on category cards — defaults to hero
  gallery: GalleryImage[];
};

// Shorthand helpers — keeps the data readable
const CATALOG = (name: string) => `/images/services/catalog/${name}`;
const GALLERY = (name: string) => `/images/gallery/all/${name}`;
const SVC = (cat: string, svc: string, file: string) =>
  `/images/services/${cat}/${svc}/${file}`;

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE SETS — keyed by "{categorySlug}/{serviceSlug}"
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICE_IMAGES: Record<string, ServiceImageSet> = {

  // ── PROTECTION ─────────────────────────────────────────────────────────────

  "protection/ppf": {
    hero: GALLERY("maserati-ppf.jpg"),
    heroAlt: "White Maserati inside the KAR FX Customs workshop",
    gallery: [
      {
        src: GALLERY("maserati-ppf.jpg"),
        alt: "PPF applied to Maserati — front bumper and hood coverage",
      },
    ],
  },

  "protection/window-tint": {
    hero: CATALOG("tint.jpg"),
    heroAlt: "Professional window tint installation — Raleigh NC",
    gallery: [
      {
        src: GALLERY("tint.jpg"),
        alt: "F-350 with professional window tint — side profile in daylight",
      },
      {
        src: GALLERY("tint.jpg"),
        alt: "Interior view through tinted windows — reduced glare in daylight",
      },
      {
        src: GALLERY("tint.jpg"),
        alt: "Rear window tint close-up — clean edge and even coverage",
      },
    ],
  },

  "protection/headlight-tint": {
    hero: GALLERY("headlight-tint.jpg"),
    heroAlt: "Headlight and taillight tint — smoked lens finish",
    gallery: [
      {
        src: GALLERY("chrome-delete.jpg"),
        alt: "Smoked headlight close-up — side angle showing tint depth",
      },
      {
        src: GALLERY("tint.jpg"),
        alt: "Tinted taillights on dark vehicle — rear 3/4 view",
      },
      {
        src: GALLERY("tint.jpg"),
        alt: "Before and after: stock vs smoked headlight comparison",
        isBeforeAfter: true,
      },
    ],
  },

  "protection/ceramic-coats": {
    hero: GALLERY("bmw-ceramic.jpg"),
    heroAlt: "Ceramic coating application — hydrophobic gloss finish on vehicle paint",
    gallery: [
      {
        src: GALLERY("bmw-ceramic.jpg"),
        alt: "BMW with ceramic coating — deep gloss finish in sunlight",
      },
      {
        src: GALLERY("detail-shot-1.jpg"),
        alt: "Ceramic coated paint surface — water beading close-up",
        isDetail: true,
      },
    ],
  },

  // ── WRAPS & STYLING ────────────────────────────────────────────────────────

  "wraps-styling/color-change-wrap": {
    hero: CATALOG("color-change-v2.jpg"),
    heroAlt: "Full vehicle color change wrap — premium vinyl finish",
    gallery: [
      {
        src: GALLERY("wraps.jpg"),
        alt: "Supra with custom ombre color-change wrap — full vehicle view",
      },
      {
        src: GALLERY("wraps.jpg"),
        alt: "Vehicle with full color-change wrap — side profile",
      },
    ],
  },

  "wraps-styling/chrome-delete": {
    hero: CATALOG("chrome-delete-v2.jpg"),
    heroAlt: "Chrome delete — blacked-out trim and exterior accents",
    gallery: [],
  },

  "wraps-styling/commercial-wraps": {
    hero: GALLERY("IMG_6230.jpg"),
    heroAlt: "Branded commercial van parked in the city",
    gallery: [
      {
        src: GALLERY("IMG_6230.jpg"),
        alt: "Branded commercial van parked in the city",
      },
    ],
  },

  "wraps-styling/boats-rvs": {
    hero: GALLERY("IMG_6070.jpg"),
    heroAlt: "Green and white boat inside the KAR FX Customs workshop",
    gallery: [
      {
        src: GALLERY("IMG_6071.jpg"),
        alt: "Green and white boat seating and trim inside the workshop",
      },
    ],
  },

  // ── WHEELS, CALIPERS & LIGHTING ────────────────────────────────────────────

  "wheels-calipers-lighting/wheel-painting": {
    hero: CATALOG("wheels-v2.jpg"),
    heroAlt: "Custom painted wheels — professional automotive finish",
    gallery: [
      {
        src: CATALOG("wheels-v2.jpg"),
        alt: "Custom wheel finish on a workshop display stand",
      },
      {
        src: GALLERY("IMG_8423.jpg"),
        alt: "Polished wheels displayed inside the workshop",
      },
    ],
  },

  "wheels-calipers-lighting/caliper-painting": {
    hero: GALLERY("reflective-calipers.avif"),
    heroAlt: "Finished blue brake caliper beside a black wheel",
    gallery: [
      {
        src: GALLERY("IMG_7774.jpg"),
        alt: "Painted caliper on dark wheel — parked vehicle",
      },
    ],
  },

  "wheels-calipers-lighting/reflective-calipers": {
    hero: GALLERY("reflective-calipers.avif"),
    heroAlt: "Reflective caliper finish — metallic coating catching light through spokes",
    gallery: [
      {
        src: GALLERY("IMG_7772.jpg"),
        alt: "Reflective caliper detail — full wheel view showing finish effect",
        isDetail: true,
      },
      {
        src: GALLERY("IMG_7774.jpg"),
        alt: "Reflective caliper lit from side at night — high-impact finish",
      },
    ],
  },

  "wheels-calipers-lighting/starlight-headliner": {
    hero: GALLERY("photo-mar-20-2025.jpg"),
    heroAlt: "Illuminated starlight ceiling inside a vehicle cabin",
    gallery: [
      {
        src: GALLERY("photo-mar-20-2025.jpg"),
        alt: "Illuminated starlight ceiling and purple cabin lighting",
      },
    ],
  },

  "wheels-calipers-lighting/ambient-lighting": {
    hero: CATALOG("ambient-lighting.jpg"),
    heroAlt: "Ambient interior lighting — customizable LED throughout vehicle cabin",
    gallery: [
      {
        src: GALLERY("ambient-lighting.jpg"),
        alt: "Ambient interior lighting — footwells and door panels glowing",
      },
      {
        src: GALLERY("ambient-lighting.jpg"),
        alt: "Mercedes Maybach ambient lighting — premium cabin atmosphere",
      },
    ],
  },

  // ── DETAILING ──────────────────────────────────────────────────────────────

  "detailing/engine-bay": {
    hero: GALLERY("detail-shot-1.jpg"),
    heroAlt: "Engine bay detail — clean engine compartment after professional service",
    gallery: [
      {
        src: GALLERY("detail-shot-2.jpg"),
        alt: "Engine bay before and after — contamination and grime removed",
        isBeforeAfter: true,
      },
      {
        src: GALLERY("detail-shot-1.jpg"),
        alt: "Clean engine bay close-up — degreased and dressed surfaces",
        isDetail: true,
      },
    ],
  },

  "detailing/interior-exterior": {
    hero: GALLERY("detail-shot-1.jpg"),
    heroAlt: "Professional vehicle detailing — exterior paint gloss restored",
    gallery: [
      {
        src: GALLERY("detail-shot-2.jpg"),
        alt: "Detailing — paint surface close-up showing restored gloss",
        isDetail: true,
      },
      {
        src: GALLERY("bmw-ceramic.jpg"),
        alt: "BMW after full detail and ceramic treatment — exterior finish",
      },
      {
        src: GALLERY("detail-shot-1.jpg"),
        alt: "Interior deep clean — seats, dashboard, and floors restored",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CARD IMAGES — used on the /services hub grid
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  protection: {
    src: GALLERY("maserati-ppf.jpg"),
    alt: "Paint protection film — KAR FX protection services",
  },
  "wraps-styling": {
    src: GALLERY("wraps.jpg"),
    alt: "Color change wrap — KAR FX wraps and styling services",
  },
  "wheels-calipers-lighting": {
    src: CATALOG("wheels-v2.jpg"),
    alt: "Painted wheels and calipers — KAR FX wheel and lighting services",
  },
  detailing: {
    src: GALLERY("detail-shot-1.jpg"),
    alt: "Professional vehicle detailing — KAR FX detailing services",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESTORFX PARTNER IMAGE
// ─────────────────────────────────────────────────────────────────────────────

export const RESTORFX_IMAGE = {
  src: GALLERY("tarifa-comercial.jpg"),
  alt: "RestorFX Raleigh award badges",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — get images for a service page
// ─────────────────────────────────────────────────────────────────────────────

export function getServiceImages(
  categorySlug: string,
  serviceSlug: string
): ServiceImageSet | undefined {
  return SERVICE_IMAGES[`${categorySlug}/${serviceSlug}`];
}

