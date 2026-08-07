import Link from "next/link";
import Monogram from "@/components/Monogram";
import { fr } from "@/lib/i18n/fr";
import { en } from "@/lib/i18n/en";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import styles from "./not-found.module.css";

/**
 * `not-found.tsx` receives no route params, so it cannot know which locale the
 * visitor was in. Rather than guess or thread the pathname through headers,
 * it leads in French (the default locale) and repeats the essentials in
 * English underneath — which is what a bilingual site should do on the one
 * page where the language is genuinely unknown.
 */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <Monogram size={64} />

      <p className="label label--gold">{fr.notFound.eyebrow}</p>
      <h1 className={styles.title}>{fr.notFound.title}</h1>
      <p className={styles.body}>{fr.notFound.body}</p>

      <div className={`rule lit ${styles.rule}`} />

      <p className={`label ${styles.alt}`}>
        {en.notFound.title} — {en.notFound.body}
      </p>

      <Link href={`/${DEFAULT_LOCALE}`} className={styles.cta}>
        {fr.notFound.cta}
      </Link>
    </div>
  );
}
