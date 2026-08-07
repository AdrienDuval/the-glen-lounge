"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollLocked } from "@/lib/scrollLock";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Mounts Lenis once and drives it from the GSAP ticker rather than its own
 * rAF loop — one clock for both, so ScrollTrigger never reads a scroll
 * position from a frame GSAP has not rendered yet.
 *
 * `window.__lenis` is deliberately public: the Preloader stops/starts it, the
 * nav anchors scroll through it, and the screenshot tooling jumps the page
 * with `scrollTo(y, { immediate: true })` (see CLAUDE.md).
 */
export default function SmoothScroll() {
  useEffect(() => {
    /* Reduced motion gets native scrolling — Lenis is momentum, which is
       exactly what the preference asks us to drop. Everything that talks to
       __lenis already branches on it being undefined. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.__lenis = lenis;

    /* The preloader takes its scroll lock in a layout effect, BEFORE this
       passive effect creates Lenis — honour any lock already held. Replaces
       the old delayedCall workaround in the preloader. */
    if (scrollLocked()) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
