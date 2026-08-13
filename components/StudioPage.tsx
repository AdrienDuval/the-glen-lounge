"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BUILDING_SERVICES,
  floorLabel,
  formatPrice,
  formatSize,
  isWholeUnit,
  SAME_BUILDING_AS_RESTAURANT,
  slidesFor,
  unitLine,
  type RelatedStudios,
  type Studio,
} from "@/lib/apartments";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import AmenityIcon from "./AmenityIcon";
import ReserveStudio from "./ReserveStudio";
import StudioCard, { RELATED_SIZES } from "./StudioCard";
import StudioGallery from "./StudioGallery";
import StudioLightbox from "./StudioLightbox";
import styles from "./StudioPage.module.css";

/**
 * One unit.
 *
 * Opens on the carousel — this unit's own frames, swipeable, with the name laid
 * over them. The photographs are the only thing a visitor is really here for, so
 * they arrive before a single line of copy. The spec table and the amenities
 * follow; the enquiry panel tracks alongside; the rest of the building sits at
 * the foot, full width.
 *
 * Every gallery is photographs of THIS building (2026-08-12): the shared
 * stock-European fallback and the « image d'illustration » caption that had to
 * travel with it are both gone, along with the undocumented units that were the
 * only reason for either.
 *
 * A spec row is omitted rather than guessed. `status` and `size` are nullable,
 * and where they are null the row simply does not appear and the enquiry panel
 * says « sur demande ».
 *
 * ── WHAT CHANGED 2026-08-13, AND WHY ─────────────────────────────────────────
 * Three complaints, all of them fair, all of them the same underlying problem —
 * this page named units instead of showing them.
 *
 * 1. THE UNITS WERE NOT TELLABLE APART. The `<h1>` was a bare mono unit code at
 *    4.5rem, so A10's page and A10-2's page differed above the fold by two
 *    characters — one a 130 m² flat, the other a 10 m² bedroom inside it. The
 *    noun now leads (« Appartement A10 »), and `unitLine` puts the surface,
 *    the bedroom count and the couchages in one readable sentence under it.
 * 2. « AUTRES STUDIOS » WAS THREE GREY BOXES — a code, a status pill and an
 *    arrow, at the foot of a page whose entire argument is photographs. It is
 *    now the same card the index uses, at full shell width, and it is GROUPED:
 *    the apartment a bedroom belongs to is no longer a stranger in that list.
 * 3. THE PAGE HAD ONE HEADING SIZE below the carousel — `.label`, the smallest
 *    type in the system, on all four section titles — so nothing outranked
 *    anything and the enquiry panel's own title was the largest heading on the
 *    page. `BlockHead` gives it the house kicker-over-Didone lockup that every
 *    other section on this site already uses.
 */

/**
 * The house section head: a gold mono kicker over a Didone title.
 *
 * Every other section on this site is built this way (Contact, Carte, Lieu,
 * EventsIndex). This page was the only one whose block titles were bare
 * `.label` — a class borrowed from EventPage, where it titles blocks inside a
 * narrow aside standing beside a display-size h1. In a primary column with
 * nothing above it, it read as a caption, and everything below the masthead
 * flattened to a single tier.
 *
 * `--fs-h3` and not `--fs-h2`: h2 runs to 3.5rem and would overwhelm a spec
 * sheet. h3 is exactly the step ReserveStudio's title already uses, so the fix
 * is precisely that the sidebar stops outranking the page.
 *
 * ⚠️ `.blockTitle` must NOT also carry the global `label` class, or globals'
 * mono family wins over the display face.
 */
function BlockHead({
  kicker,
  title,
  rule,
}: {
  kicker?: string;
  title: string;
  rule?: boolean;
}) {
  return (
    <div className={styles.head} data-reveal>
      {rule && <span className="rule" data-rule />}
      {kicker && <p className={`label ${styles.kicker}`}>{kicker}</p>}
      <h2 className={styles.blockTitle}>{title}</h2>
    </div>
  );
}

