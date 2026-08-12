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
  /**
   * The photograph is not this venue, and the slide says so on screen.
   *
   * This is the ONLY way a `origin: "placeholder"` image gets past the gate in
   * `activeSlides()` — declaring it here is what makes the hero render the
   * « Image d'illustration » caption, so the flag and the disclosure cannot
   * drift apart. Do not set it on a real venue photograph to "be safe": the
   * caption is a claim about the picture, and a false one devalues it on the
   * slide that genuinely needs it.
   */
  illustrative?: boolean;
  from?: string;
  to?: string;
};

/** Slides that are NOT events — standing promos for the venue's services. */
const PROMOS: Slide[] = [
  /* The apartments. `lead: true` puts this ahead of the event slides: the
     studios are the highest-value thing the site sells and until now the banner
     offered no route to them at all.

     ── THE PHOTOGRAPH, 2026-08-12 ────────────────────────────────────────────
     `ss140_salon` — a real room in the real building, so no caption is owed.

     Two earlier versions, kept as a record of why this one is right. First
     `exterior_day` (the actual building, but an overcast phone snapshot), then
     `studio_hero`: a handsome stock European interior that was NOT this venue
     and therefore had to carry `illustrative: true` and an « image
     d'illustration » notice on the one indexed page of the site.

     Both compromises are now unnecessary. The client sent photographs of SS101
     and SS140-A, so the slide can show an actual Glen apartment that also
     happens to be the best-looking frame we hold. `illustrative` is gone from
     this slide — it is a claim about the picture, and it would now be false.

     Every word below is FACTS.md-traceable (« meublé haut standing »,
     « disponibilité 24h/24, tous les jours », « Confort, sécurité, intimité »,
     eleven units confirmed by the client 2026-08-09). No rate, no unit type —
     both are still open questions, and « luxe » is ruled out twice over.

     ⚠️ « onze studios » stays, and it is deliberately NOT the number the
     studios index now shows. Eleven is what the venue has (FACTS.md, client
     2026-08-09); two is what we can document well enough to list. Advertising
     the true inventory here while only detailing what we can stand behind is
     the intended split — do not "fix" one to match the other.

     Deliberately NOT here: where the studios are. « au-dessus du lounge » was
     in the first draft of this slide and came out again — FACTS.md records the
     address the three businesses share and nothing about a vertical
     relationship, and the unit-code prefixes (ST/B/A/SS) read more like several
     blocks than one staircase. Co-location is sourced; stacking is not. */
  {
    id: "appartements",
    kind: "image",
    photo: "ss140_salon",
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
     the one surface that had nowhere to put the « illustration » notice. The
     manifest promises placeholders can only reach a page that asks for them by
     name; this is the gate that makes that true here.

     Since 2026-08-11 the hero HAS somewhere to put the notice, so the rule is
     no longer "no placeholders" but "no UNDISCLOSED placeholders": a slide may
     carry one if, and only if, it sets `illustrative`, which is the same flag
     that renders the caption. A placeholder without it is still dropped.

     Note this gate reads the SLIDE's flag against the PHOTO's origin, so it
     also catches the inverse mistake — a slide that claims `illustrative` over
     a genuine photograph of the venue is a false disclosure, and is dropped
     too rather than quietly captioning the real building as somewhere else. */
  const usable = (id: PhotoId | undefined, illustrative = false) =>
    id !== undefined && isCleared(id) && isPlaceholder(id) === illustrative;

  const promos = PROMOS.filter((s) => {
    if (s.from && today < s.from) return false;
    if (s.to && today > s.to) return false;
    const flag = s.illustrative === true;
    return s.kind === "image"
      ? usable(s.photo, flag)
      : s.poster
        ? usable(s.poster, flag)
        : true;
  });

  /* Lead promos first, then the dated programme, then the standing rest. */
  return [
    ...promos.filter((s) => s.lead),
    ...fromEvents,
    ...promos.filter((s) => !s.lead),
  ];
}
