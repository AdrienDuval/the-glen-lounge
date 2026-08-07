"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Lang } from "@/lib/i18n/config";
import { swapLocale } from "@/lib/routes";
import type { Dict } from "@/lib/i18n";
import styles from "./LangSwitch.module.css";

/**
 * FR | EN. Renders both languages always — a toggle that only shows the
 * *other* language forces the user to work out which one they are currently in.
 *
 * `swapLocale` walks the route table so localised segments translate rather
 * than 404 (see lib/routes.ts).
 */
export default function LangSwitch({
  lang,
  dict,
}: {
  lang: Lang;
  dict: Dict;
}) {
  const pathname = usePathname();

  return (
    <nav className={styles.root} aria-label={dict.langSwitch.label}>
      {LOCALES.map((code, i) => {
        const active = code === lang;
        return (
          <span key={code} className={styles.item}>
            {i > 0 && (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            )}
            {active ? (
              <span className={`${styles.link} ${styles.active}`} aria-current="true">
                {code.toUpperCase()}
              </span>
            ) : (
              <Link
                href={swapLocale(pathname, code)}
                className={styles.link}
                hrefLang={code}
              >
                {code.toUpperCase()}
                <span className="sr-only"> — {dict.langSwitch.switchTo}</span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
