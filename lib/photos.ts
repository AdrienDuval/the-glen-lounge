/**
 * Curated photography manifest.
 *
 * Sources: TikTok photo posts, harvested 2026-08-05 (see ASSETS.md). Dimensions
 * are measured, not guessed.
 *
 * ── CONSENT GATE ──────────────────────────────────────────────────────────
 * These photographs came from public social posts and several show identifiable
 * people. CONTRACT.md makes clearing them a launch blocker, so the status is
 * recorded per-image rather than held in someone's head:
 *
 *   "clear"      — no identifiable people. Ships freely.
 *   "staff"      — venue staff only. The venue can clear this internally.
 *   "promo"      — the venue's OWN promotional artwork (event flyers). People
 *                  in these are billed performers, and the asset was designed
 *                  and published to be circulated. Reposting it on the venue's
 *                  own site is what it exists for, so it ships — a different
 *                  case entirely from a candid photograph of a customer.
 *   "guests"     — identifiable customers. MUST NOT SHIP until the venue
 *                  confirms it holds usage rights.
 *   "unverified" — not yet inspected frame by frame. Treat as blocked.
 *
 * Use `shippable()` rather than reading ASSETS directly in a section that
 * renders people, so an unconsented image cannot reach the page by accident.
 */

export type Consent = "clear" | "staff" | "promo" | "guests" | "unverified";

export type Photo = {
  src: string;
  w: number;
  h: number;
  consent: Consent;
  /**
   * Where the pixels came from. Absent = photograph. `"generated"` marks
   * commissioned illustrative imagery (see ASSETS.md, Option C) — any render
   * of such an entry must carry an « Image d'illustration » caption, so the
   * gap between picture and reality is never discovered in person.
   *
   * `"placeholder"` is the same promise for a stronger reason: a real
   * photograph of a DIFFERENT property, standing in until the venue shoots its
   * own. It carries the same caption obligation, and `shippable()` refuses it,
   * so it can only reach a page that asks for it by name.
   */
  origin?: "photograph" | "generated" | "placeholder";
  /** Alt text is content, so it is bilingual and lives with the image. */
  alt: { fr: string; en: string };
  /** Anything that constrains how the image may be used. */
  note?: string;
};

