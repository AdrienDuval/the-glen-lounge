import type { PhotoId } from "./photos";

/**
 * The studios — only the units we can actually document.
 *
 * ── WHAT IS HERE, AS OF 2026-08-12 ───────────────────────────────────────────
 * Two units, both with their own photographs of the real rooms, and both fully
 * specified: SS101 from its filled characteristics sheet, and SS140-A because
 * the client confirmed it carries the same characteristics and the same rate.
 * They therefore share ONE spec object, `SS101_SPEC` — see its note.
 *
 * ── WHY THE OTHER NINE ARE GONE ──────────────────────────────────────────────
 * There were eleven rows. Nine of them existed only so the pages could be
 * clicked through before the client sent anything: surface, couchages, étage,
 * literie and équipements were all invented, and the site carried two separate
 * disclaimers admitting it. Removed 2026-08-12 — a listing a visitor can hold
 * the venue to is worse than a listing that is not there.
 *
 * ⚠️ THE NINE CODES ARE STILL REAL and are still recorded in FACTS.md
 * (`ST005-A` · `B35-A` · `B15-A` · `A10-A` · `A10-1-A` · `A10-2-A` · `A10-3-A` ·
 * `SS130-A` · `SS110-A`). This file is the shippable set, not the inventory.
 * The venue has eleven units; we can only describe two. When a sheet and photos
 * land for one of the nine, add the row back from FACTS.md — do NOT restore the
 * old invented figures from git history.
 *
 * ── ADDING A UNIT ────────────────────────────────────────────────────────────
 * A row belongs here once it has photographs of ITS OWN rooms. Fill only the
 * fields the client actually answered, give it its `photos`, and record the
 * answers in FACTS.md with the date. Never fill a field to make a page look
 * complete — `null`/omitted renders as « sur demande », which is honest.
 */

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
   * Availability, or null when the client has not told us — the row and the
   * card badge are then omitted rather than guessed.
   *
   * Nothing is null today (both units are « libre »). The nullability is kept
   * deliberately: it is what lets the next unit be listed on partial answers
   * without a placeholder status creeping back in.
   */
  status: StudioStatus | null;
  /** How many people the unit sleeps. */
  sleeps: number;
  /**
   * Floor as the building names it; null = not recorded.
   * "RDC" = ground. "R-1", "R-2" … = sous-sol levels, which is what the `SS`
   * code prefix turns out to mean. `floorLabel` renders all three shapes.
   */
  floor: string | null;
  /**
   * Floor area in m², or null when unmeasured — the row is then omitted.
   * Decimal on purpose: 48.72 is what the sheet gave, and rounding it to 49
   * would invent precision in the wrong direction.
   */
  size: number | null;
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

/**
 * ✅ THE SHEET. Every characteristic the client filled in for SS101 on
 * 2026-08-11, and — since they confirmed on 2026-08-12 that SS140-A carries
 * « les mêmes informations et caractéristiques, avec le tarif » — for SS140-A
 * too.
 *
 * It lives here, once, because the client's answer was « the same as SS101 »
 * rather than a second set of numbers. Two hand-copied rows would drift the
 * first time one of these values was corrected, and the drift would be silent:
 * both pages would still render, just disagreeing about the rate. Spreading one
 * object makes that impossible, and makes « they match » a fact about the code
 * rather than a promise in a comment.
 *
 * ── WHAT IS IN HERE ──────────────────────────────────────────────────────────
 * « studio entier », sous-sol R-2, 48.72 m² (as given — a decimal, not
 * rounded), 1 chambre, 2 douches, salon, cuisine, balcon, 2 personnes, grand
 * lit, libre, 60 000 FCFA la nuit. Ventilateur and machine à laver came back
 * « non » and are therefore absent rather than assumed.
 *
 * ⚠️ Weekly and monthly rates and the caution were left blank on the sheet.
 * Still open — do not guess them, and note nothing in the UI multiplies the
 * nightly figure.
 *
 * ⚠️ When a THIRD unit arrives, do not reach for this by default. It is
 * SS101's sheet, shared with SS140-A on the client's explicit word. A unit that
 * merely looks similar gets its own row.
 */
const SS101_SPEC = {
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
} as const satisfies Omit<Studio, "code" | "slug" | "photos" | "video">;

/**
 * The units we can document, in the order the client listed them.
 *
 * Both rows are client-stated end to end and share one spec object, so they
 * cannot disagree. There is no invented data left in this file — which is why no
 * page renders a preview notice any more.
 */
