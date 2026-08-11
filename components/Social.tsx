"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
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
 * handle: extend the table below with `posts?: { src; href; alt }[]` and render
 * a thumbnail row inside the same card chassis, above `.follow`. Nothing else
 * should change — the section title, the cards and the follow CTAs stay.
 *
 * Until then the cards are honest: they link out, and promise nothing.
 *
 * ── WHY THESE CARDS CARRY COLOUR ──────────────────────────────────────────
 * The rest of the site is gold on near-black, and this section used to obey
 * that literally: three identical `--ink-2` rectangles, a hairline border and a
 * 26px grey glyph. On a near-black ground that is three of the same rectangle —
 * nothing told TikTok from Facebook except the word, and the section read as
 * the quietest thing on a page whose whole job is to send people to the feeds.
 *
 * So each platform brings its own light. The accent is confined to the chrome —
 * bloom, icon chip, rule, watermark, the « suivre » line — while the handle
 * stays white and the eyebrow stays gold, so the section still belongs to the
 * house palette rather than turning into a brand-colour swatch board.
 *
 * The bright end of each pair is the one used for text, and all three clear AA
 * on `--ink-2`: cyan ≈ 11:1, amber ≈ 8:1, blue ≈ 7.5:1. Facebook's real
 * #1877f2 measures ≈ 4:1 there and is lightened for that reason.
 */

type Platform = {
  key: "tiktok" | "instagram" | "facebook";
  label: string;
  /** Bright end — carries text. */
  a1: string;
  /** Deep end — gradient partner, never used alone behind type. */
  a2: string;
};

const PLATFORMS: Platform[] = [
  { key: "tiktok", label: "TikTok", a1: "#25f4ee", a2: "#fe2c55" },
  { key: "instagram", label: "Instagram", a1: "#ffa93d", a2: "#d6249f" },
  { key: "facebook", label: "Facebook", a1: "#5aa9ff", a2: "#2f6fd0" },
];

export default function Social({ dict }: { dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  /* The bloom tracks the pointer. Written straight to the element's own custom
     properties — no state, so it never re-renders React on mousemove, and the
     card composites it on the GPU. Touch never fires this, which is why the
     resting bloom is already lit rather than waiting to be woken up. */
  const track = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const untrack = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  };

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
        {PLATFORMS.map(({ key, label, a1, a2 }) => (
          <li key={key} data-reveal>
            <a
              className={styles.card}
              style={{ "--a1": a1, "--a2": a2 } as React.CSSProperties}
              href={site.social[key].url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={track}
              onPointerLeave={untrack}
            >
              {/* Oversized mark, bled off the bottom-right corner. Decorative —
                  SocialIcon is aria-hidden throughout, and the same glyph is
                  already announced by the visible platform name below. */}
              <span className={styles.watermark}>
                <SocialIcon name={key} size={200} />
              </span>

              <span className={styles.chip}>
                <SocialIcon name={key} size={24} />
              </span>
              <span className={`label ${styles.platform}`}>{label}</span>
              <span className={styles.handle}>{site.social[key].handle}</span>
              <span className={`label ${styles.follow}`}>
                {dict.social.followCta}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
