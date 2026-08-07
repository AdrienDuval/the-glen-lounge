"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import Monogram from "./Monogram";
import type { Dict } from "@/lib/i18n";
import styles from "./Preloader.module.css";

/**
 * Boot sequence and the page's motion gate.
 *
 * Three signals fire together, at the START of the exit slide, so the hero
 * entrance plays underneath the panel rather than after it:
 *
 *   1. `document.documentElement.dataset.loaded = "1"`  — state, for late mounts
 *   2. `window` event `glen:loaded`                      — the trigger
 *   3. `window.__lenis.start()`                          — scroll released
 *
 * Anything that wants to animate on entry must handle BOTH: check the dataset
 * flag first (it may already be "1" if the component mounted late or the user
 * navigated client-side), and only then subscribe to the event.
 */
export default function Preloader({ dict }: { dict: Dict }) {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      /* Take the refcounted scroll lock while the panel owns the viewport.
         SmoothScroll mounts Lenis AFTER this layout effect and checks
         scrollLocked() itself, so the old delayedCall deferral is gone — and
         the drawer holding its own lock can no longer be clobbered by us,
         nor we by it. (Adversarial review finding.) */
      lockScroll();
      let released = false;
      const release = () => {
        if (!released) {
          released = true;
          unlockScroll();
        }
      };

      const finish = () => {
        document.documentElement.dataset.loaded = "1";
        window.dispatchEvent(new CustomEvent("glen:loaded"));
        release();
      };

      const fmt = (v: number) => String(Math.round(v)).padStart(2, "0");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* The component stays mounted (rendering null) after boot, so a
           motion-preference flip re-runs this callback — never replay the
           sequence against unmounted refs once the page has loaded. */
        if (document.documentElement.dataset.loaded === "1") {
          setDone(true);
          return;
        }

        const counter = { v: 0 };
        const tl = gsap.timeline();

        /* The mark arrives first and its backlight blooms with it — the venue's
           own « G » is back-illuminated, so the glow is the mark, not a shadow. */
        tl.from(
          markRef.current,
          { scale: 0.68, opacity: 0, duration: 1.2, ease: "expo.out" },
          0
        )
          .fromTo(
            markRef.current,
            { "--mono-glow": 0 },
            { "--mono-glow": 1, duration: 1.5, ease: "power2.out" },
            0.1
          )
          /* The wordmark resolves out of wide tracking — the signage settling. */
          .from(
            wordRef.current,
            {
              letterSpacing: "0.55em",
              opacity: 0,
              duration: 1.2,
              ease: "expo.out",
            },
            0.35
          )
          .from(
            descRef.current,
            { y: 14, opacity: 0, duration: 0.9, ease: "expo.out" },
            0.6
          )
          .to(
            counter,
            {
              v: 100,
              duration: 1.6,
              ease: "power2.inOut",
              onUpdate: () => {
                if (numRef.current) numRef.current.textContent = fmt(counter.v);
              },
            },
            0.35
          )
          .to(
            fillRef.current,
            { width: "100%", duration: 1.6, ease: "power2.inOut" },
            0.35
          )
          /* 0.25 s hold, then the panel leaves. Signals fire as it starts. */
          .to(rootRef.current, {
            yPercent: -101,
            duration: 0.9,
            ease: "power4.inOut",
            delay: 0.25,
            onStart: finish,
          })
          .add(() => setDone(true));
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Same guard: a preference flip after boot must not re-fire finish().
        if (document.documentElement.dataset.loaded === "1") {
          setDone(true);
          return;
        }
        // No animation: signal immediately and get out of the way.
        finish();
        setDone(true);
      });

      return () => {
        // Safety: never leave our lock held if we unmount early. Idempotent —
        // a normal finish() already released it.
        release();
      };
    },
    { scope: rootRef }
  );

  if (done) return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.mark}>
          <div ref={markRef} className={styles.markInner}>
            <Monogram size={112} />
          </div>
        </div>

        <p ref={wordRef} className={styles.wordmark}>
          Glen Lounge
        </p>

        <p ref={descRef} className={`label ${styles.descriptor}`}>
          {dict.preloader.descriptor}
        </p>
      </div>

      <div className={styles.foot}>
        <div className={styles.track}>
          <div ref={fillRef} className={styles.fill} />
        </div>
        <div className={styles.row}>
          <span className="label">{dict.preloader.loading}</span>
          <span ref={numRef} className={styles.counter}>
            00
          </span>
        </div>
      </div>

      {/* Without JS the overlay would never exit — remove it entirely. */}
      <noscript>
        <style>{`.${styles.root}{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
