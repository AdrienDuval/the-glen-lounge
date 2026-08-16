import type { PhotoId } from "./photos";

/**
 * The studios — only the units we can actually document.
 *
 * ── WHAT IS HERE, AS OF 2026-08-13 ───────────────────────────────────────────
 * SIX units, every one of them with its own media of its own rooms and every
 * spec client-stated. Four filled sheets cover them, because two of the sheets
 * each answered for two units:
 *
 *   `SS101_SPEC`    → SS101, and SS140-A on the client's explicit word.
 *   `A10_ROOM_SPEC` → A10-2 and A10-3, two rooms let inside apartment A10.
 *   `B35_SPEC`      → B35 alone. NOT to be spread by a second row.
 *   `A10_SPEC`      → A10 alone — the apartment the two rooms above sit in.
 *
 * Rows that share a sheet spread ONE object rather than a hand-copied duplicate,
 * so a correction cannot silently leave one of them behind.
 *
 * ⚠️ A10 AND ITS ROOMS ARE THE SAME FLOOR AREA, LISTED TWICE — whole at 150 000,
 * or one bedroom at 30 000, all three « libre ». Safe only because nothing here
 * takes a booking. Read the note on `A10_SPEC` before building anything that
 * does.
 *
 * ── WHY THE REST ARE NOT HERE ────────────────────────────────────────────────
 * There were eleven rows once. Nine existed only so the pages could be clicked
 * through before the client sent anything: surface, couchages, étage, literie
 * and équipements were all invented, and the site carried two separate
 * disclaimers admitting it. Removed 2026-08-12 — a listing a visitor can hold
 * the venue to is worse than a listing that is not there. Four of the nine have
 * since come back properly documented (A10-2, A10-3, B35, A10).
 *
 * ⚠️ THE FIVE REMAINING CODES ARE STILL REAL and are still recorded in FACTS.md
 * (`ST005-A` · `B15-A` · `A10-1-A` · `SS130-A` · `SS110-A`). This file is the
 * shippable set, not the inventory. The venue has eleven units; we can describe
 * six. When a sheet and media land for one of the five, add the row back from
 * FACTS.md — do NOT restore the old invented figures from git history.
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

/**
 * Bed layouts. Labels live in `studios.beds` in both dictionaries.
 *
 * `beds` (below) multiplies this: « grand lit » × 2 → « Deux grands lits ». The
 * type says WHAT KIND of bed and the count says HOW MANY, so a two-bedroom flat
 * does not need its own union member — which is what the old shape forced, and
 * why B35 read « Un grand lit » on a unit that has two.
 */
export type BedType = "double" | "twin" | "doubleSingle";

/**
 * What is actually being let — AND THE NOUN THE SITE CALLS IT BY.
 *
 * `apartment` — a whole flat, its own front door. A10 and B35.
 * `studio`    — a whole unit the client calls a studio. SS101 and SS140-A.
 * `room`      — ONE bedroom inside a shared apartment. A10-2 and A10-3,
 *               confirmed by the client 2026-08-12 as « chambre seule dans un
 *               appartement ».
 *
 * `room` was added 2026-08-12 because the site called everything a « studio »,
 * and a 10 m² bedroom with no kitchen, no salon and a shared front door is not
 * one. A visitor who books a « studio » and arrives to a room in someone else's
 * flat has been misled by the noun alone, so the noun became data.
 *
 * ── WHY `whole` HAD TO SPLIT IN TWO, 2026-08-13 ───────────────────────────────
 * This was `"whole" | "room"`, and `whole` carried exactly ONE label —
 * « Studio entier ». That label was printed over A10 (130 m², 2 chambres, salon,
 * cuisine, 8 couchages) and B35 (95,72 m², 2 chambres), the enquiry panel said
 * « Demander ce studio » above 150 000 FCFA, and the WhatsApp message the client
 * herself receives said « je souhaite réserver le studio A10 ». That is the exact
 * mirror of the bug `room` was introduced to fix, at the other end of the range,
 * and FACTS.md had it logged as open.
 *
 * ⚠️ THE NOUN IS TRANSCRIBED, NEVER DERIVED. Each value is the word the client
 * wrote on that unit's own sheet: « appartement entier » for A10 and B35,
 * « studio entier » for SS101. It is tempting to compute it instead —
 * `rooms >= 2 → apartment` reproduces all three sheets today — but a rule fitted
 * to three points would silently invent the noun for the five undocumented codes
 * still listed in FACTS.md, which is precisely what the header of this file
 * forbids. She wrote one word per sheet; record the word.
 *
 * ⚠️ SS140-A's « studio » IS INHERITED, NOT WRITTEN FOR IT. It comes from
 * SS101's sheet via « les mêmes informations et caractéristiques » — a word she
 * wrote about a different unit. Open question in FACTS.md.
 */
