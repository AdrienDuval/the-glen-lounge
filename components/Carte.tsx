"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MENU, MENU_SOURCE_DATE, formatPrice } from "@/lib/menu";
import { SECTION_PHOTO, DISH_PHOTO, DRINKS_PHOTO } from "@/lib/menuPhotos";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { gsap, useGSAP } from "@/lib/gsap";
import FadeImage from "./FadeImage";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Carte.module.css";

/**
 * La carte — immersive rebuild.
 *
 * Rendered from `lib/menu.ts` (transcribed from the venue's own artwork, typos
 * fixed, ambiguities tracked as `query` rather than guessed) and imagery from
 * `lib/menuPhotos.ts`. The layout is image-forward WHERE a real, consented
 * photo exists and editorial-typographic where one does not — no invented
 * picture reaches the page. Populate `menuPhotos.ts` and dishes upgrade to
 * image cards automatically.
 *
 * The two honesty notes above the list are deliberate and kept: the prices are
 * dated février 2026, and the source document has no drinks at all.
 *
 * Motion: the shared house choreography (`useSectionMotion`) plus page-local
 * hero parallax and active-section tracking, all inside a `no-preference`
 * matchMedia branch or as non-decorative usability (the sticky nav highlight
 * works under reduced motion too, because it is navigation, not decoration).
 */

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  // Sticky site-nav + category bar sit ~150px tall; clear them.
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -150 });
  else {
    const y = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: "auto" });
  }
};

