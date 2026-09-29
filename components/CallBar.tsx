"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import type { Dict } from "@/lib/i18n";
import SocialIcon from "./SocialIcon";
import styles from "./CallBar.module.css";

/**
 * The phone-only « Appeler | WhatsApp » bar, for every page that is not a
 * unit page (those carry ReserveStudio's own bar, with the unit's rate).
 *
 * Why it exists: measured at 390px on /fr, the first screen offered « Voir les
 * soirées » and « La carte » and nothing that dials. The nav's « Réserver »
 * scrolled ~6 300px to #contact, so the site's one conversion was a tap, a
 * long scroll and a second tap away. This makes it one tap from anywhere.
 *
 * Shown once the visitor has scrolled past most of the first screen, and
 * hidden again whenever #contact or the footer is on screen — both already
 * print the same two buttons, and doubling them reads as a glitch. The CSS
 * removes it outright from 900px, where the nav CTA is always in view.
 */
export default function CallBar({
  dict,
  night,
}: {
  dict: Dict;
  /** The night's name, on an event page — prefills the WhatsApp message. */
  night?: string;
}) {
  const t = dict.callBar;
  const [scrolled, setScrolled] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* One observer over both targets; the bar is covered while either is in
       view. A Set rather than the last entry's flag, because a single callback
       can report one target leaving as the other arrives. */
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el != null
    );
    const inView = new Set<Element>();
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            for (const e of entries) {
              if (e.isIntersecting) inView.add(e.target);
              else inView.delete(e.target);
            }
            setCovered(inView.size > 0);
          });
    targets.forEach((el) => io?.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  if (!scrolled || covered) return null;

  const message = night ? t.messageFor.replace("{night}", night) : t.message;
  const waNumber = site.contact.whatsapp.tel.replace(/\D/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.bar} role="region" aria-label={t.label}>
      <a className={`btn ${styles.call}`} href={`tel:${site.contact.phonePrimary.tel}`}>
        {dict.contact.callCta}
      </a>
      <a className={`btn ${styles.wa}`} href={waHref} target="_blank" rel="noopener noreferrer">
        <SocialIcon name="whatsapp" size={16} />
        {t.whatsapp}
      </a>
    </div>
  );
}
