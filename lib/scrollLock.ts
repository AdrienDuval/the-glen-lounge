/**
 * Refcounted page scroll lock.
 *
 * Two things lock the page independently — the boot preloader and the mobile
 * nav drawer — and both used to write the same two globals directly
 * (`body.style.overflow` + `__lenis.stop()/start()`). Booleans have no notion
 * of ownership, so whichever released last clobbered the other: closing the
 * drawer during boot unlocked the page behind the preloader, and the preloader
 * finishing unlocked it behind an open drawer. (Adversarial review finding.)
 *
 * A count fixes both directions: the page unlocks only when every holder has
 * released, and double-release by one holder is the caller's bug to avoid
 * (keep a local `released` flag).
 */

let locks = 0;

export function lockScroll(): void {
  if (++locks === 1) {
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
  }
}

export function unlockScroll(): void {
  if (locks > 0 && --locks === 0) {
    document.body.style.overflow = "";
    window.__lenis?.start();
  }
}

/** For late initialisers (Lenis mounts after the preloader takes its lock). */
export function scrollLocked(): boolean {
  return locks > 0;
}
