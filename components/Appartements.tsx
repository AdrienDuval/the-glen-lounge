"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { isCleared, PHOTOS, shippable } from "@/lib/photos";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { PhotoId } from "@/lib/photos";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Split.module.css";

/**
 * Apartments — a teaser, not the real page. That page is the highest-value one
 * on the site and is blocked on the client: no unit count, no types, no rates,
 * no booking method (FACTS.md open question #1).
 *
 * The media reads the way an accommodation listing does: the real building by
 * day on top — signage below, three floors of apartment balconies above — then
 * the room itself underneath. Nothing here is commissioned or generated; every
 * frame is a photograph of the actual property (ASSETS.md).
 *
 * The interiors are all the same room on the same Valentine's night, which is
 * the whole apartment archive we hold. That skews the section toward the
 * occasion, so the copy carries the year-round claim on its own: it leads on
 * what IS verified (« meublé haut standing », 24h/24, « Confort, sécurité,
 * intimité ») and the word "luxe" appears nowhere.
 */

/**
 * 01 is the same angle as 02 and adds nothing, so it sits out. Order runs
 * room → room → detail. Resolved through shippable() so flipping a consent
 * field in the manifest is enough to pull a frame off the page.
 */
const ROOM_IDS: readonly PhotoId[] = [
  "apartment_02",
  "apartment_03",
  "apartment_04",
];
export default function Appartements({
  lang,
  dict,
}: {
  lang: Lang;
  dict: Dict;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  /* Gated like the thumbs below it. The single-image sections all read PHOTOS
     directly, which quietly opted the biggest frame on the section out of the
     consent gate the manifest exists to enforce. (Review finding.) */
  const building = isCleared("exterior_day") ? PHOTOS.exterior_day : null;
  const rooms = shippable(ROOM_IDS);

  return (
    <section
      id="appartements"
      ref={sectionRef}
      className={`shell ${styles.section}`}
    >
      <div className={`${styles.grid} ${styles.reverse}`}>
        <div className={styles.copy}>
          <p className="label label--gold" data-reveal>
            {dict.appartements.section}
          </p>
          <h2 ref={titleRef} className={styles.title}>
            {dict.appartements.title}
          </h2>
          <p className={styles.lede} data-reveal>
            {dict.appartements.lede}
          </p>
          {/* Not `label`: this is a sentence, and uppercase mono at 0.19em
              tracking is a style for two or three words. (Review finding.) */}
          <p className={styles.noteText} data-reveal>
            {dict.appartements.note}
          </p>

          <div className={styles.ctas} data-reveal>
            <Link href={href("appartements", lang)} className="btn">
              {dict.appartements.seeAll}
            </Link>
            <a
              href={`tel:${site.contact.phonePrimary.tel}`}
              className={`label ${styles.callLink}`}
            >
              {dict.appartements.cta}
            </a>
          </div>
        </div>

        <div className={styles.stack}>
          {building && (
            <div className={`frame ${styles.media}`}>
              <Image
                src={building.src}
                alt={building.alt[lang]}
                fill
                sizes="(max-width: 860px) 92vw, 40rem"
                quality={72}
              />
            </div>
          )}

          {rooms.length > 0 && (
            <div className={styles.thumbs}>
              {rooms.map((id) => {
                const room = PHOTOS[id];
                return (
                  <div key={id} className={`frame ${styles.thumb}`}>
                    <Image
                      src={room.src}
                      alt={room.alt[lang]}
                      fill
                      sizes="(max-width: 860px) 30vw, 13rem"
                      quality={72}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
