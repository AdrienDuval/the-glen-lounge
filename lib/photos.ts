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

  /* ── Weekly-night flyers ──────────────────────────────────────────────────
     The venue's own artwork for four of the weekly nights, from the Instagram
     dump of 2026-08-11 (assets-raw/instagram-dump). `consent: "promo"` on the
     same reading as the flyers above: the venue designed and published these to
     be circulated, and the people in them are its own models, not customers.

     ⚠️ TWO CAVEATS, both live.

     RESOLUTION. All four are ~512×640 — Instagram feed renditions, not the
     originals. That is enough for the calendar popover (23rem ≈ 368px) and the
     events-index card, but the hero shows a poster at 42vw, so on a wide
     display these upscale roughly 2× and go soft. Compare event_bal_veterans at
     1536×2048, which is the standard to hold them to. Ask the client for the
     source files.

     PRINTED TIMES. Each flyer prints a door time in the pixels, and all four
     disagree with the 19h the site used to publish (FACTS.md, « Updated
     2026-08-07 », from the August 2026 posts). The printed time is recorded
     per-entry below so it stays visible at the point of use. Since 2026-08-11
     the site publishes no competing time for these four nights — the flyer is
     the only clock on the page; see the ONE TIME CLAIM block in lib/events.ts.
     Do not "fix" the site's times from these flyers either: the karaoke 16h
     matches the January 2026 drift FACTS.md already logged as superseded, so
     the artwork may simply be older than the posts. Client confirmation is the
     only thing that settles it. */
  event_jeudi_karaoke: {
    src: "/photos/event-jeudi-karaoke.jpg",
    w: 512,
    h: 640,
    consent: "promo",
    alt: {
      fr: "Affiche du Jeudi Karaoké — « KARAOKE » sur un micro rose fondu entouré de bougainvilliers, mix policy DJ W et DJ Personica",
      en: "Thursday Karaoke flyer — “KARAOKE” over a melting pink microphone framed by bougainvillea, mix policy DJ W and DJ Personica",
    },
    note:
      "Prints « DÉBUT 16H CE JEUDI ». The site publishes 19h — see the section note. 512×640, soft above ~600px.",
  },
  event_mardi_casino: {
    src: "/photos/event-mardi-casino.jpg",
    w: 512,
    h: 640,
    consent: "promo",
    alt: {
      fr: "Affiche du Game Night Show Casino — dés, boule de billard couronnée et rideau rouge, mix policy DJ W et DJ Personica",
      en: "Game Night Show Casino flyer — dice, a crowned billiard ball and a red curtain, mix policy DJ W and DJ Personica",
    },
    note:
      "Prints « DÉBUT 20H CE MARDI ». The site publishes 19h — see the section note. 512×640, soft above ~600px.",
  },
  event_mercredi_cocktail: {
    src: "/photos/event-mercredi-cocktail.jpg",
    w: 512,
    h: 640,
    consent: "promo",
    alt: {
      fr: "Affiche du Mercredi Cocktail — trois cocktails garnis d’agrumes sur un plateau noir dans un bar sombre",
      en: "Wednesday Cocktails flyer — three citrus-garnished cocktails on a black tray in a dark bar",
    },
    note:
      "Prints « DÉBUT 20H ». The site publishes 19h — see the section note. The only one of the four with no people in frame. 512×640.",
  },
  event_samedi_vip: {
    src: "/photos/event-samedi-vip.jpg",
    w: 511,
    h: 640,
    consent: "promo",
    alt: {
      fr: "Affiche du Samedi VIP — lunettes de soleil serties de strass et boa rose, « tous les samedis », sound policy DJ W et DJ Personica",
      en: "Saturday VIP flyer — rhinestone sunglasses and a pink feather boa, “tous les samedis”, sound policy DJ W and DJ Personica",
    },
    note:
      "Prints « OPEN DOORS 18H ». The site publishes 19h — see the section note. Also the weakest crop of the four: the address line is cut mid-word at the bottom edge, and it reads « 150M de l'école » where the other three read « 300M ». 511×640.",
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
  /* ── SS101 — THE REAL THING ───────────────────────────────────────────────
     The first photographs of an actual Glen apartment, sent by the client
     2026-08-11 with the filled characteristics sheet. Note what these are NOT:
     no `origin: "placeholder"`, so they are `shippable()` and they carry no
     « image d'illustration » caption, because for once the picture is the room.

     Empty rooms, no people in any frame — `consent: "clear"` on inspection, not
     by assumption.

     They also corroborate the sheet rather than merely illustrating it: the
     split AC unit is on the salon wall, an Ariston water heater hangs in both
     shower rooms, and the kitchen frame shows the hob, microwave, fridge, the
     dish rack and the utensils. Three of the sheet's « oui » answers are
     therefore evidenced, not just claimed.

     1080px on the long edge — WhatsApp's cap, since they arrived through the
     app. Good enough for the gallery and the lightbox at current sizes; the
     originals are still worth asking for. */
  ss101_salon: {
    src: "/photos/studios/ss101/salon.jpg",
    w: 1080,
    h: 708,
    consent: "clear",
    alt: {
      fr: "Salon du studio SS101 — sol en marbre blanc, lustre en cristal, fauteuils crème et bleu nuit, climatiseur mural et doubles rideaux",
      en: "The SS101 living room — white marble floor, crystal chandelier, cream and navy armchairs, wall-mounted air conditioning and full-length curtains",
    },
  },
  ss101_cuisine: {
    src: "/photos/studios/ss101/cuisine.jpg",
    w: 1080,
    h: 868,
    consent: "clear",
    alt: {
      fr: "Cuisine équipée du studio SS101 — plan de travail en granit noir, plaque gaz, micro-ondes, cafetière, réfrigérateur et égouttoir garni",
      en: "The SS101 fitted kitchen — black granite worktop, gas hob, microwave, coffee maker, fridge and a stocked dish rack",
    },
  },
  ss101_douche_1: {
    src: "/photos/studios/ss101/douche-1.jpg",
    w: 1080,
    h: 922,
    consent: "clear",
    alt: {
      fr: "Première salle d’eau du studio SS101 — faïence marbrée noir et blanc, douche à l’italienne vitrée, vasque et chauffe-eau",
      en: "The first SS101 shower room — black-and-white marbled tiling, glazed walk-in shower, basin and water heater",
    },
  },
  ss101_douche_2: {
    src: "/photos/studios/ss101/douche-2.jpg",
    w: 1080,
    h: 922,
    consent: "clear",
    alt: {
      fr: "Seconde salle d’eau du studio SS101 — cabine de douche d’angle vitrée, vasque, miroir et chauffe-eau",
      en: "The second SS101 shower room — glazed corner shower cubicle, basin, mirror and water heater",
    },
  },
  ss101_balcon: {
    src: "/photos/studios/ss101/balcon.jpg",
    w: 1080,
    h: 894,
    consent: "clear",
    alt: {
      fr: "Balcon du studio SS101 — sol en marbre, garde-corps vitré, vue sur les arbres et les toits du quartier",
      en: "The SS101 balcony — marble floor, glass balustrade, looking out over trees and neighbouring rooftops",
    },
  },

  /* ── SS140 ────────────────────────────────────────────────────────────────
     Five frames of an actual Glen apartment, sent by the client 2026-08-11
     alongside SS101's and on the same terms: empty rooms, no people in any
     frame, `consent: "clear"` on inspection. 1080px long edge — WhatsApp's cap
     again.

     `ss140_salon` does double duty as `STUDIO_HERO`: the banner plate on the
     studios index and the « Appartements » slide in the home hero. It took over
     from a stock European interior that both surfaces had to caption.

     The client confirmed 2026-08-12 that this unit has the same characteristics
     and rate as SS101, so the row shares SS101's sheet — see `SS101_SPEC` in
     `lib/apartments.ts`.

     ⚠️ THE FRAMES SHOW ONE SHOWER ROOM; THE SHEET SAYS TWO. `ss140_douche` is
     singular for that reason, and the page states 2 on the client's word. The
     second one is unphotographed, not absent. If a sixth frame ever arrives,
     rename this to `ss140_douche_1` and match SS101's pair.

     ⚠️ Also unphotographed: nothing here shows Canal+ or the second douche, and
     the surface is SS101's measurement carried across. The photographs and the
     spec table are no longer 1:1 on this unit — the gap is the client's word,
     which is a legitimate source, but it is a gap.

     The interiors are visibly a different and more recent fit-out than SS101's
     (green velvet suite, marbled porcelain, gloss units) despite the identical
     spec, which is worth remembering before either unit's photographs are used
     to represent « the range ». */
  ss140_salon: {
    src: "/photos/studios/ss140/salon.jpg",
    w: 1080,
    h: 868,
    consent: "clear",
    alt: {
      fr: "Salon du studio SS140 — canapé et fauteuils en velours vert d’eau, coussins baroques dorés, table basse ovale en marbre, sol en marbre gris, téléviseur mural et climatiseur",
      en: "The SS140 living room — sea-green velvet sofa and armchairs, gold baroque cushions, an oval marble coffee table, grey marble floor, wall-mounted TV and air conditioning",
    },
  },
  ss140_chambre: {
    src: "/photos/studios/ss140/chambre.jpg",
    w: 1080,
    h: 686,
    consent: "clear",
    alt: {
      fr: "Chambre du studio SS140 — grand lit en bois verni, linge blanc et coussins framboise, table de chevet, téléviseur mural, climatiseur et rideaux voilés",
      en: "The SS140 bedroom — polished wood double bed, white linen with raspberry cushions, bedside table, wall-mounted TV, air conditioning and sheer curtains",
    },
  },
  ss140_cuisine: {
    src: "/photos/studios/ss140/cuisine.jpg",
    w: 1080,
    h: 868,
    consent: "clear",
    alt: {
      fr: "Cuisine équipée du studio SS140 — meubles laqués blancs, plan de travail en granit noir, crédence en marbre, plaque gaz, micro-ondes, cafetière, réfrigérateur et égouttoir garni",
      en: "The SS140 fitted kitchen — white gloss units, black granite worktop, marbled splashback, gas hob, microwave, coffee maker, fridge and a stocked dish rack",
    },
  },
  ss140_douche: {
    src: "/photos/studios/ss140/douche.jpg",
    w: 1080,
    h: 922,
    consent: "clear",
    alt: {
      fr: "Salle d’eau du studio SS140 — faïence marbrée noir et blanc, cabine de douche vitrée à profilés noirs, vasque en marbre, miroir, serviettes et chauffe-eau",
      en: "The SS140 shower room — black-and-white marbled tiling, glazed shower cubicle with black framing, marble basin, mirror, towels and water heater",
    },
  },
  ss140_balcon: {
    src: "/photos/studios/ss140/balcon.jpg",
    w: 1080,
    h: 894,
    consent: "clear",
    alt: {
      fr: "Balcon du studio SS140 — sol en marbre veiné, garde-corps vitré, porte-fenêtre vitrée et vue sur la végétation et les maisons voisines",
      en: "The SS140 balcony — veined marble floor, glass balustrade, glazed French door and a view over greenery and neighbouring houses",
    },
  },

  /* ── REMOVED 2026-08-12: the eight studio placeholders ────────────────────
     `studio_hero`, `studio_living`, `studio_living_kitchen`, `studio_bedroom`,
     `studio_bedroom_desk`, `studio_kitchen`, `studio_bathroom`,
     `studio_balcony`.

     Seven were a modern European apartment supplied 2026-08-09 to preview the
     studio pages before any real shoot — French windows, wall radiators, a
     suburban tower block through the balcony door, a building not in Yaoundé.
     The eighth, `studio_hero`, was an Unsplash banner plate (Huy Nguyen,
     `AB-q9lwCVv8`) on the same footing.

     They were `origin: "placeholder"`, kept out of `shippable()`, and forced an
     « Image d'illustration » caption wherever they rendered. All of that
     machinery worked; the images were still pictures of somewhere else, and the
     seven of them stood in for nine units nobody had photographed.

     Now that SS101 and SS140-A have their own frames and the undocumented units
     are unlisted, nothing referenced these. The files are still on disk under
     `public/photos/studios/studio-*` and the originals in `assets-raw/` — safe
     to delete, but left alone here so this is a code change only. The licence
     question in FACTS.md dies with them: seven had an unknown licence, which is
     one fewer launch blocker.

     If a preview set is ever needed again, do NOT resurrect these: the venue's
     own photography now exists, and an unlisted unit is a better answer than a
     borrowed photograph. */
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
