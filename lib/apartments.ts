import type { PhotoId } from "./photos";

/**
 * The studios — eleven units, and a preview dataset draped over them.
 *
 * ── READ THIS BEFORE TRUSTING ANYTHING BELOW ─────────────────────────────────
 * Exactly one thing here comes from the client: the eleven unit CODES, given
 * 2026-08-09 (recorded in FACTS.md). Everything else — availability, how many
 * the unit sleeps, which amenities it has, the floor it sits on — is invented
 * so the pages can be built, reviewed and clicked through before the real
 * information exists.
 *
 * That invention is deliberate and it is fenced:
 *   · `PREVIEW` is exported and every page that renders this data shows a
 *     notice while it is `true`. Flip it to `false` only when every field has
 *     been replaced with something the client confirmed.
 *   · No prices. FACTS.md open question #1 lists rates as unknown, and a made-up
 *     nightly rate is the one demo value a visitor could hold the venue to.
 *     `Tarif sur demande` is both honest and what they already tell callers.
 *   · The photography is `origin: "placeholder"` in `lib/photos.ts` — a real
 *     apartment, somewhere else entirely. All eleven units share it, which is
 *     why the gallery says so out loud.
 *
 * When the real data lands: replace the entries, delete the demo notes, set
 * `PREVIEW = false`, and give each unit its own `photos` list.
 */

/** Demo data is in play. Drives the notice banner on every studio page. */
export const PREVIEW = true;

export type StudioStatus = "available" | "occupied" | "soon";

/**
 * Amenity ids. Labels live in `lib/i18n/{fr,en}.ts` under `studios.amenities`,
 * so adding one here fails `tsc` until both languages name it.
 */
export const AMENITIES = [
  "wifi",
  "ac",
  "tv",
  "kitchenette",
  "bathroom",
  "hotWater",
  "balcony",
  "desk",
  "laundry",
  "parking",
  "access24",
  "housekeeping",
] as const;

export type Amenity = (typeof AMENITIES)[number];

/** Bed layouts. Labels live in `studios.beds` in both dictionaries. */
export type BedType = "double" | "twin" | "doubleSingle";

export type Studio = {
  /** The venue's own unit code, e.g. "A10-2-A". Client-supplied — real. */
  code: string;
  /** URL segment, language-neutral: the code, lowercased. */
  slug: string;
  /** ⚠️ preview */
  status: StudioStatus;
  /** ⚠️ preview — how many people the studio sleeps. */
  sleeps: number;
  /** ⚠️ preview — floor as the building numbers them; null = not recorded. */
  floor: string | null;
  /** ⚠️ preview — floor area in m². */
  size: number;
  /** ⚠️ preview */
  bed: BedType;
  /** ⚠️ preview */
  amenities: readonly Amenity[];
};

/** Slug for a unit code: "A10-2-A" → "a10-2-a". */
export function slugFor(code: string): string {
  return code.toLowerCase();
}

/* Amenity sets, named so the table below reads as data rather than noise.
   ⚠️ All three are invented — see the header. */
const BASE: readonly Amenity[] = [
  "wifi",
  "ac",
  "tv",
  "kitchenette",
  "bathroom",
  "hotWater",
  "access24",
];
const PLUS: readonly Amenity[] = [...BASE, "desk", "housekeeping"];
const FULL: readonly Amenity[] = [...PLUS, "balcony", "laundry", "parking"];

/**
 * The eleven studios, in the order the client listed them.
 *
 * Codes: real. Everything else on each row: preview.
 */
export const STUDIOS: readonly Studio[] = [
  { code: "ST005-A", slug: "st005-a", status: "available", sleeps: 2, floor: "RDC", size: 28, bed: "double", amenities: BASE },
  { code: "B35-A", slug: "b35-a", status: "occupied", sleeps: 2, floor: "1", size: 32, bed: "double", amenities: PLUS },
  { code: "B15-A", slug: "b15-a", status: "available", sleeps: 2, floor: "1", size: 30, bed: "twin", amenities: BASE },
  { code: "A10-A", slug: "a10-a", status: "available", sleeps: 3, floor: "2", size: 42, bed: "doubleSingle", amenities: FULL },
  { code: "A10-1-A", slug: "a10-1-a", status: "occupied", sleeps: 2, floor: "2", size: 30, bed: "double", amenities: PLUS },
  { code: "A10-2-A", slug: "a10-2-a", status: "available", sleeps: 2, floor: "2", size: 34, bed: "double", amenities: PLUS },
  { code: "A10-3-A", slug: "a10-3-a", status: "soon", sleeps: 4, floor: "2", size: 48, bed: "doubleSingle", amenities: FULL },
  { code: "SS130-A", slug: "ss130-a", status: "available", sleeps: 2, floor: "3", size: 29, bed: "twin", amenities: BASE },
  { code: "SS140-A", slug: "ss140-a", status: "occupied", sleeps: 3, floor: "3", size: 40, bed: "doubleSingle", amenities: FULL },
  { code: "SS101-A", slug: "ss101-a", status: "available", sleeps: 2, floor: "3", size: 33, bed: "double", amenities: PLUS },
  { code: "SS110-A", slug: "ss110-a", status: "soon", sleeps: 2, floor: "3", size: 28, bed: "double", amenities: BASE },
] as const;

/**
 * The shared gallery. Every studio shows the same seven frames because that is
 * all we hold, and none of them is this building — hence the caption the pages
 * are obliged to render. When the real shoot lands, this becomes a per-unit
 * field on `Studio`.
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

/**
 * The floor line, built here so the index and the detail page cannot drift.
 * « RDC » is a floor NAME, not a number — prefixing it gives « Étage
 * Rez-de-chaussée ». Returns null when the floor is unknown, so the caller
 * can drop the separator too.
 */
export function floorLabel(
  studio: Studio,
  labels: { floor: string; ground: string }
): string | null {
  if (!studio.floor) return null;
  return studio.floor === "RDC" ? labels.ground : `${labels.floor} ${studio.floor}`;
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

/** Everything except the one being viewed, available first. */
export function otherStudios(slug: string, limit = 3): Studio[] {
  const rank: Record<StudioStatus, number> = { available: 0, soon: 1, occupied: 2 };
  return STUDIOS.filter((s) => s.slug !== slug)
    .slice()
    .sort((a, b) => rank[a.status] - rank[b.status])
    .slice(0, limit);
}
