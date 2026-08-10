"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PHOTOS, type PhotoId } from "@/lib/photos";
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
 */
export default function StudioGallery({
  photos,
  lang,
  dict,
  onOpen,
  children,
}: {
  photos: readonly PhotoId[];
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
        fill.style.transform = `scaleX(${(i + 1) / photos.length})`;
      }
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, photos.length]);

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {photos.map((id, i) => {
              const photo = PHOTOS[id];
              return (
                <button
                  key={id}
                  type="button"
                  className={styles.slide}
                  onClick={() => onOpen(i)}
                  aria-label={`${t.openGallery} — ${photo.alt[lang]}`}
                  /* Off-screen slides are still in the DOM and still focusable;
                     without this, Tab walks through six invisible buttons. */
                  tabIndex={i === selected ? 0 : -1}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt[lang]}
                    fill
                    sizes="100vw"
                    quality={75}
                    priority={i === 0}
                    className={styles.img}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Pointer-events off so the wash and the masthead never swallow a
            click meant for the slide underneath; the interactive bits inside
            switch them back on. */}
        <div className={styles.wash} aria-hidden="true" />
        <div className={`shell ${styles.overlay}`}>{children}</div>

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
            {String(photos.length).padStart(2, "0")}
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

      {/* ---- thumb strip ---- */}
      <div className={`shell ${styles.thumbsWrap}`}>
        <ul className={styles.thumbs}>
          {photos.map((id, i) => {
            const photo = PHOTOS[id];
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`${styles.thumb} ${i === selected ? styles.thumbOn : ""}`}
                  aria-label={photo.alt[lang]}
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
                </button>
              </li>
            );
          })}
        </ul>
        <p className={`label ${styles.caption}`}>{t.photoNotice}</p>
      </div>
    </>
  );
}
