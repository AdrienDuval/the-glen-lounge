import type { PhotoId } from "./photos";
import { isCleared } from "./photos";
import type { Lang } from "./i18n/config";

/**
 * Events — the single source of truth.
 *
 * One entry here produces THREE things automatically:
 *   1. a slide in the hero banner            (`activeEvents()`)
 *   2. a card in the events index            (`/fr/evenements`)
 *   3. its own detail page                   (`/fr/evenements/<slug>`)
 *
 * So adding an event is one object, not three edits in three files. That is
 * the whole point: this is the part of the site the venue will keep feeding.
 *
 * `kind: "weekly"` is a recurring night — it has no date and never expires.
 * `kind: "one-off"` has a real date and an expiry window; once `to` has passed
 * it drops out of the banner and the index on its own, but its page keeps
 * working so old links and shares do not rot.
 *
 * Every fact below is traceable to FACTS.md. The `body` paragraphs are our
 * editorial voice built on those facts — that is allowed; inventing facts
 * is not.
 */

type L = { fr: string; en: string };

/** Monday-first, matching how a French calendar is read. */
export const WEEKDAYS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type GlenEvent = {
  slug: string;
  kind: "weekly" | "one-off";
  /** Weekly events only — which night of the week it lands on. */
  day?: Weekday;
  /** Door time as published, e.g. "19h". Omit when nothing is published. */
  time?: string;
  photo: PhotoId;
  /**
   * How the image wants to be shown.
   * `"cover"` (default) — a photograph, cropped full-bleed.
   * `"poster"` — event artwork. Shown whole, on a dark ground, because a
   * portrait flyer cover-cropped into a landscape hero loses its own
   * typography and then fights the caption we lay over it.
   */
  layout?: "cover" | "poster";
  title: L;
  /** The "when" line used on the banner and the card. */
  when: L;
  /** ISO date, one-offs only. Drives ordering and the <time> element. */
  date?: string;
  /** Short line under the title. */
  summary: L;
  /** Key facts, rendered as chips. Kept to three — more is not a highlight. */
  highlights: L[];
  /** Detail-page prose. */
  body: { fr: string[]; en: string[] };
  /** Billed names, if any. */
  lineup?: string[];
  /** Inclusive ISO window. Omit for evergreen. */
  from?: string;
  to?: string;
};

