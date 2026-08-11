"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { site } from "@/lib/site";
import { formatPrice, type Studio } from "@/lib/apartments";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./ReserveStudio.module.css";

/**
 * The reservation panel.
 *
 * CONTRACT says this is a marketing site, not a booking engine, and that
 * reservations go to phone and WhatsApp. That still holds — so this does not
 * pretend to take a booking. It collects dates and a headcount and hands them
 * to the channel the venue actually answers, with the unit code already in the
 * message so nobody has to spell out "A10-2-A" over a bad line.
 *
 * The upside of doing it this way: it is real. There is no fake confirmation
 * screen to rip out later, and it works the day it ships. When the client wants
 * a true booking engine, this panel is where it goes.
 *
 * ── THE RATE ────────────────────────────────────────────────────────────────
 * Shown when the unit has a confirmed one, « tarif sur demande » when it does
 * not. Until 2026-08-11 no unit had one and this panel said « sur demande »
 * unconditionally — which, once SS101 arrived with 60 000 FCFA on its sheet,
 * put « tarif sur demande » directly beside the masthead quoting the price.
 *
 * ⚠️ It deliberately does NOT multiply the rate by the number of nights. The
 * sheet's weekly and monthly boxes came back BLANK, so a 30-night total at the
 * nightly rate would quote ~1 800 000 FCFA against a monthly price that
 * probably exists and that we have never been told. The nightly figure is what
 * was confirmed, so the nightly figure is all this states; the night count
 * below travels to WhatsApp, where a human quotes the real total.
 * Add a total here only once weekly/monthly rates are on record.
 */
/* Two field marks, local to this panel — they belong to the form, not to the
   amenity vocabulary in AmenityIcon.tsx, and keeping them here stops that set
   from becoming a junk drawer. */
function Glyph({ name }: { name: "calendar" | "guest" }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      {name === "calendar" ? (
        <>
          <rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2" {...s} />
          <path d="M3.4 9.8h17.2M8.2 3.4v3.6M15.8 3.4v3.6" {...s} />
        </>
      ) : (
        <>
          <circle cx="12" cy="8.2" r="3.8" {...s} />
          <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" {...s} />
        </>
      )}
    </svg>
  );
}

export default function ReserveStudio({
  studio,
  lang,
  dict,
}: {
  studio: Studio;
  lang: Lang;
  dict: Dict;
}) {
  const t = dict.studios.book;
  const uid = useId();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(1);

  /* `min` depends on today's date. Deriving it during render would make the
     server and the client disagree whenever the two straddle midnight, so it
     is set after mount — the inputs are perfectly usable in the meantime. */
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);

  const nights = useMemo(() => {
    if (!from || !to) return 0;
    const ms = new Date(to).getTime() - new Date(from).getTime();
    return ms > 0 ? Math.round(ms / 86_400_000) : 0;
  }, [from, to]);

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric",
      month: "long",
    }).format(new Date(`${iso}T12:00:00`));

  const message = useMemo(() => {
    const dates =
      from && to
        ? t.messageDates.replace("{from}", fmt(from)).replace("{to}", fmt(to))
        : t.messageNoDates;
    return t.message
      .replace("{code}", studio.code)
      .replace("{dates}", dates)
      .replace("{guests}", t.messageGuests.replace("{n}", String(guests)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, guests, studio.code, t, lang]);

  const rate = formatPrice(studio.pricePerNight);
  const waNumber = site.contact.whatsapp.tel.replace(/\D/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  const canBook = studio.status !== "occupied";

  return (
    <aside className={styles.panel} aria-labelledby={`${uid}-title`}>
      <h2 id={`${uid}-title`} className={styles.title}>
        {t.title}
      </h2>

      <p className={styles.price}>
        {rate ? (
          <>
            <span className={styles.rate}>{rate}</span>{" "}
            <span className={styles.per}>{dict.studios.specs.perNight}</span>
          </>
        ) : (
          t.price
        )}
      </p>

      {studio.status === "occupied" && (
        <p className={styles.notice}>{t.unavailable}</p>
      )}
      {studio.status === "soon" && <p className={styles.notice}>{t.soon}</p>}

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={`label ${styles.fieldLabel}`}>
            <Glyph name="calendar" />
            {t.arrival}
          </span>
          <input
            type="date"
            value={from}
            min={today || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={`label ${styles.fieldLabel}`}>
            <Glyph name="calendar" />
            {t.departure}
          </span>
          <input
            type="date"
            value={to}
            min={from || today || undefined}
            onChange={(e) => setTo(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={`label ${styles.fieldLabel}`}>
            <Glyph name="guest" />
            {t.guests}
          </span>
          <input
            type="number"
            min={1}
            max={studio.sleeps}
            value={guests}
            onChange={(e) =>
              setGuests(
                Math.min(studio.sleeps, Math.max(1, Number(e.target.value) || 1))
              )
            }
            className={styles.input}
          />
        </label>
      </div>

      {/* aria-live so a screen-reader user hears the total change rather than
          having to go looking for it after every date edit. */}
      <p className={styles.nights} aria-live="polite">
        {nights > 0 ? `${nights} ${nights > 1 ? t.nightsPlural : t.nights}` : " "}
      </p>

      <div className={styles.actions}>
        {canBook ? (
          <a
            className="btn"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.whatsapp}
          </a>
        ) : (
          <button type="button" className="btn" disabled>
            {t.whatsapp}
          </button>
        )}
        {/* Not `label`: uppercase mono at 0.19em tracking wrapped the number
            onto a second line and made it harder to read, on the one control a
            visitor with a bad connection is most likely to use. */}
        <a className={styles.call} href={`tel:${site.contact.phonePrimary.tel}`}>
          {t.call} — {site.contact.phonePrimary.display}
        </a>
      </div>
    </aside>
  );
}
