"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PHOTOS } from "@/lib/photos";
import type { Slide } from "@/lib/apartments";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./StudioGallery.module.css";

/**
 * The studio's opening carousel — the room, immediately, before any copy.
 *
 * Embla again (`embla-carousel-react`, already a dependency for the Écrans
 * flyer archive), but a different setting of it: snap-aligned single slides
 * with loop, not free drag, because this is one room seen seven ways rather
 * than a shelf of posters to browse. Embla owns only the horizontal axis, so
 * it never fights Lenis for the wheel.
 *
 * No autoplay. A carousel that advances on its own would move the photograph a
 * visitor is reading, and it would need a reduced-motion branch to do it —
 * every movement here is user-initiated, so neither problem exists.
 *
 * Clicking a slide hands its index to the lightbox; the thumb strip below is a
 * plain scrolling row rather than a second Embla instance, because seven
 * thumbnails do not need momentum physics.
 *
 * The last slide may be a walkthrough clip (see `slidesFor`). It is a poster
 * frame with a play badge here, not a playing video: the carousel slide is a
 * 3:2 crop the visitor has not asked to watch, and autoplaying it would move
 * the thing they are reading. Pressing it opens the lightbox, which is where
 * the clip actually plays, at the right size and with controls.
 */
export default function StudioGallery({
  slides,
  lang,
  dict,
  onOpen,
  children,
}: {
  slides: readonly Slide[];
  lang: Lang;
  dict: Dict;
  onOpen: (index: number) => void;
  /** The masthead, laid over the slides. */
  children: React.ReactNode;
}) {
  const t = dict.studios;
  /**
   * ⚠️ REDUCED MOTION HAS TO BE READ IN AN EFFECT, NOT DURING RENDER.
   *
   * Embla tweens the track on rAF, so the global CSS kill switch in globals.css
   * cannot reach it: under `prefers-reduced-motion: reduce` a full-viewport
   * photograph still slid across the screen for ~800ms. That was the one piece
   * of motion on this page not gated on the preference, and the house rule is
   * explicit. `duration: 0` snaps instead.
   *
   * Reading `matchMedia` during render would be a hydration mismatch — the
   * server has no media queries — which is the same trap ReserveStudio already
   * documents for today's date. Hence the effect, and hence the default of
   * `false`: the first client render must agree with the server's.
   */
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    duration: reduced ? 0 : 25,
  });
  const [selected, setSelected] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);

  /**
   * Which slides may fetch. Embla moves the track with a transform, so an
   * off-screen slide is inside the viewport rectangle as far as the browser's
   * lazy-load observer is concerned — it never intersects, never loads, and
   * pressing → gave you an empty black frame while a full-width image fetched
   * from scratch. Measured: five of the seven never loaded at all until visited.
   *
   * So the set is driven off the selected snap instead. It starts at the first
   * frame and its ONE forward neighbour, and widens to a radius of two on the
   * first real move. One slide of lead time was not enough once moving: a steady
   * click through → at 1365×640 arrived at the fifth frame ~280ms after it
   * started fetching and still showed black. Two is what held.
   *
   * The wider radius deliberately does NOT apply at mount, or first paint would
   * fetch five full-width images before the visitor had asked for any of them.
   * That is also why the widening hangs off Embla's `select` event rather than
   * the manual priming call below: `select` fires only when the snap changes.
   *
   * ⚠️ THE BACKWARD WRAP USED TO BE IN THE MOUNT SET TOO, and it defeated half
   * of the above. Next preloads every non-lazy image, so `slides.length - 1`
   * put a `<link rel=preload>` on the LAST frame of the gallery at first paint —
   * on A10 that is `a10_appt_terrasse`, the drying terrace that
   * `lib/apartments.ts` deliberately orders last so it is never the frame a
   * visitor forms their impression on, fetched eagerly for a slide reachable
   * only by pressing ←. The widening below still covers the wrap on the first
   * real navigation.
   *
   * The set only ever grows — an image that has decoded is not worth un-marking.
   */
  const [warm, setWarm] = useState<ReadonlySet<number>>(
    () => new Set([0, 1 % slides.length])
  );

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    /* Stepped from the selected snap rather than read off scrollProgress:
       under `loop: true` the progress value wraps mid-drag, which made the
       hairline snap backwards every time the carousel crossed the seam. */
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      setSelected(i);
      const fill = fillRef.current;
      if (fill) {
        fill.style.transform = `scaleX(${(i + 1) / slides.length})`;
      }
    };

    /* Bound to `select`, so it runs on a real move and not on the priming call.
       Returns `prev` untouched once the neighbours are already warm, so a snap
       that adds nothing does not re-render the whole track. */
    const onMove = () => {
      const i = emblaApi.selectedScrollSnap();
      onSelect();
      setWarm((prev) => {
        const next = new Set(prev);
        for (const d of [-2, -1, 1, 2]) {
          next.add((i + d + slides.length) % slides.length);
        }
        return next.size === prev.size ? prev : next;
      });
    };

    onSelect();
    emblaApi.on("select", onMove);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onMove);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, slides.length]);

  return (
    <div>
      {/* `.wrap` holds the frame and the masthead and NOTHING else. It is the
          containing block for the absolutely-positioned desktop masthead, so
          the thumb strip must stay outside it — with the strip inside, its
          ~139px of height made `bottom: 0` the bottom of the THUMBNAILS and the
          unit code painted over them. (Review finding, high.) */}
      <div className={styles.wrap}>
        <div className={styles.hero}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {slides.map((slide, i) => {
              /* A video slide shows its poster here — see the note at the top.
                 Both branches draw a `next/image`, so the loading and warming
                 behaviour below is identical for either kind. */
              const photo =
                slide.kind === "photo"
                  ? PHOTOS[slide.id]
                  : PHOTOS[slide.poster];
              const label =
                slide.kind === "photo"
                  ? `${t.openGallery} — ${photo.alt[lang]}`
                  : t.playVideo;
              /* ⚠️ A PRESENTATION WORKAROUND FOR A SOURCE PROBLEM.
                 A frame taller than it is wide cannot fill a 16:9 band without
                 being scaled by its WIDTH: `a10_chambre` is 356×640, and
                 covering a 1440px band means a 4× upscale of a phone-video
                 still — measured in Chrome, not feared. Anything under 900px on
                 the long edge is the same problem one size down; A10's five
                 apartment frames are 640×360.

                 So those are CONTAINED at their own ratio over a blurred,
                 darkened copy of themselves. The band stays full-bleed, the
                 picture is shown at a size it can actually hold, and the
                 backdrop is obviously a backdrop rather than a second photo.
                 The 900px floor deliberately lets `a10_appt_salon` (960×540)
                 run full-bleed at ~1.5×, which is tolerable.

                 The real fix is real photographs of A10 and A10-2 — see
                 lib/photos.ts and FACTS.md. DELETE THIS the day they arrive. */
              const lowRes = photo.h > photo.w || photo.w < 900;
              return (
                <button
                  key={slide.kind === "photo" ? slide.id : slide.src}
                  type="button"
                  className={styles.slide}
                  onClick={() => onOpen(i)}
                  aria-label={label}
                  /* Off-screen slides are still in the DOM and still focusable;
                     without this, Tab walks through six invisible buttons. */
                  tabIndex={i === selected ? 0 : -1}
                >
                  {lowRes && (
                    <Image
                      src={photo.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="100vw"
                      /* Tiny on purpose: it is 32px of blur, and it doubles the
                         request count on the slides that use it. */
                      quality={25}
                      loading={i === 0 || warm.has(i) ? "eager" : "lazy"}
                      className={styles.fillImg}
                    />
                  )}
                  <Image
                    src={photo.src}
                    alt={slide.kind === "photo" ? photo.alt[lang] : ""}
                    fill
                    sizes="100vw"
                    quality={75}
                    priority={i === 0}
                    loading={i === 0 || warm.has(i) ? "eager" : "lazy"}
                    className={`${styles.img} ${lowRes ? styles.imgFit : ""}`}
                  />
                  {slide.kind === "video" && (
                    <span className={styles.playWrap} aria-hidden="true">
                      <span className={styles.play}>▶</span>
                      <span className={`label ${styles.playText}`}>
                        {t.videoLabel}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two grades, one at a time — see the comment at the top of the
            stylesheet. `.shade` runs on a phone and leaves the middle of the
            photograph alone; `.wash` is the desktop overlay ground. */}
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.wash} aria-hidden="true" />

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => emblaApi?.scrollPrev()}
            aria-label={t.prev}
          >
            ←
          </button>
          <span className={`label ${styles.counter}`} aria-live="polite">
            {String(selected + 1).padStart(2, "0")}
            <span className={styles.counterSep}>/</span>
            {String(slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => emblaApi?.scrollNext()}
            aria-label={t.next}
          >
            →
          </button>
        </div>

          <span className={styles.progress} aria-hidden="true">
            <span ref={fillRef} className={styles.progressFill} />
          </span>
        </div>

        {/* ONE masthead, two compositions. On a phone it flows here, under the
            photograph, on the page's own ink — nothing is laid over the image,
            so the image needs no scrim to defend the type. From 900px the same
            block is absolutely positioned back over the foot of the frame. */}
        <div className={`shell ${styles.mast}`}>{children}</div>
      </div>

      {/* ---- thumb strip ---- */}
      <div className={`shell ${styles.thumbsWrap}`}>
        <ul className={styles.thumbs}>
          {slides.map((slide, i) => {
            const photo =
              slide.kind === "photo" ? PHOTOS[slide.id] : PHOTOS[slide.poster];
            return (
              <li key={slide.kind === "photo" ? slide.id : slide.src}>
                <button
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`${styles.thumb} ${i === selected ? styles.thumbOn : ""}`}
                  aria-label={
                    slide.kind === "photo" ? photo.alt[lang] : t.videoLabel
                  }
                  aria-current={i === selected}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 1164px) 8rem, (min-width: 455px) 11vw, 5rem"
                    quality={60}
                    className={styles.thumbImg}
                  />
                  {slide.kind === "video" && (
                    <span className={styles.thumbPlay} aria-hidden="true">
                      ▶
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {/* The « image d'illustration » caption stood here while some galleries
            showed another building. Both are gone as of 2026-08-12. */}
      </div>
    </div>
  );
}
