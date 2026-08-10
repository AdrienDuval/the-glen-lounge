"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { PHOTOS, shippable, type PhotoId } from "@/lib/photos";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./Lieu.module.css";

/**
 * « Le lieu » — the pinned horizontal gallery, the signature move of the page.
 *
 * Three layers of motion while pinned, all scrub-driven so they cost nothing
 * when the page is still:
 *   - the track translates against the scroll (the band itself);
 *   - each image drifts a few percent inside its frame via containerAnimation
 *     (parallax against the band — what makes it feel dimensional);
 *   - the counter and progress hairline report where you are.
 *
 * Below 900px there is no pin: native snap scroll, captions still present.
 * The cards contain no focusable children, so there is no keyboard trap.
 */

type Card = { id: PhotoId; caption: { fr: string; en: string } };

/* Requested order. `shippable()` drops anything not consent-cleared, so a
   blocked photograph cannot reach the band by being listed here. */
const CARDS: readonly Card[] = [
  { id: "lounge_detail", caption: { fr: "Les salons", en: "The lounges" } },
  { id: "bar_monogram", caption: { fr: "Le bar", en: "The bar" } },
  { id: "lounge_sofa", caption: { fr: "Banquettes & marbre", en: "Marble & banquettes" } },
  { id: "lounge_hero", caption: { fr: "Le grand salon", en: "The main room" } },
  { id: "food_plate", caption: { fr: "La cuisine", en: "From the kitchen" } },
  { id: "events_table", caption: { fr: "Les grandes tablées", en: "Private dining" } },
];

export default function Lieu({ lang, dict }: { lang: Lang; dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const cards = CARDS.filter((c) => shippable([c.id]).length);
  const total = cards.length;
  const fmt = (n: number) => String(n).padStart(2, "0");

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      /* Reveals — every width, motion-safe only. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const h2 = titleRef.current;
        if (h2) {
          SplitText.create(h2, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.15,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: { trigger: h2, start: "top 82%", once: true },
                onComplete: () => self.revert(),
              }),
          });
        }

        gsap.from(section.querySelectorAll("[data-reveal]"), {
          y: 28,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });

        const frames = gsap.utils.toArray<HTMLElement>(".frame", track);
        gsap.from(frames, {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });

        gsap.from(track.querySelectorAll("figcaption"), {
          y: 14,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
      });

      /* Desktop only: pinned horizontal scrub. */
      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          track.classList.add(styles.trackPinned);
          const distance = () => track.scrollWidth - window.innerWidth;

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (fillRef.current) {
                  fillRef.current.style.width = (self.progress * 100).toFixed(2) + "%";
                }
                if (countRef.current && total > 0) {
                  const idx = Math.min(
                    total,
                    Math.max(1, Math.round(self.progress * (total - 1)) + 1)
                  );
                  countRef.current.textContent = `${fmt(idx)} / ${fmt(total)}`;
                }
              },
            },
          });

          /* Parallax: each image drifts inside its frame as its card crosses
             the viewport. `containerAnimation` ties the trigger to the
             horizontal tween instead of the vertical page scroll. */
          gsap.utils.toArray<HTMLElement>(`.${styles.para}`, track).forEach((el) => {
            gsap.fromTo(
              el,
              { xPercent: -4 },
              {
                xPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: el.closest("figure"),
                  containerAnimation: tween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          });

          return () => {
            track.classList.remove(styles.trackPinned);
            if (fillRef.current) fillRef.current.style.width = "0%";
            if (countRef.current) countRef.current.textContent = `01 / ${fmt(total)}`;
          };
        }
      );

      /* Wherever the pin is NOT running, the band is a native snap-scroller —
         and the progress hairline and counter were driven only from the pinned
         ScrollTrigger's onUpdate. So on every phone they sat frozen at 0% and
         « 01 / 06 » while you scrolled through all six cards. Same formula as
         the pinned branch, fed from scrollLeft instead of scrub progress. */
      const wireNativeProgress = () => {
        const report = () => {
          const max = track.scrollWidth - track.clientWidth;
          const p = max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0;
          if (fillRef.current) {
            fillRef.current.style.width = (p * 100).toFixed(2) + "%";
          }
          if (countRef.current && total > 0) {
            const idx = Math.min(
              total,
              Math.max(1, Math.round(p * (total - 1)) + 1)
            );
            countRef.current.textContent = `${fmt(idx)} / ${fmt(total)}`;
          }
        };

        track.addEventListener("scroll", report, { passive: true });
        window.addEventListener("resize", report);
        report();

        return () => {
          track.removeEventListener("scroll", report);
          window.removeEventListener("resize", report);
          if (fillRef.current) fillRef.current.style.width = "0%";
          if (countRef.current) countRef.current.textContent = `01 / ${fmt(total)}`;
        };
      };

      /* The exact complement of the pin's own query. */
      mm.add("(max-width: 899.98px)", wireNativeProgress);
      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: reduce)",
        wireNativeProgress
      );
    },
    { scope: sectionRef }
  );

  if (!total) return null;

  return (
    <section id="lieu" ref={sectionRef} className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className="label label--gold" data-reveal>
            {dict.lieu.section}
          </p>
          <h2 ref={titleRef} className={styles.title}>
            {dict.lieu.title}
          </h2>
        </div>
        <p className={styles.lede} data-reveal>
          {dict.lieu.lede}
        </p>
      </div>

      {/* tabIndex: wherever the pin is not active (reduced motion, <900px,
          Safari) this is a native scroller with hidden scrollbars and no
          focusable children — without a tab stop, keyboard users can never
          reach the off-screen photos. WCAG 2.1.1. (Review finding.) */}
      <div
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        role="region"
        aria-label={dict.lieu.title}
      >
        {cards.map((card, i) => {
          const photo = PHOTOS[card.id];
          return (
            <figure key={card.id} className={styles.card}>
              {/* The photo's own ratio travels as a custom property rather
                  than as `aspect-ratio` directly: an inline aspect-ratio
                  cannot be overridden by a media query, and the mobile band
                  needs a different rule from the pinned desktop one. */}
              <div
                className={`frame ${styles.media}`}
                style={{ "--card-ar": `${photo.w} / ${photo.h}` } as CSSProperties}
              >
                <div className={styles.para}>
                  <Image
                    src={photo.src}
                    alt={photo.alt[lang]}
                    fill
                    sizes="(max-width: 900px) 86vw, 44rem"
                    quality={72}
                  />
                </div>
              </div>
              <figcaption className={styles.cap}>
                <span className={`label ${styles.capIndex}`}>{fmt(i + 1)}</span>
                <span className={`label ${styles.capText}`}>{card.caption[lang]}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span className="label" data-reveal>
          {dict.lieu.hint}
        </span>
        <div className={styles.progress} aria-hidden="true">
          <div ref={fillRef} className={styles.progressFill} />
        </div>
        <span ref={countRef} className={`label ${styles.count}`} aria-hidden="true">
          01 / {fmt(total)}
        </span>
      </div>
    </section>
  );
}
