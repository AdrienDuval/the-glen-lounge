"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * The house scroll choreography, in one place.
 *
 * Every section reveals the same way, so the vocabulary lives here rather than
 * being retyped (and drifting) in each one. Opt in with data attributes:
 *
 *   [data-reveal]  — rises and fades, staggered, once
 *   [data-rule]    — the luminous hairline sweeps when it enters
 *   .frame         — clips up while its media settles out of scale
 *
 * Pass `titleRef` to get the masked line-by-line heading split.
 *
 * The whole thing lives inside a `no-preference` matchMedia branch, so
 * reduced-motion users get the finished layout with nothing to wait for.
 */
export function useSectionMotion(
  scope: RefObject<HTMLElement | null>,
  titleRef?: RefObject<HTMLHeadingElement | null>
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const h = titleRef?.current;
        if (h) {
          SplitText.create(h, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.15,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: { trigger: h, start: "top 82%", once: true },
                /* Restore pristine markup so tight leading never clips the
                   French accents (É, À, ê) once the line is at rest. */
                onComplete: () => self.revert(),
              }),
          });
        }

        const reveals = root.querySelectorAll("[data-reveal]");
        if (reveals.length) {
          gsap.from(reveals, {
            y: 30,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          });
        }

        root.querySelectorAll("[data-rule]").forEach((rule) => {
          ScrollTrigger.create({
            trigger: rule,
            start: "top 88%",
            once: true,
            onEnter: () => rule.classList.add("lit"),
          });
        });

        gsap.utils.toArray<HTMLElement>(".frame", root).forEach((frame, i) => {
          const delay = i * 0.08;
          gsap.from(frame, {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.2,
            ease: "expo.out",
            delay,
            scrollTrigger: { trigger: frame, start: "top 85%", once: true },
          });
          const media = frame.querySelector("img, video");
          if (media) {
            gsap.from(media, {
              scale: 1.18,
              duration: 1.6,
              ease: "expo.out",
              delay,
              scrollTrigger: { trigger: frame, start: "top 85%", once: true },
            });
          }
        });
      });
    },
    { scope }
  );
}
