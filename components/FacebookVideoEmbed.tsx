"use client";

import styles from "./FacebookVideoEmbed.module.css";

/**
 * Meta's single-video plugin — the same family as `FacebookFeed`'s Page
 * Plugin, auto-parsed by the same shared `FacebookSdk` mount. Unlike the
 * timeline, this takes any Facebook video URL, share links included; no
 * canonical permalink needs resolving first.
 */
export default function FacebookVideoEmbed({ href }: { href: string }) {
  return (
    <div className={styles.wrap}>
      <div
        className="fb-video"
        data-href={href}
        data-width="350"
        data-show-text="false"
        data-allowfullscreen="true"
      >
        {/* Shown until the SDK swaps this block for the live iframe, and
            kept for anyone with third-party scripts blocked. */}
        <blockquote cite={href} className="fb-xfbml-parse-ignore">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {href}
          </a>
        </blockquote>
      </div>
    </div>
  );
}
