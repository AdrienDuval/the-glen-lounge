import type { PhotoId } from "./photos";

/**
 * The studios — eleven units, now a mix of one real one and ten still invented.
 *
 * ── WHAT IS REAL, AS OF 2026-08-11 ───────────────────────────────────────────
 * The eleven unit CODES (client, 2026-08-09) and **the whole of SS101**, which
 * came back on a filled characteristics sheet with five photographs of the
 * actual rooms. SS101 carries `confirmed: true`.
 *
 * Everything on the other ten rows — availability, couchages, surface, étage,
 * literie, équipements — is still invented so the pages can be built and
 * clicked through. Those rows carry `confirmed: false` and every page that
 * renders one shows a notice.
 *
 * ── WHY `confirmed` IS PER-UNIT AND NOT ONE FLAG ─────────────────────────────
 * It used to be a single exported `PREVIEW` boolean, which was right while
 * nothing was known and wrong the moment anything was. Leaving it on would have
 * put « ces informations sont des exemples » under a page whose every figure is
 * now sourced; turning it off would have removed the warning from ten pages that
 * still need it. The data decides, per row, which is the only version that stays
 * honest as the sheets trickle in one at a time.
 *
 * When a sheet lands: fill the row, set `confirmed: true`, give it its own
 * `photos`, and record the answers in FACTS.md with the date.
 */

/** Any row still on invented data. Drives the notice on index and detail. */
export const hasPreviewData = (s: Studio) => !s.confirmed;

export type StudioStatus = "available" | "occupied" | "soon";

/**
 * Amenity ids — things inside the unit. Labels live in
 * `lib/i18n/{fr,en}.ts` under `studios.amenities`, so adding one here fails
 * `tsc` until both languages name it and `AmenityIcon` draws it.
 *
 * `fridge`, `microwave`, `canalPlus`, `linens` and `utensils` were added
 * 2026-08-11: the SS101 sheet asked about them by name and the photographs show
 * four of the five, so they are things this venue actually advertises rather
 * than a generic hotel checklist.
 */
export const AMENITIES = [
  "wifi",
  "ac",
  "fan",
  "tv",
  "canalPlus",
  "kitchenette",
  "fridge",
  "microwave",
  "utensils",
  "bathroom",
  "hotWater",
  "linens",
  "balcony",
  "desk",
  "laundry",
  "access24",
] as const;

export type Amenity = (typeof AMENITIES)[number];

/**
 * Services that belong to the BUILDING, not to a unit.
 *
 * Answered once on the sheet — « L'IMMEUBLE (une seule fois) » — so they live
 * once here rather than being copied onto eleven rows, where they would drift
 * the first time one of them changed. Every studio page renders this list.
 *
 * ✅ All six confirmed by the client 2026-08-11.
 */
export const BUILDING_SERVICES = [
  "guard",
  "cameras",
  "generator",
  "waterReserve",
  "parking",
  "housekeeping",
] as const;

export type BuildingService = (typeof BUILDING_SERVICES)[number];

/**
 * ✅ Confirmed 2026-08-11, and it closes a FACTS.md open question that had been
 * open since the first harvest: the apartments are in the SAME BUILDING as the
 * restaurant. Until now the copy could only say « dans la même maison » because
 * co-location was sourced and stacking was not. The `SS` prefix on four unit
 * codes reads as « sous-sol », which fits: SS101 is on R-2.
 */
export const SAME_BUILDING_AS_RESTAURANT = true;

/** Bed layouts. Labels live in `studios.beds` in both dictionaries. */
export type BedType = "double" | "twin" | "doubleSingle";

