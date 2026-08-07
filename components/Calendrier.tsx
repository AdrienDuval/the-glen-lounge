"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  dayLabel,
  isoOf,
  monthGrid,
  monthLabel,
  weekdayInitials,
  type DayCell,
} from "@/lib/calendar";
import { WEEKDAYS, type GlenEvent } from "@/lib/events";
import { PHOTOS } from "@/lib/photos";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { useSectionMotion } from "./useSectionMotion";
import styles from "./Calendrier.module.css";

/** The environments where the hover popover exists at all. */
const POP_MQ = "(hover: hover) and (pointer: fine) and (min-width: 980px)";

/**
 * L'agenda — a full-width month over `lib/events.ts`.
 *
 * Readability comes from the grid itself: on a wide viewport every cell prints
 * its event's name and door time, so the whole month scans without touching
 * anything. Hovering (or focusing) a day raises a popover card — photo, date,
 * summary, key facts, link — that glides between days rather than re-opening.
 *
 * Interaction contract:
 *  - hover / focus  → popover anchored to the cell
 *  - click by keyboard (event.detail === 0) → focus moves into the popover so
 *    the « voir le détail » link is reachable; Escape returns it to the cell
 *  - touch / narrow viewport → no popover; tap feeds the panel under the grid
 *
 * "Today" is corrected client-side after mount: the site is statically built,
 * so the server's month would go stale. First client paint matches the server
 * markup (no hydration mismatch); an effect then flips to the real month.
 */
