import { site } from "@/lib/site";
import type { Dict } from "@/lib/i18n";
import styles from "./Footer.module.css";

/**
 * Server component — no motion, so no client bundle.
 *
 * Every fact rendered here is verified in FACTS.md. Two deliberate omissions:
 * the landmark distance (the Contact section carries the current 300 m
 * wording; the footer stays short) and any email address, since none has ever
 * been published.
 */
export default function Footer({ dict }: { dict: Dict }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.wordmark}>Glen Lounge</p>
        <p className={`label ${styles.tagline}`}>{dict.hero.tagline}</p>
      </div>

      <div className={styles.cols}>
        <div>
          <h2 className={`label ${styles.colTitle}`}>{dict.footer.findUs}</h2>
          <ul className={styles.colList}>
            <li className="label label--text">
              {site.address.area}, derrière le stade
            </li>
            <li className="label label--text">{site.address.detail}</li>
            <li className="label label--text">
              {site.address.city}, {site.address.country}
            </li>
          </ul>
        </div>

        <div>
          <h2 className={`label ${styles.colTitle}`}>{dict.footer.contact}</h2>
          <ul className={styles.colList}>
            <li>
              <a
                className={`label label--text ${styles.colLink}`}
                href={`tel:${site.contact.phonePrimary.tel}`}
              >
                {site.contact.phonePrimary.display}
              </a>
            </li>
            {/* The second published number is disputed by one digit — see the
                note in components/Contact.tsx. One number everywhere until the
                client settles it; two, one of which may be wrong, is worse. */}
            <li>
              <a
                className={`label label--text ${styles.colLink}`}
                href={`https://wa.me/${site.contact.whatsapp.tel.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.common.whatsapp}
              </a>
            </li>
          </ul>

          <h2 className={`label ${styles.colTitle}`} style={{ marginTop: "1.75rem" }}>
            {dict.footer.hours}
          </h2>
          <ul className={styles.colList}>
            <li className="label label--text">
              {dict.footer.hoursRestaurant} — {dict.footer.hoursRestaurantValue}
            </li>
            <li className="label label--text">
              {dict.footer.hoursApartments} — {dict.footer.hoursApartmentsValue}
            </li>
          </ul>
        </div>

        <div>
          <h2 className={`label ${styles.colTitle}`}>{dict.footer.follow}</h2>
          <ul className={styles.colList}>
            <li>
              <a
                className={`label label--text ${styles.colLink}`}
                href={site.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                className={`label label--text ${styles.colLink}`}
                href={site.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                className={`label label--text ${styles.colLink}`}
                href={site.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="label">
          © {year} {site.name} — {dict.footer.rights}
        </p>
        <p className={`label ${styles.badge}`}>{dict.footer.status}</p>
      </div>
    </footer>
  );
}