export type UnitKind = "apartment" | "studio" | "room";

/**
 * A whole unit with its own front door — anything that is not a single room.
 *
 * Every place the old `kind === "whole"` test appeared was asking a STRUCTURAL
 * question (does this thing have its own bedrooms? its own kitchen?) rather than
 * a naming one, so those tests ask it through here. Splitting the noun again —
 * and there will be a third word eventually, the venue has eleven units — then
 * touches this one function instead of five components.
 */
export function isWholeUnit(studio: Studio): boolean {
  return studio.kind !== "room";
}

export type Studio = {
  /** The venue's own unit code, e.g. "SS101". Client-supplied — real. */
  code: string;
  /** URL segment, language-neutral: the code, lowercased. */
  slug: string;
  /** Whole unit or a single room inside one. See `UnitKind`. */
  kind: UnitKind;
  /**
   * For `kind: "room"`, the apartment it sits in — « Chambre dans
   * l'appartement A10 ». Omitted for whole units.
   */
  parentCode?: string;
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
  /**
   * How many beds of that type. Optional — absent means one, which is what
   * every sheet before B35 described and keeps the four single-bed rows
   * unchanged.
   *
   * Added 2026-08-14: the client said B35 has **2 grands lits**, and the old
   * shape could only say « Un grand lit » on a 2-chambre flat sleeping 4.
   */
  beds?: number;
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
} as const satisfies Omit<
  Studio,
  "code" | "slug" | "photos" | "video" | "kind" | "parentCode"
>;

/**
 * ✅ THE A10 ROOM SHEET — client, 2026-08-12, headed « Code / Nom : A10-3 and 2 ».
 *
 * One sheet answered for TWO units, so like `SS101_SPEC` it lives here once and
 * both rows spread it. That is the client's own framing, not an inference: she
 * filled a single fiche and named both codes on it.
 *
 * ── WHAT THESE ARE ───────────────────────────────────────────────────────────
 * « chambre seule dans un appartement » — one bedroom let inside apartment A10,
 * NOT a self-contained studio. R+1, 10 m², 1 douche, no salon, no cuisine, no
 * balcon, 2 personnes, grand lit, libre, 30 000 FCFA la nuit. Ventilateur,
 * micro-ondes, machine à laver and ustensiles all came back « non » and are
 * therefore absent rather than assumed — consistent with there being no kitchen.
 *
 * This is what `A10-A` versus `A10-1-A` / `A10-2-A` / `A10-3-A` in the original
 * code list was hinting at all along: A10 is one apartment and the numbered
 * codes are its rooms, let individually.
 *
 * ⚠️ « Creoling : oui » — the fifth equipment line, which on the fiche we sent
 * is the Canal+ slot. Every other line matches its label exactly, so position
 * says Canal+; the word does not. It is NOT recorded as `canalPlus` here,
 * because advertising a subscription package the client may not have said is a
 * claim we cannot support. Ask her what she meant, then add it.
 *
 * ⚠️ Weekly rate, monthly rate and caution were left blank again. Still open.
 */
const A10_ROOM_SPEC = {
  status: "available",
  sleeps: 2,
  floor: "R+1",
  size: 10,
  bed: "double",
  rooms: 1,
  showers: 1,
  livingRoom: false,
  kitchen: false,
  amenities: [
    "wifi",
    "ac",
    "tv",
    "fridge",
    "bathroom",
    "hotWater",
    "linens",
    "access24",
  ],
  pricePerNight: 30000,
} as const satisfies Omit<
  Studio,
  "code" | "slug" | "photos" | "video" | "kind" | "parentCode"
>;

