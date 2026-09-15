"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type VideoHTMLAttributes,
} from "react";
import Image, { type ImageProps } from "next/image";
import styles from "./FadeImage.module.css";

/**
 * The house wait plate — a gold hairline over `--ink-2`.
 *
 * Shared by `FadeImage` and `FadeVideo` so a photograph and a clip wait the
 * same way. `ready` fades it out; a cached file that is already decoded
 * should pass `true` before the first paint (see the layout effect in
 * FadeImage) so the plate never flashes on a warm cache.
 */
export function WaitPlate({ ready }: { ready: boolean }) {
  return (
    <span
      className={`${styles.wait} ${ready ? styles.waitOff : ""}`}
      aria-hidden="true"
    >
      <span className={styles.hair} />
    </span>
  );
}

function srcKey(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if (typeof src === "object" && src && "src" in src) return src.src;
  return String(src);
}

/**
 * `next/image` plus the wait plate.
 *
 * Drop-in for a framed photograph. The `<img>` stays in the tree so
 * `useSectionMotion`'s `.frame img` scale, the card hover zoom, and any
 * module class on the image keep working — the plate is a sibling, not a
 * wrapper around the pixels.
 *
 * `fill` follows Next's own rule (this component becomes the positioned
 * parent). Without `fill`, pass `layout="intrinsic"` for artwork that must
 * keep its ratio (a flyer); the default `box` fills a parent that already
 * has a size.
 */
export default function FadeImage({
  className,
  onLoad,
  alt,
  fill,
  layout = "box",
  ...rest
}: ImageProps & { layout?: "box" | "intrinsic" }) {
  const key = srcKey(rest.src);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(key);
  const done = useRef(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  if (key !== seen) {
    setSeen(key);
    setReady(false);
    done.current = false;
  }

  const note = () => {
    if (done.current) return;
    done.current = true;
    setReady(true);
  };

  useLayoutEffect(() => {
    const img = wrapRef.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) note();
  }, [key]);

  const mode = fill ? "fill" : layout === "intrinsic" ? "intrinsic" : "box";

  return (
    <span ref={wrapRef} className={styles[mode]}>
      <WaitPlate ready={ready} />
      <Image
        {...rest}
        fill={fill}
        alt={alt}
        className={className}
        onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
          note();
          onLoad?.(e);
        }}
      />
    </span>
  );
}

/**
 * Same wait plate over a `<video>`. Used by the hero banner and the studio
 * lightbox, which mount a clip on demand the same way they mount a still.
 */
export function FadeVideo({
  className,
  onCanPlay,
  src,
  ...rest
}: VideoHTMLAttributes<HTMLVideoElement>) {
  const key = typeof src === "string" ? src : "";
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(key);

  if (key !== seen) {
    setSeen(key);
    setReady(false);
  }

  return (
    <span className={styles.fill}>
      <WaitPlate ready={ready} />
      <video
        {...rest}
        src={src}
        className={className}
        onCanPlay={(e) => {
          setReady(true);
          onCanPlay?.(e);
        }}
      />
    </span>
  );
}
