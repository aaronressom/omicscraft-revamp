/**
 * Brand glyphs.
 *
 * Drawn inline rather than imported: lucide-react no longer ships brand icons,
 * and pulling in a second icon package for one or two marks is not worth the
 * weight. Each is `aria-hidden` — the surrounding link carries the label.
 *
 * `SOCIAL_MARKS` is keyed to match `SITE.social`, so the footer can look a
 * network up by name and fall back to a text badge for any it has no glyph for.
 */

export function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.9 21.5V9.9h4.16v11.6H2.9Zm7 0V9.9h3.99v1.6h.06c.56-1.02 1.92-2.1 3.95-2.1 4.22 0 5 2.66 5 6.13v5.97h-4.15v-5.3c0-1.26-.03-2.9-1.8-2.9-1.8 0-2.08 1.38-2.08 2.8v5.4H9.9Z" />
    </svg>
  );
}

export const SOCIAL_MARKS: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  linkedin: LinkedInMark,
};

/** Display name for a network key — "linkedin" reads badly in a label. */
export const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  twitter: "X",
};