/**
 * ✅ THE A10 SHEET — client, 2026-08-13. The apartment ITSELF, let whole:
 * « Appartement entier », sous-sol R-1, 130 m², 2 chambres, 4 douches, salon,
 * cuisine, balcon, 8 personnes, grand lit, libre, 150 000 FCFA la nuit.
 *
 * The biggest and the dearest thing on the site — 130 m² against B35's 95.72,
 * and 150 000 FCFA against its 120 000.
 *
 * ⚠️ THIS IS THE PARENT OF THE A10-2 AND A10-3 ROWS. The site now lets the same
 * floor area twice: whole at 150 000, or one of its bedrooms at 30 000. Both are
 * « libre ». Nothing in the code prevents a visitor asking for A10 and another
 * asking for A10-3 over the same nights — but nothing needs to, because
 * ReserveStudio does not take bookings; it hands an enquiry to WhatsApp with the
 * unit code in it, and a human answers. Recorded because the overlap is real and
 * a future booking engine MUST know these rows share a space. Worth telling the
 * client the site now offers both.
 *
 * ⚠️ THE FLOOR CONTRADICTS THE ROOM SHEET. This one says « sous sol R-1 »;
 * `A10_ROOM_SPEC` says « R+1 » for two bedrooms INSIDE this same apartment, and
 * both cannot be true. `floor: "R-1"` here is simply this sheet's own answer,
 * left as given rather than reconciled — picking a winner would be inventing the
 * loser. NOTE the photographs settle nothing: the frames look out over
 * neighbouring roofs, which reads as an upper storey, but SS140-A is on R-2 with
 * exactly that view because the building is cut into a slope. Only the client
 * can resolve it, and it is the first thing to ask her.
 *
 * ⚠️ « 2 chambres » SITS BADLY WITH THE CODE LIST. FACTS.md records A10-1-A,
 * A10-2-A and A10-3-A — three numbered rooms in an apartment this sheet says has
 * two bedrooms. Ask.
 *
 * ⚠️ « 8 personnes » ON « 2 chambres » AND ONE « grand lit ». Sleeping eight in
 * two bedrooms means bedding the site cannot see and `BedType` cannot express.
 * `sleeps: 8` is the client's answer and stands; the literie line will read « Un
 * lit double », which is the whole of what she told us about beds.
 *
 * ⚠️ MACHINE À LAVER : « non » ON THE SHEET, VISIBLE IN THE KITCHEN CLIP. See
 * `a10_appt_cuisine` in `lib/photos.ts`. `laundry` is absent here, following the
 * sheet — the client's word governs what is advertised.
 *
 * ✅ « Canal+ au salon : oui » — AND IT RETIRES A DOUBT. `A10_ROOM_SPEC` above
 * flags « Creoling » appearing in the Canal+ slot on the rooms' sheet, and could
 * not tell whether the client meant Canal+ by it. This sheet prints BOTH lines,
 * « Canal+ au salon : oui » and « Creoling dans la chambre : oui », so they are
 * two different things in her own hand and « Creoling » is NOT her word for
 * Canal+. `canalPlus` is therefore recorded here, where she named it, and
 * remains correctly absent from the room rows — those bedrooms have no salon.
 * What « Creoling » actually is remains unknown and unadvertised.
 *
 * ⚠️ Weekly rate, monthly rate and caution blank AGAIN — fourth sheet running.
 */
const A10_SPEC = {
  status: "available",
  sleeps: 8,
  floor: "R-1",
  size: 130,
  bed: "double",
  rooms: 2,
  showers: 4,
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
  pricePerNight: 150000,
} as const satisfies Omit<
  Studio,
  "code" | "slug" | "photos" | "video" | "kind" | "parentCode"
>;

