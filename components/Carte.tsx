"use client";

import { useRef } from "react";
import Link from "next/link";
import { MENU, MENU_SOURCE_DATE, formatPrice } from "@/lib/menu";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Carte.module.css";

/**
 * La carte. Rendered from `lib/menu.ts`, which was transcribed from the
 * venue's own four-page artwork — not photocopied, so the typos in the
 * original do not ship and every genuinely ambiguous line is tracked with a
 * `query` rather than quietly resolved.
 *
 * The two honesty notes above the list are deliberate: the prices are dated,
 * and the source document contains no drinks at all. Both are things a visitor
 * would otherwise have to discover at the table.
 */
export default function Carte({ lang, dict }: { lang: Lang; dict: Dict }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(rootRef, titleRef);

  return (
    <section ref={rootRef} className={`shell ${styles.page}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.carte.eyebrow}
        </p>
        <h1 ref={titleRef} className={styles.title}>
          {dict.carte.title}
        </h1>
        <p className={styles.lede} data-reveal>
          {dict.carte.lede}
        </p>
      </div>

      {/* Body type, not the mono `label` — these are full sentences, and
          letterspaced uppercase is punishing to read at that length. */}
      <div className={styles.notes} data-reveal>
        <p className={styles.note}>{dict.carte.priceNote}</p>
        <p className={styles.note}>{dict.carte.drinksNote}</p>
      </div>

      <div className="rule" data-rule style={{ marginBottom: "2.5rem" }} />

      <div className={styles.sections}>
        {MENU.map((section) => (
          <section key={section.id} className={styles.section} data-reveal>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{section.title[lang]}</h2>
              {section.flatPrice != null && (
                <span className={`label ${styles.flat}`}>
                  {dict.carte.flatPriceLabel} {formatPrice(section.flatPrice)}{" "}
                  {dict.carte.currency}
                </span>
              )}
            </div>

            <ul className={styles.list}>
              {section.items.map((item) => (
                <li key={item.name} className={styles.item}>
                  <div className={styles.row}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.leader} aria-hidden="true" />
                    {item.price != null && (
                      <span className={styles.price}>
                        {formatPrice(item.price)} {dict.carte.currency}
                      </span>
                    )}
                  </div>
                  {item.detail && <p className={styles.detail}>{item.detail}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className={styles.foot}>
        <div>
          <h2 className={styles.footTitle}>{dict.carte.ctaTitle}</h2>
          <p className="label" style={{ marginTop: "0.5rem" }}>
            <time dateTime={MENU_SOURCE_DATE}>{MENU_SOURCE_DATE}</time>
          </p>
        </div>
        <div className={styles.actions}>
          <a className="btn" href={`tel:${site.contact.phonePrimary.tel}`}>
            {dict.carte.cta}
          </a>
          <Link className="btn" href={href("home", lang)}>
            {dict.carte.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
