import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./lib/i18n/config";

const nextConfig: NextConfig = {
  /**
   * Build output directory, overridable per-process.
   *
   * `next dev` and `next build` both own `.next`, so running a build while a
   * dev server is up swaps the directory underneath it and the running server
   * starts throwing 500s — which looks exactly like the OneDrive cache
   * corruption noted in CLAUDE.md, but isn't.
   *
   * Set NEXT_DIST_DIR to give a one-off build its own directory:
   *   NEXT_DIST_DIR=.next-verify npx next build
   *   NEXT_DIST_DIR=.next-verify npx next start -p 3201
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  experimental: {
    /* Lets `app/global-not-found.tsx` own <html> for requests that never reach
       the [lang] segment. Required because this project has no app/layout.tsx —
       the root layout is app/[lang]/layout.tsx so <html lang> can vary. */
    globalNotFound: true,
  },

  images: {
    /* AVIF first. The audience is on Cameroonian mobile data and the
       photography is heavy — this is the single cheapest win available. */
    formats: ["image/avif", "image/webp"],
    /* Must be declared explicitly — the optimizer 400s on any `quality` value
       not in this list, and these photographs want a lower setting than the
       default 75 to stay inside a sane mobile budget. */
    qualities: [60, 72, 75, 78],
    /* Trimmed from the Next defaults: mobile-first, and nothing here is ever
       rendered above ~2048 CSS px. Fewer sizes = fewer cold-start encodes. */
    deviceSizes: [360, 420, 640, 828, 1080, 1440, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: `/${DEFAULT_LOCALE}`,
        /* Deliberately temporary: the default locale is a content decision and
           a cached 301 would be painful to walk back. */
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
