/**
 * Language-independent venue facts. Every value must be traceable to FACTS.md.
 *
 * UI copy does NOT belong here — it lives in `lib/i18n/`. This file is for
 * things that are the same in every language: phone numbers, coordinates,
 * social URLs, the programme.
 *
 * Anything still marked TODO is unconfirmed. Do not render it, and do not
 * replace it with a plausible guess.
 */
export const site = {
  name: "The Glen Lounge",
  fullName: "The Glen Lounge Restaurant Appartement",

  /** TODO: production domain not chosen. Blocks metadataBase, OG and sitemap. */
  url: "",

  contact: {
    /**
     * ⚠️ FACTS.md records SIX published variants. This is the working
     * assumption: the pair used for "réservations" across the whole TikTok
     * timeline. TODO — the client must settle 652 81 **45** 49 vs **46** 49
     * before launch. The entire site converts to a phone call.
     */
    phonePrimary: { display: "+237 691 24 65 90", tel: "+237691246590" },
    phoneSecondary: { display: "+237 652 81 46 49", tel: "+237652814649" },
    /** From the Facebook page WhatsApp field. */
    whatsapp: { display: "+237 691 51 35 16", tel: "+237691513516" },
    /** TODO: no email address is published anywhere. */
    email: "",
  },

  address: {
    area: "Omnisport",
    /** ⚠️ TODO: posts say 150 m up to 2026-05-29, then 300 m from 2026-07-25. */
    landmark: "école publique de Mfandena",
    landmarkDistance: null as string | null,
    detail: "2ᵉ entrée à droite",
    city: "Yaoundé",
    country: "Cameroun",
    countryCode: "CM",
    /** TODO: no Google Business Profile exists, so no verified coordinates. */
    geo: null as { lat: number; lng: number } | null,
  },

  hours: {
    /**
     * ⚠️ Genuinely contradictory across the timeline. FACTS.md's hypothesis is
     * that the apartments are 24/7 while the restaurant runs 10h–late.
     * "jusqu'à tard" cannot go into `openingHours` structured data, so
     * `restaurantClose` stays null until the client gives a real time.
     */
    restaurantOpen: "10:00",
    restaurantClose: null as string | null,
    apartments247: true,
  },

  /** Handles are shown in the Suivre section; keep them matching the URLs. */
  social: {
    tiktok: {
      url: "https://www.tiktok.com/@the.glen.lounge",
      handle: "@the.glen.lounge",
    },
    instagram: {
      url: "https://www.instagram.com/the_glen_lounge/",
      handle: "@the_glen_lounge",
    },
    facebook: {
      url: "https://www.facebook.com/people/The-Glen-Lounge/61580468213620/",
      handle: "The Glen Lounge",
    },
  },

  /** Opened early October 2025 — first TikTok post 2025-10-03. */
  founded: "2025-10",
} as const;

/**
 * The weekly programme. Start times drifted 18h → 16h → 19h through 2026;
 * these are the most recently published values.
 * TODO: confirm before launch. `night: null` = nothing published since Oct 2025.
 */
export const programme = [
  { key: "lundi", night: null, start: null },
  { key: "mardi", night: "Casino / Game Night Show", start: "19h" },
  { key: "mercredi", night: "Mercredi Cocktail", start: "19h" },
  { key: "jeudi", night: "Jeudi Karaoké", start: "19h", flagship: true },
  { key: "vendredi", night: "After Work", start: null },
  { key: "samedi", night: "Samedi VIP", start: "19h" },
  { key: "dimanche", night: "Dimanche Vétéran", start: "19h" },
] as const;

/** Resident DJs — credited on nearly every flyer. */
export const RESIDENT_DJS = ["DJ W", "DJ Personica"] as const;