export default function Carte({ lang, dict }: { lang: Lang; dict: Dict }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(MENU[0]?.id ?? "");

  useSectionMotion(rootRef, titleRef);

  const dishCount = MENU.reduce((n, s) => n + s.items.length, 0);

  // Page-local decorative motion: the hero image drifts on scroll.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroImgRef.current) {
          gsap.to(heroImgRef.current, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: heroImgRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: rootRef }
  );

  // Active-section tracking for the sticky pill bar. Plain IntersectionObserver
  // (not GSAP) so it works regardless of motion preference.
  useEffect(() => {
    const sections = MENU.map((s) => document.getElementById(`sec-${s.id}`)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace(/^sec-/, ""));
      },
      { rootMargin: "-160px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keep the active pill in view inside the horizontally scrolling bar.
  useEffect(() => {
    const bar = navRef.current;
    if (!bar) return;
    const pill = bar.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    pill?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <section ref={rootRef} className={styles.page}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className={`shell ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className="label label--gold" data-reveal>
            {dict.carte.eyebrow}
          </p>
          <h1 ref={titleRef} className={styles.title}>
            {dict.carte.title}
          </h1>
          <p className={styles.lede} data-reveal>
            {dict.carte.lede}
          </p>
          <dl className={styles.stats} data-reveal>
            <div className={styles.stat}>
              <dt className={styles.statNum}>{MENU.length}</dt>
              <dd className={styles.statLabel}>{dict.carte.statSectionsLabel}</dd>
            </div>
            <div className={styles.statSep} aria-hidden="true" />
            <div className={styles.stat}>
              <dt className={styles.statNum}>{dishCount}</dt>
              <dd className={styles.statLabel}>{dict.carte.statDishesLabel}</dd>
            </div>
          </dl>
          <button
            type="button"
            className={styles.scrollHint}
            data-reveal
            onClick={() => scrollTo(`sec-${MENU[0].id}`)}
          >
            <span>{dict.carte.scrollHint}</span>
            <span className={styles.scrollHintLine} aria-hidden="true" />
          </button>
        </div>

        <div ref={heroImgRef} className={styles.heroMedia}>
          <div className={`frame ${styles.heroFrame}`}>
            <FadeImage
              src={SECTION_PHOTO["produits-de-mer"]!.src}
              alt={SECTION_PHOTO["produits-de-mer"]!.alt[lang]}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              className={styles.cover}
              priority
            />
          </div>
        </div>
      </header>

      {/* ── STICKY CATEGORY NAV ──────────────────────────────────────────── */}
      <nav className={styles.catbar} aria-label={dict.carte.navLabel}>
        <div ref={navRef} className={styles.catbarInner}>
          {MENU.map((s) => (
            <button
              key={s.id}
              type="button"
              data-pill={s.id}
              className={`${styles.pill} ${active === s.id ? styles.pillOn : ""}`}
              aria-current={active === s.id ? "true" : undefined}
              onClick={() => scrollTo(`sec-${s.id}`)}
            >
              {s.title[lang]}
            </button>
          ))}
        </div>
      </nav>

      <div className={`shell ${styles.body}`}>
        {/* ── HONESTY NOTES ──────────────────────────────────────────────── */}
        <div className={styles.notes} data-reveal>
          <p className={styles.note}>{dict.carte.priceNote}</p>
          <p className={styles.note}>{dict.carte.drinksNote}</p>
        </div>

        {/* ── SECTIONS ───────────────────────────────────────────────────── */}
        <div className={styles.sections}>
          {MENU.map((section, i) => {
            const feature = SECTION_PHOTO[section.id];
            return (
              <section
                key={section.id}
                id={`sec-${section.id}`}
                className={styles.section}
                aria-labelledby={`h-${section.id}`}
              >
                <div className={styles.sectionHead} data-reveal>
                  <span className={styles.sectionNum} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`h-${section.id}`} className={styles.sectionTitle}>
                    {section.title[lang]}
                  </h2>
                  {section.flatPrice != null && (
                    <span className={`label ${styles.flat}`}>
                      {dict.carte.flatPriceLabel} {formatPrice(section.flatPrice)}{" "}
                      {dict.carte.currency}
                    </span>
                  )}
                  <span className={styles.sectionRule} aria-hidden="true" />
                </div>

                {feature && (
                  <div className={`frame ${styles.feature}`} data-reveal>
                    <FadeImage
                      src={feature.src}
                      alt={feature.alt[lang]}
                      fill
                      sizes="(max-width: 900px) 100vw, 90vw"
                      className={styles.cover}
                    />
                    {feature.illustration && (
                      <span className={styles.illus}>{dict.carte.illustration}</span>
                    )}
                  </div>
                )}

                <ul className={styles.grid}>
                  {section.items.map((item) => {
                    const photo = DISH_PHOTO[item.name];
                    return (
                      <li
                        key={item.name}
                        className={`${styles.card} ${photo ? styles.cardPhoto : ""}`}
                        data-reveal
                      >
                        {photo && (
                          <div className={`frame ${styles.cardMedia}`}>
                            <FadeImage
                              src={photo.src}
                              alt={photo.alt[lang]}
                              fill
                              sizes="(max-width: 640px) 100vw, 360px"
                              className={styles.cover}
                            />
                            {photo.illustration && (
                              <span className={styles.illus}>
                                {dict.carte.illustration}
                              </span>
                            )}
                          </div>
                        )}
                        <div className={styles.cardBody}>
                          <div className={styles.cardRow}>
                            <h3 className={styles.name}>{item.name}</h3>
                            {item.price != null && (
                              <span className={styles.price}>
                                {formatPrice(item.price)} {dict.carte.currency}
                              </span>
                            )}
                          </div>
                          {item.detail && (
                            <p className={styles.detail}>{item.detail}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {/* ── DRINKS TEASER ──────────────────────────────────────────────── */}
        <section className={styles.drinks} aria-labelledby="drinks-h">
          <div className={`frame ${styles.drinksMedia}`} data-reveal>
            <FadeImage
              src={DRINKS_PHOTO.src}
              alt={DRINKS_PHOTO.alt[lang]}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.cover}
            />
          </div>
          <div className={styles.drinksText}>
            <p className="label label--gold" data-reveal>
              {dict.carte.drinksKicker}
            </p>
            <h2 id="drinks-h" className={styles.drinksTitle} data-reveal>
              {dict.carte.drinksTitle}
            </h2>
            <p className={styles.drinksLede} data-reveal>
              {dict.carte.drinksLede}
            </p>
          </div>
        </section>

        {/* ── FOOT / CTA ─────────────────────────────────────────────────── */}
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
      </div>
    </section>
  );
}
