"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BUILDING_SERVICES,
  floorLabel,
  formatPrice,
  SAME_BUILDING_AS_RESTAURANT,
  slidesFor,
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
 * Opens on the carousel — this unit's own frames, swipeable, with the code laid
 * over them. The photographs are the only thing a visitor is really here for, so
 * they arrive before a single line of copy. The spec table and the amenities
 * follow; the enquiry panel tracks alongside.
 *
 * Every gallery is now photographs of THIS building (2026-08-12): the shared
 * stock-European fallback and the « image d'illustration » caption that had to
 * travel with it are both gone, along with the undocumented units that were the
 * only reason for either.
 *
 * A spec row is omitted rather than guessed. `status` and `size` are nullable,
 * and where they are null the row simply does not appear and the enquiry panel
 * says « sur demande » — see SS140-A, which has photographs but no sheet.
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
  const { slides } = slidesFor(studio);
  const price = formatPrice(studio.pricePerNight);
  /* Formatted once — the masthead and the spec table must not disagree, and
     both have to cope with a unit whose surface was never measured. */
  const size =
    studio.size === null
      ? null
      : `${studio.size.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB")} ${t.specs.sizeUnit}`;

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
     the definition of a studio.

     Status and surface are dropped entirely when unknown, for the same reason.
     There is no longer a preview notice to explain a placeholder value, so an
     absent row is the only honest way to say « we were not told ». */
  const yesNo = (v: boolean) => (v ? t.specs.yes : t.specs.no);
  const specs: { key: string; label: string; value: string }[] = [
    ...(studio.status
      ? [{ key: "status", label: t.specs.status, value: t.status[studio.status] }]
      : []),
    ...(size ? [{ key: "size", label: t.specs.size, value: size }] : []),
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
        slides={slides}
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
            {/* Each fact appears only if we hold it. A unit with no sheet leads
                on its code, its couchages and its floor — which is thin, but
                every word of it is true. */}
            {studio.status && (
              <span className={`label ${styles.status} ${styles[studio.status]}`}>
                <span className={styles.dot} aria-hidden="true" />
                {t.status[studio.status]}
              </span>
            )}
            {size && <span className={styles.fact}>{size}</span>}
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
        {/* The preview notice used to sit here. Removed 2026-08-12 with the
            undocumented units it described — nothing on this page is invented
            any more, so there is nothing left to disclaim. */}
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
                once by the client, so they are identical on every studio page —
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
                      {o.status && (
                        <span className={`label ${styles[o.status]}`}>
                          <span className={styles.dot} aria-hidden="true" />
                          {t.status[o.status]}
                        </span>
                      )}
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
        slides={slides}
        index={shot}
        onClose={() => setShot(null)}
        onMove={setShot}
        lang={lang}
        dict={dict}
      />
    </article>
  );
}
