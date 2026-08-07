"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point. Importing GSAP plugins from here (never from
 * `gsap/...` directly in a component) guarantees they are registered exactly
 * once, and keeps the SSR guard in one place.
 *
 * SplitText ships in the public package as of GSAP 3.13 — no Club licence.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
