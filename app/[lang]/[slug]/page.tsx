import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Carte from "@/components/Carte";
import EventsIndex from "@/components/EventsIndex";
import StudiosIndex from "@/components/StudiosIndex";
import { getDict } from "@/lib/i18n";
import { isLang, LOCALES, type Lang } from "@/lib/i18n/config";
import { ROUTES, routeIdFor, staticSlugs } from "@/lib/routes";
import { activeEvents } from "@/lib/events";

/**
 * Inner pages, one dynamic segment deep.
 *
 * Slugs are localised — `/fr/carte` and `/en/menu` are the same page — so the
 * route table in `lib/routes.ts` decides which exist. Anything not in it 404s
 * via `dynamicParams = false`, landing on `app/[lang]/not-found.tsx` inside the
 * real layout.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return staticSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const id = routeIdFor(lang, slug);
  if (!id) notFound();
  const dict = getDict(lang);

  const meta = {
    carte: {
      title:
        lang === "fr"
          ? "La carte — The Glen Lounge, Yaoundé"
          : "Menu — The Glen Lounge, Yaoundé",
      description: dict.carte.lede,
    },
    evenements: {
      title:
        lang === "fr"
          ? "Les soirées — The Glen Lounge, Yaoundé"
          : "What's on — The Glen Lounge, Yaoundé",
      description: dict.evenementsPage.lede,
    },
    appartements: {
      title:
        lang === "fr"
          ? "Appartements meublés — The Glen Lounge, Yaoundé"
          : "Furnished apartments — The Glen Lounge, Yaoundé",
      description: dict.studios.lede,
    },
    home: { title: "", description: "" },
  }[id];

  /* Alternates come from the table, not from swapping a path segment — the
     slug itself differs between languages. */
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}/${ROUTES[id][l as Lang]}`])
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: { ...languages, "x-default": `/fr/${ROUTES[id].fr}` },
    },
  };
}

export default async function InnerPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const id = routeIdFor(lang, slug);
  const dict = getDict(lang);

  return (
    <>
      <a href="#main" className="skip">
        {dict.nav.skip}
      </a>
      <Nav lang={lang} dict={dict} />
      <main id="main">
        {id === "carte" ? (
          <Carte lang={lang} dict={dict} />
        ) : id === "evenements" ? (
          <EventsIndex events={activeEvents(new Date())} lang={lang} dict={dict} />
        ) : id === "appartements" ? (
          <StudiosIndex lang={lang} dict={dict} />
        ) : (
          notFound()
        )}
      </main>
      <Footer dict={dict} />
    </>
  );
}
