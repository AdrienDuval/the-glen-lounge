"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS, type PhotoId } from "@/lib/photos";
import { href, type RouteId } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Trois.module.css";

/**
 * The three-in-one pitch — restaurant, lounge, appartements. Their own launch
 * post making exactly this pitch is the third best-performing thing on the
 * account, so it earns a place high on the page.
 *
 * `route` makes a card clickable. Two of the three now have a page to go to;
 * the lounge does not yet, and a card that looks like a link and is not is
 * worse than one that plainly is not — so it stays an <article>. (Review
 * finding: the apartments card was a full photo card titled « Appartements »
 * with nothing to click, on the page that is meant to sell them.)
 */
const CARDS = [
  { key: "resto", photo: "food_pair", route: "carte" },
  { key: "lounge", photo: "lounge_detail" },
  { key: "appart", photo: "apartment_valentine", route: "appartements" },
] as const satisfies readonly {
  key: keyof Pick<Dict["trois"], "resto" | "lounge" | "appart">;
  photo: PhotoId;
  route?: RouteId;
}[];

export default function Trois({ lang, dict }: { lang: Lang; dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  return (
    <section ref={sectionRef} className={`shell ${styles.section}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.trois.section}
        </p>
        <h2 ref={titleRef} className={styles.title}>
          {dict.trois.title}
        </h2>
        <p className={styles.lede} data-reveal>
          {dict.trois.lede}
        </p>
      </div>

      <div className={styles.grid}>
        {CARDS.map((card) => {
          const { key, photo } = card;
          const route = "route" in card ? card.route : undefined;
          const p = PHOTOS[photo];
          const copy = dict.trois[key];

          const body = (
            <>
              <div className={`frame ${styles.media}`}>
                <Image
                  src={p.src}
                  alt={p.alt[lang]}
                  fill
                  sizes="(max-width: 760px) 92vw, 27rem"
                  quality={72}
                  className={styles.img}
                />
              </div>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{copy.title}</h3>
                <span className="label label--gold">{copy.meta}</span>
              </div>
              <p className={styles.cardText}>{copy.text}</p>
              {route && (
                <span className={`label ${styles.more}`}>
                  {dict.trois.more}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </span>
              )}
            </>
          );

          return route ? (
            <Link
              key={key}
              href={href(route, lang)}
              className={`${styles.card} ${styles.cardLink}`}
            >
              {body}
            </Link>
          ) : (
            <article key={key} className={styles.card}>
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
