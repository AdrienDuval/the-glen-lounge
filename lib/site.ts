/**
 * Single source of truth for site-wide strings.
 * Every value here must be traceable to FACTS.md. Anything still marked TODO is
 * unconfirmed — do not render it, and do not replace it with a plausible guess.
 */
export const site = {
  name: "The Glen Lounge",
  fullName: "The Glen Lounge Restaurant Appartement",
  lang: "fr",
  // Verified: TikTok bio / launch post, 2025-10-08
  description:
    "Restaurant, lounge et appartements meublés à Yaoundé — Omnisport, derrière le stade.",
  tagline: "Ambiance, goût et élégance réunis",
  url: "", // TODO: production domain not chosen

  contact: {
    // Working assumption per FACTS.md — the pair used for "réservations" across
    // the whole TikTok timeline. TODO: confirm, incl. the 45/46 discrepancy.
    phonePrimary: "+237 691 24 65 90",
    phoneSecondary: "+237 652 81 46 49",
    whatsapp: "+237 691 51 35 16", // from the Facebook page
    email: "", // TODO: none published anywhere
  },

  address: {
    // TODO: "150 m" vs "300 m" contradict each other across the timeline.
    street: "Omnisport, derrière le stade, à 150 m de l'école publique de Mfandena",
    detail: "2ᵉ entrée à droite",
    city: "Yaoundé",
    country: "Cameroun",
    countryCode: "CM",
  },

  hours: {
    // TODO: apartments appear to be 24h/24 while the restaurant runs 10h–late.
    // Unconfirmed, and "jusqu'à tard" is not a publishable closing time.
    restaurant: "Tous les jours, 10h — tard",
    apartments: "24h/24, 7j/7",
  },

  social: {
    tiktok: "https://www.tiktok.com/@the.glen.lounge",
    instagram: "https://www.instagram.com/the_glen_lounge/",
    facebook: "https://www.facebook.com/people/The-Glen-Lounge/61580468213620/",
  },
} as const;

/**
 * The weekly programme. Start times drifted through 2026 — these are the most
 * recent published values. TODO: confirm with the client before launch.
 * `null` night = nothing published since October 2025.
 */
export const programme = [
  { day: "Lundi", night: null, start: null },
  { day: "Mardi", night: "Casino / Game Night Show", start: "19h" },
  { day: "Mercredi", night: "Mercredi Cocktail", start: "19h" },
  { day: "Jeudi", night: "Jeudi Karaoké", start: "19h" },
  { day: "Vendredi", night: "After Work", start: null },
  { day: "Samedi", night: "Samedi VIP", start: "19h" },
  { day: "Dimanche", night: "Dimanche Vétéran", start: "19h" },
] as const;
