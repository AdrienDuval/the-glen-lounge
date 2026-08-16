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
     * ✅ THE BOOKING LINE — client, 2026-08-14. This closes what FACTS.md had
     * carried as the **#1 launch blocker** since the first harvest.
     *
     * ── WHY THIS SUPERSEDES EVERYTHING ───────────────────────────────────────
     * FACTS.md records SIX published variants, and the site had been rendering
     * `691 24 65 90` as a working assumption — the one number that appeared
     * consistently across the whole TikTok timeline — while a long note weighed
     * `652 81 45 49` against `46 49`.
     *
     * The client has now given the number directly, and it is a SEVENTH value
     * matching none of the six. Given directly beats inferred from captions, so
     * that whole argument is closed: this is the number, and the six published
     * ones are stale.
     *
     * ⚠️ THE OLD NUMBERS ARE STILL LIVE ON THEIR OWN CHANNELS — TikTok captions,
     * the Facebook intro and contact fields, and their Bal des Vétérans flyer.
     * The site is now correct and their socials are not. Only they can fix
     * those; it is the first thing to raise. A guest who finds the venue through
     * TikTok will still dial a stale line.
     *
     * ── ONE NUMBER, BOTH CHANNELS ────────────────────────────────────────────
     * Calls and WhatsApp were two different numbers (`691 51 35 16` came from
     * the Facebook WhatsApp field). Client's instruction 2026-08-14 is one line
     * for everything, so `whatsapp` points at the same value rather than being
     * deleted — every WhatsApp button reads `whatsapp.tel`, and keeping the key
     * means the two can diverge again with a one-line edit if they ever put
     * WhatsApp on a separate handset.
     */
    phonePrimary: { display: "+237 699 31 36 23", tel: "+237699313623" },
    /**
     * The previous working assumption, kept for one release as a fallback if the
     * new line turns out to be mistyped — NOT rendered anywhere. Delete once the
     * client has confirmed the new number is answering.
     */
    phoneSecondary: { display: "+237 691 24 65 90", tel: "+237691246590" },
    /** Same line as `phonePrimary` — see the note above. */
    whatsapp: { display: "+237 699 31 36 23", tel: "+237699313623" },
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
 *
 * ⚠️ NOT RENDERED, AND NO LONGER AGREES WITH THE SITE. Nothing imports this —
 * `lib/events.ts` is what the banner, the calendar and the event pages read, and
 * since 2026-08-11 it publishes NO start time for mardi, mercredi, jeudi and
 * samedi, because the venue's own flyers for those nights print times that
 * contradict the 19h below (see the ONE TIME CLAIM block in lib/events.ts).
 * Fix this table in the same edit as that one, or delete it — as a second,
 * stale copy of the programme it can only mislead.
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
