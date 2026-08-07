import { EVENTS, WEEKDAYS, type GlenEvent, type Weekday } from "./events";
import { isCleared } from "./photos";
import type { Lang } from "./i18n/config";

/**
 * Calendar model for « La semaine ».
 *
 * Two kinds of thing land on a date and they are resolved differently:
 *   - a **weekly** night recurs on its `day`, so it appears on every matching
 *     weekday, for ever;
 *   - a **one-off** appears only on its `date`.
 *
 * Adding a dated event to `lib/events.ts` therefore puts it on the calendar
 * with no other change — which is the point.
 *
 * Everything here works in UTC. Building dates from local parts would shift
 * the grid by a day for anyone east or west of the build machine, and this
 * runs on a Windows box for a venue in Cameroon.
 */

export type DayCell = {
  /** null for the leading/trailing blanks that pad the grid. */
  date: Date | null;
  iso: string;
  /** Recurring night, if the venue does one on this weekday. */
  weekly: GlenEvent | null;
  /** Dated events on exactly this day. */
  specials: GlenEvent[];
};

export function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(d: Date): Weekday {
  /* getUTCDay is 0=Sunday; WEEKDAYS is Monday-first. */
  return WEEKDAYS[(d.getUTCDay() + 6) % 7];
}

/** Only events whose photo is consent-cleared can surface anywhere. */
function usable(): GlenEvent[] {
  return EVENTS.filter((e) => isCleared(e.photo));
}

export function whatsOn(date: Date): { weekly: GlenEvent | null; specials: GlenEvent[] } {
  const day = weekdayOf(date);
  const iso = isoOf(date);
  const all = usable();
  return {
    weekly: all.find((e) => e.kind === "weekly" && e.day === day) ?? null,
    specials: all.filter((e) => e.kind === "one-off" && e.date === iso),
  };
}

/**
 * A Monday-first grid for the given month, padded to whole weeks.
 * Returns 5 or 6 rows of 7 — whatever the month actually needs.
 */
export function monthGrid(year: number, month: number): DayCell[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // blanks before the 1st

  const cells: DayCell[] = [];
  for (let i = 0; i < lead; i++) {
    cells.push({ date: null, iso: `pad-${i}`, weekly: null, specials: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, month, d));
    cells.push({ date, iso: isoOf(date), ...whatsOn(date) });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, iso: `pad-end-${cells.length}`, weekly: null, specials: [] });
  }

  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Months that contain at least one dated event, for the jump-to affordance. */
export function monthsWithSpecials(): { year: number; month: number }[] {
  const seen = new Set<string>();
  const out: { year: number; month: number }[] = [];
  for (const e of usable()) {
    if (e.kind !== "one-off" || !e.date) continue;
    const d = new Date(`${e.date}T12:00:00Z`);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() });
  }
  return out.sort((a, b) => a.year - b.year || a.month - b.month);
}

export function monthLabel(year: number, month: number, lang: Lang): string {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-GB",
    { month: "long", year: "numeric", timeZone: "UTC" }
  );
}

export function dayLabel(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** Short weekday initials for the grid header, Monday-first. */
export function weekdayInitials(lang: Lang): string[] {
  return WEEKDAYS.map((_, i) =>
    new Date(Date.UTC(2024, 0, 1 + i)) // 2024-01-01 was a Monday
      .toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
        weekday: "short",
        timeZone: "UTC",
      })
      .slice(0, lang === "fr" ? 3 : 3)
  );
}
