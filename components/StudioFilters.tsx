"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  FURNISHING_FILTERS,
  KIND_FILTERS,
  filterCounts,
  type FurnishingFilter,
  type KindFilter,
  type StudioFilter,
} from "@/lib/apartments";
import type { Dict } from "@/lib/i18n";
import styles from "./StudioFilters.module.css";

/**
 * The index filter — two groups, composing with AND.
 *
 * Added 2026-09-07, when the index began listing two products: seven furnished
 * units let by the night and one unfurnished flat let by the month, in one
 * undifferentiated grid. See the FILTERING block in `lib/apartments.ts` for why
 * the axes are `kind` and `furnished` and why they are separate.
 *
 * ── STATELESS ON PURPOSE ────────────────────────────────────────────────────
 * The filter lives in `StudiosIndex`, because that is what has to render the
 * grid from it, refresh ScrollTrigger when the document height changes, and
 * decide which unit gets the wide feature card. Two components holding halves
 * of one filter is how a filter bar ends up disagreeing with its own results.
 *
 * ── WHY TOGGLE BUTTONS AND NOT A RADIOGROUP ─────────────────────────────────
 * Each group is single-select, which is radio semantics — but `role="radio"`
 * carries an obligation this component would then have to meet properly:
 * arrow-key navigation within the group and a single tab stop. Toggle buttons
 * with `aria-pressed` are natively tabbable and announce their state, and the
 * group's purpose is carried by `role="group"` + `aria-label`. Fewer moving
 * parts, nothing half-implemented.
 *
 * ── THE COUNTS ARE THE POINT ────────────────────────────────────────────────
 * Every chip prints how many units it would show, computed with the OTHER group
 * held as it is, and a chip at zero is disabled. So « Studios 0 » while
 * « Non meublé » is selected cannot be clicked, which is what makes an empty
 * grid unreachable rather than merely unlikely.
 */
export default function StudioFilters({
  filter,
  onChange,
  shown,
  dict,
}: {
  filter: StudioFilter;
  onChange: (next: StudioFilter) => void;
  /** How many units the grid is showing right now — announced, not recomputed. */
  shown: number;
  dict: Dict;
}) {
  const t = dict.studios.filters;
  const uid = useId();
  const counts = filterCounts(filter);
  /* A one-shot sweep on the hairline below the chips, so a click that is
     instant (the list is already in memory) still has a "we heard you"
     rather than a silent swap. Skipped on the first paint — nothing has
     been asked for yet. */
  const [beat, setBeat] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBeat((n) => n + 1);
  }, [filter]);

  /* One row builder for both groups: they differ only in which key of the
     filter they set and where their labels come from. Written once so the two
     cannot drift in markup, keyboard behaviour or ARIA. */
  const group = <T extends string>(
    axis: "kind" | "furnishing",
    options: readonly T[],
    label: string,
    labelFor: (o: T) => string,
    countFor: (o: T) => number
  ) => (
    <div className={styles.group} role="group" aria-labelledby={`${uid}-${axis}`}>
      <span id={`${uid}-${axis}`} className={`label ${styles.groupLabel}`}>
        {label}
      </span>
      <div className={styles.chips}>
        {options.map((o) => {
          const n = countFor(o);
          const active = filter[axis] === o;
          return (
            <button
              key={o}
              type="button"
              className={styles.chip}
              /* The state, for a screen reader. The visual state is the gold
                 border and `data-active` below. */
              aria-pressed={active}
              data-active={active || undefined}
              /* Zero means this combination lists nothing. Disabled rather than
                 hidden: a chip that vanishes makes the bar jump on every click,
                 and « Studios 0 » is itself useful information — it says there
                 is no unfurnished studio yet, rather than hiding that fact. */
              disabled={n === 0}
              onClick={() => onChange({ ...filter, [axis]: o })}
            >
              {labelFor(o)}
              <span className={styles.count} aria-hidden="true">
                {n}
              </span>
              {/* The count is decorative for sighted users — it sits beside the
                  label — but a screen reader should hear what it means. */}
              <span className="sr-only">
                {" — "}
                {(n === 1 ? t.resultsOne : t.results).replace("{n}", String(n))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.bar}>
      {group(
        "kind",
        KIND_FILTERS,
        t.kindLabel,
        (o: KindFilter) => (o === "all" ? t.all : t.kind[o]),
        (o: KindFilter) => counts.kind[o]
      )}
      {group(
        "furnishing",
        FURNISHING_FILTERS,
        t.furnishingLabel,
        (o: FurnishingFilter) =>
          o === "all" ? t.all : o === "furnished" ? t.furnished : t.unfurnished,
        (o: FurnishingFilter) => counts.furnishing[o]
      )}

      {/* The result count, announced. Without this a screen-reader user presses
          a chip, hears its own state change and nothing else — the grid below
          has silently become a different list. */}
      <p className={styles.results} role="status" aria-live="polite">
        {(shown === 1 ? t.resultsOne : t.results).replace("{n}", String(shown))}
      </p>
      <span
        key={beat}
        className={`${styles.ack} ${beat > 0 ? styles.ackRun : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
