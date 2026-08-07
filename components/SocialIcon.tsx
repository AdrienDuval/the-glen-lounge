/**
 * Platform marks, drawn in-house on a 24×24 grid.
 *
 * Deliberately not an icon-font or npm icon pack: four inline glyphs cost a
 * few hundred bytes, ship no runtime, and inherit `currentColor`, so the
 * surrounding CSS owns their colour exactly like text (muted at rest, gold on
 * hover). Server-safe — no "use client" needed.
 *
 * Every glyph is aria-hidden: each usage sits beside the platform's visible
 * name, so the icon is decoration, not the label.
 */

export type SocialIconName = "tiktok" | "instagram" | "facebook" | "whatsapp";

const PATHS: Record<SocialIconName, React.ReactNode> = {
  /* The note glyph: stem with the characteristic curled headphone-arm top
     right, resolving into a disc bottom left. */
  tiktok: (
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.77a5.76 5.76 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48z" />
  ),
  /* Camera: rounded plate, lens, flash dot — pure primitives, so it can never
     render as a mangled path. */
  instagram: (
    <>
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle cx="16.9" cy="7.1" r="1.25" />
    </>
  ),
  /* The lowercase f. */
  facebook: (
    <path d="M13.4 21v-6.9h2.6l.5-3.1h-3.1V9.1c0-.9.35-1.6 1.7-1.6h1.55V4.75c-.35-.05-1.4-.15-2.5-.15-2.5 0-4.15 1.5-4.15 4.2V11H7.4v3.1H10V21h3.4z" />
  ),
  /* Speech bubble with tail, handset inside. */
  whatsapp: (
    <>
      <path
        d="M12 3.6a8.3 8.3 0 0 0-7.1 12.6L3.7 20.4l4.3-1.1A8.3 8.3 0 1 0 12 3.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M9.4 7.9c-.25-.55-.5-.55-.75-.55h-.6c-.2 0-.55.08-.85.4-.3.33-1.1 1.1-1.1 2.65s1.15 3.07 1.3 3.28c.15.2 2.2 3.5 5.45 4.77 2.7 1.05 3.25.85 3.83.8.58-.05 1.88-.77 2.15-1.5.26-.75.26-1.38.18-1.5-.08-.14-.28-.22-.6-.38l-2.1-1c-.3-.13-.5-.2-.72.1-.2.3-.8 1-.98 1.2-.18.2-.36.23-.66.08a8.3 8.3 0 0 1-2.45-1.5 9.2 9.2 0 0 1-1.7-2.1c-.17-.3 0-.46.13-.6.14-.15.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.4-.02-.55-.08-.15-.66-1.6-.93-2.16z" transform="translate(1.1 .6) scale(.82)" />
    </>
  ),
};

export default function SocialIcon({
  name,
  size = 22,
  className,
}: {
  name: SocialIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
