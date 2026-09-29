/**
 * Menu photography manifest — the one file to edit when real product photos
 * arrive from the venue's `serveur` app (or from a shoot).
 *
 * Why a separate manifest from `lib/photos.ts`:
 *   `lib/photos.ts` is the curated *site* library (the room, the studios,
 *   events). The menu needs a mapping from a DISH or a SECTION to an image,
 *   and most of those images do not exist yet. Keeping that mapping here means
 *   the redesigned page can render image-forward where a consented photo
 *   exists and fall back to clean typography where one does not — without a
 *   single invented picture reaching the page.
 *
 * ── HOW TO ADD A REAL PRODUCT PHOTO ─────────────────────────────────────────
 *   1. Drop the file in `public/photos/menu/` (the scraper writes here).
 *   2. Add an entry to `DISH_PHOTO` keyed by the dish's EXACT `name` as it
 *      appears in `lib/menu.ts`, or to `SECTION_PHOTO` keyed by the section id.
 *   3. Give it measured `w`/`h` and honest bilingual `alt`.
 *   4. Leave `illustration` unset for a real photograph of the real dish. Set
 *      it `true` ONLY for stand-in/illustrative imagery — the card then renders
 *      an « Image d'illustration » caption, per CONTRACT.md and ASSETS.md.
 *
 * Nothing here is invented: an entry exists only when a real, consented file
 * backs it. Sections and dishes without an entry render text-first, by design.
 */

import { PHOTOS } from "./photos";

export type MenuPhoto = {
  src: string;
  /** Measured, not guessed. */
  w: number;
  h: number;
  alt: { fr: string; en: string };
  /**
   * `true` marks a stand-in or illustrative image (not a photograph of this
   * exact dish). Forces the « Image d'illustration » caption. Real photographs
   * of the real plate leave this unset.
   */
  illustration?: boolean;
};

/**
 * Section-level feature images. Keyed by `MenuSection.id` from `lib/menu.ts`.
 *
 * Today only two real food photographs exist (`food-01`, `food-02-crop`), both
 * plated mains. They sit at section level with their own honest alt text rather
 * than being passed off as a specific named dish. The rest wait for the shoot.
 */
export const SECTION_PHOTO: Partial<Record<string, MenuPhoto>> = {
  viandes: {
    src: PHOTOS.food_plate.src,
    w: PHOTOS.food_plate.w,
    h: PHOTOS.food_plate.h,
    alt: PHOTOS.food_plate.alt,
  },
  "produits-de-mer": {
    src: PHOTOS.food_pair.src,
    w: PHOTOS.food_pair.w,
    h: PHOTOS.food_pair.h,
    alt: PHOTOS.food_pair.alt,
  },
};

/**
 * Dish-level images. Keyed by the EXACT `MenuItem.name` in `lib/menu.ts`.
 * Empty until real per-dish photography arrives (the `serveur` scrape fills
 * this). Add entries here and the matching dish upgrades to an image card
 * automatically — no change to the component.
 */
export const DISH_PHOTO: Record<string, MenuPhoto> = {
  // e.g. "Poulet DG — entier": { src: "/photos/menu/poulet-dg.jpg", w: 1600, h: 1200, alt: { fr: "…", en: "…" } },
};

/**
 * The bar image for the drinks teaser. The venue's OWN cocktail promo flyer —
 * `consent: "promo"` in `lib/photos.ts`, so it ships. It is real venue artwork,
 * not a stand-in, so no illustration caption.
 */
export const DRINKS_PHOTO: MenuPhoto = {
  src: PHOTOS.event_mercredi_cocktail.src,
  w: PHOTOS.event_mercredi_cocktail.w,
  h: PHOTOS.event_mercredi_cocktail.h,
  alt: PHOTOS.event_mercredi_cocktail.alt,
};

/** Convenience: does this section or any of its dishes have a photo? */
export function sectionHasImagery(
  sectionId: string,
  itemNames: string[]
): boolean {
  if (SECTION_PHOTO[sectionId]) return true;
  return itemNames.some((n) => DISH_PHOTO[n]);
}
