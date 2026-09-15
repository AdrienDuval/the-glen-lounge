"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./RouteWait.module.css";

/**
 * Gold hairline at the top of the viewport while an in-site navigation is
 * still in flight.
 *
 * App Router has no router events, so this listens for clicks on same-origin
 * links and clears when the pathname actually changes. A short delay stops
 * a prefetched hop from flashing the bar on every card press.
 */
export default function RouteWait({ label }: { label: string }) {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    setOn(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setOn(true), 140);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={styles.root}
      data-on={on || undefined}
      role="status"
      aria-live="polite"
      aria-hidden={on ? undefined : true}
    >
      {on && <span className="sr-only">{label}</span>}
      <span className={styles.hair} aria-hidden="true" />
    </div>
  );
}
