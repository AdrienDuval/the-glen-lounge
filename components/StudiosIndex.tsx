"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { PHOTOS } from "@/lib/photos";
import {
  availableStudios,
  floorLabel,
  PREVIEW,
  STUDIOS,
  STUDIO_GALLERY,
  STUDIO_HERO,
  type Studio,
} from "@/lib/apartments";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import AmenityIcon from "./AmenityIcon";
import styles from "./StudiosIndex.module.css";

/**
 * The studios index.
 *
 * Composed as a magazine spread rather than a list: a full-bleed opening frame
 * with the count set into it, then the first unit given a wide editorial card
 * and the rest in a grid. The earlier version put eleven identical cards on a
 * black page and read like a stock table.
 *
 * The codes are the client's. Availability, amenities and the photography are
 * preview data (`lib/apartments.ts`), which is why the notice sits above the
 * grid rather than in a footnote: it is the first thing between a visitor and
 * a room they might try to book.
 *
 * Every card shows the same photograph because that is all we hold, and the
 * opening frame is a wide banner plate rather than a twelfth copy of it. Both
 * are placeholders, so the frame carries the « illustration » caption the
 * manifest demands and the preview notice says the same thing in words.
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
  /* Two different pictures for two different jobs. `hero` is the wide banner
     plate; `cover` is the 16:9 room frame the cards crop. They were the same
     image until 2026-08-11, which meant the full-bleed opening band was a
     gallery photo stretched across the viewport. */
  const hero = PHOTOS[STUDIO_HERO];
  const cover = PHOTOS[STUDIO_GALLERY[0]];
  const free = availableStudios().length;
  const t = dict.studios;
  const [featured, ...restStudios] = STUDIOS;

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

  const Card = ({ studio, wide }: { studio: Studio; wide?: boolean }) => {
    const floor = floorLabel(studio, { floor: t.floor, ground: t.groundFloor });
    return (
      <Link
        href={`${base}/${studio.slug}`}
        className={`${styles.card} ${wide ? styles.cardWide : ""}`}
        data-reveal
      >
        <div className={`frame ${styles.media}`}>
          <Image
            src={cover.src}
            alt={cover.alt[lang]}
            fill
            sizes={wide ? "(max-width: 720px) 92vw, 60rem" : "(max-width: 720px) 92vw, 28rem"}
            quality={72}
            className={styles.img}
          />
          <span className={styles.scrim} aria-hidden="true" />
          <span className={`label ${styles.status} ${styles[studio.status]}`}>
            <span className={styles.dot} aria-hidden="true" />
            {t.status[studio.status]}
          </span>
          {/* Corner ticks — the frame reads as a mount rather than a rectangle,
              and they are what the hover animates. */}
          <span className={styles.tick} aria-hidden="true" />
          <span className={`${styles.tick} ${styles.tickEnd}`} aria-hidden="true" />
        </div>

        <div className={styles.body}>
          <div className={styles.codeRow}>
            <h3 className={styles.code}>{studio.code}</h3>
            <span className={styles.rule} aria-hidden="true" />
            <span className={`label ${styles.more}`}>{t.seeStudio}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </div>
          <p className={styles.meta}>
            {t.sleeps} {studio.sleeps}
            {floor && ` · ${floor}`}
          </p>
          <ul className={styles.chips}>
            {studio.amenities.slice(0, wide ? 6 : 4).map((a) => (
              <li key={a} className={styles.chip}>
                <AmenityIcon name={a} size={16} />
                {t.amenities[a]}
              </li>
            ))}
            {studio.amenities.length > (wide ? 6 : 4) && (
              <li className={`${styles.chip} ${styles.chipMore}`}>
                +{studio.amenities.length - (wide ? 6 : 4)}
              </li>
            )}
          </ul>
        </div>
      </Link>
    );
  };

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

          {/* In the flow on a phone (where an absolute caption landed on top of
              the tally), pinned bottom-right from 720px. */}
          <p className={`label ${styles.heroCaption}`}>{t.photoNotice}</p>
        </div>
      </div>

      <div className={`shell ${styles.body2}`}>
        {PREVIEW && (
          <p className={styles.preview} role="note">
            <span className={styles.previewMark} aria-hidden="true">
              ◆
            </span>
            {t.preview}
          </p>
        )}

        <div className="rule" data-rule />

        <div ref={gridRef} className={styles.grid}>
          <Card studio={featured} wide />
          {restStudios.map((s) => (
            <Card key={s.slug} studio={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