export type Studio = {
  /** The venue's own unit code, e.g. "SS101". Client-supplied — real. */
  code: string;
  /** URL segment, language-neutral: the code, lowercased. */
  slug: string;
  /**
   * True once every field below came from the client. Gates the preview notice
   * — see the header. Never set this because a row *looks* complete.
   */
  confirmed: boolean;
  status: StudioStatus;
  /** How many people the unit sleeps. */
  sleeps: number;
  /**
   * Floor as the building names it; null = not recorded.
   * "RDC" = ground. "R-1", "R-2" … = sous-sol levels, which is what the `SS`
   * code prefix turns out to mean. `floorLabel` renders all three shapes.
   */
  floor: string | null;
  /** Floor area in m². Decimal on purpose — SS101 is 48.72, as measured. */
  size: number;
  bed: BedType;
  /** Bedrooms. 0 is legitimate: a true one-room studio has none. */
  rooms: number;
  /** Shower rooms. SS101 has two, which the old boolean could not express. */
  showers: number;
  /** Separate living room — the thing that makes SS101 more than one room. */
  livingRoom: boolean;
  kitchen: boolean;
  amenities: readonly Amenity[];
  /**
   * Nightly rate in FCFA, or null while unknown — the pages fall back to
   * « tarif sur demande ». Never invent one: it is the single value a visitor
   * could hold the venue to.
   */
  pricePerNight: number | null;
  /**
   * This unit's own photographs, in the order they should be shown. Empty means
   * the page falls back to the shared placeholder set AND owes the viewer the
   * « image d'illustration » caption.
   */
  photos: readonly PhotoId[];
  /** Walkthrough clip under /public, if the client sent one. */
  video?: string;
};

/** Slug for a unit code: "A10-2-A" → "a10-2-a". */
export function slugFor(code: string): string {
  return code.toLowerCase();
}

/* Amenity sets for the rows still on invented data. ⚠️ Invented. */
const BASE: readonly Amenity[] = [
  "wifi",
  "ac",
  "tv",
  "kitchenette",
  "bathroom",
  "hotWater",
  "access24",
];
const PLUS: readonly Amenity[] = [...BASE, "desk", "fridge"];
const FULL: readonly Amenity[] = [...PLUS, "balcony", "laundry", "microwave"];

/**
 * The eleven units, in the order the client listed them.
 *
 * ⚠️ Codes: real. SS101: real throughout. Every other row: preview.
 */
export const STUDIOS: readonly Studio[] = [
  /* ✅ THE REAL ONE. Client sheet + five photographs, 2026-08-11.
     « studio entier », sous-sol R-2, 48.72 m², 1 chambre, 2 douches, salon,
     cuisine, balcon, 2 personnes, grand lit, libre, 60 000 FCFA la nuit.
     Ventilateur and machine à laver came back « non » and are therefore
     absent rather than assumed. Weekly and monthly rates and the caution were
     left blank on the sheet — still open, do not guess them. */
  {
    code: "SS101",
    slug: "ss101",
    confirmed: true,
    status: "available",
    sleeps: 2,
    floor: "R-2",
    size: 48.72,
    bed: "double",
    rooms: 1,
    showers: 2,
    livingRoom: true,
    kitchen: true,
    amenities: [
      "wifi",
      "ac",
      "tv",
      "canalPlus",
      "kitchenette",
      "fridge",
      "microwave",
      "utensils",
      "bathroom",
      "hotWater",
      "linens",
      "balcony",
      "access24",
    ],
    pricePerNight: 60000,
    photos: [
      "ss101_salon",
      "ss101_cuisine",
      "ss101_douche_1",
      "ss101_douche_2",
      "ss101_balcon",
    ],
    video: "/photos/studios/ss101/visite.mp4",
  },

  /* ⚠️ Everything below this line is invented except the code. */
  { code: "ST005-A", slug: "st005-a", confirmed: false, status: "available", sleeps: 2, floor: "RDC", size: 28, bed: "double", rooms: 0, showers: 1, livingRoom: false, kitchen: true, amenities: BASE, pricePerNight: null, photos: [] },
  { code: "B35-A", slug: "b35-a", confirmed: false, status: "occupied", sleeps: 2, floor: "1", size: 32, bed: "double", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: PLUS, pricePerNight: null, photos: [] },
  { code: "B15-A", slug: "b15-a", confirmed: false, status: "available", sleeps: 2, floor: "1", size: 30, bed: "twin", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: BASE, pricePerNight: null, photos: [] },
  { code: "A10-A", slug: "a10-a", confirmed: false, status: "available", sleeps: 3, floor: "2", size: 42, bed: "doubleSingle", rooms: 2, showers: 2, livingRoom: true, kitchen: true, amenities: FULL, pricePerNight: null, photos: [] },
  { code: "A10-1-A", slug: "a10-1-a", confirmed: false, status: "occupied", sleeps: 2, floor: "2", size: 30, bed: "double", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: PLUS, pricePerNight: null, photos: [] },
  { code: "A10-2-A", slug: "a10-2-a", confirmed: false, status: "available", sleeps: 2, floor: "2", size: 34, bed: "double", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: PLUS, pricePerNight: null, photos: [] },
  { code: "A10-3-A", slug: "a10-3-a", confirmed: false, status: "soon", sleeps: 4, floor: "2", size: 48, bed: "doubleSingle", rooms: 2, showers: 2, livingRoom: true, kitchen: true, amenities: FULL, pricePerNight: null, photos: [] },
  { code: "SS130-A", slug: "ss130-a", confirmed: false, status: "available", sleeps: 2, floor: "R-2", size: 29, bed: "twin", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: BASE, pricePerNight: null, photos: [] },
  { code: "SS140-A", slug: "ss140-a", confirmed: false, status: "occupied", sleeps: 3, floor: "R-2", size: 40, bed: "doubleSingle", rooms: 1, showers: 2, livingRoom: true, kitchen: true, amenities: FULL, pricePerNight: null, photos: [] },
  { code: "SS110-A", slug: "ss110-a", confirmed: false, status: "soon", sleeps: 2, floor: "R-2", size: 28, bed: "double", rooms: 1, showers: 1, livingRoom: false, kitchen: true, amenities: BASE, pricePerNight: null, photos: [] },
] as const;

