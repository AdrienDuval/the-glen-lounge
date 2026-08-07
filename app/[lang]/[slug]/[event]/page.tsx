import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EventPage from "@/components/EventPage";
import { getDict } from "@/lib/i18n";
import { isLang, LOCALES, type Lang } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";
import { allEventSlugs, eventBySlug, isPast } from "@/lib/events";
import { PHOTOS } from "@/lib/photos";

/**
 * One page per event, generated from `lib/events.ts`.
 *
 * The parent segment is the localised « evenements » / « events » slug, so the
 * pair of params is (localised section, event slug). Adding an event to the
 * data file creates both language versions of its page — nobody writes a route.
 *
 * `allEventSlugs()` deliberately includes expired one-offs. Their page keeps
 * working so shared links and search results do not rot; the page itself says
 * the night has passed.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    allEventSlugs().map((event) => ({
      lang,
      slug: ROUTES.evenements[lang],
      event,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string; event: string }>;
}): Promise<Metadata> {
  const { lang, event: slug } = await params;
  if (!isLang(lang)) notFound();
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
  const { lang, event: slug } = await params;
  if (!isLang(lang)) notFound();
  const event = eventBySlug(slug);
  if (!event) notFound();
  const dict = getDict(lang);

  return (
    <>
      <a href="#main" className="skip">
        {dict.nav.skip}
      </a>
      <Nav lang={lang} dict={dict} />
      <main id="main">
        <EventPage
          event={event}
          past={isPast(event, new Date())}
          lang={lang}
          dict={dict}
        />
      </main>
      <Footer dict={dict} />
    </>
  );
}