export default function StudioPage({
  studio,
  related,
  lang,
  dict,
}: {
  studio: Studio;
  related: RelatedStudios;
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLElement>(null);
  const [shot, setShot] = useState<number | null>(null);
  /* One scope per band. The hook is a plain `useGSAP` call and is safe to
     invoke more than once; `[data-reveal]` shares ONE trigger per scope, so a
     single scope over a 1265px-tall body meant the bottom half animated
     unseen. Lieu.tsx already handles a too-tall section this way. */
  useSectionMotion(bodyRef);
  useSectionMotion(relatedRef);

  const t = dict.studios;
  const base = href("appartements", lang);
  const floor = floorLabel(studio, {
    floor: t.floor,
    ground: t.groundFloor,
    basement: t.basement,
  });
  const { slides } = slidesFor(studio);
  const price = formatPrice(studio.pricePerNight);
  /* « Chambre dans l'appartement A10 » when we know which apartment, the plain
     « Chambre dans un appartement » when we do not, and the unit's own noun
     otherwise — « Appartement entier » or « Studio entier », transcribed from
     the client's sheet rather than derived. See `UnitKind`. */
  const kindLabel =
    studio.kind === "room"
      ? studio.parentCode
        ? t.specs.kindRoomIn.replace("{code}", studio.parentCode)
        : t.specs.kindRoom
      : studio.kind === "apartment"
        ? t.specs.kindApartment
        : t.specs.kindStudio;
  /* Formatted once — the masthead, the identity line and the spec table must
     not disagree, and all three have to cope with a unit whose surface was
     never measured. */
  const size = formatSize(studio, lang, t.specs.sizeUnit);

  /* The identity sentence. Same function as the cards use, so the line a
     visitor read on the index is the line that greets them here. */
  const identity = unitLine(
    studio,
    {
      rooms: t.roomsCount,
      roomsOne: t.roomsCountOne,
      sleeps: t.sleepsCount,
      sleepsOne: t.sleepsCountOne,
      inApartment: t.inApartment,
    },
    { size, floor }
  );

  const family = [related.parent, ...related.siblings, ...related.rooms].filter(
    (s): s is Studio => Boolean(s)
  );
  /* True when this unit and its family do not have distinct opening frames
     between them — see `a10_chambre` in lib/photos.ts, where the client placed
     one walkthrough in both room folders. Computed, never hard-coded to A10:
     the reason it is true today is an accident of what she sent, and it stops
     being true the day a second clip arrives. Better the page says so plainly
     than that a visitor meets two identical listings and concludes the
     photographs are stock. */
  const sharesMedia =
    family.length > 0 &&
    new Set([studio, ...family].map((s) => s.photos[0])).size < family.length + 1;

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
     absent row is the only honest way to say « we were not told ».

     ⚠️ The rows deliberately RESTATE facts the identity line already carries.
     That line is a masthead sentence built for comparison; this is the complete
     record, and a careful reader looks here. Do not thin it out to avoid the
     repetition — see the rejected proposals in the 2026-08-13 audit. */
  const yesNo = (v: boolean) => (v ? t.specs.yes : t.specs.no);
  const specs: { key: string; label: string; value: string }[] = [
    /* Type leads the table. For a `room` it is the single most important fact
       on the page — a visitor booking « A10-3 » is booking one bedroom inside
       someone else's apartment, and no other row says so. */
    { key: "kind", label: t.specs.kind, value: kindLabel },
    ...(studio.status
      ? [{ key: "status", label: t.specs.status, value: t.status[studio.status] }]
      : []),
    ...(size ? [{ key: "size", label: t.specs.size, value: size }] : []),
    { key: "sleeps", label: t.sleeps, value: String(studio.sleeps) },
    { key: "bed", label: t.specs.bed, value: t.beds[studio.bed] },
    /* Skipped for a single room: the listing IS one bedroom, so « Chambres 1 »
       restates the type row and reads as though there were a choice. */
    ...(isWholeUnit(studio) && studio.rooms > 0
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
      <StudioGallery slides={slides} lang={lang} dict={dict} onOpen={setShot}>
        <div className={styles.heroCopy}>
          <Link href={base} className={`label ${styles.back}`}>
            ← {t.backToStudios}
          </Link>
          {/* The noun announces and the code identifies. This was a bare code,
              which told a visitor nothing they could weigh — and made « A10 »
              and « A10-2 », a whole flat and one bedroom inside it, read as two
              members of one series. The code survives verbatim: it is what goes
              into the WhatsApp message and what someone reads out on a bad
              line. */}
          <h1 className={styles.title}>
            {t.noun[studio.kind]}{" "}
            <span className={styles.titleCode}>{studio.code}</span>
          </h1>
          {/* « 2 chambres · 130 m² · 8 couchages · Sous-sol 1 » — the same
              sentence the cards carry, so a visitor arriving from the index
              lands on the line they clicked. Everything in it used to be loose
              items in `.facts` below, at the same weight as everything else. */}
          {identity.length > 0 && (
            <p className={styles.identity}>
              {identity.map((part) => (
                <span key={part} className={styles.identityPart}>
                  {part}
                </span>
              ))}
            </p>
          )}
          <div className={styles.facts}>
            {studio.status && (
              <span className={`label ${styles.status} ${styles[studio.status]}`}>
                <span className={styles.dot} aria-hidden="true" />
                {t.status[studio.status]}
              </span>
            )}
            {/* The rate leads only when it is real. A unit with no confirmed
                price shows nothing here rather than « sur demande », which
                would read as a second-class listing beside SS101. */}
            {price && (
              <span className={styles.price}>
                {price} <span className={styles.pricePer}>{t.specs.perNight}</span>
              </span>
            )}
          </div>
        </div>
      </StudioGallery>

      <div className={`shell ${styles.wrap}`}>
        <div ref={bodyRef} className={styles.layout}>
          <div className={styles.main}>
            <section className={styles.block}>
              <BlockHead kicker={studio.code} title={t.specs.title} rule />
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
              <BlockHead
                kicker={`${studio.amenities.length} ${t.specs.equipmentCount}`}
                title={t.equipment}
              />
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
            <section className={`${styles.block} ${styles.blockShared}`}>
              <BlockHead kicker={t.building.note} title={t.building.title} />
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
          </div>

          <ReserveStudio studio={studio} lang={lang} dict={dict} />
        </div>
      </div>

      {/* ---- the rest of the building ----
          OUTSIDE `.layout`, and that is load-bearing in two ways.

          WIDTH: the detail column HALVES from 818px to 438px the instant the
          21rem enquiry panel appears at 900px, and it is not monotonic in
          viewport width (655 at 720, 818 at 899, 438 at 900, 610 at 1100, 790
          at 1440). No `@media` ladder written against the viewport is correct
          for that column at every step. Out here the cards sit in the plain
          82rem shell and a three-band grid is simply right.

          ⚠️ STICKINESS: `StudioPage.module.css` pins the panel with
          `.layout > :last-child` — a POSITIONAL selector that silently means
          « whatever is added last ». Kept outside `.layout`, this band leaves
          ReserveStudio's aside as the last child and the sticky panel is
          provably untouched. Anyone adding a child to `.layout` will hit
          this. */}
      {(family.length > 0 || related.others.length > 0) && (
        <section ref={relatedRef} className={`shell ${styles.relatedBand}`}>
          {family.length > 0 && (
            <div className={styles.block}>
              <BlockHead
                kicker={t.related.sameApartmentKicker}
                title={t.related.sameApartmentTitle}
                rule
              />
              <p className={styles.relatedNote} data-reveal>
                {studio.kind === "room" && studio.parentCode
                  ? t.related.roomInside.replace("{code}", studio.parentCode)
                  : t.related.apartmentRooms}
              </p>
              <ul className={styles.relatedGrid}>
                {related.parent && (
                  <li className={styles.slot}>
                    <StudioCard
                      studio={related.parent}
                      relation="parent"
                      variant="compact"
                      sizes={RELATED_SIZES}
                      base={base}
                      lang={lang}
                      dict={dict}
                      showFloor={false}
                    />
                  </li>
                )}
                {[...related.siblings, ...related.rooms].map((s) => (
                  <li key={s.slug} className={styles.slot}>
                    <StudioCard
                      studio={s}
                      relation={s.parentCode === studio.code ? "room" : "sibling"}
                      variant="compact"
                      sizes={RELATED_SIZES}
                      base={base}
                      lang={lang}
                      dict={dict}
                      showFloor={false}
                    />
                  </li>
                ))}
              </ul>
              {sharesMedia && (
                <p className={styles.mediaNote} data-reveal>
                  {t.related.sameMedia}
                </p>
              )}
            </div>
          )}

          {related.others.length > 0 && (
            <div className={styles.block}>
              <BlockHead
                kicker={t.related.otherKicker}
                title={t.related.otherTitle}
                rule={family.length === 0}
              />
              <ul className={styles.relatedGrid}>
                {related.others.map((o) => (
                  <li key={o.slug} className={styles.slot}>
                    <StudioCard
                      studio={o}
                      variant="compact"
                      sizes={RELATED_SIZES}
                      base={base}
                      lang={lang}
                      dict={dict}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

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
