"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { PHOTOS } from "@/lib/photos";
import type { Slide } from "@/lib/banner";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./Hero.module.css";

const INTERVAL = 7000;
/** How far a finger has to travel before it counts as a slide change. */
const SWIPE_MIN = 45;

/**
 * The hero IS the banner. Slide 0 is the brand statement; the rest come from
 * `lib/events.ts` via `lib/banner.ts`, already filtered by date window and
 * photo consent on the server. Slides take an image or a video.
 *
 * ── The transition ──────────────────────────────────────────────────────────
 * Not a crossfade. The incoming slide is revealed by a directional clip-path
 * wipe while its image settles out of a scale-and-drift, so the movement has a
 * direction that matches the control you pressed. The caption's title is split
 * into masked lines that rise behind it, with the supporting elements
 * staggered after. Under `prefers-reduced-motion` all of that collapses to an
 * instant swap.
 *
 * ── Legibility ──────────────────────────────────────────────────────────────
 * The grade is deliberately light so the photograph reads. Text separation
 * comes from a radial bed under the caption, a text-shadow, and — for the key
 * facts — chips that carry their own background, so they survive whatever the
 * image behind them is doing.
 *
 * ── Accessibility ───────────────────────────────────────────────────────────
 * The <h1> is a persistent visually-hidden heading on the section, never the
 * rotating brand line: a heading inside a rotating panel would be aria-hidden
 * for most of the page's life. Rotation stops for good on any control press,
 * pauses on hover and focus-within, pauses offscreen, and never starts under
 * reduced motion.
 */
