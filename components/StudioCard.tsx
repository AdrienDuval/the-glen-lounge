import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos";
import {
  floorLabel,
  formatPrice,
  formatSize,
  unitLine,
  type Studio,
} from "@/lib/apartments";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import AmenityIcon from "./AmenityIcon";
import styles from "./StudioCard.module.css";

/**
 * One unit, as a card.
 *
 * Lifted out of `StudiosIndex` on 2026-08-13 so that the foot of every unit page
 * could stop being three grey boxes. This was already the only place on the site
 * where a unit is SHOWN rather than named, and the detail page — the page a
 * visitor reaches precisely because they want to see rooms — was the one surface
 * that did not use it.
 *
 * ── WHY EXTRACTED RATHER THAN COPIED ─────────────────────────────────────────
 * The honesty rules are the reason, not the CSS. `formatPrice(...) && <price>`
 * and the « chambre dans l'appartement {code} » dance were ALREADY written twice,
 * once in StudiosIndex and once in StudioPage's masthead. A third copy inside the
 * related block is exactly how « never print a placeholder » eventually gets
 * broken on one surface and not the others. They live here now, once.
 *
 * ── NO HOOKS, NO STATE, NO GSAP — AND THAT IS LOAD-BEARING ───────────────────
 * The house choreography reaches this markup through `data-reveal` and the
 * `.frame` class, both of which `useSectionMotion` collects from whichever
 * section ref owns the card. That is what makes the same component safe to render
 * from two pages with completely different motion scopes, and it is why
 * extracting it dragged no motion code along with it.
 *
 * It is not marked `"use client"`: it inherits that from whichever page imports
 * it, and needs nothing of its own.
 */

export type StudioCardVariant = "feature" | "grid" | "compact";

/**
 * How this unit relates to the one whose page we are standing on. Renders the
 * gold ribbon opposite the status pill. Omitted = an unrelated unit.
 */
export type StudioRelation = "parent" | "sibling" | "room";

