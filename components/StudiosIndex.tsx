"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PHOTOS } from "@/lib/photos";
import {
  availableStudios,
  filterStudios,
  NO_FILTER,
  STUDIOS,
  STUDIO_HERO,
  type StudioFilter,
} from "@/lib/apartments";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import StudioCard, {
  INDEX_FEATURE_SIZES,
  INDEX_GRID_SIZES,
} from "./StudioCard";
import StudioFilters from "./StudioFilters";
import styles from "./StudiosIndex.module.css";

/**
 * The studios index.
 *
 * Composed as a magazine spread rather than a list: a full-bleed opening frame
 * with the count set into it, then the first unit given a wide editorial card
 * and the rest in a grid. The earlier version put eleven identical cards on a
 * black page and read like a stock table.
 *
 * Every card is a documented unit with its own photographs (2026-08-12). The
 * nine placeholder listings and the notice that used to sit above the grid are
 * both gone — see the header of `lib/apartments.ts` for what was removed and
 * why, and note that the venue still HAS eleven units; we can only describe the
 * ones we hold photographs and answers for.
 *
 * The tally is therefore labelled « studios présentés » rather than « studios »,
 * and the heading no longer counts them: the lede states the building's eleven
 * as a fact about the property, and the grid shows what we can stand behind.
 * An accurate small number beats eleven listings a visitor cannot rely on.
 *
 * ── THE FILTER, 2026-09-07 ──────────────────────────────────────────────────
 * The grid now lists TWO PRODUCTS — seven furnished units let by the night and
 * A40, an unfurnished flat let by the month — so it is filterable on both axes
 * a visitor actually asks about: what kind of place it is, and whether it is
 * furnished. The state lives here rather than in `StudioFilters`, because this
 * is what has to render from it; see that file for the rest of the reasoning.
 */
export default function StudiosIndex({
  lang,
  dict,
}: {
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  useSectionMotion(gridRef);

  const base = href("appartements", lang);
  /* The wide banner plate. Now SS140-A's salon — a room in this building —
     where it used to be a stock European interior that needed a caption. */
  const hero = PHOTOS[STUDIO_HERO];
  const free = availableStudios().length;
  const t = dict.studios;

  const [filter, setFilter] = useState<StudioFilter>(NO_FILTER);
  const shown = filterStudios(filter);
  /* The wide editorial card goes to the first unit OF THE CURRENT VIEW, not to
     `STUDIOS[0]` — so filtering to « Chambres » features A10-2 rather than
     leaving the feature slot empty or showing a unit the filter excludes.
     Unfiltered, this is still SS101, exactly as before.

     ⚠️ `shown` CAN BE EMPTY IN PRINCIPLE, so this destructure can yield
     `undefined`. Guarded at the render below rather than asserted — the
     zero-count chips are disabled, which makes an empty view unreachable
     today, and that invariant should not be load-bearing. */
  const [featured, ...restStudios] = shown;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* The opening frame drifts against the scroll — the one move that makes
           a static photograph feel like a room you are walking into. Small on
           purpose: 12% over the whole band, not a parallax fairground. */
        const img = heroRef.current?.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        /* The masthead lifts in under the preloader hand-off. */
        gsap.from(`.${styles.heroCopy} > *`, {
          y: 34,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.25,
        });

        /* Count up, so the tally reads as a live number rather than a label. */
        gsap.utils.toArray<HTMLElement>(`.${styles.statNum}`).forEach((el) => {
          const target = Number(el.dataset.value ?? "0");
          const obj = { n: 0 };
          gsap.to(obj, {
            n: target,
            duration: 1.3,
            ease: "expo.out",
            delay: 0.5,
            onUpdate: () => {
              el.textContent = String(Math.round(obj.n));
            },
          });
        });
      });
    },
    { scope: rootRef }
  );

  /* ⚠️ FILTERING CHANGES THE DOCUMENT HEIGHT, and both scroll systems cache it.
     Going from eight cards to one shortens this page by well over a viewport:
     every ScrollTrigger start/end below the grid is then measured against a
     layout that no longer exists, and Lenis's own limit is stale, so the page
     can refuse to scroll to its real bottom.

     Skipped on the first run — nothing has moved yet, and refreshing during
     mount would fight the entry animations that are still playing. */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.__lenis?.resize();
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <section ref={rootRef} className={styles.page}>
      {/* ---- opening frame ----
          Stacked on a phone (photograph, then copy on the ink ground below),
          overlaid from 900px. Same split as the main hero, same reason: on a
          phone the photograph is all there is, so nothing gets laid over it.  */}
      <div className={styles.heroWrap}>
        <div ref={heroRef} className={styles.hero}>
          <div className={styles.heroMedia}>
            <Image
              src={hero.src}
              alt={hero.alt[lang]}
              fill
              sizes="100vw"
              quality={75}
              priority
              className={styles.heroImg}
            />
          </div>
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.heroWash} aria-hidden="true" />

          {/* Scroll cue: a hairline that runs top-to-bottom on a loop. Purely
              decorative, so it is aria-hidden and the CSS stops it dead under
              prefers-reduced-motion. */}
          <span className={styles.cue} aria-hidden="true">
            <span className={styles.cueLine} />
          </span>
        </div>

        <div className={`shell ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className="label label--gold">{t.eyebrow}</p>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.lede}>{t.lede}</p>

            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt className={`label ${styles.statLabel}`}>{t.count}</dt>
                <dd className={styles.statNum} data-value={STUDIOS.length}>
                  {STUDIOS.length}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={`label ${styles.statLabel}`}>{t.availableNow}</dt>
                <dd className={styles.statNum} data-value={free}>
                  {free}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt className={`label ${styles.statLabel}`}>
                  {t.amenities.access24}
                </dt>
                <dd className={styles.statText}>
                  {site.hours.apartments247 ? "24/7" : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* The « image d'illustration » caption sat here while the banner was
              a stock European interior. The banner is now SS140-A's salon, so
              there is nothing to disclaim. */}
        </div>
      </div>

      {/* The motion scope is this wrapper and NOT the grid, since 2026-08-13.
          `useSectionMotion` collects `[data-rule]` with `root.querySelectorAll`,
          and the divider was a SIBLING of the old scope — so the apartments
          index's signature luminous sweep had never once fired. It is a
          per-element trigger, so widening the scope changes nothing else. */}
      <div ref={gridRef} className={`shell ${styles.body2}`}>
        {/* The preview notice sat here. Gone with the placeholder listings it
            described — see the header. */}
        <div className="rule" data-rule />

        <StudioFilters
          filter={filter}
          onChange={setFilter}
          shown={shown.length}
          dict={dict}
        />

        {/* ⚠️ NO ENTRY ANIMATION ON A FILTER CHANGE, deliberately.
            `useSectionMotion` collects `[data-reveal]` and `.frame` once at
            mount and animates with `gsap.from`, so cards mounted later render
            at their natural state — visible, unanimated, correct. Adding a CSS
            fade here would fight those inline styles on the first paint and
            re-animate the whole grid on every click, which at eight cards is
            noise rather than polish. */}
        {featured ? (
          <div className={styles.grid}>
            <StudioCard
              studio={featured}
              variant="feature"
              sizes={INDEX_FEATURE_SIZES}
              base={base}
              lang={lang}
              dict={dict}
            />
            {restStudios.map((s) => (
              <StudioCard
                key={s.slug}
                studio={s}
                variant="grid"
                sizes={INDEX_GRID_SIZES}
                base={base}
                lang={lang}
                dict={dict}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{t.filters.none}</p>
        )}
      </div>
    </section>
  );
}
