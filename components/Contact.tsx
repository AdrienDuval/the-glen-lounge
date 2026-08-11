"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Contact.module.css";

/**
 * Reservations. The venue takes bookings by phone and WhatsApp only, so this
 * section is the site's single conversion point — everything else routes here.
 * Layout follows that: the number is the hero, the CTAs sit directly under it,
 * and address + hours are supporting metadata beside the photo of the actual
 * entrance — « 2ᵉ entrée à droite » with the door it points at.
 *
 * ⚠️ ONE NUMBER, DELIBERATELY. FACTS.md records six published variants, and two
 * of them differ by a single digit (652 81 **45** 49 vs **46** 49) with the
 * evidence genuinely split: the recent TikTok posts say 45, the current
 * Facebook page and the oldest posts say 46. Only +237 691 24 65 90 appears
 * consistently everywhere, including the August 2026 posts.
 *
 * Showing a number that might be wrong is worse than showing one number, so the
 * disputed line stays out of the UI until the client settles it. It is still in
 * `lib/site.ts` — this is a rendering decision, not a data deletion.
 */
export default function Contact({ lang, dict }: { lang: Lang; dict: Dict }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useSectionMotion(sectionRef, titleRef);

  const waNumber = site.contact.whatsapp.tel.replace(/\D/g, "");
  const photo = PHOTOS.exterior_entrance;

  return (
    <section id="contact" ref={sectionRef} className={`shell ${styles.section}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.contact.section}
        </p>
        <h2 ref={titleRef} className={styles.title}>
          {dict.contact.title}
        </h2>
        <p className={styles.lede} data-reveal>
          {dict.contact.lede}
        </p>
      </div>

      <div className={`rule ${styles.rule}`} data-rule />

      <div className={styles.grid}>
        <div className={styles.info}>
          <div data-reveal>
            <h3 className={`label ${styles.colTitle}`}>{dict.common.phone}</h3>
            <a
              className={styles.big}
              href={`tel:${site.contact.phonePrimary.tel}`}
            >
              {site.contact.phonePrimary.display}
            </a>
            <div className={styles.actions}>
              <a className="btn" href={`tel:${site.contact.phonePrimary.tel}`}>
                {dict.contact.callCta}
              </a>
              <a
                className="btn"
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.contact.whatsappCta}
              </a>
            </div>
          </div>

          <div className={styles.meta}>
            <div data-reveal>
              <h3 className={`label ${styles.colTitle}`}>
                {dict.contact.addressTitle}
              </h3>
              <p className={styles.directions}>{dict.contact.directions}</p>
            </div>

            <div data-reveal>
              <h3 className={`label ${styles.colTitle}`}>
                {dict.contact.hoursTitle}
              </h3>
              <ul className={styles.rows}>
                <li className={styles.row}>
                  {dict.footer.hoursRestaurant} —{" "}
                  {dict.footer.hoursRestaurantValue}
                </li>
                <li className={styles.row}>
                  {/* The only apartments mention in the site's conversion
                      section, and it used to dead-end as plain text. */}
                  <Link
                    href={href("appartements", lang)}
                    className={styles.rowLink}
                  >
                    {dict.footer.hoursApartments}
                  </Link>{" "}
                  — {dict.footer.hoursApartmentsValue}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`frame ${styles.photo}`}>
          <Image
            src={photo.src}
            alt={photo.alt[lang]}
            fill
            sizes="(max-width: 900px) 92vw, 26rem"
            quality={72}
          />
        </div>
      </div>
    </section>
  );
}