export const PHOTOS = {
  /* ── The room ─────────────────────────────────────────────────────────── */
  lounge_wide: {
    src: "/photos/interior-lounge-01.jpg",
    w: 2048,
    h: 1152,
    consent: "guests",
    alt: {
      fr: "Salle principale du Glen Lounge — sol en marbre noir, poteaux dorés et cordon noir, plafond à caissons",
      en: "The Glen Lounge main room — black marble floor, gold stanchions with black rope, coffered ceiling",
    },
    note: "Plastic-wrapped sofa in the left foreground; crop it out before use.",
  },
  lounge_seating: {
    src: "/photos/interior-lounge-02.jpg",
    w: 2048,
    h: 1152,
    consent: "guests",
    alt: {
      fr: "Fauteuils capitonnés et tables en marbre sur socle doré, salle du Glen Lounge",
      en: "Buttoned tub chairs and marble-topped tables on gilt plinths in the Glen Lounge",
    },
    note: "Plastic-wrapped furniture visible centre-left.",
  },
  lounge_sofa: {
    src: "/photos/interior-lounge-03.jpg",
    w: 2048,
    h: 1152,
    consent: "clear",
    alt: {
      fr: "Canapé bleu matelassé, coussins baroques et tables en marbre sur socle cuivré",
      en: "Quilted blue sofa with baroque cushions and marble tables on copper plinths",
    },
  },
  /** The hero. Strongest composition we hold — no people, brand signage in frame. */
  lounge_hero: {
    src: "/photos/interior-lounge-04.jpg",
    w: 2048,
    h: 1152,
    consent: "clear",
    alt: {
      fr: "Salon du Glen Lounge — fauteuils zébrés, coussins Versace, poteaux dorés et cordon noir sur marbre poli",
      en: "The Glen Lounge sitting area — zebra-print armchairs, Versace cushions, gold stanchions and black rope on polished marble",
    },
  },
  lounge_detail: {
    src: "/photos/interior-lounge-05.jpg",
    w: 2048,
    h: 1152,
    consent: "clear",
    alt: {
      fr: "Détail — fauteuils zébrés et coussin Versace, enseigne « The Glen · Lounge-Resto » au fond",
      en: "Detail — zebra-print armchairs and Versace cushion, “The Glen · Lounge-Resto” signage behind",
    },
  },
  /** The physical backlit « G » behind the bar — the motif the preloader echoes. */
  bar_monogram: {
    src: "/photos/interior-lounge-06.jpg",
    w: 2048,
    h: 1152,
    consent: "staff",
    alt: {
      fr: "Le bar du Glen Lounge — monogramme « G » rétro-éclairé, casier à spiritueux suspendu",
      en: "The Glen Lounge bar — backlit “G” monogram and suspended spirits cage",
    },
  },

  /* ── Events & private hire ────────────────────────────────────────────── */
  events_banquet: {
    src: "/photos/events-01.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Buffet dressé — chafing dishes dorés, arche de ballons noir et or, écussons Glen Lounge au mur",
      en: "Dressed buffet — gold chafing dishes, black-and-gold balloon arch, Glen Lounge roundels on the wall",
    },
  },
  events_02: {
    src: "/photos/events-02.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Table de banquet dressée — serviettes dorées, sets brandés Glen Lounge, ballons « 50 ans »",
      en: "Dressed banquet table — gold napkins, Glen Lounge branded placemats, “50 ans” balloons",
    },
    note: "Figures along the buffet line, background left and centre.",
  },
  events_03: {
    src: "/photos/events-03.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Longue table d’anniversaire dressée, écran géant diffusant un match en fond",
      en: "Long birthday table laid up, giant screen showing a match behind",
    },
    note:
      "Two clearly identifiable guests, mid-frame. A shame: this is the single best 'écrans géants' asset we hold, since it shows the setup AND a live match. Blocked until cleared.",
  },
  events_04: {
    src: "/photos/events-04.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Salle privatisée — longue tablée, ballons noir et or, buffet en fond",
      en: "Room laid out for a private event — long table, black and gold balloons, buffet behind",
    },
    note: "Small shadowed figures by the buffet. Cropped safely — see events_table.",
  },

  /** Derived crop of events-04 with the buffet line removed. See ASSETS.md. */
  events_table: {
    src: "/photos/events-04-crop.jpg",
    w: 2160,
    h: 1556,
    consent: "clear",
    alt: {
      fr: "Couvert dressé — set brandé Glen Lounge, serviette nouée d’un anneau doré, ballon d’anniversaire",
      en: "A place setting — Glen Lounge branded placemat, napkin in a gold ring, birthday balloon",
    },
  },

  /* ── Event artwork ────────────────────────────────────────────────────── */

  /** The venue's own flyer, Facebook 2026-08-06. Portrait 3:4, so it wants a
      generous crop in the hero — the type sits in the middle third. */
  event_bal_veterans: {
    src: "/photos/event-bal-veterans.jpg",
    w: 1536,
    h: 2048,
    consent: "promo",
    alt: {
      fr: "Affiche du Bal des Vétérans, 23 août — artiste K-Tino, DJ Christian Denon, entrée libre dès 18h",
      en: "Bal des Vétérans flyer, 23 August — artist K-Tino, DJ Christian Denon, free entry from 6pm",
    },
  },

  /* ── Sport flyers — the venue's own match-night artwork ───────────────────
     ⚠️ DECISION 2026-08-07: these were first evaluated and REJECTED for the
     site because they contain third-party player imagery and league marks
     (see ASSETS.md). The client reviewed that concern and decided to publish
     them anyway — they are the venue's own published promotional artwork, and
     the site presents them as an archive of its match nights. Recorded here so
     the choice is traceable to the client, not to an oversight. Dates on the
     flyers are historical; the gallery frames them as artwork, not as
     upcoming fixtures. */
  sport_cl_newcastle: {
    src: "/photos/sport-cl-newcastle-barca.jpg",
    w: 860,
    h: 1282,
    consent: "promo",
    alt: {
      fr: "Affiche Champions League — Newcastle vs Barcelone, mardi 10 mars 21h, « en live sur nos écrans »",
      en: "Champions League flyer — Newcastle vs Barcelona, Tuesday 10 March 9pm, “live on our screens”",
    },
  },
  sport_el_clasico: {
    src: "/photos/sport-el-clasico.jpg",
    w: 1024,
    h: 1280,
    consent: "promo",
    alt: {
      fr: "Affiche El Clásico — FC Barcelone vs Real Madrid, dimanche 10 mai 20h",
      en: "El Clásico flyer — FC Barcelona vs Real Madrid, Sunday 10 May 8pm",
    },
  },
  sport_wc_finale: {
    src: "/photos/sport-wc-finale.jpg",
    w: 1280,
    h: 1600,
    consent: "promo",
    alt: {
      fr: "Affiche de la finale de la Coupe du Monde 2026 — Espagne vs Argentine, dimanche 20h",
      en: "FIFA World Cup 2026 final flyer — Spain vs Argentina, Sunday 8pm",
    },
  },
  sport_wc_3eme: {
    src: "/photos/sport-wc-3eme-place.jpg",
    w: 1280,
    h: 1600,
    consent: "promo",
    alt: {
      fr: "Affiche Coupe du Monde 2026, match pour la 3ᵉ place — France vs Angleterre, samedi 22h",
      en: "World Cup 2026 third-place match flyer — France vs England, Saturday 10pm",
    },
  },
  sport_cl_demi: {
    src: "/photos/sport-cl-demi-finale.jpg",
    w: 859,
    h: 1075,
    consent: "promo",
    alt: {
      fr: "Affiche demi-finale de Champions League — PSG vs Bayern Munich, mardi 28 avril 20h",
      en: "Champions League semi-final flyer — PSG vs Bayern Munich, Tuesday 28 April 8pm",
    },
  },

  /* ── Exterior ─────────────────────────────────────────────────────────── */
  /**
   * The whole building by day, cropped from the Facebook harvest
   * (`122122525719015607.jpg`, posted 2026-01-31; crop (500,120)–(1600,945)
   * per ASSETS.md — excludes the seated man at the right edge). Signage at
   * street level, three floors of apartment balconies above: the
   * « Restaurant Appartement » pitch in one honest frame. The only people in
   * it are printed on the venue's own event banner.
   */
  exterior_day: {
    src: "/photos/exterior-day.jpg",
    w: 1100,
    h: 825,
    consent: "clear",
    alt: {
      fr: "L’immeuble du Glen Lounge en journée — enseigne « The Glen · Lounge-Resto » en marbre noir, trois étages de balcons d’appartements au-dessus",
      en: "The Glen Lounge building by day — “The Glen · Lounge-Resto” signage on black marble, three floors of apartment balconies above",
    },
    note: "Overcast phone snapshot with power lines in frame — honest, not glamorous. Replace when the client shoots the facade properly.",
  },

  /** Derived portrait crop of the same Facebook original as exterior_day —
      cut from the source file, not the derived JPEG, so it costs no second
      encode. The street entrance for the Contact section: this is the door
      « 2ᵉ entrée à droite » points at, so the photo is wayfinding, not decor.
      The seated man in the original sits far right of this frame. */
  exterior_entrance: {
    src: "/photos/exterior-day-entrance.jpg",
    w: 800,
    h: 1000,
    consent: "clear",
    alt: {
      fr: "L’entrée du Glen Lounge — tour en marbre noir, enseigne « The Glen · Lounge-Resto » dorée au-dessus de la porte, piliers gris de part et d’autre",
      en: "The Glen Lounge entrance — black marble tower, gold “The Glen · Lounge-Resto” signage over the door, grey gate pillars either side",
    },
  },
  exterior_night: {
    src: "/photos/exterior-night-01.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Façade de nuit — enseigne néon blanche sur bardage en marbre noir",
      en: "The facade at night — white neon signage on black marble cladding",
    },
    note:
      "The only exterior we hold, and it is a portrait of a customer with the signage half out of frame and mirrored in the marble. Blocked on consent; a proper facade shot is an outstanding client request.",
  },

  /* ── Food ─────────────────────────────────────────────────────────────── */
  food_plate: {
    src: "/photos/food-01.jpg",
    w: 2160,
    h: 2880,
    consent: "clear",
    alt: {
      fr: "Assiette — viande en sauce crémeuse aux champignons, frites et carottes rôties",
      en: "Plated main — meat in a creamy mushroom sauce with fries and roast carrots",
    },
  },
  food_02: {
    src: "/photos/food-02.jpg",
    w: 2160,
    h: 2880,
    consent: "guests",
    alt: {
      fr: "Deux assiettes dressées au passe, salle visible à travers la vitre",
      en: "Two plated dishes at the pass, the dining room visible through the glass",
    },
    note: "Diners visible through the window band at the top. Cropped — see food_pair.",
  },

  /** Derived crop of food-02 with the window band removed. See ASSETS.md. */
  food_pair: {
    src: "/photos/food-02-crop.jpg",
    w: 2160,
    h: 1728,
    consent: "clear",
    alt: {
      fr: "Deux assiettes — viande en sauce crémeuse aux champignons, frites et carottes rôties",
      en: "Two plates — meat in a creamy mushroom sauce with fries and roast carrots",
    },
  },

  /* ── Apartments ───────────────────────────────────────────────────────── */
  /* All four are the same room on the same night, the only apartment interior
     we hold. Inspected frame by frame 2026-08-07: every one is an empty room,
     no people anywhere, so all four clear the gate. 01 and 02 were re-derived
     from the Facebook copies at 1536×2048 — the TikTok copies that shipped
     first were 1440×1920. 03 and 04 exist only on TikTok, so they stay at
     1440×1920. See ASSETS.md. */
  apartment_valentine: {
    src: "/photos/apartment-valentine-01.jpg",
    w: 1536,
    h: 2048,
    consent: "clear",
    alt: {
      fr: "Chambre dressée pour la Saint-Valentin — pétales de rose, bougies et ballons",
      en: "Room dressed for Valentine's — rose petals, candles and balloons",
    },
    note:
      "Reads as an occasion photo, not a luxury accommodation photo — plain walls, simple bed frame, visible AC and cabling. Lead with the package angle, never with the word 'luxe'.",
  },
  apartment_02: {
    src: "/photos/apartment-valentine-02.jpg",
    w: 1536,
    h: 2048,
    consent: "clear",
    alt: {
      fr: "Chambre de l’appartement dressée pour la Saint-Valentin — lit en bois sombre, voûte de ballons rouges, téléviseur mural et fenêtre voilée",
      en: "The apartment bedroom dressed for Valentine's — dark wood bed, a canopy of red balloons, wall-mounted TV and sheer-curtained window",
    },
    note:
      "The clearest read of the room we have: bed, nightstand, television, window and floor all legible in one frame. Use this one when a single interior has to carry the section.",
  },
  apartment_03: {
    src: "/photos/apartment-valentine-03.jpg",
    w: 1440,
    h: 1920,
    consent: "clear",
    alt: {
      fr: "Chambre dressée pour la Saint-Valentin — cœurs en ballons au mur, bougies LED alignées et voûte de ballons rouges au plafond",
      en: "The bedroom dressed for Valentine's — balloon hearts on the wall, a line of LED candles and a canopy of red balloons overhead",
    },
    note: "The darkest of the four; the room barely reads. Supporting frame only.",
  },
  apartment_04: {
    src: "/photos/apartment-valentine-04.jpg",
    w: 1440,
    h: 1920,
    consent: "clear",
    alt: {
      fr: "Détail du lit — « I LOVE YOU » en lettres rouges, grand cœur de bougies LED et serviette pliée en éventail",
      en: "Bed detail — “I LOVE YOU” in red lettering, a large heart of LED tealights and a fan-folded napkin",
    },
    note:
      "A detail rather than a room, so it carries the occasion without pretending to document the accommodation. The most attractive of the four.",
  },
  /* ── Studios — PLACEHOLDER, NOT THIS VENUE ────────────────────────────────
     Supplied by the client 2026-08-09 to preview the studio pages before the
     real shoot. They are photographs of a modern European apartment — French
     windows, wall radiators, a suburban tower block through the balcony door —
     and they document a building that is not in Yaoundé.

     Every one is `origin: "placeholder"`, which keeps them out of `shippable()`
     and forces the « Image d'illustration » caption wherever they render. The
     consent field is honest on its own terms: no people are in frame. The
     licence, however, is unknown — see the open question in FACTS.md before any
     of this reaches production.

     All seven are 16:9, so a single `--ratio` covers the gallery. */
  studio_living: {
    src: "/photos/studios/studio-living-02.webp",
    w: 2400,
    h: 1349,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Séjour de studio — canapé clair, tables basses rondes, porte-fenêtre ouvrant sur un balcon",
      en: "Studio living area — pale sofa, round coffee tables, French window onto a balcony",
    },
  },
  studio_living_kitchen: {
    src: "/photos/studios/studio-living-01.webp",
    w: 2400,
    h: 1349,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Studio en enfilade — kitchenette équipée à gauche, coin salon et tapis à droite",
      en: "Open-plan studio — fitted kitchenette on the left, seating area and rug on the right",
    },
  },
  studio_bedroom: {
    src: "/photos/studios/studio-bedroom-02.avif",
    w: 2048,
    h: 1151,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Chambre de studio — lit double, penderie à portes coulissantes et fenêtre voilée",
      en: "Studio bedroom — double bed, sliding-door wardrobe and a sheer-curtained window",
    },
  },
  studio_bedroom_desk: {
    src: "/photos/studios/studio-bedroom-01.webp",
    w: 2400,
    h: 1349,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Chambre de studio — lit fait, grand miroir doré et petit bureau sous la fenêtre",
      en: "Studio bedroom — made bed, tall gold mirror and a small desk under the window",
    },
  },
  studio_kitchen: {
    src: "/photos/studios/studio-kitchen.webp",
    w: 2400,
    h: 1349,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Coin repas et kitchenette — table en bois deux couverts, micro-ondes et bouilloire",
      en: "Dining corner and kitchenette — wooden table laid for two, microwave and kettle",
    },
  },
  studio_bathroom: {
    src: "/photos/studios/studio-bathroom.avif",
    w: 2048,
    h: 1151,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Salle d’eau — douche à l’italienne vitrée, vasque et rangements en bois clair",
      en: "Shower room — glazed walk-in shower, basin and pale wood storage",
    },
  },
  studio_balcony: {
    src: "/photos/studios/studio-balcony.webp",
    w: 2400,
    h: 1349,
    consent: "clear",
    origin: "placeholder",
    alt: {
      fr: "Balcon meublé — table ronde et deux chaises, vue sur les arbres et les tours",
      en: "Furnished balcony — round table and two chairs looking out over trees and towers",
    },
  },
} as const satisfies Record<string, Photo>;

export type PhotoId = keyof typeof PHOTOS;

/** True when the image carries no unresolved consent risk. */
export function isCleared(id: PhotoId): boolean {
  const c = PHOTOS[id].consent;
  return c === "clear" || c === "staff" || c === "promo";
}

/** True when the image shows somewhere other than this venue.
    Widened to `Photo` on purpose: `as const` gives every entry its own literal
    type, and the ones that never wrote `origin` simply have no such key. */
export function isPlaceholder(id: PhotoId): boolean {
  return (PHOTOS[id] as Photo).origin === "placeholder";
}

/**
 * Filter a list down to what may legally ship today. Sections that render
 * photography should map over this rather than over PHOTOS directly.
 *
 * Placeholders are excluded on purpose: a page that wants one has to name it,
 * which is also the page that owes the viewer the « illustration » caption.
 */
export function shippable(ids: readonly PhotoId[]): PhotoId[] {
  return ids.filter((id) => isCleared(id) && !isPlaceholder(id));
}