export default function Calendrier({
  buildDate,
  lang,
  dict,
}: {
  buildDate: string;
  lang: Lang;
  dict: Dict;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const shownRef = useRef(false);
  useSectionMotion(rootRef, titleRef);

  const seed = useMemo(() => new Date(`${buildDate}T12:00:00Z`), [buildDate]);
  const [cursor, setCursor] = useState({
    year: seed.getUTCFullYear(),
    month: seed.getUTCMonth(),
  });
  const [todayIso, setTodayIso] = useState(buildDate);
  const [activeIso, setActiveIso] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setTodayIso(isoOf(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))));
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  const rows = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);
  const cells = useMemo(() => rows.flat(), [rows]);

  const featOf = (c: DayCell): GlenEvent | null => c.specials[0] ?? c.weekly ?? null;

  /** The popover's cell (hover-driven). */
  const activeCell = useMemo(
    () => (activeIso ? cells.find((c) => c.iso === activeIso) ?? null : null),
    [cells, activeIso]
  );

  /** The mobile panel's cell: the chosen day, else today, else the first
      day with news, else the first weekly. Never empty mid-month. */
  const panelCell = useMemo(() => {
    const real = cells.filter((c) => c.date);
    return (
      activeCell ??
      /* Today only counts when it actually has an event — otherwise a quiet
         Monday would short-circuit the chain and the panel would claim
         « rien de publié » under a grid full of nights. (Review finding.) */
      real.find((c) => c.iso === todayIso && featOf(c)) ??
      real.find((c) => c.specials.length) ??
      real.find((c) => c.weekly) ??
      null
    );
  }, [cells, activeCell, todayIso]);

  const shift = useCallback((delta: number) => {
    setActiveIso(null);
    setCursor((c) => {
      const d = new Date(Date.UTC(c.year, c.month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });
  }, []);

  /* ---- close scheduling: the popover must survive the pointer travelling
     from the cell into the card (to click its link). ---- */
  const cancelClose = useCallback(() => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    /* Close-on-leave only makes sense where the popover exists. On touch,
       scrolling makes Chromium synthesize a mouseleave on the grid — which
       was silently wiping the tapped selection out of the panel below. */
    if (!window.matchMedia(POP_MQ).matches) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      /* Keep it open while a keyboard user is inside it. */
      if (popRef.current?.contains(document.activeElement)) return;
      setActiveIso(null);
    }, 180);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  /**
   * Escape closes the popover and hands focus back to its cell.
   *
   * Three guards, all from review findings: it only acts where the popover
   * exists (on touch, a tapped selection is panel state, not a dialog to
   * dismiss — and Escape must never hijack a press aimed elsewhere); it only
   * restores focus when focus is actually inside the grid/popover; and the
   * restore suppresses the cell's onFocus, which would otherwise re-open the
   * popover in the same breath and make Escape a no-op.
   */
  const escapingRef = useRef(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !activeIso) return;
      if (!window.matchMedia(POP_MQ).matches) return;
      const grid = monthRef.current;
      const iso = activeIso;
      setActiveIso(null);
      if (grid?.contains(document.activeElement)) {
        escapingRef.current = true;
        grid
          .querySelector<HTMLElement>(`[data-iso="${CSS.escape(iso)}"]`)
          ?.focus();
        window.setTimeout(() => (escapingRef.current = false), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIso]);

  /* ---- month-turn cascade ---- */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const els = monthRef.current?.querySelectorAll("[data-cell]");
      if (!els?.length) return;
      gsap.fromTo(
        els,
        { opacity: 0, y: 10, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: { each: 0.01, from: "start" },
          overwrite: "auto",
        }
      );
    },
    { dependencies: [cursor.year, cursor.month] }
  );

  /* ---- popover position + entrance ----
     First show: fade/rise in place. Subsequent days: the card GLIDES to the
     new cell while its content restaggers — moving across the month reads as
     one object following you, not a series of tooltips. */
  useGSAP(
    () => {
      const pop = popRef.current;
      const grid = monthRef.current;
      if (!pop || !grid) return;

      const usable = activeIso && window.matchMedia(POP_MQ).matches;

      if (!usable) {
        gsap.set(pop, { autoAlpha: 0 });
        shownRef.current = false;
        return;
      }

      const cellEl = grid.querySelector<HTMLElement>(
        `[data-iso="${CSS.escape(activeIso)}"]`
      );
      if (!cellEl) {
        gsap.set(pop, { autoAlpha: 0 });
        shownRef.current = false;
        return;
      }

      const gr = grid.getBoundingClientRect();
      const cr = cellEl.getBoundingClientRect();
      const pw = pop.offsetWidth;
      const ph = pop.offsetHeight;

      let x = cr.left - gr.left + cr.width / 2 - pw / 2;
      x = Math.max(0, Math.min(x, gr.width - pw));
      /* Above the cell when there is room; below it on the top rows. */
      let y = cr.top - gr.top - ph - 12;
      if (y < -8) y = cr.top - gr.top + cr.height + 12;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = pop.querySelectorAll("[data-pop-item]");

      if (!shownRef.current) {
        gsap.set(pop, { x, y });
        gsap.to(pop, { autoAlpha: 1, duration: reduce ? 0 : 0.35, ease: "power2.out" });
        shownRef.current = true;
      } else {
        gsap.to(pop, {
          x,
          y,
          autoAlpha: 1,
          duration: reduce ? 0 : 0.5,
          ease: "expo.out",
          overwrite: "auto",
        });
      }

      if (!reduce && items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "expo.out", stagger: 0.045, overwrite: "auto" }
        );
      }
    },
    { dependencies: [activeIso, cursor.year, cursor.month] }
  );

  const onCellClick = (iso: string) => (e: ReactMouseEvent<HTMLButtonElement>) => {
    cancelClose();
    setActiveIso(iso);
    /* detail === 0 → the click came from the keyboard. Move focus into the
       popover so its link is reachable; Escape brings it back. */
    if (e.detail === 0) {
      requestAnimationFrame(() => {
        popRef.current?.querySelector<HTMLElement>("a")?.focus();
      });
    }
  };

  const initials = weekdayInitials(lang);
  const eventsBase = href("evenements", lang);
  const popFeat = activeCell ? featOf(activeCell) : null;
  const popPhoto = popFeat ? PHOTOS[popFeat.photo] : null;
  const panelFeat = panelCell ? featOf(panelCell) : null;

  return (
    <section id="calendrier" ref={rootRef} className={`shell ${styles.section}`}>
      <div className={styles.head}>
        <p className="label label--gold" data-reveal>
          {dict.semaine.section}
        </p>
        <h2 ref={titleRef} className={styles.title}>
          {dict.semaine.title}
        </h2>
        <p className={styles.lede} data-reveal>
          {dict.semaine.lede}
        </p>
      </div>

      <div data-reveal>
        <div className={styles.monthBar}>
          <p className={styles.monthName}>{monthLabel(cursor.year, cursor.month, lang)}</p>
          <div className={styles.monthNav}>
            <button
              type="button"
              className={styles.navBtn}
              aria-label={dict.semaine.prevMonth}
              onClick={() => shift(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className={styles.navBtn}
              aria-label={dict.semaine.nextMonth}
              onClick={() => shift(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className={styles.weekHead} aria-hidden="true">
          {WEEKDAYS.map((day, i) => (
            <span key={day} className="label">
              <span className={styles.dShort}>{initials[i]}</span>
              <span className={styles.dFull}>{dict.semaine.days[day]}</span>
            </span>
          ))}
        </div>

        <div
          ref={monthRef}
          className={styles.month}
          onMouseLeave={scheduleClose}
          /* focusout: a keyboard user tabbing out of the grid must close the
             popover too, or it stays on screen anchored to a cell that no
             longer has focus, with its link a stray tab stop. scheduleClose's
             existing guards keep it open while focus is ON the popover link,
             and cancelClose in the next cell's onFocus handles cell-to-cell
             tabbing. (Review finding.) */
          onBlur={scheduleClose}
        >
          {cells.map((cell) => {
            if (!cell.date) {
              return <div key={cell.iso} className={styles.pad} data-cell />;
            }
            const feat = featOf(cell);
            const has = feat ? 1 : 0;
            const isOn = activeIso === cell.iso;
            const label = `${dayLabel(cell.date, lang)}${
              feat ? ` — ${feat.title[lang]}` : ""
            }`;
            return (
              <button
                key={cell.iso}
                type="button"
                data-cell
                data-iso={cell.iso}
                data-has={has}
                disabled={!has}
                aria-label={label}
                /* A disclosure, not a toggle: the button opens a popover with
                   a link in it. aria-pressed mirrored focus and announced a
                   meaningless constant "pressed" — expanded/controls is the
                   truthful relationship. SSR-safe: activeIso is null on the
                   server and first client paint. (Review finding.) */
                aria-expanded={has ? isOn : undefined}
                aria-controls={has ? "cal-pop" : undefined}
                className={[
                  styles.day,
                  cell.specials.length ? styles.daySpecial : "",
                  isOn ? styles.dayOn : "",
                  cell.iso === todayIso ? styles.dayToday : "",
                ].join(" ")}
                onMouseEnter={() => {
                  if (has) {
                    cancelClose();
                    setActiveIso(cell.iso);
                  }
                }}
                onFocus={() => {
                  /* escapingRef: Escape returns focus here — reopening on that
                     synthetic focus would make Escape a no-op. */
                  if (has && !escapingRef.current) {
                    cancelClose();
                    setActiveIso(cell.iso);
                  }
                }}
                onClick={has ? onCellClick(cell.iso) : undefined}
              >
                <span className={styles.num}>{cell.date.getUTCDate()}</span>
                {feat && (
                  <>
                    <span className={styles.cellName}>{feat.title[lang]}</span>
                    {feat.time && <span className={styles.cellTime}>{feat.time}</span>}
                  </>
                )}
                <span className={styles.marks} aria-hidden="true">
                  {cell.specials.length > 0 && <span className={styles.dotSpecial} />}
                  {cell.weekly && cell.specials.length === 0 && (
                    <span className={styles.dot} />
                  )}
                </span>
              </button>
            );
          })}

          {/* ---- the hover card ---- */}
          <div
            ref={popRef}
            id="cal-pop"
            className={styles.pop}
            inert={!activeIso}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {activeCell && popFeat && popPhoto && (
              <>
                <div
                  className={`${styles.popMedia} ${
                    popFeat.layout === "poster" ? styles.popMediaPoster : ""
                  }`}
                  data-pop-item
                >
                  <Image
                    src={popPhoto.src}
                    alt=""
                    width={popPhoto.w}
                    height={popPhoto.h}
                    sizes="23rem"
                    quality={60}
                  />
                </div>
                <div className={styles.popBody}>
                  <p className={`label ${styles.popDate}`} data-pop-item>
                    {activeCell.date ? dayLabel(activeCell.date, lang) : ""}
                  </p>
                  <h3 className={styles.popTitle} data-pop-item>
                    {popFeat.title[lang]}
                  </h3>
                  <p className={styles.popSummary} data-pop-item>
                    {popFeat.summary[lang]}
                  </p>
                  <p className={`label ${styles.popRow}`} data-pop-item>
                    <span className={styles.popKey}>{dict.evenementsPage.when}</span>
                    <span>{popFeat.when[lang]}</span>
                  </p>
                  <p className={`label ${styles.popRow}`} data-pop-item>
                    <span className={styles.popKey}>{dict.evenementsPage.where}</span>
                    <span>{dict.semaine.where}</span>
                  </p>
                  <div className={styles.chips} data-pop-item>
                    {popFeat.highlights.map((h) => (
                      <span key={h.fr} className={styles.chip}>
                        {h[lang]}
                      </span>
                    ))}
                  </div>
                  <Link
                    className={`label ${styles.popLink}`}
                    href={`${eventsBase}/${popFeat.slug}`}
                    data-pop-item
                  >
                    {dict.semaine.seeEvent} →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={`label ${styles.legendItem}`}>
            <span className={styles.dot} aria-hidden="true" />
            {dict.semaine.legendWeekly}
          </span>
          <span className={`label ${styles.legendItem}`}>
            <span className={styles.dotSpecial} aria-hidden="true" />
            {dict.semaine.legendSpecial}
          </span>
        </div>

        {/* ---- narrow-viewport detail (tap, no hover) ---- */}
        <div className={styles.panel} aria-live="polite">
          {panelCell && panelFeat ? (
            <>
              <p className={`label ${styles.panelDate}`}>
                {panelCell.date ? dayLabel(panelCell.date, lang) : ""}
              </p>
              <h3 className={styles.panelTitle}>{panelFeat.title[lang]}</h3>
              <p className={styles.panelSummary}>{panelFeat.summary[lang]}</p>
              <p className={`label ${styles.popRow}`}>
                <span className={styles.popKey}>{dict.evenementsPage.when}</span>
                <span>{panelFeat.when[lang]}</span>
              </p>
              <div className={styles.chips}>
                {panelFeat.highlights.map((h) => (
                  <span key={h.fr} className={styles.chip}>
                    {h[lang]}
                  </span>
                ))}
              </div>
              <Link
                className={`label ${styles.popLink}`}
                href={`${eventsBase}/${panelFeat.slug}`}
              >
                {dict.semaine.seeEvent} →
              </Link>
            </>
          ) : (
            <p className={styles.empty}>{dict.semaine.noneYet}</p>
          )}
        </div>
      </div>

      <p className={`label ${styles.djs}`} data-reveal>
        {dict.semaine.djs}
      </p>
    </section>
  );
}