/**
 * ✅ THE B35 SHEET — client, 2026-08-13. « Appartement entier », sous-sol R-1,
 * 95.72 m², 2 chambres, 3 douches, salon, cuisine, balcon, 4 personnes, grand
 * lit, libre, 120 000 FCFA la nuit.
 *
 * ✅ **DEUX GRANDS LITS** — client, 2026-08-14, correcting this sheet. The fiche
 * said « grand lit » in the singular and the page therefore printed « Un grand
 * lit » under a 2-chambre flat sleeping 4, which read as a missing bed. `beds: 2`
 * now carries the count and the line reads « Deux grands lits ».
 *
 * This is the first sheet answer the client has revised, and it is worth noting
 * WHY the original was wrong rather than just fixing it: the fiche has one
 * « literie » slot, so a multi-bedroom unit has nowhere to put a second bed. The
 * same doubt therefore hangs over A10 — 2 chambres, 8 couchages, « grand lit »
 * singular — see the ⚠️ in `A10_SPEC`. Ask about that one too; do NOT infer it
 * from this correction.
 *
 * ⚠️ THIS ONE IS NOT SHARED. `SS101_SPEC` and `A10_ROOM_SPEC` are spread by two
 * rows each because one sheet answered for two units in both cases. This sheet
 * names ONE code. It is kept in a const purely to match the shape of the other
 * two and keep the row readable — a second row must not spread it unless the
 * client says in her own words that the units match, which is the bar SS140-A
 * had to clear.
 *
 * By some distance the largest unit listed — twice SS101's floor area and the
 * only one with two bedrooms, which is what the 4 couchages rest on.
 *
 * ⚠️ SO `kind: "whole"` MISLABELS IT. The sheet says « appartement entier »; the
 * spec table prints `kindWhole`, « Studio entier », because `whole` has one
 * label. A studio is a single room — this has two bedrooms and a salon over
 * 95.72 m². Exactly the mirror of what `UnitKind` was introduced to fix at the
 * small end, and not fixed here because the noun runs through the index heading,
 * the gallery title and the enquiry panel too. See FACTS.md.
 *
 * ⚠️ Ventilateur and machine à laver came back « non » and are therefore absent
 * from `amenities` rather than assumed.
 *
 * ⚠️ `access24` IS NOT ON THIS SHEET. The fiche never asks about it; it is the
 * venue's own « disponibilité 24h/24, tous les jours » marketing line (FACTS.md),
 * carried by every other row here on the same basis. Building-wide, not a B35
 * claim — if that line is ever retired, it comes off all four rows together.
 *
 * ⚠️ Weekly rate, monthly rate and caution left blank AGAIN — third sheet in a
 * row. Still open; nothing in the UI multiplies the nightly figure.
 */
const B35_SPEC = {
  status: "available",
  sleeps: 4,
  floor: "R-1",
  size: 95.72,
  bed: "double",
  /* ✅ Two, client 2026-08-14 — one per chambre, which is what the 4 couchages
     rest on. The only row with a count; every other unit has a single bed. */
  beds: 2,
  rooms: 2,
  showers: 3,
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
  pricePerNight: 120000,
} as const satisfies Omit<
  Studio,
  "code" | "slug" | "photos" | "video" | "kind" | "parentCode"
>;

/**
 * The units we can document, in the order the client listed them.
 *
 * Every row is client-stated end to end, and the rows that share a sheet share
 * one spec object rather than a hand-copied copy, so they cannot disagree. There
 * is no invented data left in this file — which is why no page renders a preview
 * notice any more.
 */
