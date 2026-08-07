"use client";

import { useRef } from "react";
import Image from "next/image";
import { PHOTOS, type PhotoId } from "@/lib/photos";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Trois.module.css";

/**
 * The three-in-one pitch — restaurant, lounge, appartements. Their own launch
 * post making exactly this pitch is the third best-performing thing on the
 * account, so it earns a place high on the page.
 */
const CARDS = [
  { key: "resto", photo: "food_pair" },
  { key: "lounge", photo: "lounge_detail" },
  { key: "appart", photo: "apartment_valentine" },
] as const satisfies readonly {
  key: keyof Pick<Dict["trois"], "resto" | "lounge" | "appart">;
  photo: PhotoId;
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
        {CARDS.map(({ key, photo }) => {
          const p = PHOTOS[photo];
          const copy = dict.trois[key];
          return (
            <article key={key} className={styles.card}>
              <div className={`frame ${styles.media}`}>
                <Image
                  src={p.src}
                  alt={p.alt[lang]}
                  fill
                  sizes="(max-width: 760px) 92vw, 27rem"
                  quality={72}
                />
              </div>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{copy.title}</h3>
                <span className="label label--gold">{copy.meta}</span>
              </div>
              <p className={styles.cardText}>{copy.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
