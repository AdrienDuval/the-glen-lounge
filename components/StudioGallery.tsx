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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
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
   * frame and its two immediate neighbours — the wrap matters, because under
   * `loop: true` ← from the first slide lands on the last — and widens to a
   * radius of two on the first real move. One slide of lead time was not enough:
   * a steady click through → at 1365×640 arrived at the fifth frame ~280ms after
   * it started fetching and still showed black. Two is what held.
   *
   * The wider radius deliberately does NOT apply at mount, or first paint would
   * fetch five full-width images before the visitor had asked for any of them.
   * That is also why the widening hangs off Embla's `select` event rather than
   * the manual priming call below: `select` fires only when the snap changes.
   *
   * The set only ever grows — an image that has decoded is not worth un-marking.
   */
  const [warm, setWarm] = useState<ReadonlySet<number>>(
    () => new Set([slides.length - 1, 0, 1 % slides.length])
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
                  <Image
                    src={photo.src}
                    alt={slide.kind === "photo" ? photo.alt[lang] : ""}
                    fill
                    sizes="100vw"
                    quality={75}
                    priority={i === 0}
                    loading={i === 0 || warm.has(i) ? "eager" : "lazy"}
                    className={styles.img}
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
                    sizes="9rem"
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