export default function StudioCard({
  studio,
  base,
  lang,
  dict,
  variant = "grid",
  sizes,
  relation,
  showFloor = true,
}: {
  studio: Studio;
  /** The localised « /fr/appartements » href. Passed in so the card never has to
      know about `lib/routes`, or which surface it is standing on. */
  base: string;
  lang: Lang;
  dict: Dict;
  variant?: StudioCardVariant;
  /**
   * REQUIRED, and deliberately without a default.
   *
   * The same card renders ~700px wide as the index feature plate and ~380px in a
   * related grid, so any default would be silently wrong on one of the two — and
   * that is the failure mode `sizes` bugs always have: nothing breaks, the
   * photographs are simply fetched at the wrong size forever. Making it required
   * forces every call site to answer the question; the answers are derived in the
   * comments beside them.
   */
  sizes: string;
  relation?: StudioRelation;
  /**
   * ⚠️ A GATE ON AN OPEN QUESTION, NOT A DESIGN OPTION. `A10_SPEC` says the
   * apartment is on « sous-sol R-1 » and `A10_ROOM_SPEC` says « R+1 » for two
   * bedrooms INSIDE that same apartment. Both are the client's own answers, on
   * two sheets, and neither has been withdrawn — so each row keeps its own and
   * the contradiction is recorded in FACTS.md rather than resolved by us.
   *
   * That is survivable while the two are a page apart. It is NOT survivable
   * stacked in one band, where the site would visibly tell a visitor that one
   * flat is on two different floors. So the related block passes `false` for
   * family cards. Delete this prop the day she answers.
   */
  showFloor?: boolean;
}) {
  const t = dict.studios;
  /* Its own first photograph. No fallback: an undocumented unit is not listed at
     all, so `photos` is never empty. */
  const shot = PHOTOS[studio.photos[0]];
  const price = formatPrice(studio.pricePerNight);
  const floor = floorLabel(studio, {
    floor: t.floor,
    ground: t.groundFloor,
    basement: t.basement,
  });

  /* The line that made these cards tell each other apart. It used to be
     « couchages · étage », which over the six rows produced two byte-identical
     cards and two more differing by a single digit — surface, the most
     separating number in the dataset, was printed nowhere. See `unitLine`. */
  const line = unitLine(
    studio,
    {
      rooms: t.roomsCount,
      roomsOne: t.roomsCountOne,
      sleeps: t.sleepsCount,
      sleepsOne: t.sleepsCountOne,
      inApartment: t.inApartment,
    },
    {
      size: formatSize(studio, lang, t.specs.sizeUnit),
      floor: showFloor ? floor : null,
    }
  );

  const relationLabel = relation
    ? { parent: t.related.isParent, sibling: t.related.isSibling, room: t.related.isRoom }[
        relation
      ]
    : null;

  return (
    <Link
      href={`${base}/${studio.slug}`}
      className={`${styles.card} ${styles[variant]}`}
      data-reveal
    >
      <div className={`frame ${styles.media}`}>
        <Image
          src={shot.src}
          alt={shot.alt[lang]}
          fill
          sizes={sizes}
          quality={72}
          className={styles.img}
        />
        <span className={styles.scrim} aria-hidden="true" />
        {/* No badge at all when availability was never given — better a card
            that says nothing about it than one that guesses. */}
        {studio.status && (
          <span className={`label ${styles.status} ${styles[studio.status]}`}>
            <span className={styles.dot} aria-hidden="true" />
            {t.status[studio.status]}
          </span>
        )}
        {/* The relationship, opposite the status. Gold-bordered rather than
            muted because on A10-2's page « L'appartement entier » is not a
            suggestion — it is where the bed actually is. */}
        {relationLabel && (
          <span className={`label ${styles.relation}`}>{relationLabel}</span>
        )}
        {/* Corner ticks — the frame reads as a mount rather than a rectangle,
            and they are what the hover animates. */}
        <span className={styles.tick} aria-hidden="true" />
        <span className={`${styles.tick} ${styles.tickEnd}`} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <div className={styles.codeRow}>
          {/* The noun leads and the code identifies. A bare code told a visitor
              nothing — two pages could differ above the fold by four characters
              — and « Appartement » is the word they are actually weighing. The
              code stays, in mono and in gold: it is what goes into the WhatsApp
              message and what someone reads out over a bad line. */}
          <h3 className={styles.code}>
            {t.noun[studio.kind]}{" "}
            <span className={styles.codeMark}>{studio.code}</span>
          </h3>
          <span className={styles.rule} aria-hidden="true" />
          <span className={`label ${styles.more}`}>{t.seeUnit}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
        {/* Two lines, not one. These used to be a single muted run —
            « Couchages 4 · Sous-sol 1 · 120 000 FCFA la nuit » — which put the
            one number a visitor is scanning for at the END of a sentence that
            wrapped, so the rate broke across lines and read as quietly as the
            floor. The specs stay muted and inline; the rate gets its own line
            and the masthead's gold, so the card has the same hierarchy as the
            page it opens.

            ⚠️ A ROOM'S FIRST SEGMENT IS GOLD, and that is the whole of what a
            separate « Chambre dans l'appartement A10 » line used to do above
            this one. `unitLine` already leads a room with the apartment it sits
            in, so keeping both printed the same sentence twice, one under the
            other. The qualification still has to survive being skimmed past on
            the way to the price — hence the accent rather than deletion: the
            code alone ("A10-3") gives a browser no way to tell a bedroom apart
            from a whole unit, and the price makes it look like a bargain one. */}
        <p className={styles.meta}>
          {line.map((part, i) => (
            <span
              key={part}
              className={
                i === 0 && studio.kind === "room" ? styles.metaLead : undefined
              }
            >
              {part}
              {i < line.length - 1 && <span aria-hidden="true"> · </span>}
            </span>
          ))}
        </p>
        {/* Only when a real rate exists — a card never advertises a
            placeholder, and « sur demande » is the enquiry panel's job. */}
        {price && (
          <p className={styles.price}>
            {price}
            <span className={styles.pricePer}> {t.specs.perNight}</span>
          </p>
        )}
        <ul className={styles.chips}>
          {studio.amenities.slice(0, variant === "feature" ? 6 : 4).map((a) => (
            <li key={a} className={styles.chip}>
              <AmenityIcon name={a} size={16} />
              {t.amenities[a]}
            </li>
          ))}
          {studio.amenities.length > (variant === "feature" ? 6 : 4) && (
            <li className={`${styles.chip} ${styles.chipMore}`}>
              +{studio.amenities.length - (variant === "feature" ? 6 : 4)}
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
}

/* Kept beside the component because they are facts about where it is rendered,
   not about the component. Each is derived from a MEASURED rendered width, not
   from the grid's max-width — an over-declared `sizes` does not fail visibly, it
   just fetches a rendition three times too large forever.

   ⚠️ Re-measure these if the grid gap, the shell width or the 62/38 feature
   split changes. */

/** The index's opening plate: full measure below 720px, then a flex row whose
    media takes ~62% of an 82rem shell. */
export const INDEX_FEATURE_SIZES =
  "(min-width: 1312px) 45rem, (min-width: 720px) 57vw, 92vw";

/** The index grid: two-up from 720px, three-up from 1100px. */
export const INDEX_GRID_SIZES =
  "(min-width: 1100px) 23rem, (min-width: 720px) 25rem, 92vw";

/** The related band at the foot of a unit page. It sits in the 82rem `.shell`,
    NOT in the 438px detail column — which is exactly why a plain three-band
    ladder is correct here and a container query is not needed.

    The last branch is 40vw and not 92vw because below 620px the compact card
    lays out as a ROW with the media at 38% — see StudioCard.module.css. */
export const RELATED_SIZES = "(min-width: 1100px) 26rem, (min-width: 620px) 45vw, 40vw";