export const EVENTS: GlenEvent[] = [
  {
    slug: "bal-des-veterans-2026",
    kind: "one-off",
    photo: "event_bal_veterans",
    layout: "poster",
    date: "2026-08-23",
    time: "18h",
    title: { fr: "Bal des Vétérans", en: "Bal des Vétérans" },
    /* 2026-08-23 is a SUNDAY — the flyer prints no weekday, and the calendar
       exposed an earlier "samedi" assumption as wrong. A Sunday date also fits
       their « Dimanche Vétéran » branding, which corroborates it. */
    when: { fr: "Dimanche 23 août — dès 18h", en: "Sunday 23 August — from 6pm" },
    summary: {
      fr: "Une soirée exceptionnelle avec l’artiste K-Tino, aux côtés de DJ Christian Denon.",
      en: "A one-off night with K-Tino, alongside DJ Christian Denon.",
    },
    highlights: [
      { fr: "Entrée libre", en: "Free entry" },
      { fr: "Ouverture 18h", en: "Doors 6pm" },
      { fr: "+18", en: "18+" },
    ],
    lineup: ["K-Tino", "DJ Christian Denon", "DJ W", "DJ Personica"],
    body: {
      fr: [
        "Le Bal des Vétérans revient au Glen Lounge le dimanche 23 août. Les portes ouvrent à 18h et l’entrée est libre.",
        "L’artiste K-Tino est à l’affiche, accompagnée de DJ Christian Denon. La mix policy de la soirée est assurée par les résidents de la maison, DJ W et DJ Personica.",
        "Soirée réservée aux plus de 18 ans. Les tables partent vite les soirs d’affiche : réservez la vôtre par téléphone.",
      ],
      en: [
        "Bal des Vétérans returns to the Glen Lounge on Sunday 23 August. Doors at 6pm, free entry.",
        "K-Tino headlines, alongside DJ Christian Denon. The night's mix policy is handled by the house residents, DJ W and DJ Personica.",
        "Over-18s only. Tables go quickly on billed nights — book yours by phone.",
      ],
    },
    to: "2026-08-24",
  },
  {
    slug: "jeudi-karaoke",
    kind: "weekly",
    day: "jeudi",
    time: "19h",
    photo: "bar_monogram",
    title: { fr: "Jeudi Karaoké", en: "Thursday Karaoke" },
    when: { fr: "Tous les jeudis — dès 19h", en: "Every Thursday — from 7pm" },
    summary: {
      // ✅ verbatim — their single best-performing post, 25 100 vues
      fr: "« Tu chantes bien ou faux ? On s’en fout. »",
      en: "“Good singer or terrible? We really don't mind.”",
    },
    highlights: [
      { fr: "Le rendez-vous de la maison", en: "The house favourite" },
      { fr: "Dès 19h", en: "From 7pm" },
      { fr: "Micro ouvert", en: "Open mic" },
    ],
    body: {
      fr: [
        "Le jeudi karaoké est, de loin, le rendez-vous le plus suivi de la maison. Micro ouvert, salle pleine, et personne pour juger votre justesse.",
        "Venez seul, à deux ou en bande. Les portes ouvrent à 19h — arrivez tôt si vous voulez une table près de la scène.",
      ],
      en: [
        "Thursday karaoke is comfortably the busiest night here. Open mic, full room, and nobody keeping score on your pitch.",
        "Come alone, as a pair or mob-handed. Doors at 7pm — arrive early if you want a table near the stage.",
      ],
    },
  },
  {
    slug: "samedi-vip",
    kind: "weekly",
    day: "samedi",
    time: "19h",
    photo: "lounge_sofa",
    title: { fr: "Samedi VIP", en: "Saturday VIP" },
    when: { fr: "Tous les samedis — dès 19h", en: "Every Saturday — from 7pm" },
    summary: {
      fr: "Le style, la musique et l’ambiance, réunis pour la soirée la plus chic de la semaine.",
      en: "Style, music and atmosphere, for the sharpest night of the week.",
    },
    highlights: [
      { fr: "DJ W & DJ Personica", en: "DJ W & DJ Personica" },
      { fr: "Dès 19h", en: "From 7pm" },
      { fr: "Tenue soignée", en: "Dress sharp" },
    ],
    lineup: ["DJ W", "DJ Personica"],
    body: {
      fr: [
        "Le samedi est la soirée la plus habillée de la semaine. Aux platines, les résidents DJ W et DJ Personica tiennent la salle jusqu’au bout de la nuit.",
        "Réservez votre table à l’avance : c’est le soir où la salle se remplit le plus vite.",
      ],
      en: [
        "Saturday is the dressiest night of the week. On the decks, residents DJ W and DJ Personica hold the room until closing.",
        "Book ahead — it is the night the room fills fastest.",
      ],
    },
  },
  {
    slug: "mercredi-cocktail",
    kind: "weekly",
    day: "mercredi",
    time: "19h",
    photo: "lounge_detail",
    title: { fr: "Mercredi Cocktail", en: "Wednesday Cocktails" },
    when: { fr: "Tous les mercredis — dès 19h", en: "Every Wednesday — from 7pm" },
    summary: {
      fr: "Le rendez-vous du milieu de semaine : ambiance chic et cocktails soignés.",
      en: "The midweek fixture: a chic room and cocktails made properly.",
    },
    highlights: [
      { fr: "Cocktails", en: "Cocktails" },
      { fr: "Dès 19h", en: "From 7pm" },
      { fr: "DJ résidents", en: "Resident DJs" },
    ],
    lineup: ["DJ W", "DJ Personica"],
    body: {
      fr: [
        "Le mercredi casse la semaine. Ambiance chic, cocktails soignés et une sélection musicale signée DJ W et DJ Personica.",
        "C’est la soirée pour se détendre entre amis sans attendre le week-end.",
      ],
      en: [
        "Wednesday breaks the week up. A chic room, cocktails made properly, and a selection from DJ W and DJ Personica.",
        "The night to unwind with friends without waiting for the weekend.",
      ],
    },
  },
  {
    slug: "mardi-casino",
    kind: "weekly",
    day: "mardi",
    time: "19h",
    photo: "lounge_hero",
    title: { fr: "Mardi Casino", en: "Tuesday Casino" },
    when: { fr: "Tous les mardis — dès 19h", en: "Every Tuesday — from 7pm" },
    summary: {
      fr: "Tentez votre chance : musique, convivialité et un peu d’adrénaline.",
      en: "Try your luck: music, good company and a little adrenaline.",
    },
    highlights: [
      { fr: "Game night", en: "Game night" },
      { fr: "Dès 19h", en: "From 7pm" },
      { fr: "Entre amis", en: "Bring friends" },
    ],
    body: {
      fr: [
        "Le mardi, la salle se transforme en game night. Musique, convivialité et ce qu’il faut d’émotions autour des tables.",
        "Les portes ouvrent à 19h.",
      ],
      en: [
        "On Tuesdays the room turns into a game night. Music, good company, and enough drama around the tables to keep it interesting.",
        "Doors at 7pm.",
      ],
    },
  },
  {
    slug: "dimanche-veteran",
    kind: "weekly",
    day: "dimanche",
    time: "19h",
    photo: "food_pair",
    title: { fr: "Dimanche Vétéran", en: "Sunday Vétéran" },
    when: { fr: "Tous les dimanches — dès 19h", en: "Every Sunday — from 7pm" },
    summary: {
      // ✅ close paraphrase — « Les grands classiques ne vieillissent pas »
      fr: "Les grands classiques ne vieillissent pas.",
      en: "The classics don't age.",
    },
    highlights: [
      { fr: "Grands classiques", en: "The classics" },
      { fr: "Dès 19h", en: "From 7pm" },
      { fr: "Cuisine ouverte", en: "Kitchen open" },
    ],
    body: {
      fr: [
        "Le dimanche prend une autre saveur : les grands classiques, joués comme il faut, dans une salle qui ralentit un peu.",
        "La cuisine est ouverte — voir la carte.",
      ],
      en: [
        "Sunday has a different flavour: the classics, played properly, in a room that slows down a little.",
        "The kitchen is open — see the menu.",
      ],
    },
  },
  {
    slug: "after-work",
    kind: "weekly",
    day: "vendredi",
    /* Not one of the lounge frames: those are all either taken by another
       night or consent-blocked. `shippable()` would have dropped this event
       silently if it pointed at a blocked photo. */
    photo: "food_plate",
    title: { fr: "After Work", en: "After Work" },
    /* ⚠️ No start time claimed. FACTS.md has « chaque vendredi dès 16h » from a
       January 2026 Facebook post, but every other night has since drifted to
       19h and nothing recent restates Friday. Saying nothing is honest;
       guessing 16h or 19h is not. Confirm with the client. */
    when: { fr: "Tous les vendredis", en: "Every Friday" },
    summary: {
      fr: "On décompresse en fin de semaine, avant que la soirée ne commence vraiment.",
      en: "Winding down at the end of the week, before the night properly starts.",
    },
    highlights: [
      { fr: "Fin de semaine", en: "End of the week" },
      { fr: "Entre collègues", en: "After hours" },
      { fr: "Cuisine ouverte", en: "Kitchen open" },
    ],
    body: {
      fr: [
        "Le vendredi, on décompresse. L’after work du Glen se prend au comptoir ou en salon, avant que la soirée ne bascule.",
        "Horaire d’ouverture à confirmer — appelez-nous pour être sûr.",
      ],
      en: [
        "Friday is for winding down. The Glen's after work is taken at the bar or in the lounges, before the night tips over.",
        "Opening time to be confirmed — call to be sure.",
      ],
    },
  },
];

