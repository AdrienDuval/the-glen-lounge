import type { PhotoId } from "./photos";
import { isCleared, isPlaceholder } from "./photos";
import type { RouteId } from "./routes";
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
  /**
   * Extra action.
   *
   * `href` is emitted verbatim, so it is only safe for things that are the same
   * in both languages — an anchor, a `tel:`, an external URL. An in-app path
   * written here would be wrong in one of the two locales AND would navigate as
   * a full page reload, because it renders as an `<a>` and not a `Link`.
   *
   * For an in-app destination use `route` instead: the hero resolves it through
   * `href(route, lang)` and renders a real `Link`.
   */
  cta?: { label: L } & (
    | { route: RouteId; href?: never }
    | { href: string; route?: never }
  );
  /**
   * Put this promo before the events rather than after them. Reserved for the
   * standing offers the venue most wants sold — currently only the apartments,
   * which are the highest-value thing on the site and were previously reachable
   * from the banner not at all.
   */
  lead?: boolean;
  from?: string;
  to?: string;
};

/** Slides that are NOT events — standing promos for the venue's services. */
const PROMOS: Slide[] = [
  /* The apartments. `lead: true` puts this ahead of the event slides: the
     studios are the highest-value thing the site sells and until now the banner
     offered no route to them at all.

     `exterior_day` and not one of the `studio_*` frames on purpose — those are
     placeholders of a different building, and the hero has nowhere to put the
     « image d'illustration » caption they oblige. This one is the actual
     Glen: signage at street level, three floors of apartment balconies above,
     which is the « Restaurant Appartement » pitch in a single honest frame.

     Every word below is FACTS.md-traceable (« meublé haut standing »,
     « disponibilité 24h/24, tous les jours », « Confort, sécurité, intimité »,
     eleven units confirmed by the client 2026-08-09). No rate, no unit type —
     both are still open questions, and « luxe » is ruled out twice over.

     Deliberately NOT here: where the studios are. « au-dessus du lounge » was
     in the first draft of this slide and came out again — FACTS.md records the
     address the three businesses share and nothing about a vertical
     relationship, the unit-code prefixes (ST/B/A/SS) read more like several
     blocks than one staircase, and `lib/apartments.ts` has ST005-A on the
     ground floor. Co-location is sourced; stacking is not. */
  {
    id: "appartements",
    kind: "image",
    photo: "exterior_day",
    lead: true,
    eyebrow: { fr: "Appartements", en: "Apartments" },
    title: { fr: "Dormir sur place", en: "Stay the night" },
    meta: {
      fr: "Glen Appartement — onze studios meublés haut standing, disponibles 24h/24. Confort, sécurité, intimité.",
      en: "Glen Appartement — eleven studios furnished to a high standard, available around the clock. Comfort, security, privacy.",
    },
    highlights: [
      { fr: "11 studios", en: "11 studios" },
      { fr: "Meublé", en: "Furnished" },
      { fr: "24h/24", en: "24/7" },
    ],
    cta: {
      label: { fr: "Voir les studios", en: "View the studios" },
      route: "appartements",
    },
  },
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

  /* Consent AND provenance. `isCleared` alone was a hole: every `studio_*`
     placeholder is `consent: "clear"`, so a photograph of a building that is
     not this venue could have sailed into the home-page hero uncaptioned —
     the one surface with nowhere to put the « illustration » notice. The
     manifest promises placeholders can only reach a page that asks for them by
     name; this is the gate that makes that true here. */
  const usable = (id: PhotoId | undefined) =>
    id !== undefined && isCleared(id) && !isPlaceholder(id);

  const promos = PROMOS.filter((s) => {
    if (s.from && today < s.from) return false;
    if (s.to && today > s.to) return false;
    return s.kind === "image" ? usable(s.photo) : s.poster ? usable(s.poster) : true;
  });

  /* Lead promos first, then the dated programme, then the standing rest. */
  return [
    ...promos.filter((s) => s.lead),
    ...fromEvents,
    ...promos.filter((s) => !s.lead),
  ];
}
