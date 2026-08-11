"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BUILDING_SERVICES,
  floorLabel,
  formatPrice,
  galleryFor,
  hasPreviewData,
  SAME_BUILDING_AS_RESTAURANT,
  type Studio,
} from "@/lib/apartments";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import AmenityIcon from "./AmenityIcon";
import ReserveStudio from "./ReserveStudio";
import StudioGallery from "./StudioGallery";
import StudioLightbox from "./StudioLightbox";
import styles from "./StudioPage.module.css";

/**
 * One studio.
 *
 * Opens on the carousel — seven frames of the room, swipeable, with the unit
 * code laid over them. The code is the only thing on this page the client has
 * confirmed and the photographs are the only thing a visitor is really here
 * for, so both arrive before a single line of copy. The spec table and the
 * amenities follow; the enquiry panel tracks alongside.
 *
 * The gallery is shared by all eleven units and shows a different property, so
 * the caption travels with the images — under the thumb strip and into the
 * lightbox. Without it the page shows a Yaoundé visitor a European apartment
 * and lets them assume it is the room they would be sleeping in.
 */
export default function StudioPage({
  studio,
  others,
  lang,
  dict,
}: {
  studio: Studio;
  others: Studio[];
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState<number | null>(null);
  useSectionMotion(bodyRef);

  const t = dict.studios;
  const base = href("appartements", lang);
  const floor = floorLabel(studio, {
    floor: t.floor,
    ground: t.groundFloor,
    basement: t.basement,
  });
  const { photos, illustrative } = galleryFor(studio);
  const price = formatPrice(studio.pricePerNight);
  const preview = hasPreviewData(studio);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(`.${styles.heroCopy} > *`, {
          y: 30,
          opacity: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.07,
          delay: 0.2,
        });
      });
    },
    { scope: rootRef }
  );

  /* One row per characteristic. Built here rather than in the markup so the
     table cannot drift out of step with the data model.

     `48.72` prints as « 48,72 » in French and « 48.72 » in English — the sheet
     gave a decimal and rounding it to 49 would be inventing precision in the
     wrong direction. Rooms and shower rooms only appear when there are any: a
     one-room studio with « Chambres 0 » reads as missing data rather than as
     the definition of a studio. */
  const yesNo = (v: boolean) => (v ? t.specs.yes : t.specs.no);
  const specs: { key: string; label: string; value: string }[] = [
    { key: "status", label: t.specs.status, value: t.status[studio.status] },
    {
      key: "size",
      label: t.specs.size,
      value: `${studio.size.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB")} ${t.specs.sizeUnit}`,
    },
    { key: "sleeps", label: t.sleeps, value: String(studio.sleeps) },
    { key: "bed", label: t.specs.bed, value: t.beds[studio.bed] },
    ...(studio.rooms > 0
      ? [{ key: "rooms", label: t.specs.rooms, value: String(studio.rooms) }]
      : []),
    ...(studio.showers > 0
      ? [{ key: "showers", label: t.specs.showers, value: String(studio.showers) }]
      : []),
    { key: "livingRoom", label: t.specs.livingRoom, value: yesNo(studio.livingRoom) },
    { key: "kitchen", label: t.specs.kitchen, value: yesNo(studio.kitchen) },
    ...(floor ? [{ key: "floor", label: t.floor, value: floor }] : []),
    ...(site.hours.apartments247
      ? [
          {
            key: "access",
            label: t.specs.access,
            value: dict.footer.hoursApartmentsValue,
          },
        ]
      : []),
  ];

  return (
    <article ref={rootRef} className={styles.page}>
      <StudioGallery
        photos={photos}
        illustrative={illustrative}
        lang={lang}
        dict={dict}
        onOpen={setShot}
      >
        <div className={styles.heroCopy}>
          <Link href={base} className={`label ${styles.back}`}>
            ← {t.backToStudios}
          </Link>
          <h1 className={styles.code}>{studio.code}</h1>
          <div className={styles.facts}>
            <span className={`label ${styles.status} ${styles[studio.status]}`}>
              <span className={styles.dot} aria-hidden="true" />
              {t.status[studio.status]}
            </span>
            <span className={styles.fact}>
              {studio.size.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB")}{" "}
              {t.specs.sizeUnit}
            </span>
            <span className={styles.fact}>
              {t.sleeps} {studio.sleeps}
            </span>
            {floor && <span className={styles.fact}>{floor}</span>}
            {/* The rate leads only when it is real. A unit with no confirmed
                price shows nothing here rather than « sur demande », which
                would read as a second-class listing beside SS101. */}
            {price && <span className={styles.price}>{price} {t.specs.perNight}</span>}
          </div>
        </div>
      </StudioGallery>

      <div className={`shell ${styles.wrap}`}>
        {/* Per-unit now, not global: SS101 is sourced end to end and must not
            carry a notice saying otherwise, while the ten rows still on
            invented data must keep it. */}
        {preview && (
          <p className={styles.preview} role="note">
            <span className={styles.previewMark} aria-hidden="true">
              ◆
            </span>
            {t.preview}
          </p>
        )}

        <div ref={bodyRef} className={styles.layout}>
          <div className={styles.main}>
            <section className={styles.block}>
              <h2 className={`label ${styles.blockTitle}`}>{t.specs.title}</h2>
              <dl className={styles.specs} data-reveal>
                {specs.map((s) => (
                  <div key={s.key} className={styles.spec}>
                    <dt className={`label ${styles.specLabel}`}>{s.label}</dt>
                    <dd className={styles.specValue}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={styles.block}>
              <h2 className={`label ${styles.blockTitle}`}>
                {t.equipment}
                <span className={styles.blockCount}>
                  · {studio.amenities.length} {t.specs.equipmentCount}
                </span>
              </h2>
              <ul className={styles.amenities} data-reveal>
                {studio.amenities.map((a) => (
                  <li key={a} className={styles.amenity}>
                    <span className={styles.amenityIcon} aria-hidden="true">
                      <AmenityIcon name={a} size={22} />
                    </span>
                    {t.amenities[a]}
                  </li>
                ))}
              </ul>
            </section>

            {/* Building services. Deliberately its own block rather than more
                rows in « Équipements »: these belong to the address, not the
                unit, and merging them would let a visitor read « gardien » as
                something this studio has and the next one might not. Confirmed
                once by the client, so they are identical on all eleven pages —
                which is exactly why they are stored once. */}
            <section className={styles.block}>
              <h2 className={`label ${styles.blockTitle}`}>
                {t.building.title}
                <span className={styles.blockCount}>· {t.building.note}</span>
              </h2>
              <ul className={styles.amenities} data-reveal>
                {BUILDING_SERVICES.map((s) => (
                  <li key={s} className={styles.amenity}>
                    <span className={styles.amenityIcon} aria-hidden="true">
                      <AmenityIcon name={s} size={22} />
                    </span>
                    {t.building[s]}
                  </li>
                ))}
              </ul>
              {SAME_BUILDING_AS_RESTAURANT && (
                <p className={styles.buildingNote} data-reveal>
                  {t.building.sameBuilding}
                </p>
              )}
            </section>

            {others.length > 0 && (
              <section className={styles.block}>
                <h2 className={`label ${styles.blockTitle}`}>{t.otherStudios}</h2>
                <div className={styles.others}>
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      href={`${base}/${o.slug}`}
                      className={styles.other}
                    >
                      <span className={styles.otherCode}>{o.code}</span>
                      <span className={`label ${styles[o.status]}`}>
                        <span className={styles.dot} aria-hidden="true" />
                        {t.status[o.status]}
                      </span>
                      <span className={styles.otherArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <ReserveStudio studio={studio} lang={lang} dict={dict} />
        </div>
      </div>

      <StudioLightbox
        photos={photos}
        illustrative={illustrative}
        index={shot}
        onClose={() => setShot(null)}
        onMove={setShot}
        lang={lang}
        dict={dict}
      />
    </article>
  );
}
