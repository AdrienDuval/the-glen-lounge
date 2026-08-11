import type { Amenity } from "@/lib/apartments";

/**
 * Amenity marks, drawn in-house on a 24×24 grid — same reasoning as
 * `SocialIcon.tsx`: twelve inline glyphs cost a few hundred bytes, ship no
 * runtime, and inherit `currentColor`, so the surrounding CSS owns their colour
 * exactly like text.
 *
 * Built from primitives (rect / circle / line / short arcs) rather than one
 * clever path each, so none of them can render as a mangled squiggle at 20px.
 * Stroke-first at 1.6, which is the weight that sits beside IBM Plex Mono
 * without shouting over it.
 *
 * Every glyph is aria-hidden: each one sits beside its own visible label, so it
 * is decoration, not the name.
 */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const GLYPHS: Record<Amenity, React.ReactNode> = {
  /* Three arcs and the source dot. */
  wifi: (
    <>
      <path d="M3.4 9.3a13.2 13.2 0 0 1 17.2 0" {...S} />
      <path d="M6.5 12.9a8.7 8.7 0 0 1 11 0" {...S} />
      <path d="M9.6 16.4a4.3 4.3 0 0 1 4.8 0" {...S} />
      <circle cx="12" cy="19.6" r="1.2" fill="currentColor" />
    </>
  ),
  /* Split unit on the wall, air falling out of it. */
  ac: (
    <>
      <rect x="3.2" y="4.4" width="17.6" height="7.6" rx="2" {...S} />
      <path d="M6.4 9.2h11.2" {...S} />
      <path d="M7.4 15.4c1 0 1 1.6 2 1.6" {...S} />
      <path d="M11 15.4c1 0 1 1.6 2 1.6" {...S} />
      <path d="M14.6 15.4c1 0 1 1.6 2 1.6" {...S} />
    </>
  ),
  tv: (
    <>
      <rect x="2.8" y="4.2" width="18.4" height="12" rx="1.8" {...S} />
      <path d="M12 16.2v3.4M8.6 19.6h6.8" {...S} />
    </>
  ),
  /* Pot on the hob, two curls of steam. */
  kitchenette: (
    <>
      <path d="M4.6 11.4h14.8v4.2a3.2 3.2 0 0 1-3.2 3.2H7.8a3.2 3.2 0 0 1-3.2-3.2z" {...S} />
      <path d="M4.6 13.1H2.7M19.4 13.1h1.9" {...S} />
      <path d="M9.6 8.6c0-1.3 1.4-1.3 1.4-2.6" {...S} />
      <path d="M13.2 8.6c0-1.3 1.4-1.3 1.4-2.6" {...S} />
    </>
  ),
  /* Shower rose and three falling drops. */
  bathroom: (
    <>
      <path d="M12 3.2v3.4" {...S} />
      <path d="M7.3 10.2h9.4a4.7 4.7 0 0 0-9.4 0z" {...S} />
      <path d="M8.9 13.2l-.7 2.2M12 13.2v2.6M15.1 13.2l.7 2.2" {...S} />
    </>
  ),
  /* A drop, with the heat coming off it. */
  hotWater: (
    <>
      <path d="M12 7.4c2.9 3.3 4.4 5.4 4.4 7.5a4.4 4.4 0 1 1-8.8 0c0-2.1 1.5-4.2 4.4-7.5z" {...S} />
      <path d="M8.2 5.6c-.7-.8-.7-1.5 0-2.3" {...S} />
      <path d="M15.8 5.6c.7-.8.7-1.5 0-2.3" {...S} />
    </>
  ),
  /* Railing, seen straight on. */
  balcony: (
    <>
      <path d="M2.8 9.4h18.4" {...S} />
      <path d="M3.6 9.4v10M20.4 9.4v10" {...S} />
      <path d="M8 9.4v10M12 9.4v10M16 9.4v10" {...S} />
      <path d="M2.8 19.4h18.4" {...S} />
    </>
  ),
  /* Screen on a desk. */
  desk: (
    <>
      <rect x="5.4" y="6.4" width="13.2" height="8.6" rx="1.2" {...S} />
      <path d="M3.2 18.2h17.6" {...S} />
      <path d="M9.4 15v3.2M14.6 15v3.2" {...S} />
    </>
  ),
  laundry: (
    <>
      <rect x="4.2" y="3.2" width="15.6" height="17.6" rx="2.2" {...S} />
      <path d="M4.2 9.2h15.6" {...S} />
      <circle cx="12" cy="14.8" r="4" {...S} />
      <circle cx="7.6" cy="6.2" r="0.95" fill="currentColor" />
      <circle cx="10.6" cy="6.2" r="0.95" fill="currentColor" />
    </>
  ),
  parking: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4" {...S} />
      <path d="M9.8 17.2V7.4h3.2a2.9 2.9 0 0 1 0 5.8H9.8" {...S} />
    </>
  ),
  /* The clock, because "24h/24" is a time promise. */
  access24: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <path d="M12 6.9V12l3.7 2.2" {...S} />
    </>
  ),
  /* Broom. */
  housekeeping: (
    <>
      <path d="M16.4 4.1l-5.7 5.7" {...S} />
      <path d="M12.9 13.7L9.6 10.4l-3.1 3.1c-1.4 1.4-1.6 2.9-1.9 5 2.1-.3 3.6-.5 5-1.9z" {...S} />
      <path d="M8.1 12l3.3 3.3" {...S} />
    </>
  ),
};

export default function AmenityIcon({
  name,
  size = 20,
  className,
}: {
  name: Amenity;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {GLYPHS[name]}
    </svg>
  );
}
