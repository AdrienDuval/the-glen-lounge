"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import type { Slide } from "@/lib/apartments";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./StudioLightbox.module.css";

/**
 * Full-screen viewer for the studio gallery.
 *
 * The thumbnails are small by necessity — a phone cannot show seven rooms at
 * once — so the page needs somewhere to send a visitor who wants to actually
 * look. Keyboard: ← → to move, Escape to leave.
 *
 * Scroll goes through `lib/scrollLock`, not `body.style.overflow`, because the
 * preloader and the nav drawer share that lock and a raw write clobbers them.
 *
 * The caption rides along: these are placeholder photographs, and blown up to
 * fill a screen they are more persuasive, not less, so the disclosure matters
 * more here than anywhere else on the page.
 *
 * This is also where the walkthrough clip plays — with controls, and only once
 * the visitor has chosen the slide. Arrow keys still move off it, so the video
 * is unmounted on navigation and stops with it; nothing keeps playing behind a
 * photograph.
 */
export default function StudioLightbox({
  slides,
  index,
  onClose,
  onMove,
  lang,
  dict,
}: {
  slides: readonly Slide[];
  /** null = closed. */
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
  lang: Lang;
  dict: Dict;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  /* The dialog root, so the inerting loop below can skip the branch of <body>
     that contains it. */
  const hostRef = useRef<HTMLDivElement>(null);
  /* Where focus came from, so Escape returns it there rather than to <body>. */
  const returnTo = useRef<HTMLElement | null>(null);

  const move = useCallback(
    (delta: number) => {
      if (index === null) return;
      onMove((index + delta + slides.length) % slides.length);
    },
    [index, onMove, slides.length]
  );

  /* Two effects, deliberately. `move` changes identity on every navigation, so
     folding the listener in with the lock made one ← keypress release the
     scroll lock, punt focus to the thumbnail behind the overlay, re-lock and
     re-focus — every time. The lock and the focus handoff belong to the
     lifetime of the dialog; only the listener cares about `move`. */
  useEffect(() => {
    if (!open) return;

    returnTo.current = document.activeElement as HTMLElement | null;
    lockScroll();
    closeRef.current?.focus();

    /* ⚠️ THE `aria-modal` PROMISE HAS TO BE KEPT FOR THE KEYBOARD TOO.
       Nothing enforced it: Tab went close → prev → next → and then straight out
       into the FOOTER's phone number, behind an opaque backdrop with the scroll
       locked, so the focused element could not even be brought into view.

       Same remedy the nav drawer already uses (Nav.tsx), and the host is
       filtered out BY REFERENCE rather than by selector — this dialog renders
       inside <main>, so inerting every child of <body> blindly would inert its
       own ancestor and take the dialog with it. `.inert` is skipped so a lock
       taken by the drawer is not released by this effect's cleanup. */
    const host = hostRef.current;
    const dimmed = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && !el.contains(host) && !el.inert
    );
    dimmed.forEach((el) => (el.inert = true));

    return () => {
      dimmed.forEach((el) => (el.inert = false));
      unlockScroll();
      returnTo.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, move]);

  if (index === null) return null;

  const slide = slides[index];
  const photo = slide.kind === "photo" ? PHOTOS[slide.id] : PHOTOS[slide.poster];
  const t = dict.studios;

  return (
    <div
      ref={hostRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery}
      /* Backdrop only — a click that started on the image must not close. */
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        /* Was `dict.nav.closeMenu`, so the gallery's close control announced
           « Fermer le menu » — the wrong control entirely. */
        aria-label={t.closeGallery}
      >
        ✕
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        onClick={() => move(-1)}
        aria-label={t.prev}
      >
        ←
      </button>

      <figure className={styles.figure}>
        <div
          className={`${styles.stage} ${
            slide.kind === "video" ? styles.stageVideo : ""
          }`}
        >
          {slide.kind === "photo" ? (
            <Image
              src={photo.src}
              alt={photo.alt[lang]}
              fill
              sizes="(min-width: 720px) 82vw, 100vw"
              quality={75}
              className={styles.img}
            />
          ) : (
            /* Keyed on `src` so React remounts rather than reusing the element
               across a navigation — a reused <video> keeps its playback state
               and would resume mid-clip on a second visit to the slide.
               `autoPlay` is safe here because opening this slide IS the request
               to watch it, and `playsInline` stops iOS taking it fullscreen.

               `muted` is not timidity: an unmuted autoplay is refused outright
               by the stricter autoplay policies, so without it the same slide
               would play in one browser and sit dead in another. These are
               phone walkthroughs — the audio is uncontrolled room noise, not
               narration — and `controls` is right there to unmute. */
            <video
              key={slide.src}
              className={styles.video}
              src={slide.src}
              poster={photo.src}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
        <figcaption className={styles.caption}>
          <span className={`label ${styles.counter}`}>
            {index + 1} / {slides.length}
          </span>
          {slide.kind === "video" && (
            <span className={`label ${styles.notice}`}>{t.videoLabel}</span>
          )}
        </figcaption>
      </figure>

      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        onClick={() => move(1)}
        aria-label={t.next}
      >
        →
      </button>
    </div>
  );
}
