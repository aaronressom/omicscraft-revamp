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

export function XMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {/* The post-2023 mark. Not a bird: the account is x.com/omicscraft, and
          a Twitter bird next to that URL would be the wrong brand. */}
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function FacebookMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export const SOCIAL_MARKS: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  linkedin: LinkedInMark,
  twitter: XMark,
  facebook: FacebookMark,
};

/** Display name for a network key — "linkedin" reads badly in a label. */
export const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  twitter: "X",
};
