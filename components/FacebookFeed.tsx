"use client";

import { site } from "@/lib/site";
import styles from "./FacebookFeed.module.css";

/**
 * Meta's own Page Plugin — the one platform of the three with a live-feed
 * embed that needs no API token or app review (see the seam note in
 * Social.tsx for why Instagram and TikTok don't get the same treatment yet).
 *
 * Auto-parsed by the shared `FacebookSdk` mount (`xfbml=1` scans the DOM for
 * `.fb-page` on load and swaps in the iframe, no `FB.init` call needed) — this
 * component assumes that SDK is already on the page. Locale only changes the
 * widget's own chrome (button labels, "il y a 2 j" vs "2d ago"); the posts
 * render in whatever language the venue posted them in either way.
 */
export default function FacebookFeed() {
  return (
    <div className={styles.wrap}>
      <div
        className="fb-page"
        data-href={site.social.facebook.url}
        data-tabs="timeline"
        data-width="500"
        data-height="640"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
        data-color-scheme="dark"
      >
        {/* Shown until the SDK swaps this block for the live iframe, and kept
            for anyone with third-party scripts blocked. */}
        <blockquote cite={site.social.facebook.url} className="fb-xfbml-parse-ignore">
          <a href={site.social.facebook.url} target="_blank" rel="noopener noreferrer">
            {site.social.facebook.handle}
          </a>
        </blockquote>
      </div>
    </div>
  );
}
