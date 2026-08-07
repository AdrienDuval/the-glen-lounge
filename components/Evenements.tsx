"use client";

import { useRef } from "react";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Split.module.css";

/**
 * Private hire. Their events posts are the second-strongest content on the
 * account, and the venue has never published capacity or pricing — so the
 * section sells the occasion and routes to a phone call, which is the only
 * honest CTA available.
 */
export default function Evenements({ lang, dict }: { lang: Lang; dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  const photo = PHOTOS.events_table;

  return (
    <section
      id="evenements"
      ref={sectionRef}
      className={`shell ${styles.section}`}
    >
      <div className={styles.grid}>
        <div className={`frame ${styles.media}`}>
          <Image
            src={photo.src}
            alt={photo.alt[lang]}
            fill
            sizes="(max-width: 860px) 92vw, 40rem"
            quality={72}
          />
        </div>

        <div className={styles.copy}>
          <p className="label label--gold" data-reveal>
            {dict.evenements.section}
          </p>
          <h2 ref={titleRef} className={styles.title}>
            {dict.evenements.title}
          </h2>
          <p className={styles.lede} data-reveal>
            {dict.evenements.lede}
          </p>

          <ul className={styles.list} data-reveal>
            {dict.evenements.list.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.bullet} aria-hidden="true">
                  ◆
                </span>
                {item}
              </li>
            ))}
          </ul>

          <p className={`label ${styles.note}`} data-reveal>
            {dict.evenements.note}
          </p>

          <a
            href={`tel:${site.contact.phonePrimary.tel}`}
            className={`btn ${styles.cta}`}
            data-reveal
          >
            {dict.evenements.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
