import Link from "next/link";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import SocialIcon from "./SocialIcon";
import styles from "./Footer.module.css";

/**
 * Server component — no motion, so no client bundle.
 *
 * Every fact rendered here is verified in FACTS.md. Two deliberate omissions:
 * the landmark distance (the Contact section carries the current 300 m
 * wording; the footer stays short) and any email address, since none has ever
 * been published.
 *
 * `lang` is here for one reason: the footer said « Appartements » and offered
 * no way to reach them, and a localised route cannot be built without it.
 */
export default function Footer({ dict, lang }: { dict: Dict; lang: Lang }) {
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
            <li className={styles.value}>
              {site.address.area}, derrière le stade
            </li>
            <li className={styles.value}>{site.address.detail}</li>
            <li className={styles.value}>
              {site.address.city}, {site.address.country}
            </li>
          </ul>
        </div>

        <div>
          <h2 className={`label ${styles.colTitle}`}>{dict.footer.contact}</h2>
          <ul className={styles.colList}>
            <li>
              <a
                className={`${styles.value} ${styles.phone} ${styles.colLink}`}
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
                className={`${styles.value} ${styles.colLink} ${styles.iconLink}`}
                href={`https://wa.me/${site.contact.whatsapp.tel.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name="whatsapp" size={16} className={styles.icon} />
                {dict.common.whatsapp}
              </a>
            </li>
          </ul>

          <h2 className={`label ${styles.colTitle} ${styles.colTitleNext}`}>
            {dict.footer.hours}
          </h2>
          <ul className={styles.colList}>
            <li className={styles.value}>
              {dict.footer.hoursRestaurant} — {dict.footer.hoursRestaurantValue}
            </li>
            <li className={styles.value}>
              <Link
                href={href("appartements", lang)}
                className={styles.colLink}
              >
                {dict.footer.hoursApartments}
              </Link>{" "}
              — {dict.footer.hoursApartmentsValue}
            </li>
          </ul>
        </div>

        <div>
          <h2 className={`label ${styles.colTitle}`}>{dict.footer.follow}</h2>
          <ul className={styles.colList}>
            {(["tiktok", "instagram", "facebook"] as const).map((key) => (
              <li key={key}>
                <a
                  className={`${styles.value} ${styles.colLink} ${styles.iconLink}`}
                  href={site.social[key].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon name={key} size={16} className={styles.icon} />
                  {site.social[key].handle}
                </a>
              </li>
            ))}
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
