"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import Monogram from "./Monogram";
import LangSwitch from "./LangSwitch";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import type { Lang } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import styles from "./Nav.module.css";

/**
 * Kept deliberately short on desktop — more wrapped the bar onto two lines.
 * « La semaine » is covered by the events page.
 */
const SECTIONS = [
  { hash: "#lieu", key: "lieu" },
  { hash: "#evenements", key: "evenements" },
  { hash: "#appartements", key: "appartements" },
  { hash: "#contact", key: "contact" },
] as const satisfies readonly { hash: string; key: keyof Dict["nav"]["links"] }[];

export default function Nav({ lang, dict }: { lang: Lang; dict: Dict }) {
  const rootRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useGSAP(
    () => {
      const nav = rootRef.current;
      if (!nav) return;

      // Backdrop appears once the page has scrolled past 60px.
      ScrollTrigger.create({
        start: 60,
        end: "max",
        toggleClass: { targets: nav, className: styles.scrolled },
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        /* The preloader signal usually fires after this context has finished
           collecting, so register the tween through ctx.add() to keep it in
           scope for cleanup. */
        const play = () => {
          ctx.add(() => {
            gsap.from(nav, {
              yPercent: -100,
              duration: 1.15,
              ease: "expo.out",
              delay: 0.3,
              /* A leftover transform makes the header a containing block, and
                 position:fixed descendants would pin to IT instead of the
                 viewport. Nothing fixed lives inside the header any more (the
                 drawer was moved out for exactly this reason) — cleared anyway
                 so the trap can never come back. */
              clearProps: "transform",
            });
          });
        };
        if (document.documentElement.dataset.loaded === "1") play();
        else window.addEventListener("glen:loaded", play, { once: true });
        return () => window.removeEventListener("glen:loaded", play);
      });
    },
    { scope: rootRef }
  );

  /* ---- drawer lifecycle ----
     Scroll locks while open (Lenis + native overflow), Escape closes, focus
     moves to the first link on open and back to the burger on close. Route
     changes close it, so tapping « La carte » never leaves a stale overlay. */
  const close = useCallback(() => setOpen(false), []);

  useEffect(close, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    lockScroll();

    /* aria-modal promises assistive tech that nothing outside the dialog
       exists — but nothing enforced that for the keyboard: Tab walked
       straight out into the page hidden behind the opaque overlay, with
       scroll locked so the focused element could not even be brought into
       view. inert everything except the header (the visible bar stays
       interactive by design) and the drawer itself. (Review finding, high.) */
    const dimmed = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el !== rootRef.current &&
        el !== drawerRef.current &&
        !el.inert
    );
    dimmed.forEach((el) => (el.inert = true));

    /* Snapshots for the cleanup — the refs could in principle point elsewhere
       by then (react-hooks/exhaustive-deps). */
    const burger = burgerRef.current;
    const root = rootRef.current;
    const drawer = drawerRef.current;
    /* Focus the first NAV LINK, not the sr-only close button that now
       precedes it — programmatic focus on a visually hidden control gives a
       keyboard user no visible location. */
    const first = drawer?.querySelector<HTMLElement>("nav a");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    /* Desktop resize while open: the drawer is display:none ≥900px, which
       would leave the page scroll-locked behind an invisible overlay. */
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && close();
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      dimmed.forEach((el) => (el.inert = false));
      unlockScroll();
      burger?.focus();
      /* Resize-to-desktop close: the burger is display:none there, so its
         focus() silently no-ops and a keyboard user resumes from <body> at
         the top of the document. Fall back to the always-visible brand link.
         (Review finding.) */
      if (document.activeElement !== burger) {
        root?.querySelector<HTMLElement>("a")?.focus();
      }
    };
  }, [open, close]);

  /* Staggered entrance for the drawer links. */
  useGSAP(
    () => {
      if (!open || !drawerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        drawerRef.current.querySelectorAll("[data-drawer-item]"),
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.05, delay: 0.08 }
      );
    },
    { dependencies: [open] }
  );

  /**
   * Section links are `/fr#lieu`, not `#lieu`, so they work from inner pages.
   * Intercept only when the target exists on the current page; from the
   * drawer, close first so the overlay never covers the scroll.
   */
  const onAnchor = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      const raw = e.currentTarget.getAttribute("href") ?? "";
      const hash = raw.slice(raw.indexOf("#"));
      if (!hash.startsWith("#")) return;

      const target = document.querySelector(hash);
      if (!target) return; // different page — let the navigation happen

      e.preventDefault();
      close();
      if (window.__lenis) {
        /* close() is a batched state update — the drawer's unlock cleanup has
           NOT run yet, so Lenis is still stopped here and scrollTo would
           silently early-return: menu closes, page never moves. start() first
           clears isStopped (and turns the later cleanup start() into a no-op
           instead of a tween-killing reset). Verified against lenis 1.3.26
           source by the review. (Finding, high.) */
        window.__lenis.start();
        window.__lenis.scrollTo(hash, { duration: 1.4 });
      } else {
        /* No Lenis means the user asked for reduced motion — honour it. */
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      }
    },
    [close]
  );

  const home = href("home", lang);
  const waNumber = site.contact.whatsapp.tel.replace(/\D/g, "");

  return (
    <>
    <header ref={rootRef} className={styles.nav}>
      <Link href={home} className={styles.brand}>
        <Monogram size={22} />
        <span className={styles.word}>Glen Lounge</span>
      </Link>

      <nav className={styles.links} aria-label={dict.nav.menuLabel}>
        {/* Real pages, so real Links — not in-page anchors. */}
        <Link href={href("carte", lang)} className={`label ${styles.link}`}>
          {dict.nav.links.carte}
        </Link>
        <Link href={href("evenements", lang)} className={`label ${styles.link}`}>
          {dict.nav.links.soirees}
        </Link>
        {SECTIONS.map((s) => (
          <a
            key={s.hash}
            href={`${home}${s.hash}`}
            className={`label ${styles.link}`}
            onClick={onAnchor}
          >
            {dict.nav.links[s.key]}
          </a>
        ))}
      </nav>

      <div className={styles.right}>
        {/* Language switcher lives in the drawer below 900px — with it in the
            bar, a 360px phone clipped RÉSERVER and pushed the burger clean off
            the screen. */}
        <span className={styles.langBar}>
          <LangSwitch lang={lang} dict={dict} />
        </span>
        <a
          href={`tel:${site.contact.phonePrimary.tel}`}
          className={`label label--text ${styles.phone}`}
        >
          {site.contact.phonePrimary.display}
        </a>
        <a href={`${home}#contact`} className={styles.cta} onClick={onAnchor}>
          {dict.nav.reserve}
        </a>

        {/* The mobile menu. Without it, phones cannot reach the inner pages
            at all — the desktop link row is display:none below 900px. */}
        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerBar} ${open ? styles.barTop : ""}`} />
          <span className={`${styles.burgerBar} ${open ? styles.barMid : ""}`} />
          <span className={`${styles.burgerBar} ${open ? styles.barBot : ""}`} />
        </button>
      </div>
    </header>

    {/* SIBLING of the header, deliberately. Inside it, the entrance transform
        and the scrolled-state backdrop-filter each make the header a
        containing block, and this fixed overlay would pin to the BAR instead
        of the viewport — which is exactly the bug the first screenshot showed:
        a drawer one nav-strip tall with the page grinning through. */}
      <div
        ref={drawerRef}
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menuLabel}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        inert={!open}
      >
        {/* A close control INSIDE the dialog. aria-modal excludes the header's
            ✕ from assistive-tech reach, and iOS VoiceOver has no Escape key —
            without this, a VoiceOver user's only exit was navigating away.
            sr-only until focused, so it doesn't visually double the header ✕.
            (Review finding, high.) */}
        <button
          type="button"
          className={styles.drawerClose}
          onClick={close}
          data-drawer-item
        >
          {dict.nav.closeMenu}
        </button>

        <nav className={styles.drawerNav} aria-label={dict.nav.menuLabel}>
          <Link
            href={href("carte", lang)}
            className={styles.drawerLink}
            data-drawer-item
          >
            {dict.nav.links.carte}
          </Link>
          <Link
            href={href("evenements", lang)}
            className={styles.drawerLink}
            data-drawer-item
          >
            {dict.nav.links.soirees}
          </Link>
          {SECTIONS.map((s) => (
            <a
              key={s.hash}
              href={`${home}${s.hash}`}
              className={styles.drawerLink}
              onClick={onAnchor}
              data-drawer-item
            >
              {dict.nav.links[s.key]}
            </a>
          ))}
        </nav>

        <div className={styles.drawerFoot} data-drawer-item>
          <a className="btn" href={`tel:${site.contact.phonePrimary.tel}`}>
            {dict.nav.call} — {site.contact.phonePrimary.display}
          </a>
          <a
            className="btn"
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <span className={styles.drawerLang}>
            <LangSwitch lang={lang} dict={dict} />
          </span>
        </div>
      </div>
    </>
  );
}