/** True while ANY unit is still on invented data — drives the index notice. */
export const ANY_PREVIEW = STUDIOS.some(hasPreviewData);

/**
 * The banner plate for the apartments — the opening frame on the studios index
 * and the « Appartements » slide in the home hero.
 *
 * ⚠️ Still the placeholder, and both surfaces caption it. SS101's salon is the
 * obvious replacement once we are confident it represents the range rather
 * than the one unit we happen to have shot.
 */
export const STUDIO_HERO: PhotoId = "studio_hero";

/**
 * Fallback gallery for units with no photographs of their own. Not this
 * building — hence the caption those pages are obliged to render. A unit with
 * a non-empty `photos` must never fall back to this.
 */
export const STUDIO_GALLERY: readonly PhotoId[] = [
  "studio_living",
  "studio_living_kitchen",
  "studio_bedroom",
  "studio_bedroom_desk",
  "studio_kitchen",
  "studio_bathroom",
  "studio_balcony",
];

/** The frames to show for a unit, and whether they are of this building. */
export function galleryFor(studio: Studio): {
  photos: readonly PhotoId[];
  illustrative: boolean;
} {
  return studio.photos.length
    ? { photos: studio.photos, illustrative: false }
    : { photos: STUDIO_GALLERY, illustrative: true };
}

/**
 * The floor line, built here so the index and the detail page cannot drift.
 * Three shapes: « RDC » is a name, not a number; « R-1 »/« R-2 » are basement
 * levels (the `SS` code prefix — sous-sol); anything else is an upper storey.
 * Returns null when the floor is unknown, so the caller drops the separator.
 */
export function floorLabel(
  studio: Studio,
  labels: { floor: string; ground: string; basement: string }
): string | null {
  if (!studio.floor) return null;
  if (studio.floor === "RDC") return labels.ground;
  const basement = /^R-(\d+)$/.exec(studio.floor);
  if (basement) return `${labels.basement} ${basement[1]}`;
  return `${labels.floor} ${studio.floor}`;
}

export function studioBySlug(slug: string): Studio | undefined {
  return STUDIOS.find((s) => s.slug === slug);
}

export function allStudioSlugs(): string[] {
  return STUDIOS.map((s) => s.slug);
}

/** Units a visitor can ask for today — drives the index count and the CTA. */
export function availableStudios(): Studio[] {
  return STUDIOS.filter((s) => s.status === "available");
}

/**
 * Everything except the one being viewed, available first.
 *
 * Confirmed units outrank preview ones at equal status: a real page with real
 * photographs is a better onward click than a demo row.
 */
export function otherStudios(slug: string, limit = 3): Studio[] {
  const rank: Record<StudioStatus, number> = { available: 0, soon: 1, occupied: 2 };
  return STUDIOS.filter((s) => s.slug !== slug)
    .slice()
    .sort(
      (a, b) =>
        rank[a.status] - rank[b.status] ||
        Number(b.confirmed) - Number(a.confirmed)
    )
    .slice(0, limit);
}

/** « 60 000 FCFA » — thin spaces, French convention. Null stays null. */
export function formatPrice(value: number | null): string | null {
  if (value === null) return null;
  return `${value.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;
}
