import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, IBM_Plex_Mono } from "next/font/google";
import { fr } from "@/lib/i18n/fr";
import { en } from "@/lib/i18n/en";
import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/config";
import "./globals.css";

/**
 * 404 for paths that never reach a locale at all — `/foo`, `/en-gb`, anything
 * outside `[lang]`. Those requests have no layout above them (this project's
 * root layout lives at `app/[lang]/layout.tsx`), so this file has to bring its
 * own <html> and fonts.
 *
 * Locale-scoped misses (`/fr/anything`) are handled by `[lang]/not-found.tsx`,
 * which is the nicer path because it renders inside the real layout.
 */

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — The Glen Lounge",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang={HTML_LANG[DEFAULT_LOCALE]}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <div
          style={{
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "var(--gut)",
            textAlign: "center",
          }}
        >
          <p className="label label--gold">{fr.notFound.eyebrow}</p>
          <h1 style={{ fontSize: "var(--fs-h2)", maxWidth: "20ch" }}>
            {fr.notFound.title}
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "44ch" }}>
            {fr.notFound.body}
          </p>
          <p className="label" style={{ color: "var(--marble-hi)", maxWidth: "44ch" }}>
            {en.notFound.title} — {en.notFound.body}
          </p>
          <a
            href={`/${DEFAULT_LOCALE}`}
            className="label label--gold"
            style={{
              marginTop: "1rem",
              padding: "0.7rem 1.4rem",
              border: "1px solid var(--gold)",
              textDecoration: "none",
            }}
          >
            {fr.notFound.cta}
          </a>
        </div>
      </body>
    </html>
  );
}
