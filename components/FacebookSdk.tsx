"use client";

import Script from "next/script";
import type { Lang } from "@/lib/i18n/config";

/**
 * Loads Meta's JS SDK exactly once, however many `.fb-page` / `.fb-video`
 * widgets end up on the page (`FacebookFeed`, `FacebookVideoEmbed`) — they all
 * get auto-parsed by the one `xfbml=1` load. The `id` is what makes a second
 * mount of this component a no-op for `next/script` rather than a duplicate
 * script tag.
 *
 * `version` is not optional in the URL fragment: leaving it out throws a
 * page-breaking `Runtime Error: invalid version specified` from the SDK
 * itself, caught the hard way in this project on 2026-09-26.
 */
const FB_LOCALE: Record<Lang, string> = {
  fr: "fr_FR",
  en: "en_US",
};

export default function FacebookSdk({ lang }: { lang: Lang }) {
  return (
    <>
      <div id="fb-root" />
      <Script
        id="facebook-jssdk"
        src={`https://connect.facebook.net/${FB_LOCALE[lang]}/sdk.js#xfbml=1&version=v23.0`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </>
  );
}
