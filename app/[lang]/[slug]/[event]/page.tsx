import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EventPage from "@/components/EventPage";
import StudioPage from "@/components/StudioPage";
import { getDict } from "@/lib/i18n";
import { isLang, LOCALES, type Lang } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";
import { allEventSlugs, eventBySlug, isPast } from "@/lib/events";
import { allStudioSlugs, otherStudios, studioBySlug } from "@/lib/apartments";
import { PHOTOS } from "@/lib/photos";

/**
 * Detail pages, two segments deep — one per event, one per studio.
 *
 * The parent segment decides which: `/fr/evenements/<slug>` renders an event,
 * `/fr/appartements/<slug>` a studio. The folder is still called `[event]`
 * because renaming a route segment rewrites every generated path; read it as
 * "the second segment", whatever it names.
 *
 * Adding an event to `lib/events.ts` or a studio to `lib/apartments.ts` creates
 * both language versions of its page — nobody writes a route.
 *
 * `allEventSlugs()` deliberately includes expired one-offs. Their page keeps
 * working so shared links and search results do not rot; the page itself says
 * the night has passed.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => [
    ...allEventSlugs().map((event) => ({
      lang,
      slug: ROUTES.evenements[lang],
      event,
    })),
    ...allStudioSlugs().map((event) => ({
      lang,
      slug: ROUTES.appartements[lang],
      event,
    })),
  ]);
}

/** Which section a localised parent segment belongs to. */
function sectionOf(lang: Lang, slug: string): "evenements" | "appartements" | null {
  if (slug === ROUTES.evenements[lang]) return "evenements";
  if (slug === ROUTES.appartements[lang]) return "appartements";
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string; event: string }>;
}): Promise<Metadata> {
  const { lang, slug: parent, event: slug } = await params;
  if (!isLang(lang)) notFound();

  if (sectionOf(lang, parent) === "appartements") {
    const studio = studioBySlug(slug);
    if (!studio) notFound();
    const dict = getDict(lang);
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, `/${l}/${ROUTES.appartements[l as Lang]}/${slug}`])
    );
    return {
      title: `${lang === "fr" ? "Studio" : "Studio"} ${studio.code} — Glen Appartement, Yaoundé`,
      description: dict.studios.lede,
      alternates: {
        canonical: `/${lang}/${ROUTES.appartements[lang]}/${slug}`,
        languages: {
          ...languages,
          "x-default": `/fr/${ROUTES.appartements.fr}/${slug}`,
        },
      },
      /* This was here because preview data and placeholder photography must not
         be indexed as though they described a real room.
         ⚠️ 2026-08-12: that reason is gone. The undocumented units are unlisted
         and the stock photography is deleted, so every studio page that exists
         now shows this building and states only what the client told us. There
         is no longer a `confirmed` flag to gate on — every remaining unit would
         have passed it.
         Still `index: false`, and deliberately so: publishing these pages to
         search engines is an outward-facing decision that is the client's, not
         ours, and the site still badges itself « en construction ». Flip this to
         `true` once they say go. */
      robots: { index: false, follow: true },
    };
  }

  const event = eventBySlug(slug);
  if (!event) notFound();

  const photo = PHOTOS[event.photo];
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}/${ROUTES.evenements[l as Lang]}/${slug}`])
  );

  return {
    title: `${event.title[lang]} — The Glen Lounge, Yaoundé`,
    description: event.summary[lang],
    alternates: {
      canonical: `/${lang}/${ROUTES.evenements[lang]}/${slug}`,
      languages: {
        ...languages,
        "x-default": `/fr/${ROUTES.evenements.fr}/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: event.title[lang],
      description: event.summary[lang],
      images: [{ url: photo.src, width: photo.w, height: photo.h }],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string; event: string }>;
}) {
  const { lang, slug: parent, event: slug } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang);
  const section = sectionOf(lang, parent);

  const studio = section === "appartements" ? studioBySlug(slug) : undefined;
  if (section === "appartements" && !studio) notFound();

  const event = section === "evenements" ? eventBySlug(slug) : undefined;
  if (section === "evenements" && !event) notFound();

  return (
    <>
      <a href="#main" className="skip">
        {dict.nav.skip}
      </a>
      <Nav lang={lang} dict={dict} />
      <main id="main">
        {studio ? (
          <StudioPage
            studio={studio}
            others={otherStudios(studio.slug)}
            lang={lang}
            dict={dict}
          />
        ) : event ? (
          <EventPage
            event={event}
            past={isPast(event, new Date())}
            lang={lang}
            dict={dict}
          />
        ) : (
          notFound()
        )}
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
