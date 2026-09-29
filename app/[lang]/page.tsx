import { notFound } from "next/navigation";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Trois from "@/components/Trois";
import Calendrier from "@/components/Calendrier";
import Lieu from "@/components/Lieu";
// import Evenements from "@/components/Evenements";
import Appartements from "@/components/Appartements";
// import Ecrans from "@/components/Ecrans";
import Social from "@/components/Social";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CallBar from "@/components/CallBar";
import { getDict } from "@/lib/i18n";
import { isLang } from "@/lib/i18n/config";
import { activeSlides } from "@/lib/banner";

/**
 * Section order is demand-led, taken from what actually performs on their
 * TikTok rather than from taste — see CONTRACT.md and the play counts in
 * FACTS.md. Show the space, then what's on, then the three-in-one pitch,
 * then the week, with private hire and apartments given their own routes.
 *
 * 2026-09-27 — two sections hidden as a crowding pass, client's call. Both
 * components and their copy are untouched; uncomment the import and the line
 * below to bring either back.
 *
 * Restoring either one ALSO means renumbering: the eyebrows are hardcoded
 * strings in lib/i18n/{fr,en}.ts, and the survivors were closed up to run
 * 02..07 so the page does not count 02, 03, 04, 06, 08, 09. The two hidden
 * entries still carry their old « 05 » and « 07 », which now collide with
 * live sections — harmless while they do not render, a visible duplicate the
 * moment they do.
 *
 *   « Vos événements » (Evenements) — said nothing the hero's `privatisation`
 *   slide did not already say, down to the same photograph (events_table) and
 *   the same four occasions, and its only CTA was the phone number Contact
 *   prints in display type. The offer survives in the hero slide, whose button
 *   now dials instead of scrolling to a section that is no longer there.
 *
 *   « Écrans » (Ecrans) — an undated fixture board plus a carousel labelled as
 *   an archive of past soirées. « What's on » is Calendrier's job, and it does
 *   it with real dates. NOTE: this was the only place the site says it screens
 *   matches at all — restore it if the client wants sport pitched on the home
 *   page rather than only on the events route.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang);

  /* Resolved at build time. Slides outside their date window — and any whose
     photograph is not consent-cleared — never reach the client. */
  const slides = activeSlides(new Date());

  return (
    <>
      <Preloader dict={dict} />
      <a href="#main" className="skip">
        {dict.nav.skip}
      </a>
      <Nav lang={lang} dict={dict} />
      <main id="main">
        <Hero slides={slides} lang={lang} dict={dict} />
        <Trois lang={lang} dict={dict} />
        <Calendrier
          buildDate={new Date().toISOString().slice(0, 10)}
          lang={lang}
          dict={dict}
        />
        <Lieu lang={lang} dict={dict} />
        {/* <Evenements lang={lang} dict={dict} /> */}
        <Appartements lang={lang} dict={dict} />
        {/* <Ecrans lang={lang} dict={dict} /> */}
        <Social dict={dict} />
        <Contact lang={lang} dict={dict} />
      </main>
      <Footer dict={dict} lang={lang} />
      <CallBar dict={dict} />
    </>
  );
}