export const STUDIOS: readonly Studio[] = [
  /* ✅ Client sheet + five photographs, 2026-08-11. The sheet is `SS101_SPEC`
     above; this row adds only what is specific to the unit — its code, its own
     photographs, and its walkthrough clip. */
  {
    code: "SS101",
    slug: "ss101",
    /* « studio entier » — her word, on this unit's own sheet. */
    kind: "studio",
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
    /* ⚠️ « studio » INHERITED FROM SS101's SHEET, like every other spec on this
       row. She never wrote the word about THIS unit. Open in FACTS.md. */
    kind: "studio",
    ...SS101_SPEC,
    photos: [
      "ss140_salon",
      "ss140_chambre",
      "ss140_cuisine",
      "ss140_douche",
      "ss140_balcon",
    ],
  },

  /* ✅ A10 — client sheet + three photographs + four clips, wired up
     2026-08-13. The sheet is `A10_SPEC` above; this row adds only what is
     specific to the unit. The largest and dearest thing listed: 130 m²,
     8 couchages, 150 000 FCFA.

     Placed immediately BEFORE its two rooms on purpose — A10-2 and A10-3 are
     bedrooms inside this apartment, and reading the parent first is the only
     thing in the file that makes that relationship obvious at a glance. See
     `A10_SPEC` for what it means that all three are « libre » at once.

     ── THE PHOTO ORDER ──────────────────────────────────────────────────────
     The three salon frames lead because they are the only real photographs in
     the set — everything after them is a video frame at 640×360 — and because
     the salon is what 130 m² and « 8 personnes » are sold on. Then the bedroom,
     the shower room and the kitchen, in walkthrough order. The terrace goes
     last deliberately: it is a drying terrace in bare render, and it should not
     be the frame a visitor forms their impression on. See its note in
     `lib/photos.ts`.

     ⚠️ NO `video`, AND FOUR CLIPS ON DISK. The client sent four walkthroughs and
     not one of them can ship: every one reports portrait dimensions with the
     picture lying on its side, so a browser plays them SIDEWAYS — verified by
     screenshotting a real <video> element, not inferred from the container.
     This is B35's second-clip problem again, four times over. They are held in
     `assets-raw/whatsapp/a10/` rather than served, and the five video frames in
     this row's gallery were decoded out of them. Ship one the moment the client
     re-sends it upright.

     ⚠️ Two of those four clips (16.23.48 and 16.24.04, both 21.6s) are the same
     kitchen-and-terrace walkthrough sent twice — different bytes, same footage.
     Only one was harvested. */
  {
    code: "A10",
    slug: "a10",
    /* « Appartement entier » — her word, on this unit's own sheet. */
    kind: "apartment",
    ...A10_SPEC,
    photos: [
      "a10_appt_salon",
      "a10_appt_salon_2",
      "a10_appt_salon_tv",
      "a10_appt_chambre",
      "a10_appt_chambre_tv",
      "a10_appt_douche",
      "a10_appt_cuisine",
      "a10_appt_terrasse",
    ],
  },

  /* ✅ A10-2 and A10-3 — client sheet, 2026-08-12. The sheet is
     `A10_ROOM_SPEC` above; it named both codes, so both rows spread it and
     neither can drift from the other.

     ⚠️ THESE TWO ARE BEDROOMS INSIDE THE A10 ROW DIRECTLY ABOVE, which has been
     listed as a whole unit since 2026-08-13. The same floor area is now on offer
     twice at two prices — see `A10_SPEC` for why that is safe today and what
     would make it unsafe.

     ⚠️ IDENTICAL MEDIA ON PURPOSE, AND IT IS THE CLIENT'S. She supplied one
     walkthrough clip and placed the same file in both folders — byte-identical,
     verified by hash — so both rows carry the same three stills and the same
     video. Two listings showing the same rooms is a thing a visitor can notice;
     it is recorded here so that when they do, the answer is « this is what the
     venue sent for both », not « we duplicated it ». Give either row its own
     media the moment a second clip exists.

     ⚠️ No `size` per unit was distinguished either: 10 m² is the sheet's single
     answer for both. */
  {
    code: "A10-2",
    slug: "a10-2",
    kind: "room",
    parentCode: "A10",
    ...A10_ROOM_SPEC,
    photos: ["a10_chambre", "a10_chambre_tv", "a10_douche"],
    video: "/photos/studios/a10-chambres/visite.mp4",
  },
  {
    code: "A10-3",
    slug: "a10-3",
    kind: "room",
    parentCode: "A10",
    ...A10_ROOM_SPEC,
    photos: ["a10_chambre", "a10_chambre_tv", "a10_douche"],
    video: "/photos/studios/a10-chambres/visite.mp4",
  },

  /* ✅ B35 — client sheet + five photographs + two clips, wired up 2026-08-13.
     The sheet is `B35_SPEC` above; this row adds only what is specific to the
     unit. The biggest thing listed: 95.72 m², two bedrooms, 120 000 FCFA.

     ── THE PHOTO ORDER ──────────────────────────────────────────────────────
     Salon first (the room the client led with, and the strongest frame), then
     the two bedrooms — because « 2 chambres » and « 4 personnes » are the specs
     that make this unit different from every other row, and the frames that
     prove them should arrive before the ones that do not. Cuisine sits fifth,
     late on purpose: it is a soft video still and it should not be the frame a
     visitor forms their impression on. See its note in `lib/photos.ts`.

     ⚠️ `showers: 3`, on the client's word and NOT on the photographs — one
     shower room is pictured. Same gap as SS140-A, one size larger: if a visitor
     counts, the other two are unphotographed, not absent.

     ⚠️ THE CLIP IS THE BATHROOM, THE POSTER IS THE SALON. `slidesFor` posters
     every video with `photos[0]`, which for this row is the salon, while
     `visite.mp4` opens in the shower room. Harmless — it is a thumbnail behind
     a « Visite en vidéo » badge, not a promise about the first second — but it
     is the one place this page says something the file does not back, so it is
     written down rather than left to be rediscovered.

     ⚠️ THE SECOND CLIP IS NOT SHIPPED. The client sent two: the 15s bathroom
     walkthrough shipped here, and a 47s one covering the kitchen, a corridor
     and the exterior. The second carries a 90° rotation matrix and plays
     SIDEWAYS in a browser, so it is held in `assets-raw/whatsapp/b35/` rather
     than served — `b35_cuisine` is a frame transposed out of it. `Studio.video`
     is deliberately still a single clip: nothing here needs a list yet, and the
     gallery would render the second one unwatchable. Ship it if the client
     re-sends it upright. */
  {
    code: "B35",
    slug: "b35",
    /* « Appartement entier » — her word, on this unit's own sheet. */
    kind: "apartment",
    ...B35_SPEC,
    photos: [
      "b35_salon",
      "b35_chambre_1",
      "b35_chambre_2",
      "b35_douche",
      "b35_cuisine",
      "b35_balcon",
    ],
    video: "/photos/studios/b35/visite.mp4",
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
 *
 * Four shapes, all of them the client's own notation:
 *   « RDC »       → Rez-de-chaussée. A name, not a number.
 *   « R-1 », « R-2 » → sous-sol levels. What the `SS` code prefix means.
 *   « R+1 »       → an upper storey. Added 2026-08-12 with the A10 rooms; the
 *                   old code fell through to the last line and printed
 *                   « Étage R+1 », which reads as a floor called "R+1".
 *   « 1 », « 2 »  → a bare storey number.
 *
 * Returns null when the floor is unknown, so the caller drops the separator.
 */
export function floorLabel(
  studio: Studio,
  labels: { floor: string; ground: string; basement: string }
): string | null {
  if (!studio.floor) return null;
  if (studio.floor === "RDC") return labels.ground;
  const level = /^R([+-])(\d+)$/.exec(studio.floor);
  if (level) {
    const [, sign, n] = level;
    return sign === "-" ? `${labels.basement} ${n}` : `${labels.floor} ${n}`;
  }
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
 * The other units, grouped by how they RELATE to the one being viewed.
 *
 * Replaced `otherStudios(slug, 3)` on 2026-08-13, which returned a flat list of
 * everything-but-self. That was fine while the foot of a unit page was a row of
 * text chips, and became wrong the moment A10 was listed: on A10-2's page — a
 * bedroom INSIDE apartment A10 — the old function put A10 third in a list of
 * strangers, unlabelled and indistinguishable from two units on another floor,
 * while A10-3, the other bedroom in that same flat, was cut by the limit of 3.
 *
 * ── WHY THE GROUPS ARE DATA AND NOT A SORT ORDER ─────────────────────────────
 * The relationship is already in the model — `kind` and `parentCode` — and the
 * page states it twice in the masthead. A reader told twice that they are
 * booking one bedroom of apartment A10 must not then meet that apartment as an
 * anonymous suggestion. Returning ONE object with the family already separated
 * is also what stops the bug coming back: the two alternatives considered
 * (several small helpers, or filtering at the call site) both require every
 * future caller to remember to exclude the family, which is exactly the mistake
 * being fixed.
 *
 * ── THE MEDIA DEDUPE, AND WHY IT ONLY APPLIES TO STRANGERS ───────────────────
 * A10-2 and A10-3 carry BYTE-IDENTICAL photographs: the client sent one
 * walkthrough and placed the same file in both folders, verified by hash — see
 * `a10_chambre` in `lib/photos.ts`. While this block was three text boxes nobody
 * could tell. With photographs on the cards, SS101's page would print the same
 * bedroom twice, side by side, and read as a bug in the site rather than as a
 * fact about what we were sent.
 *
 * So a stranger whose opening frame is already spoken for is dropped. Inside the
 * family group it is kept, because there the page SAYS so in as many words.
 * Nothing is hidden from the site — both rooms are still on the index; they are
 * only prevented from appearing as two unexplained copies in one band.
 *
 * ── THE SECOND SORT KEY ──────────────────────────────────────────────────────
 * Availability still ranks first and is unchanged. But every listed unit is
 * « libre » today, so that key separates nothing at all, and beneath it a unit
 * whose PRINTED card matches the one being viewed now sinks. That is a
 * consequence of `SS101_SPEC` being spread by two rows: SS140-A's card under
 * SS101 repeats the same surface, couchages, rate and literie, so the only new
 * information it carries is its photographs. Better a genuinely different unit
 * first.
 *
 * ── THE CAP IS 4, NOT 3 ──────────────────────────────────────────────────────
 * Three was a number for a row of text chips. At full shell width the cards run
 * two- and three-up, and three leaves a hole in the last row.
 */
export type RelatedStudios = {
  /** The apartment this unit is a room in. Null unless `kind: "room"`. */
  parent: Studio | null;
  /** The OTHER rooms let inside the same apartment as this room. */
  siblings: Studio[];
  /** The rooms let inside THIS unit. Empty unless it is a whole unit. */
  rooms: Studio[];
  /** Everything with no stated relationship to this unit, capped. */
  others: Studio[];
};

export function relatedStudios(slug: string, limit = 4): RelatedStudios {
  const self = studioBySlug(slug);
  if (!self) return { parent: null, siblings: [], rooms: [], others: [] };

  const parent =
    self.kind === "room" && self.parentCode
      ? STUDIOS.find((s) => s.code === self.parentCode && isWholeUnit(s)) ?? null
      : null;
  const siblings =
    self.kind === "room" && self.parentCode
      ? STUDIOS.filter(
          (s) => s.kind === "room" && s.parentCode === self.parentCode && s.slug !== slug
        )
      : [];
  const rooms = isWholeUnit(self)
    ? STUDIOS.filter((s) => s.kind === "room" && s.parentCode === self.code)
    : [];

  const family = new Set(
    [slug, parent?.slug, ...siblings.map((s) => s.slug), ...rooms.map((s) => s.slug)].filter(
      Boolean
    )
  );

  const rank: Record<StudioStatus, number> = { available: 0, soon: 1, occupied: 2 };
  const at = (s: Studio) => (s.status === null ? 3 : rank[s.status]);
  /* Everything this block actually prints on a card. Two rows that match on all
     four are the same card twice as far as a visitor is concerned. */
  const sameOnTheCard = (a: Studio) =>
    a.size === self.size &&
    a.sleeps === self.sleeps &&
    a.rooms === self.rooms &&
    a.pricePerNight === self.pricePerNight;

  const seen = new Set<PhotoId>();
  const others = STUDIOS.filter((s) => {
    if (family.has(s.slug)) return false;
    if (seen.has(s.photos[0])) return false;
    seen.add(s.photos[0]);
    return true;
  })
    .slice()
    .sort((a, b) => at(a) - at(b) || Number(sameOnTheCard(a)) - Number(sameOnTheCard(b)))
    .slice(0, limit);

  return { parent, siblings, rooms, others };
}

/**
 * The one-line description of a unit — « 2 chambres · 130 m² · 8 couchages ·
 * Sous-sol 1 » — returned as SEGMENTS so the caller owns the separator.
 *
 * Built here, once, because THREE surfaces need the same sentence and must not
 * drift: the detail masthead, the index card, and the related cards at the foot
 * of every unit page. Those are exactly the three places where a visitor
 * compares one unit against another, which is the thing that was not working —
 * run the old card line (`couchages · étage`) over the six rows and SS101 and
 * SS140-A produce byte-identical cards, while A10 and B35 differ by one digit.
 * Surface, the single most separating number in the whole dataset — 10, 48,72,
 * 95,72, 130 m² — was printed on no card at all.
 *
 * Segments rather than a joined string on purpose: an absent fact must leave no
 * dangling « · », and the masthead wants hairline dividers where the card wants
 * a middot.
 *
 * IT INVENTS NOTHING. Every segment is a field off the client's sheet, and a
 * blank field produces NO segment rather than a placeholder:
 *   · `size` is nullable — an unmeasured unit simply does not state one.
 *   · `floorLabel` returns null when the floor was never recorded.
 *   · `rooms: 0` is dropped rather than printed, because « 0 chambre » reads as
 *     missing data when it is in fact the definition of a one-room studio.
 *   · a `room` skips the bedroom count entirely, for the same reason the spec
 *     table skips it: the listing IS one bedroom, so « 1 chambre » restates the
 *     type and reads as though there were a choice.
 *
 * A room LEADS on the apartment it sits inside. That is the single most
 * important fact about A10-2 and the only one separating it from a whole unit at
 * a similar price, so it goes ahead of the surface.
 *
 * ⚠️ IT CANNOT TELL TWO PAIRS APART, AND THAT IS THE DATA, NOT THE FUNCTION.
 * SS101 and SS140-A spread one spec object, as do A10-2 and A10-3, so their
 * lines are identical to the character. No composition of these fields will ever
 * separate those pairs — only per-unit sheets will. `relatedStudios` sinks the
 * twin rather than pretending otherwise.
 *
 * Labels are passed in rather than imported: this file imports nothing but
 * `PhotoId`, and that should stay true. Same contract as `floorLabel`.
 */
export function unitLine(
  studio: Studio,
  labels: {
    rooms: string;
    roomsOne: string;
    sleeps: string;
    sleepsOne: string;
    inApartment: string;
  },
  /** Already localised by the caller: `floorLabel(...)` and the formatted m². */
  parts: { size: string | null; floor: string | null }
): string[] {
  const out: string[] = [];

  if (studio.kind === "room") {
    if (studio.parentCode) out.push(labels.inApartment.replace("{code}", studio.parentCode));
  } else if (studio.rooms > 0) {
    out.push(
      (studio.rooms === 1 ? labels.roomsOne : labels.rooms).replace("{n}", String(studio.rooms))
    );
  }

  if (parts.size) out.push(parts.size);
  out.push(
    (studio.sleeps === 1 ? labels.sleepsOne : labels.sleeps).replace("{n}", String(studio.sleeps))
  );
  if (parts.floor) out.push(parts.floor);

  return out;
}

/**
 * The label for one amenity chip, given the unit it belongs to.
 *
 * Exists for ONE case, and it is a correctness case rather than a wording one:
 * `bathroom` renders « Douche privée », which is true of a whole flat or studio
 * and FALSE of a single bedroom let inside someone else's apartment. A10-2 and
 * A10-3 are two bedrooms in A10; their douche is in the shared apartment, and
 * another guest may be in the other room. Promising « privée » there promises
 * exclusivity the booking does not include — the kind of thing a guest only
 * discovers on arrival.
 *
 * Client sheet, 2026-08-12: it says « 1 douche » for these rooms and never says
 * private. « Privée » was our word, not hers.
 *
 * Everything else is unit-independent, so it falls straight through.
 */
export function amenityLabel(
  studio: Studio,
  amenity: Amenity,
  labels: Record<Amenity, string> & { bathroomShared: string }
): string {
  if (amenity === "bathroom" && studio.kind === "room") return labels.bathroomShared;
  return labels[amenity];
}

/**
 * The literie line — « Un grand lit », « Deux grands lits ».
 *
 * Lives here rather than in the component so the singular/plural choice is made
 * in one place: the count is data, and the two forms are genuinely different
 * strings in French (« grand lit » → « grands lits » inflects both words), so
 * this cannot be done by appending an « s » at the call site.
 *
 * `beds` absent or 1 → the singular, which is every unit except B35.
 */
export function bedLabel(
  studio: Studio,
  labels: {
    one: Record<BedType, string>;
    many: Record<BedType, string>;
    numbers: Record<string, string>;
  }
): string {
  const n = studio.beds ?? 1;
  if (n <= 1) return labels.one[studio.bed];
  /* Spelled out where we have the word, digit beyond — « Deux grands lits ». */
  return labels.many[studio.bed].replace("{n}", labels.numbers[String(n)] ?? String(n));
}

/**
 * The surface, formatted — « 130 m² », « 48,72 m² ». Null stays null.
 *
 * Shared by the masthead, the spec table and every card, so a decimal cannot be
 * rounded on one surface and not another. 48.72 prints « 48,72 » in French and
 * « 48.72 » in English; do NOT round it to 49 — see `SS101_SPEC`.
 */
export function formatSize(
  studio: Studio,
  lang: "fr" | "en",
  unit: string
): string | null {
  if (studio.size === null) return null;
  return `${studio.size.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB")} ${unit}`;
}

/** « 60 000 FCFA » — thin spaces, French convention. Null stays null. */
export function formatPrice(value: number | null): string | null {
  if (value === null) return null;
  return `${value.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;
}
