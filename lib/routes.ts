import { DEFAULT_LOCALE, isLang, type Lang } from "./i18n/config";

/**
 * Route table. Keys are stable internal ids; values are the localised path
 * segment for each language. Add a page here first, then build it — the
 * language switcher and the sitemap both read from this.
 *
 * Only routes that actually exist belong in this table; a stale entry becomes
 * a dead link in the switcher.
 */
export const ROUTES = {
  home: { fr: "", en: "" },
  carte: { fr: "carte", en: "menu" },
  evenements: { fr: "evenements", en: "events" },
  appartements: { fr: "appartements", en: "apartments" },
} as const satisfies Record<string, Record<Lang, string>>;

/** Every localised slug that is a real page, for `generateStaticParams`. */
export function staticSlugs(): { lang: Lang; slug: string }[] {
  return Object.values(ROUTES).flatMap((localised) =>
    (Object.entries(localised) as [Lang, string][])
      .filter(([, slug]) => slug !== "")
      .map(([lang, slug]) => ({ lang, slug }))
  );
}

/** Which route a localised slug belongs to, or null if it is not a page. */
export function routeIdFor(lang: Lang, slug: string): RouteId | null {
  for (const [id, localised] of Object.entries(ROUTES)) {
    if (localised[lang] === slug) return id as RouteId;
  }
  return null;
}

export type RouteId = keyof typeof ROUTES;

/** Build an absolute in-app path, e.g. href("home", "fr") → "/fr". */
export function href(id: RouteId, lang: Lang): string {
  const segment = ROUTES[id][lang];
  return segment ? `/${lang}/${segment}` : `/${lang}`;
}

/**
 * Map the current pathname onto its equivalent in `target`.
 *
 * Looks the path up in the route table so localised segments translate
 * (`/fr/appartements` → `/en/apartments`). Falls back to swapping the leading
 * locale segment, which is correct for any route whose segment is identical in
 * both languages and never produces a broken URL shape.
 */
export function swapLocale(pathname: string, target: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  const current = parts[0];

  if (!current || !isLang(current)) {
    return `/${target}`;
  }

  const [head, ...tail] = parts.slice(1);
  if (!head) return `/${target}`;

  /* Translate the LEADING section segment and keep whatever follows it.
     Matching the whole remainder instead would leave a deeper path on its old
     locale — `/fr/evenements/bal-des-veterans-2026` became
     `/en/evenements/bal-des-veterans-2026`, which 404s, because the table has
     no entry for the section-plus-slug pair. Event slugs are language-neutral
     by design, so only the head needs swapping. */
  for (const localised of Object.values(ROUTES)) {
    if (localised[current as Lang] === head) {
      const swapped = localised[target];
      const segs = swapped ? [swapped, ...tail] : tail;
      return segs.length ? `/${target}/${segs.join("/")}` : `/${target}`;
    }
  }

  return `/${target}/${[head, ...tail].join("/")}`;
}

export { DEFAULT_LOCALE };