export default function Hero({
  slides,
  lang,
  dict,
}: {
  slides: Slide[];
  lang: Lang;
  dict: Dict;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [taken, setTaken] = useState(false);

  /** +1 forward, -1 backward. Drives which way the wipe travels. */
  const dirRef = useRef(1);
  const prevRef = useRef(0);

  const count = slides.length + 1;

  /**
   * Which slides have their media in the DOM. Every panel is absolutely
   * positioned over the viewport, so `loading="lazy"` defers nothing — the
   * browser fetches them all at first paint. Mounting on approach keeps
   * concurrent loads at two or three however long the banner gets.
   */
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0, 1]));

  useEffect(() => {
    setMounted((prev) => {
      const next = new Set(prev);
      next.add(index);
      next.add((index + 1) % count);
      return next.size === prev.size ? prev : next;
    });
  }, [index, count]);

  const eventsBase = href("evenements", lang);

  /* ---- slide + caption transition ---- */
  useGSAP(
    () => {
      const stage = stageRef.current;
      const caps = captionsRef.current;
      if (!stage || !caps) return;

      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.slide}`, stage);
      const captions = gsap.utils.toArray<HTMLElement>(`.${styles.caption}`, caps);
      const prev = prevRef.current;
      prevRef.current = index;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const settle = () => {
        panels.forEach((p, i) =>
          gsap.set(p, { opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 0, clipPath: "none" })
        );
        captions.forEach((c, i) => gsap.set(c, { opacity: i === index ? 1 : 0 }));
      };

      /* First paint, or motion turned off: no choreography, just be correct. */
      if (prev === index || reduce) {
        settle();
        if (!reduce) revealCaption(captions[index], true);
        return;
      }

      const dir = dirRef.current;
      const incoming = panels[index];
      const outgoing = panels[prev];
      const inner = incoming.querySelector<HTMLElement>("[data-inner]");

      gsap.set(outgoing, { zIndex: 1, opacity: 1, clipPath: "none" });
      gsap.set(incoming, {
        zIndex: 2,
        opacity: 1,
        clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });

      /* The image drifts against the wipe, which is what stops it reading as a
         flat panel sliding over another flat panel. */
      if (inner) {
        gsap.fromTo(
          inner,
          { scale: 1.16, xPercent: dir > 0 ? 5 : -5 },
          { scale: 1, xPercent: 0, duration: 1.6, ease: "expo.out" }
        );
      }

      gsap.to(incoming, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.15,
        ease: "expo.inOut",
        onComplete: () => {
          panels.forEach((p, i) =>
            gsap.set(p, { opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 0, clipPath: "none" })
          );
        },
      });

      /* Outgoing caption clears fast; incoming arrives behind the wipe. */
      gsap.to(captions[prev], { opacity: 0, y: -14, duration: 0.4, ease: "power2.in" });
      gsap.set(captions[index], { opacity: 1, y: 0 });
      revealCaption(captions[index], false);
    },
    { dependencies: [index] }
  );

  /* ---- entrance, gated on the preloader ---- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      /* Parallax on the caption — DESKTOP ONLY, deliberately.
         There the caption is a glass panel over a full-viewport photograph
         that is on its way out, so fading it is the point. On mobile the
         composition is stacked: the same tween dims plain body copy and two
         CTAs while they are still the only thing on screen (measured 0.78 at
         300px of scroll, 0.67 at 450px). It also weakens the panel's own
         `backdrop-filter: brightness()` as it goes, so the contrast that was
         measured at rest does not survive the scroll. */
      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(section.querySelector(`.${styles.content}`), {
            yPercent: -8,
            opacity: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      );

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const play = () => {
          ctx.add(() => {
            const first = captionsRef.current?.querySelector<HTMLElement>(
              `.${styles.caption}`
            );
            if (first) revealCaption(first, false);
            gsap.from(q("[data-hero-eyebrow]"), {
              opacity: 0,
              duration: 1.1,
              stagger: 0.12,
              ease: "expo.out",
              delay: 0.55,
            });
            gsap.from(q("[data-hero-bar]"), {
              y: 16,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
              delay: 0.8,
            });
          });
        };

        if (document.documentElement.dataset.loaded === "1") play();
        else window.addEventListener("glen:loaded", play, { once: true });
        return () => window.removeEventListener("glen:loaded", play);
      });
    },
    { scope: sectionRef }
  );

  /* ---- autoplay ---- */
  useEffect(() => {
    if (taken || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let paused = false;
    let visible = true;

    const timer = window.setInterval(() => {
      if (!paused && visible) {
        dirRef.current = 1;
        setIndex((i) => (i + 1) % count);
      }
    }, INTERVAL);

    const pause = () => (paused = true);
    const resume = () => (paused = false);
    section.addEventListener("pointerenter", pause);
    section.addEventListener("pointerleave", resume);
    section.addEventListener("focusin", pause);
    section.addEventListener("focusout", resume);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible = self.isActive),
    });

    return () => {
      window.clearInterval(timer);
      section.removeEventListener("pointerenter", pause);
      section.removeEventListener("pointerleave", resume);
      section.removeEventListener("focusin", pause);
      section.removeEventListener("focusout", resume);
      st.kill();
    };
  }, [taken, count]);

  /* Dwell indicator on the active dot. */
  useGSAP(
    () => {
      const fill = document.querySelector<HTMLElement>(`.${styles.dotOn} .${styles.dotFill}`);
      if (!fill) return;
      if (taken || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(fill, { width: "100%" });
        return;
      }
      gsap.fromTo(
        fill,
        { width: "0%" },
        { width: "100%", duration: INTERVAL / 1000, ease: "none" }
      );
    },
    { dependencies: [index, taken] }
  );

  /* Only the active slide's video plays. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.querySelectorAll("video").forEach((v, i) => {
      if (i + 1 === index && !reduce) v.play().catch(() => {});
      else v.pause();
    });
  }, [index]);

  const go = useCallback(
    (next: number) => {
      const target = ((next % count) + count) % count;
      dirRef.current = target === index ? 1 : target > index ? 1 : -1;
      setIndex(target);
    },
    [count, index]
  );

  const takeOver = (fn: () => void) => () => {
    setTaken(true);
    fn();
  };

  /* ---- swipe ----
     Phones expect to drag a banner, and dots + arrows were the only way to
     move it. Pointer events cover touch, pen and mouse drag from one path.

     The axis is decided once, on the first few pixels of travel, and a
     gesture that starts out vertical is abandoned — otherwise a plain scroll
     that drifts sideways would steal a slide. `touch-action: pan-y` on the
     section keeps the page scrolling vertically while we own the x axis. */
  const drag = useRef<{ x: number; y: number; axis: "" | "x" | "y" } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    /* Never swallow a press that was aimed at a control or a link. */
    if (count < 2 || (e.target as HTMLElement).closest("a, button")) return;
    drag.current = { x: e.clientX, y: e.clientY, axis: "" };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.axis) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.axis !== "x") return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) < SWIPE_MIN) return;
    const step = dx < 0 ? 1 : -1;
    setTaken(true);
    dirRef.current = step;
    setIndex((i) => (i + step + count) % count);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className={styles.hero}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
    >
      <h1 className="sr-only">{dict.hero.h1}</h1>

      <div
        ref={stageRef}
        className={styles.stage}
        aria-roledescription="carousel"
        aria-label={dict.hero.bannerLabel}
      >
        {/* slide 0 — the brand frame */}
        <div
          className={`${styles.slide} ${styles.slideFirst}`}
          aria-hidden={index === 0 ? undefined : true}
          inert={index !== 0}
        >
          <div className={styles.slideInner} data-inner>
            <Image
              src={PHOTOS.lounge_hero.src}
              alt={PHOTOS.lounge_hero.alt[lang]}
              fill
              priority
              sizes="100vw"
              quality={78}
            />
          </div>
        </div>

        {slides.map((slide, i) => {
          const photo = slide.photo ? PHOTOS[slide.photo] : null;
          const active = index === i + 1;
          const show = mounted.has(i + 1);
          return (
            <div
              key={slide.id}
              className={styles.slide}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              <div className={styles.slideInner} data-inner>
                {!show ? null : slide.kind === "video" && slide.video ? (
                  <video
                    src={slide.video}
                    poster={slide.poster ? PHOTOS[slide.poster].src : undefined}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  />
                ) : photo && slide.layout === "poster" ? (
                  <div className={styles.poster}>
                    <Image
                      src={photo.src}
                      alt={photo.alt[lang]}
                      width={photo.w}
                      height={photo.h}
                      className={styles.posterImg}
                      sizes="(max-width: 900px) 80vw, 42vw"
                      quality={78}
                    />
                  </div>
                ) : photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt[lang]}
                    fill
                    sizes="100vw"
                    quality={78}
                  />
                ) : null}
              </div>
            </div>
          );
        })}

        <div className={styles.shade} aria-hidden="true" />
      </div>

      <div className={styles.eyebrows}>
        <p className={`label ${styles.eyebrow}`} data-hero-eyebrow>
          {dict.hero.eyebrowLeft}
        </p>
        <p className={`label ${styles.eyebrow}`} data-hero-eyebrow>
          {dict.hero.eyebrowRight}
        </p>
      </div>

      <div className={styles.foot}>
        <div className={styles.content}>
          <div ref={captionsRef} className={styles.captions}>
          {/* caption 0 — the brand */}
          <div
            className={`${styles.caption} ${styles.captionFirst}`}
            aria-hidden={index === 0 ? undefined : true}
            inert={index !== 0}
          >
            <p className={styles.display} data-title>
              {dict.hero.tagline}
            </p>
            <p className={styles.lede} data-stagger>
              {dict.hero.lede}
            </p>
            <div className={styles.actions} data-stagger>
              <Link className={styles.btnSolid} href={eventsBase}>
                {dict.hero.seeEvents}
              </Link>
              <Link className={styles.btnGhost} href={href("carte", lang)}>
                {dict.nav.links.carte}
              </Link>
            </div>
          </div>

          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={styles.caption}
              aria-hidden={index === i + 1 ? undefined : true}
              inert={index !== i + 1}
            >
              <p className={`label ${styles.when}`} data-stagger>
                {slide.eyebrow[lang]}
              </p>
              <h2 className={styles.slideTitle} data-title>
                {slide.title[lang]}
              </h2>
              <p className={styles.lede} data-stagger>
                {slide.meta[lang]}
              </p>

              {slide.highlights && slide.highlights.length > 0 && (
                <div className={styles.chips} data-stagger>
                  {slide.highlights.map((h) => (
                    <span key={h.fr} className={styles.chip}>
                      <span className={styles.chipDot} aria-hidden="true" />
                      {h[lang]}
                    </span>
                  ))}
                </div>
              )}

              {/* « Image d'illustration ». Set by `illustrative` on the slide,
                  which is also the only key that lets a placeholder photograph
                  past the gate in `activeSlides()` — the disclosure and the
                  permission are one flag, so the picture cannot appear without
                  the sentence.

                  It sits in the caption rather than pinned to a corner of the
                  photograph, as it is on the studios index: here the caption
                  is a glass panel and the rest of the frame is full-bleed
                  image behind moving type, so a corner line would be the one
                  piece of text on the slide with nothing behind it.

                  Same string as the studios page, read out of `dict.studios`
                  on purpose — one sentence, translated once. Two copies would
                  eventually disagree, and this is the sentence that must not. */}
              {slide.illustrative && (
                <p className={`label ${styles.illustration}`} data-stagger>
                  {dict.studios.photoNotice}
                </p>
              )}

              <div className={styles.actions} data-stagger>
                {slide.eventSlug ? (
                  <Link
                    className={styles.btnSolid}
                    href={`${eventsBase}/${slide.eventSlug}`}
                  >
                    {dict.hero.moreDetail}
                  </Link>
                ) : slide.cta?.route ? (
                  /* An in-app destination: resolved per locale and rendered as
                     a real Link, so it client-navigates and « Voir les studios »
                     lands on /en/apartments rather than /fr/appartements for an
                     English reader. `cta.href` stays an <a> because it is only
                     ever an anchor, a tel: or an external URL. */
                  <Link
                    className={styles.btnSolid}
                    href={href(slide.cta.route, lang)}
                  >
                    {slide.cta.label[lang]}
                  </Link>
                ) : slide.cta?.href ? (
                  <a className={styles.btnSolid} href={slide.cta.href}>
                    {slide.cta.label[lang]}
                  </a>
                ) : null}
                <a className={styles.btnGhost} href="#contact">
                  {dict.nav.reserve}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bar} data-hero-bar>
        <div className={styles.dots}>
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotOn : ""}`}
              aria-label={`${dict.hero.goTo} ${i + 1}`}
              aria-current={i === index || undefined}
              onClick={takeOver(() => go(i))}
            >
              <span className={styles.dotFill} aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className={styles.right}>
          <span className={styles.cue}>
            <span className="label">{dict.hero.scroll}</span>
            <span className={styles.cueLine} aria-hidden="true" />
          </span>
          <button
            type="button"
            className={styles.arrow}
            aria-label={dict.hero.prev}
            onClick={takeOver(() => {
              dirRef.current = -1;
              setIndex((i) => (i - 1 + count) % count);
            })}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={styles.arrow}
            aria-label={dict.hero.next}
            onClick={takeOver(() => {
              dirRef.current = 1;
              setIndex((i) => (i + 1) % count);
            })}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}

/**
 * Masked line reveal on the caption's title, then a stagger on everything else.
 *
 * The split is reverted as soon as the reveal finishes: leaving the wrapper
 * markup in place clips French accents (É, À, û) against the tight leading
 * when the line is at rest.
 */
function revealCaption(caption: HTMLElement | undefined, immediate: boolean) {
  if (!caption) return;

  const title = caption.querySelector<HTMLElement>("[data-title]");
  const rest = caption.querySelectorAll<HTMLElement>("[data-stagger]");

  if (immediate) {
    gsap.set([title, ...Array.from(rest)].filter(Boolean), { opacity: 1, y: 0 });
    return;
  }

  if (title) {
    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 118,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          onComplete: () => self.revert(),
        }),
    });
  }

  if (rest.length) {
    gsap.fromTo(
      rest,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.18 }
    );
  }
}
