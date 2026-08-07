"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";
import { formatEventDate, type GlenEvent } from "@/lib/events";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./EventPage.module.css";

/**
 * An event's own page — generated for every entry in `lib/events.ts`, so the
 * venue never has to build one by hand.
 *
 * A one-off whose date has passed keeps its page rather than 404ing: shared
 * links and search results outlive the night itself. It just has to say so
 * plainly at the top instead of still reading as an invitation.
 */
export default function EventPage({
  event,
  past,
  lang,
  dict,
}: {
  event: GlenEvent;
  past: boolean;
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(rootRef, titleRef);

  const photo = PHOTOS[event.photo];
  const eventsBase = href("evenements", lang);

  const whenLine =
    event.kind === "one-off" && event.date
      ? formatEventDate(event.date, lang)
      : dict.evenementsPage.recurring;

  return (
    <article ref={rootRef} className={styles.page}>
      <header className={styles.hero}>
        {event.layout === "poster" ? (
          /* Artwork shown whole, not cropped — see the note in lib/events.ts. */
          <div className={styles.poster}>
            <Image
              src={photo.src}
              alt={photo.alt[lang]}
              width={photo.w}
              height={photo.h}
              priority
              className={styles.posterImg}
              sizes="(max-width: 900px) 70vw, 32vw"
              quality={78}
            />
          </div>
        ) : (
          <div className={styles.media}>
            <Image
              src={photo.src}
              alt={photo.alt[lang]}
              fill
              priority
              sizes="100vw"
              quality={78}
            />
          </div>
        )}
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={`label ${styles.when}`}>{event.when[lang]}</p>
          <h1 ref={titleRef} className={styles.title}>
            {event.title[lang]}
          </h1>
          <p className={styles.summary}>{event.summary[lang]}</p>
          <div className={styles.chips}>
            {event.highlights.map((h) => (
              <span key={h.fr} className={styles.chip}>
                <span className={styles.chipDot} aria-hidden="true" />
                {h[lang]}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className={`shell ${styles.body}`}>
        <div className={styles.prose}>
          {past && <p className={styles.notice}>{dict.evenementsPage.pastNotice}</p>}
          {event.body[lang].map((para) => (
            <p key={para.slice(0, 40)} data-reveal>
              {para}
            </p>
          ))}
        </div>

        <aside className={styles.aside}>
          {event.lineup && event.lineup.length > 0 && (
            <div className={styles.block} data-reveal>
              <h2 className={`label ${styles.blockTitle}`}>
                {dict.evenementsPage.lineup}
              </h2>
              <ul className={styles.lineupList}>
                {event.lineup.map((name) => (
                  <li key={name} className={styles.lineupItem}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.block} data-reveal>
            <h2 className={`label ${styles.blockTitle}`}>
              {dict.evenementsPage.when}
            </h2>
            <p className={styles.blockBody}>
              {event.kind === "one-off" && event.date ? (
                <time dateTime={event.date}>{whenLine}</time>
              ) : (
                whenLine
              )}
            </p>
            <p className="label">{event.when[lang]}</p>
          </div>

          <div className={styles.block} data-reveal>
            <h2 className={`label ${styles.blockTitle}`}>
              {dict.evenementsPage.where}
            </h2>
            <p className={styles.blockBody}>{dict.contact.directions}</p>
          </div>

          <div className={styles.block} data-reveal>
            <h2 className={`label ${styles.blockTitle}`}>
              {dict.evenementsPage.booking}
            </h2>
            <p className={styles.blockBody}>{site.contact.phonePrimary.display}</p>
            <div className={styles.actions}>
              <a className="btn" href={`tel:${site.contact.phonePrimary.tel}`}>
                {dict.evenementsPage.cta}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className={`shell ${styles.foot}`}>
        <Link className="btn" href={eventsBase}>
          {dict.evenementsPage.backToEvents}
        </Link>
        <Link className="btn" href={href("home", lang)}>
          {dict.evenementsPage.backHome}
        </Link>
      </div>
    </article>
  );
}
