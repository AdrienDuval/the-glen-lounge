import { fr } from "./fr";
import { en } from "./en";
import type { Lang } from "./config";
import type { Dict } from "./fr";

const DICTS: Record<Lang, Dict> = { fr, en };

/** Synchronous — the dictionaries are small and statically imported. */
export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

export type { Dict };
export * from "./config";
