/**
 * French dictionary — the source of truth for UI copy. `en.ts` is typed
 * against this shape, so a missing English key is a compile error.
 *
 * Rules:
 * - Venue FACTS (phone, address, hours, programme) do NOT live here. They are
 *   language-independent and live in `lib/site.ts`, traceable to FACTS.md.
 * - Strings quoted from the venue's own posts are marked `✅ verbatim`. Anything
 *   else is our own editorial voice, which is allowed — inventing *facts* is not.
 */
/* No `as const` here, deliberately: it would freeze every value to its literal
   type, and `en.ts satisfies Dict` would then demand the English copy be
   character-identical to the French. We want the SHAPE enforced, not the text. */
export const fr = {
  nav: {
    skip: "Aller au contenu",
    menuLabel: "Navigation principale",
    links: {
      carte: "La carte",
      soirees: "Les soirées",
      lieu: "Le lieu",
      semaine: "La semaine",
      evenements: "Privatisation",
      appartements: "Appartements",
      contact: "Contact",
    },
    call: "Appeler",
    reserve: "Réserver",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },

  preloader: {
    // ✅ verbatim — TikTok bio / venue intro post, 2025-10-08
    tagline: "Ambiance, goût et élégance réunis",
    // ✅ verbatim — IG/FB descriptor
    descriptor: "Restaurant · Lounge · Appartement",
    loading: "Chargement",
  },

  hero: {
    /* The page's only <h1>, visually hidden. It has to say what the place is
       and where — the visible display line is a mood line, not a description. */
    h1: "The Glen Lounge — restaurant, lounge et appartements meublés à Yaoundé, Omnisport",
    bannerLabel: "À l’affiche",
    eyebrowLeft: "Restaurant · Lounge · Appartement",
    eyebrowRight: "Yaoundé — Omnisport",
    // ✅ verbatim — venue intro post, 2025-10-08
    tagline: "Ambiance, goût et élégance réunis",
    lede: "Restaurant, lounge et appartements meublés à Yaoundé — Omnisport, derrière le stade.",
    scroll: "Défiler",
    prev: "Diapositive précédente",
    next: "Diapositive suivante",
    goTo: "Aller à la diapositive",
    seeEvents: "Voir les soirées",
    moreDetail: "Voir le détail",
  },

  evenementsPage: {
    eyebrow: "Les soirées",
    title: "Sept soirées, et les grands rendez-vous",
    lede: "Le programme de la semaine et les dates à ne pas manquer. Réservation par téléphone.",
    upcoming: "À venir",
    weekly: "Chaque semaine",
    readMore: "Voir le détail",
    backToEvents: "Toutes les soirées",
    backHome: "Retour à l’accueil",
    lineup: "À l’affiche",
    practical: "Infos pratiques",
    when: "Quand",
    where: "Où",
    booking: "Réservation",
    /* One-offs whose date has passed keep their page so shared links survive —
       but the page has to say so instead of reading as an invitation. */
    pastNotice: "Cette soirée a eu lieu. Consultez le programme pour les prochaines dates.",
    recurring: "Rendez-vous hebdomadaire",
    cta: "Réserver une table",
  },

  carte: {
    eyebrow: "La carte",
    title: "Manger bien, à petit prix",
    lede: "Entrées, produits de mer, plats locaux, pizzas et desserts. Servis midi et soir dans la salle en marbre.",
    /* Honesty note. The artwork we transcribed is dated février 2026 and a
       restaurant menu is the one page where being stale costs real money. */
    priceNote:
      "Carte relevée en février 2026. Les prix peuvent avoir évolué — confirmez au téléphone avant de vous déplacer.",
    currency: "FCFA",
    flatPriceLabel: "Chaque",
    backHome: "Retour à l’accueil",
    ctaTitle: "Une table vous attend",
    cta: "Réserver par téléphone",
    /* No drinks list exists in the source document — say so rather than let a
       visitor assume the venue does not serve any. */
    drinksNote: "Cocktails, bouteilles et service au verre : demandez la carte sur place.",
  },

  trois: {
    section: "02 — Trois adresses en une",
    /* Shown on the cards that have a page behind them. */
    more: "Découvrir",
    title: "Restaurant, lounge, appartements",
    lede: "Une même maison pour dîner, sortir et dormir sur place. « Le spot incontournable à Yaoundé. »",
    resto: {
      title: "Restaurant",
      // ✅ verbatim — « Manger bien, à petit prix »
      text: "Manger bien, à petit prix. Plats du jour, pizza, samedi poulet et midi express, servis dans la salle en marbre.",
      meta: "Midi & soir",
    },
    lounge: {
      title: "Lounge",
      text: "Cocktails, écrans géants et sept soirées par semaine, aux platines DJ W & DJ Personica.",
      meta: "Dès 19h",
    },
    appart: {
      title: "Appartements",
      // ✅ verbatim — « meublé haut standing », « Confort, sécurité, intimité »
      /* « dans la même maison » and not « à l’étage au-dessus de la salle »:
         FACTS.md records the address the three share, never a floor. */
      text: "Meublé haut standing, disponible 24h/24. Confort, sécurité, intimité — dans la même maison.",
      meta: "24h/24",
    },
  },

  semaine: {
    section: "03 — L’agenda",
    title: "Ce qui se passe, et quand",
    lede: "Sept soirées par semaine, plus les grandes dates. Survolez un jour pour voir ce qui s’y passe.",
    djs: "Résidents : DJ W & DJ Personica",
    flagship: "L’incontournable",
    // Lundi: nothing has been published since octobre 2025 — say so, don't invent.
    noneYet: "Rien de publié — nous consulter",
    prevMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    today: "Aujourd’hui",
    legendWeekly: "Soirée hebdomadaire",
    legendSpecial: "Date spéciale",
    pickDay: "Choisir un jour",
    seeEvent: "Voir le détail",
    where: "Omnisport, derrière le stade",
    days: {
      lundi: "Lundi",
      mardi: "Mardi",
      mercredi: "Mercredi",
      jeudi: "Jeudi",
      vendredi: "Vendredi",
      samedi: "Samedi",
      dimanche: "Dimanche",
    },
  },

  lieu: {
    section: "04 — Le lieu",
    title: "Un espace chic, une ambiance unique",
    lede: "Marbre poli, laiton et lumière basse. La salle, le bar et les salons se prêtent aussi bien à un dîner qu’à une soirée privée.",
    hint: "Faites défiler",
  },

  evenements: {
    section: "05 — Événements & privatisation",
    // ✅ verbatim — « le goût du raffinement à chaque occasion »
    title: "Le goût du raffinement à chaque occasion",
    lede: "Cérémonies, anniversaires, réunions, DT, mariages. Nous dressons la salle, vous choisissez vos bouteilles.",
    list: [
      "Anniversaires",
      "Cérémonies & mariages",
      "Afterworks & réunions",
      "Dîners privés & shootings",
    ],
    // No capacity or package pricing has ever been published — route to a call.
    note: "Capacités et formules sur demande.",
    cta: "Organiser un événement",
  },

  appartements: {
    section: "06 — Appartements",
    title: "Dormir sur place",
    lede: "Glen Appartement — meublé haut standing, disponibilité 24h/24, tous les jours. Confort, sécurité, intimité.",
    note: "Types et tarifs communiqués par téléphone.",
    seeAll: "Voir les 11 logements",
    cta: "Demander une disponibilité",
  },

  ecrans: {
    section: "07 — Écrans géants",
    title: "Tous les matchs, en grand",
    lede: "Écrans géants dans la salle et le lounge. Coupe du monde 2026, Champions League, El Clásico — et le village de la CAN.",
    // ✅ verbatim — the venue's own match flyers all carry « EN LIVE SUR NOS ECRANS »
    boardTitle: "En live sur nos écrans",
    /* Every row is a competition the venue has actually screened, per its own
       posts: CAN village (déc. 2025), Coupe du Monde (juin–juil. 2026),
       Champions League + El Clásico (récurrent). No years on the board so it
       cannot go stale. */
    boardRows: [
      "Champions League",
      "El Clásico",
      "Coupe du Monde",
      "Village de la CAN",
    ],
    boardLive: "En direct",
    /* The gallery presents the venue's own match flyers as an archive of its
       soirées match — artwork, not upcoming fixtures, since every flyer
       carries a past date. */
    galleryLabel: "Les soirées match — les affiches",
    galleryPrev: "Affiche précédente",
    galleryNext: "Affiche suivante",
  },

  social: {
    section: "08 — Suivre le Glen",
    title: "Le Glen au quotidien",
    lede: "Les soirées, les matchs et les nouveautés se publient d'abord sur TikTok, Instagram et Facebook. Suivez-nous pour ne rien manquer.",
    followCta: "Suivre",
  },

  contact: {
    section: "09 — Venir & réserver",
    title: "Réservez par téléphone",
    lede: "Aucune réservation en ligne pour l’instant : appelez ou écrivez sur WhatsApp, on vous répond directement.",
    addressTitle: "L’adresse",
    // Current published wording as of the août 2026 posts.
    directions: "Yaoundé — Omnisport, derrière le stade, à 300 m de l’école publique de Mfandena. 2ᵉ entrée à droite.",
    callCta: "Appeler",
    whatsappCta: "Écrire sur WhatsApp",
    hoursTitle: "Horaires",
  },

  footer: {
    findUs: "Nous trouver",
    contact: "Contact",
    follow: "Suivre",
    hours: "Horaires",
    hoursRestaurant: "Restaurant & lounge",
    hoursApartments: "Appartements",
    /* FACTS.md records an opening time of 10h but no publishable closing time —
       « jusqu'à tard » is not an hour. Say what is known, claim nothing more. */
    hoursRestaurantValue: "À partir de 10h",
    hoursApartmentsValue: "24h/24, 7j/7",
    rights: "Tous droits réservés",
    // Honest status badge — mirrors the maquette badge on the Stand'Up build.
    status: "Site en construction — informations en cours de validation",
  },

  /* The studio pages.
     `preview`, `previewIndex` and `photoNotice` were removed 2026-08-12 with the
     placeholder listings and stock photographs they disclaimed. Nothing on these
     pages is invented any more, so there is nothing to warn about — do not
     reintroduce a notice; if a unit cannot be documented, leave it unlisted.

     ⚠️ The title deliberately does NOT count the studios. The venue has eleven
     (FACTS.md); the index lists only the ones we hold photographs and answers
     for. « Onze studios meublés » as a heading over two cards read as a broken
     page, and changing it to « Deux » would undersell the building — so the
     eleven is stated in the lede as a fact about the property, and the tally
     below is labelled « studios présentés ». */
  studios: {
    eyebrow: "Appartements",
    /* « Logements » and not « studios » since 2026-08-12: the list is now mixed
       — two whole studios and two single rooms let inside apartment A10 — and
       a heading that calls all four studios contradicts the « Chambre dans
       l'appartement A10 » printed on two of the cards below it. */
    title: "Logements meublés, sur place",
    lede: "Glen Appartement — meublé haut standing, accès 24h/24. Confort, sécurité, intimité, à deux pas de la salle. Onze logements dans l’immeuble. Ceux que nous pouvons vous montrer en détail — appartements entiers, studios et chambres seules — sont ci-dessous.",
    count: "logements présentés",
    availableNow: "disponibles aujourd’hui",
    status: {
      available: "Disponible",
      occupied: "Occupé",
      soon: "Bientôt libre",
    },
    sleeps: "Couchages",
    /* The same fact as `sleeps`, worded for a sentence instead of a table.
       « Couchages 4 » is a spec-table row that reads as a form field once it is
       set inline on a card; « 4 couchages » is how it is said out loud. The
       table keeps `sleeps` — this pair is only for the index card. */
    sleepsCount: "{n} couchages",
    sleepsCountOne: "{n} couchage",
    floor: "Étage",
    groundFloor: "Rez-de-chaussée",
    /* Rendered « Sous-sol 2 » for floor "R-2". Four unit codes start with SS,
       which is what the prefix turns out to mean. */
    basement: "Sous-sol",
    equipment: "Équipements",
    /* Building-level services — answered once by the client, shown on every
       studio page under their own heading so they are not mistaken for
       something this particular unit has and the next one might not. */
    building: {
      title: "L’immeuble",
      note: "Services communs à tout l’immeuble.",
      guard: "Gardien",
      cameras: "Vidéosurveillance",
      generator: "Groupe électrogène",
      waterReserve: "Réserve d’eau",
      parking: "Parking",
      housekeeping: "Ménage compris",
      sameBuilding: "Dans le même immeuble que le restaurant",
    },
    /* The spec table. ⚠️ Every VALUE it displays except the status is preview
       data — see the header of lib/apartments.ts. */
    specs: {
      title: "Caractéristiques",
      status: "Statut",
      size: "Surface",
      sizeUnit: "m²",
      bed: "Literie",
      access: "Accès",
      rooms: "Chambres",
      showers: "Salles d’eau",
      /* What is actually let. « Chambre seule » is the client's own wording and
         it matters: a 10 m² bedroom inside a shared apartment must not be sold
         under the same noun as a self-contained studio. */
      kind: "Type",
      /* One per `UnitKind`. `kindWhole` — a single « Studio entier » for every
         unit that was not a bedroom — was deleted 2026-08-13: it printed over
         A10's 130 m² and B35's 95,72 m² while the client's own sheets for both
         say « appartement entier ». The noun is now transcribed per unit; see
         `UnitKind` in lib/apartments.ts. */
      kindApartment: "Appartement entier",
      kindStudio: "Studio entier",
      kindRoom: "Chambre dans un appartement",
      /* « Chambre dans l’appartement A10 » — used when the parent is known. */
      kindRoomIn: "Chambre dans l’appartement {code}",
      livingRoom: "Salon",
      kitchen: "Cuisine",
      /* Rendered as the value of the two boolean rows above. */
      yes: "Oui",
      no: "Non",
      /* « 60 000 FCFA » followed by this, so the unit of time is never
         guessed from the number alone. */
      perNight: "la nuit",
      /* Rendered after the count, beside the « Équipements » heading — so it
         reads « Équipements · 9 inclus » rather than repeating the word. */
      equipmentCount: "inclus",
    },
    beds: {
      double: "Un lit double",
      twin: "Deux lits simples",
      doubleSingle: "Un lit double + un lit simple",
    },
    /* « logement » — the neutral noun — everywhere the site used to say
       « studio » about units in general. Chosen 2026-08-13 precisely because it
       stays true whichever way the studio/appartement question is settled for
       SS101 and SS140-A: the list is now two apartments, two studios and two
       bedrooms, and no one of those three words covers it. Where the site talks
       about ONE unit it uses that unit's own noun — `studios.noun` below. */
    gallery: "Le logement en images",
    openGallery: "Agrandir",
    closeGallery: "Fermer la galerie",
    prev: "Image précédente",
    next: "Image suivante",
    /* The walkthrough clip — last slide, and only on units that sent one. */
    videoLabel: "Visite en vidéo",
    playVideo: "Lire la visite",
    backToStudios: "Tous les logements",
    seeUnit: "Voir le logement",
    /**
     * The noun for ONE unit, by `UnitKind` — « Appartement A10 », « Studio
     * SS101 », « Chambre A10-2 ». It is the page's `<h1>` and its <title>, and
     * it is why the noun had to become data: those two pages used to differ
     * above the fold by four characters of unit code.
     */
    noun: {
      apartment: "Appartement",
      studio: "Studio",
      room: "Chambre",
    },
    /* The three counted lines the identity sentence is built from —
       `unitLine()` in lib/apartments.ts. French inverts (« 2 chambres »), which
       is why these are templates and not a bare label. */
    roomsCount: "{n} chambres",
    roomsCountOne: "{n} chambre",
    /* How a `room` opens its identity line. Shorter than
       `specs.kindRoomIn` because the noun is already the page's own title —
       « Chambre A10-2 » followed by « Chambre dans l’appartement A10 » says the
       word twice in two lines. */
    inApartment: "Dans l’appartement {code}",
    /* The band at the foot of a unit page. `otherStudios` — a single flat
       heading — was retired with the flat list it titled. */
    related: {
      otherTitle: "Autres logements",
      otherKicker: "Ailleurs dans l’immeuble",
      sameApartmentTitle: "Dans le même appartement",
      sameApartmentKicker: "Le reste du logement",
      roomInside:
        "Cette chambre est une pièce de l’appartement {code}, qui se loue aussi en entier.",
      apartmentRooms: "Les chambres de cet appartement se louent aussi séparément.",
      isParent: "L’appartement entier",
      isSibling: "Une autre chambre",
      /* Short on purpose: the block heading above already says « Dans le même
         appartement », and at ~380px a longer ribbon runs into the status pill
         across the top of the card. */
      isRoom: "Une chambre",
      sameMedia: "Les deux chambres partagent la même visite en images.",
    },
    /* One line per amenity id in `lib/apartments.ts`. A missing key fails tsc
       in en.ts, which is exactly what we want. */
    amenities: {
      wifi: "Wi-Fi",
      ac: "Climatisation",
      fan: "Ventilateur",
      tv: "Télévision",
      canalPlus: "Canal+",
      kitchenette: "Cuisine équipée",
      fridge: "Réfrigérateur",
      microwave: "Micro-ondes",
      utensils: "Ustensiles de cuisine",
      bathroom: "Salle d’eau privative",
      hotWater: "Eau chaude",
      linens: "Draps et serviettes fournis",
      balcony: "Balcon",
      desk: "Coin bureau",
      laundry: "Lave-linge",
      access24: "Accès 24h/24",
    },
    book: {
      /* The panel sits directly above the WhatsApp button, so it is the last
         thing read before an enquiry is sent — the one place the wrong noun
         actually costs something. One title per `UnitKind`: `title`, a single
         « Demander ce studio », was deleted 2026-08-13 because it sat over
         150 000 FCFA on a 130 m² apartment. */
      titleApartment: "Demander cet appartement",
      titleStudio: "Demander ce studio",
      titleRoom: "Demander cette chambre",
      arrival: "Arrivée",
      departure: "Départ",
      guests: "Personnes",
      nights: "nuit",
      nightsPlural: "nuits",
      /* No rate has ever been published — see FACTS.md open question #1. */
      price: "Tarif sur demande",
      whatsapp: "Demander par WhatsApp",
      call: "Appeler le Glen",
      /* Noun-free rather than three keys each: these describe states no listed
         unit is in today, and « ce logement » is true of all three kinds. */
      unavailable: "Ce logement est occupé. Demandez-nous les prochaines dates, ou choisissez-en un autre.",
      soon: "Ce logement se libère bientôt. Appelez-nous pour connaître la date exacte.",
      /* Prefilled into WhatsApp. `{unit}`, `{code}`, `{dates}` and `{guests}`
         are replaced in ReserveStudio.tsx — keep the braces.
         ⚠️ THE ARTICLE TRAVELS WITH THE NOUN, in `messageUnit` below, because
         French elides before a vowel — « réserver l’appartement A10 » — and no
         amount of concatenating an article and a noun in the component will
         produce that. English takes no article, so its values are bare. */
      message:
        "Bonjour, je souhaite réserver {unit} {code} du Glen Appartement. {dates}, {guests}. Merci de me confirmer la disponibilité et le tarif.",
      messageUnit: {
        apartment: "l’appartement",
        studio: "le studio",
        room: "la chambre",
      },
      messageDates: "Du {from} au {to}",
      messageNoDates: "Dates à confirmer",
      messageGuests: "{n} personne(s)",
      /* The phone-only sticky bar — see ReserveStudio.module.css `.bar`. */
      barCta: "Demander",
    },
  },

  langSwitch: {
    label: "Langue",
    fr: "Français",
    en: "English",
    // Shown on the inactive option, read by screen readers
    switchTo: "Passer en anglais",
  },

  notFound: {
    eyebrow: "Erreur 404",
    title: "Cette page n’existe pas",
    body: "Le lien est peut-être périmé, ou la page n’a pas encore été construite.",
    cta: "Retour à l’accueil",
  },

  common: {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    address: "Adresse",
  },
};

export type Dict = typeof fr;
