import { notFound } from "next/navigation";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Trois from "@/components/Trois";
import Calendrier from "@/components/Calendrier";
import Lieu from "@/components/Lieu";
import Evenements from "@/components/Evenements";
import Appartements from "@/components/Appartements";
import Ecrans from "@/components/Ecrans";
import Social from "@/components/Social";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/i18n";
import { isLang } from "@/lib/i18n/config";
import { activeSlides } from "@/lib/banner";

/**
 * Section order is demand-led, taken from what actually performs on their
 * TikTok rather than from taste — see CONTRACT.md and the play counts in
 * FACTS.md. Show the space, then what's on, then the three-in-one pitch,
 * then the week, with private hire and apartments given their own routes.
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
        <Evenements lang={lang} dict={dict} />
        <Appartements lang={lang} dict={dict} />
        <Ecrans lang={lang} dict={dict} />
        <Social dict={dict} />
        <Contact lang={lang} dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
