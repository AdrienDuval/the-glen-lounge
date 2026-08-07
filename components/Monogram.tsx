import styles from "./Monogram.module.css";

type Props = {
  /** Rendered size in px — drives both the glyph and its backlight. */
  size?: number;
  /** 0–1. The Preloader animates this from 0 so the backlight blooms. */
  glow?: number;
  className?: string;
};

/**
 * The « G » mark.
 *
 * ⚠️ THIS IS A STAND-IN, BY DESIGN. The venue's real logo — a circular badge
 * with a chef's toque, a fork and a house enclosing a « G » — exists only as a
 * 439×439 JPEG (public/brand/tiktok-avatar.jpg), which is far too small to
 * trace faithfully. Requesting the vector original is the highest-value open
 * item in FACTS.md.
 *
 * Rather than block the build or fake the mark, this renders the letter in the
 * display face with the logo's own sampled gradient, echoing the back-lit « G »
 * that physically hangs behind the bar (see PHOTOS.bar_monogram). When the
 * vector lands, only this component changes — every caller keeps its API.
 */
export default function Monogram({ size = 96, glow = 1, className }: Props) {
  return (
    <span
      className={`${styles.root} ${className ?? ""}`}
      style={
        {
          "--mono-size": `${size}px`,
          "--mono-glow": glow,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className={styles.glow} />
      <span className={styles.letter}>G</span>
    </span>
  );
}
