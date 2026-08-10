"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { PHOTOS, type PhotoId } from "@/lib/photos";
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
 */
export default function StudioLightbox({
  photos,
  index,
  onClose,
  onMove,
  lang,
  dict,
}: {
  photos: readonly PhotoId[];
  /** null = closed. */
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
  lang: Lang;
  dict: Dict;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  /* Where focus came from, so Escape returns it there rather than to <body>. */
  const returnTo = useRef<HTMLElement | null>(null);

  const move = useCallback(
    (delta: number) => {
      if (index === null) return;
      onMove((index + delta + photos.length) % photos.length);
    },
    [index, onMove, photos.length]
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

    return () => {
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

  const photo = PHOTOS[photos[index]];
  const t = dict.studios;

  return (
    <div
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
        aria-label={dict.nav.closeMenu}
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
        <div className={styles.stage}>
          <Image
            src={photo.src}
            alt={photo.alt[lang]}
            fill
            sizes="92vw"
            quality={78}
            className={styles.img}
          />
        </div>
        <figcaption className={styles.caption}>
          <span className={`label ${styles.counter}`}>
            {index + 1} / {photos.length}
          </span>
          <span className={`label ${styles.notice}`}>{t.photoNotice}</span>
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
