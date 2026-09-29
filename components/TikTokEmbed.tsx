"use client";

import Script from "next/script";
import styles from "./TikTokEmbed.module.css";

/**
 * TikTok has no "latest posts" widget (see the seam note in Social.tsx) —
 * only its embed.js, which renders one post you name yourself. `embed.js`
 * finds every `.tiktok-embed` blockquote on the page itself, so multiple
 * instances of this component share the one script tag (`id` below is what
 * makes a second mount a no-op for `next/script`).
 */
export default function TikTokEmbed({
  url,
  videoId,
}: {
  url: string;
  videoId: string;
}) {
  return (
    <div className={styles.wrap}>
      <blockquote
        className={`tiktok-embed ${styles.embed}`}
        cite={url}
        data-video-id={videoId}
      >
        {/* Shown until embed.js swaps this block for the live iframe, and
            kept for anyone with third-party scripts blocked. */}
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </section>
      </blockquote>
      <Script id="tiktok-embed-js" src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
    </div>
  );
}
