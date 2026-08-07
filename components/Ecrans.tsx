"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PHOTOS, shippable } from "@/lib/photos";
import type { PhotoId } from "@/lib/photos";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Ecrans.module.css";

/**
 * Giant screens. The fixture board carries the evergreen claim (header is the
 * venue's own flyer line « EN LIVE SUR NOS ECRANS », rows are competitions it
 * has verifiably screened, undated); below it, the venue's own match flyers —
 * published at the client's decision, 2026-08-07 (lib/photos.ts, ASSETS.md) —
 * run as a drag carousel labelled as the archive of past soirées match.
 *
 * The carousel is Embla (embla-carousel-react, ~8 KB headless): free drag
 * with momentum, snap-aligned buttons, progress hairline. Deliberately a
 * different vocabulary from « Le lieu » — that band is pinned and scrubbed by
 * the page scroll (the signature move); this one is hand-driven. Embla owns
 * only horizontal drag, so it never fights Lenis for the wheel.
 *
 * Motion notes: there is no autoplay — every movement is user-initiated, so
 * the carousel itself needs no reduced-motion branch. The card hover lift and
 * the entrance reveals are gated in CSS / useSectionMotion as usual.
 *
 * The one actual photograph of a screen with a match on it stays blocked on
 * consent (PHOTOS.events_03).
 */

/** Chronological by the night they advertised. */
const FLYER_IDS: readonly PhotoId[] = [
  "sport_cl_newcastle",
  "sport_cl_demi",
  "sport_el_clasico",
  "sport_wc_3eme",
  "sport_wc_finale",
];

export default function Ecrans({ lang, dict }: { lang: Lang; dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  const flyers = shippable(FLYER_IDS);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: true,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const fillRef = useRef<HTMLSpanElement>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    /* The hairline mirrors drag position directly — writing a transform in
       rAF-driven events is cheaper than a React state round-trip per frame. */
    const onScroll = () => {
      const fill = fillRef.current;
      if (fill) {
        const p = Math.min(1, Math.max(0, emblaApi.scrollProgress()));
        fill.style.transform = `scaleX(${p})`;
      }
    };

    onSelect();
    onScroll();
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onScroll);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="label label--gold" data-reveal>
            {dict.ecrans.section}
          </p>
          <div className={`rule ${styles.rule}`} data-rule />
          <h2 ref={titleRef} className={styles.title}>
            {dict.ecrans.title}
          </h2>
          <p className={styles.lede} data-reveal>
            {dict.ecrans.lede}
          </p>
        </div>

        <div className={styles.board} data-reveal>
          <div className={styles.boardHead}>
            <span className="label label--gold">{dict.ecrans.boardTitle}</span>
            <span className={`label ${styles.live}`}>
              <span className={styles.dot} aria-hidden="true" />
              {dict.ecrans.boardLive}
            </span>
          </div>
          <ul className={styles.rows}>
            {dict.ecrans.boardRows.map((row) => (
              <li key={row} className={styles.row}>
                <span className={styles.bullet} aria-hidden="true">
                  ◆
                </span>
                {row}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {flyers.length > 0 && (
        <div className={`shell ${styles.galleryBlock}`}>
          <div className={styles.galleryHead} data-reveal>
            <p className={`label ${styles.galleryLabel}`}>
              {dict.ecrans.galleryLabel}
            </p>
            <div className={styles.galleryNav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label={dict.ecrans.galleryPrev}
              >
                ←
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={scrollNext}
                disabled={!canNext}
                aria-label={dict.ecrans.galleryNext}
              >
                →
              </button>
            </div>
          </div>

          <div className={styles.viewport} ref={emblaRef}>
            <ul className={styles.gallery}>
              {flyers.map((id) => {
                const flyer = PHOTOS[id];
                return (
                  <li
                    key={id}
                    className={styles.card}
                    style={{ aspectRatio: `${flyer.w} / ${flyer.h}` }}
                  >
                    <div className={`frame ${styles.cardFrame}`}>
                      <Image
                        src={flyer.src}
                        alt={flyer.alt[lang]}
                        fill
                        sizes="(max-width: 860px) 66vw, 22rem"
                        quality={72}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span ref={fillRef} className={styles.progressFill} />
          </div>
        </div>
      )}
    </section>
  );
}
