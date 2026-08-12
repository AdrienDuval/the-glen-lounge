"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { PHOTOS } from "@/lib/photos";
import {
  availableStudios,
  floorLabel,
  formatPrice,
  STUDIOS,
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
    const floor = floorLabel(studio, {
      floor: t.floor,
      ground: t.groundFloor,
      basement: t.basement,
    });
    /* Its own first photograph. No fallback: an undocumented unit is not listed
       at all, so `photos` is never empty. */
    const shot = PHOTOS[studio.photos[0]];
    const price = formatPrice(studio.pricePerNight);
    return (
      <Link
        href={`${base}/${studio.slug}`}
        className={`${styles.card} ${wide ? styles.cardWide : ""}`}
        data-reveal
      >
        <div className={`frame ${styles.media}`}>
          <Image
            src={shot.src}
            alt={shot.alt[lang]}
            fill
            sizes={wide ? "(max-width: 720px) 92vw, 60rem" : "(max-width: 720px) 92vw, 28rem"}
            quality={72}
            className={styles.img}
          />
          <span className={styles.scrim} aria-hidden="true" />
          {/* No badge at all when availability was never given — better a card
              that says nothing about it than one that guesses. */}
          {studio.status && (
            <span className={`label ${styles.status} ${styles[studio.status]}`}>
              <span className={styles.dot} aria-hidden="true" />
              {t.status[studio.status]}
            </span>
          )}
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
            {price && ` · ${price} ${t.specs.perNight}`}
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

          {/* The « image d'illustration » caption sat here while the banner was
              a stock European interior. The banner is now SS140-A's salon, so
              there is nothing to disclaim. */}
        </div>
      </div>

      <div className={`shell ${styles.body2}`}>
        {/* The preview notice sat here. Gone with the placeholder listings it
            described — see the header. */}
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
