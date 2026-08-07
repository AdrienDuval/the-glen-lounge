/**
 * Bilingual routing. French is the primary language: `/` redirects to `/fr`
 * (see next.config.ts) and `/fr` is the hreflang x-default.
 *
 * URLs are symmetric — `/fr/appartements` and `/en/apartments` — so neither
 * language is a second-class citizen in the routing table, and canonical +
 * alternates stay mechanical rather than hand-maintained.
 */
export const LOCALES = ["fr", "en"] as const;

export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Lang = "fr";

/** BCP 47 tags for <html lang> and Open Graph locale fields. */
export const HTML_LANG: Record<Lang, string> = {
  fr: "fr-CM",
  en: "en",
};

export const OG_LOCALE: Record<Lang, string> = {
  fr: "fr_CM",
  en: "en_US",
};

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}
