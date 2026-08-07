import type { PhotoId } from "./photos";
import { isCleared } from "./photos";
import { bannerEvents } from "./events";

/**
 * « À l'affiche » — the hero banner.
 *
 * This is now a thin derivation layer, not a second list. Slides come from
 * `lib/events.ts`, so adding an event gives you the slide, the index card and
 * the detail page in one edit. The only thing declared here is the handful of
 * standing promos that are not events (private hire), plus the shape the hero
 * consumes.
 *
 * Slides carry their own date window, which is what stops a promotion sitting
 * there stale in March — the failure mode every venue site has.
 *
 * This is also shaped the way a CMS would deliver it: when the venue wants to
 * edit it themselves, a git-based CMS can populate exactly this with no
 * component changes. See CONTRACT.md.
 */

type L = { fr: string; en: string };

export type Slide = {
  id: string;
  kind: "image" | "video";
  photo?: PhotoId;
  /** kind: "video" — a path under /public. Poster comes from the manifest. */
  video?: string;
  poster?: PhotoId;
  /** "poster" shows event artwork whole rather than cropping it full-bleed. */
  layout?: "cover" | "poster";
  eyebrow: L;
  title: L;
  meta: L;
  /** Up to three key facts, rendered as chips so they survive a busy photo. */
  highlights?: L[];
  /** When set, the slide gets a « Voir le détail » link to that event page. */
  eventSlug?: string;
  /** Extra action. `href` is used as-is (anchor or tel:). */
  cta?: { label: L; href: string };
  from?: string;
  to?: string;
};

/** Slides that are NOT events — standing promos for the venue's services. */
const PROMOS: Slide[] = [
  {
    id: "privatisation",
    kind: "image",
    photo: "events_table",
    eyebrow: { fr: "Privatisation", en: "Private hire" },
    title: { fr: "Vos événements", en: "Your events" },
    meta: {
      fr: "Cérémonies, anniversaires, réunions, mariages. Nous dressons la salle, vous choisissez vos bouteilles.",
      en: "Ceremonies, birthdays, meetings, weddings. We lay the room out; you choose the bottles.",
    },
    highlights: [
      { fr: "Salle dressée", en: "Room dressed" },
      { fr: "Service bouteilles", en: "Bottle service" },
      { fr: "Sur devis", en: "On request" },
    ],
    cta: {
      label: { fr: "Organiser un événement", en: "Plan an event" },
      href: "#evenements",
    },
  },
];

/**
 * Slides live at this instant, in banner order.
 *
 * `now` is injected rather than read from the clock so the caller decides — a
 * server component passes build time, tests pass a fixed date. Anything whose
 * photograph is not consent-cleared is dropped, so the gate cannot be bypassed
 * by adding a slide.
 */
export function activeSlides(now: Date): Slide[] {
  const today = now.toISOString().slice(0, 10);

  const fromEvents: Slide[] = bannerEvents(now).map((e) => ({
    id: e.slug,
    kind: "image",
    photo: e.photo,
    layout: e.layout ?? "cover",
    eyebrow: e.when,
    title: e.title,
    meta: e.summary,
    highlights: e.highlights,
    eventSlug: e.slug,
  }));

  const promos = PROMOS.filter((s) => {
    if (s.from && today < s.from) return false;
    if (s.to && today > s.to) return false;
    if (s.kind === "image") return s.photo ? isCleared(s.photo) : false;
    return s.poster ? isCleared(s.poster) : true;
  });

  return [...fromEvents, ...promos];
}
