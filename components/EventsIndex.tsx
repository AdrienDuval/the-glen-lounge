"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";
import type { GlenEvent } from "@/lib/events";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./EventsIndex.module.css";

/**
 * The events index. Cards are generated from `lib/events.ts`, so a new event
 * appears here, in the hero banner and as its own page from one edit.
 *
 * One-offs come first and the soonest is featured full-width — a dated night
 * is news in a way a recurring one is not. Expired one-offs drop out here
 * (their pages stay up so shared links keep working).
 */
export default function EventsIndex({
  events,
  lang,
  dict,
}: {
  events: GlenEvent[];
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(rootRef, titleRef);

  const base = href("evenements", lang);
  const oneOffs = events.filter((e) => e.kind === "one-off");
  const weekly = events.filter((e) => e.kind === "weekly");

  const Card = ({ event, featured }: { event: GlenEvent; featured?: boolean }) => {
    const photo = PHOTOS[event.photo];
    /* Event artwork is a portrait flyer that carries its own typography, so it
       is shown WHOLE — the hero, the event masthead and the calendar popover
       all already branch on this and only the index did not. Cover-cropping
       the Bal des Vétérans flyer into the 16:10 featured frame cut its title
       off the top and the venue block off the bottom, on the one page whose
       job is to sell the night. */
    const poster = event.layout === "poster";
    return (
      <Link
        href={`${base}/${event.slug}`}
        className={`${styles.card} ${featured ? styles.featured : ""}`}
      >
        <div
          className={`frame ${styles.media} ${poster ? styles.mediaPoster : ""}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt[lang]}
            fill
            sizes={featured ? "(max-width: 720px) 92vw, 45rem" : "(max-width: 720px) 92vw, 26rem"}
            quality={72}
          />
        </div>
        <div className={styles.body}>
          <p className={`label ${styles.when}`}>{event.when[lang]}</p>
          <h3 className={styles.cardTitle}>{event.title[lang]}</h3>
          <p className={styles.summary}>{event.summary[lang]}</p>
          <div className={styles.chips}>
            {event.highlights.map((h) => (
              <span key={h.fr} className={styles.chip}>
                {h[lang]}
              </span>
            ))}
          </div>
          <p className={`label ${styles.more}`}>{dict.evenementsPage.readMore} →</p>
        </div>
      </Link>
    );
  };

  return (
    <section ref={rootRef} className={`shell ${styles.page}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.evenementsPage.eyebrow}
        </p>
        <h1 ref={titleRef} className={styles.title}>
          {dict.evenementsPage.title}
        </h1>
        <p className={styles.lede} data-reveal>
          {dict.evenementsPage.lede}
        </p>
      </div>

      <div className="rule" data-rule />

      {oneOffs.length > 0 && (
        <div className={styles.group}>
          <h2 className={`label ${styles.groupTitle}`}>
            {dict.evenementsPage.upcoming}
          </h2>
          <div className={styles.grid}>
            {oneOffs.map((e, i) => (
              <Card key={e.slug} event={e} featured={i === 0} />
            ))}
          </div>
        </div>
      )}

      {weekly.length > 0 && (
        <div className={styles.group}>
          <h2 className={`label ${styles.groupTitle}`}>
            {dict.evenementsPage.weekly}
          </h2>
          <div className={styles.grid}>
            {weekly.map((e) => (
              <Card key={e.slug} event={e} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