export const STUDIOS: readonly Studio[] = [
  /* ✅ Client sheet + five photographs, 2026-08-11. The sheet is `SS101_SPEC`
     above; this row adds only what is specific to the unit — its code, its own
     photographs, and its walkthrough clip. */
  {
    code: "SS101",
    slug: "ss101",
    ...SS101_SPEC,
    photos: [
      "ss101_salon",
      "ss101_cuisine",
      "ss101_douche_1",
      "ss101_douche_2",
      "ss101_balcon",
    ],
    video: "/photos/studios/ss101/visite.mp4",
  },

  /* ✅ SAME CHARACTERISTICS AND RATE AS SS101 — client, 2026-08-12.
     Five photographs of this unit arrived 2026-08-11; the client then confirmed
     it carries « les mêmes informations et caractéristiques que le SS101, avec
     le tarif ». So every spec below is now client-stated, by reference to
     SS101's filled sheet, and the fields this row previously left null are
     filled: 48.72 m², « libre », 60 000 FCFA la nuit.

     Because the two rows are meant to be identical, they are written as ONE
     source: this row spreads `SS101_SPEC` rather than repeating its values, so
     a correction to SS101's sheet cannot silently leave SS140-A behind. Only
     the identity fields and the photographs differ.

     ⚠️ `showers: 2`, on the client's word and NOT on the photographs — only one
     shower room appears in the five frames. SS101 sent frames of both of its
     douches; SS140-A's fifth frame went to the bedroom instead. Recorded here
     because it is the one spec on this page a visitor could count and find
     wanting: if they ask, the second shower room is unphotographed, not absent.

     ⚠️ `size` is SS101's measured 48.72 m² carried across on « mêmes
     caractéristiques ». It is a decimal measured for a different room, so it
     reads more precisely than it was probably meant. Worth having the client
     confirm the surface specifically rather than by reference.

     ⚠️ NO `video`. SS101's `visite.mp4` is a walkthrough OF SS101 — pointing
     this row at it would show a visitor a different unit's rooms under this
     unit's code, and there is no SS140 clip on disk. Add one only when the
     client sends a clip of THIS unit. */
  {
    code: "SS140-A",
    slug: "ss140-a",
    ...SS101_SPEC,
    photos: [
      "ss140_salon",
      "ss140_chambre",
      "ss140_cuisine",
      "ss140_douche",
      "ss140_balcon",
    ],
  },
] as const;

/**
 * The banner plate for the apartments — the opening frame on the studios index
 * and the « Appartements » slide in the home hero.
 *
 * SS140-A's salon, as of 2026-08-12. It replaced `studio_hero`, a stock photo of
 * a European apartment that both surfaces had to caption « image d'illustration »
 * because it was not this building. This one IS this building, so the caption is
 * gone along with the placeholder.
 *
 * SS140-A's salon rather than SS101's because it is the wider, better-lit frame
 * of the two and it crops to a full-bleed band without losing the room.
 */
export const STUDIO_HERO: PhotoId = "ss140_salon";

/**
 * The frames to show for a unit.
 *
 * No fallback any more, and no `illustrative` flag: a unit without its own
 * photographs is not listed at all (see the header), so `photos` is never empty
 * and nothing this returns is ever of a different building. The old shape
 * returned a shared set of stock European interiors plus a caption admitting it.
 */
export function galleryFor(studio: Studio): { photos: readonly PhotoId[] } {
  return { photos: studio.photos };
}

/**
 * One thing the carousel and the lightbox can show. The walkthrough clip is a
 * slide like any other, so both components iterate ONE list and an index means
 * the same position in both — the earlier shape (a `PhotoId[]` plus a video
 * hanging off the studio) would have made the lightbox's index arithmetic
 * disagree with the carousel's the moment the clip was added.
 *
 * `poster` is a `PhotoId` rather than a path so the still obeys the same
 * consent gate as every other frame, and so the video slide's thumbnail can be
 * drawn with the existing `next/image` pipeline.
 */
export type Slide =
  | { kind: "photo"; id: PhotoId }
  | { kind: "video"; src: string; poster: PhotoId };

/**
 * The slides for a unit: its frames, then its walkthrough clip if it sent one.
 *
 * The video goes LAST deliberately. The opening slide is what a visitor sees
 * before they have asked for anything, and a poster frame with a play button is
 * a worse first impression of a room than the room itself — the clip is the
 * reward for having looked, not the greeting.
 *
 * Every listed unit now has its own photographs, so the old guard against
 * pairing this building's video with a fallback gallery of another building is
 * gone with the fallback itself.
 */
export function slidesFor(studio: Studio): { slides: readonly Slide[] } {
  const { photos } = galleryFor(studio);
  const slides: Slide[] = photos.map((id) => ({ kind: "photo", id }));

  if (studio.video) {
    slides.push({
      kind: "video",
      src: studio.video,
      /* The salon — the room the clip opens on, and the frame the client led
         their sheet with. */
      poster: photos[0],
    });
  }

  return { slides };
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
 * The old tie-break on `confirmed` is gone: every listed unit is documented now,
 * so there is no demo row to sink. A unit whose availability we were never told
 * (`status: null`) sorts last of all — it is the weakest onward click, because
 * « sur demande » is the one thing it can promise.
 */
export function otherStudios(slug: string, limit = 3): Studio[] {
  const rank: Record<StudioStatus, number> = { available: 0, soon: 1, occupied: 2 };
  const at = (s: Studio) => (s.status === null ? 3 : rank[s.status]);
  return STUDIOS.filter((s) => s.slug !== slug)
    .slice()
    .sort((a, b) => at(a) - at(b))
    .slice(0, limit);
}

/** « 60 000 FCFA » — thin spaces, French convention. Null stays null. */
export function formatPrice(value: number | null): string | null {
  if (value === null) return null;
  return `${value.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;
}
