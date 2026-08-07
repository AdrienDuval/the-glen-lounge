"use client";

import { useRef } from "react";
import { site } from "@/lib/site";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import SocialIcon from "./SocialIcon";
import styles from "./Social.module.css";

/**
 * Suivre le Glen — the three platforms, as outbound cards.
 *
 * ── THE FEED SEAM ─────────────────────────────────────────────────────────
 * The client wants each platform's latest posts shown here eventually. That
 * needs either per-platform embed scripts (heavy, consent-laden, and they
 * drag third-party JS into a 165 KB page) or a small server-side fetch/cache
 * (oEmbed / Graph API / TikTok display API) rendered statically — the second
 * is the plan. When that lands, each card grows a `posts` list under the
 * handle: extend `Card` below with `posts?: { src; href; alt }[]` and render
 * a thumbnail row inside the same card chassis. Nothing else should change —
 * the section title, the cards and the follow CTAs stay as they are.
 *
 * Until then the cards are honest: they link out, and promise nothing.
 */

const PLATFORMS = [
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
] as const;

export default function Social({ dict }: { dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  return (
    <section id="suivre" ref={sectionRef} className={`shell ${styles.section}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.social.section}
        </p>
        <h2 ref={titleRef} className={styles.title}>
          {dict.social.title}
        </h2>
        <p className={styles.lede} data-reveal>
          {dict.social.lede}
        </p>
      </div>

      <ul className={styles.cards}>
        {PLATFORMS.map(({ key, label }) => (
          <li key={key} data-reveal>
            <a
              className={styles.card}
              href={site.social[key].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.icon}>
                <SocialIcon name={key} size={26} />
              </span>
              <span className={`label ${styles.platform}`}>{label}</span>
              <span className={styles.handle}>{site.social[key].handle}</span>
              <span className={`label ${styles.follow}`}>
                {dict.social.followCta}
                <span aria-hidden="true"> →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
