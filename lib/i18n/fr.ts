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
      text: "Meublé haut standing, disponible 24h/24. Confort, sécurité, intimité — à l’étage au-dessus de la salle.",
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
    seeAll: "Voir les 11 studios",
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

  /* The studio pages. `studios.preview` is the notice that has to stay on the
     page for as long as `PREVIEW` is true in `lib/apartments.ts` — it is the
     only thing telling a visitor that the availability and the photographs are
     not yet real. Do not quietly soften it. */
  studios: {
    eyebrow: "Appartements",
    title: "Onze studios meublés, au-dessus du lounge",
    lede: "Glen Appartement — meublé haut standing, accès 24h/24. Confort, sécurité, intimité, à deux pas de la salle.",
    count: "studios",
    availableNow: "disponibles aujourd’hui",
    preview:
      "Aperçu : les photos, les disponibilités et les équipements affichés ici sont des exemples, le temps que le Glen fournisse les vraies informations. Seuls les numéros de studio sont réels.",
    photoNotice: "Image d’illustration — photographie d’un autre logement.",
    status: {
      available: "Disponible",
      occupied: "Occupé",
      soon: "Bientôt libre",
    },
    sleeps: "Couchages",
    floor: "Étage",
    groundFloor: "Rez-de-chaussée",
    equipment: "Équipements",
    /* The spec table. ⚠️ Every VALUE it displays except the status is preview
       data — see the header of lib/apartments.ts. */
    specs: {
      title: "Caractéristiques",
      status: "Statut",
      size: "Surface",
      sizeUnit: "m²",
      bed: "Literie",
      access: "Accès",
      /* Rendered after the count, beside the « Équipements » heading — so it
         reads « Équipements · 9 inclus » rather than repeating the word. */
      equipmentCount: "inclus",
    },
    beds: {
      double: "Un lit double",
      twin: "Deux lits simples",
      doubleSingle: "Un lit double + un lit simple",
    },
    gallery: "Le studio en images",
    openGallery: "Agrandir",
    prev: "Image précédente",
    next: "Image suivante",
    backToStudios: "Tous les studios",
    seeStudio: "Voir le studio",
    otherStudios: "Autres studios",
    /* One line per amenity id in `lib/apartments.ts`. A missing key fails tsc
       in en.ts, which is exactly what we want. */
    amenities: {
      wifi: "Wi-Fi",
      ac: "Climatisation",
      tv: "Télévision",
      kitchenette: "Kitchenette équipée",
      bathroom: "Salle d’eau privative",
      hotWater: "Eau chaude",
      balcony: "Balcon",
      desk: "Coin bureau",
      laundry: "Lave-linge",
      parking: "Parking",
      access24: "Accès 24h/24",
      housekeeping: "Ménage",
    },
    book: {
      title: "Demander ce studio",
      arrival: "Arrivée",
      departure: "Départ",
      guests: "Personnes",
      nights: "nuit",
      nightsPlural: "nuits",
      /* No rate has ever been published — see FACTS.md open question #1. */
      price: "Tarif sur demande",
      whatsapp: "Demander par WhatsApp",
      call: "Appeler le Glen",
      unavailable: "Ce studio est occupé. Demandez-nous les prochaines dates, ou choisissez-en un autre.",
      soon: "Ce studio se libère bientôt. Appelez-nous pour connaître la date exacte.",
      /* Prefilled into WhatsApp. `{code}`, `{dates}` and `{guests}` are
         replaced in ReserveStudio.tsx — keep the braces. */
      message:
        "Bonjour, je souhaite réserver le studio {code} du Glen Appartement. {dates}, {guests}. Merci de me confirmer la disponibilité et le tarif.",
      messageDates: "Du {from} au {to}",
      messageNoDates: "Dates à confirmer",
      messageGuests: "{n} personne(s)",
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