/** Events whose window is open right now AND whose photo is consent-cleared. */
export function activeEvents(now: Date): GlenEvent[] {
  const today = now.toISOString().slice(0, 10);
  return EVENTS.filter((e) => {
    if (e.from && today < e.from) return false;
    if (e.to && today > e.to) return false;
    return isCleared(e.photo);
  });
}

/**
 * Banner order: live one-offs first (they are the news), then the weeklies.
 * Within one-offs, soonest first.
 */
export function bannerEvents(now: Date): GlenEvent[] {
  const live = activeEvents(now);
  const oneOffs = live
    .filter((e) => e.kind === "one-off")
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  const weekly = live.filter((e) => e.kind === "weekly");
  return [...oneOffs, ...weekly];
}

/** Every event that has a page — including expired ones, so links never rot. */
export function allEventSlugs(): string[] {
  return EVENTS.map((e) => e.slug);
}

export function eventBySlug(slug: string): GlenEvent | null {
  return EVENTS.find((e) => e.slug === slug) ?? null;
}

/** True once a one-off's date has passed. Detail pages say so rather than lie. */
export function isPast(event: GlenEvent, now: Date): boolean {
  if (event.kind !== "one-off" || !event.date) return false;
  return now.toISOString().slice(0, 10) > event.date;
}

/** « samedi 23 août 2026 » / « Saturday 23 August 2026 ». */
export function formatEventDate(iso: string, lang: Lang): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );
}
