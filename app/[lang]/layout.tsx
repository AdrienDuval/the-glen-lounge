import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import { getDict } from "@/lib/i18n";
import {
  LOCALES,
  DEFAULT_LOCALE,
  HTML_LANG,
  OG_LOCALE,
  isLang,
} from "@/lib/i18n/config";
import "../globals.css";

/**
 * This is the root layout. There is deliberately no `app/layout.tsx` — with a
 * `[lang]` segment at the top, this file owns <html> so the `lang` attribute
 * can actually change per locale. `/` redirects here via next.config.
 */

/* Display: a Didone. High contrast holds up at hero size over dark marble and
   echoes the serif caps of the venue's own wordmark. */
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * TODO: no production domain has been chosen (FACTS.md open question #12).
 * Until then metadataBase falls back to the dev origin, which keeps relative
 * OG/canonical URLs resolvable without inventing a hostname. Set
 * NEXT_PUBLIC_SITE_URL in the Vercel project and this becomes correct.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang);

  const title =
    lang === "fr"
      ? "The Glen Lounge — Restaurant, lounge et appartements à Yaoundé"
      : "The Glen Lounge — Restaurant, lounge and apartments in Yaoundé";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: dict.hero.lede,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "The Glen Lounge",
      title,
      description: dict.hero.lede,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url: `/${lang}`,
      // TODO: a dedicated OG image once the vector logo lands.
      images: [{ url: "/photos/interior-lounge-04.jpg", width: 2048, height: 1152 }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06090c",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html
      lang={HTML_LANG[lang]}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
