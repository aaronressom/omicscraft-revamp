import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string | null;
  /**
   * Optional. When omitted, the eyebrow is promoted to the heading element —
   * see the note below.
   */
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
  /** Set on dark sections so the eyebrow/description pick legible tones. */
  onDark?: boolean;
  className?: string;
  as?: "h1" | "h2";
};

/**
 * The only way to render a section header. Centralizing it is what fixes the
 * audit's "inconsistent header sizing" — there is no second code path that
 * could drift.
 *
 * TITLELESS MODE: several pages dropped their large display title at the
 * client's request. Rendering just a decorative <span> eyebrow would leave
 * those pages with **no heading element at all** — the exact defect that was
 * fixed on /platform. So when `title` is absent the eyebrow itself renders as
 * the heading tag: the small tracked-caps treatment visually, the page's `h1`
 * semantically. Do not "simplify" this back to a span.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  className,
  as: Tag = "h2",
}: Props) {
  const hasTitle = Boolean(title);
  // Titleless: the eyebrow carries the heading. Otherwise it stays decorative.
  const EyebrowTag = hasTitle ? "span" : Tag;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <EyebrowTag
          className={cn(
            "inline-flex items-center gap-2.5 font-semibold uppercase",
            // Slightly larger than the old text-sm, per client feedback — a
            // touch more presence without becoming a replacement title.
            hasTitle
              ? "text-sm tracking-[0.14em]"
              : "text-base tracking-[0.16em] sm:text-[1.05rem]",
            onDark ? "text-cyan-400" : "text-cyan-ink",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-px",
              hasTitle ? "w-6" : "w-8",
              onDark ? "bg-cyan-400/60" : "bg-cyan-ink/50",
            )}
          />
          {eyebrow}
        </EyebrowTag>
      ) : null}

      {hasTitle ? (
        <Tag
          className={cn(
            Tag === "h1" ? "type-display" : "type-h2",
            onDark ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </Tag>
      ) : null}

      {description ? (
        <p
          className={cn(
            "type-lead",
            // A 65ch measure is right for a description sitting under a
            // display title — it is one element of a stack, and a long line
            // there fights the title above it.
            //
            // NOT for the titleless pages. There the description IS the
            // header, a single short sentence set larger, and 65ch cut it a
            // word or two early: /services broke after "workflow," and
            // /projects after "Institutes", with a stub of a second line that
            // read as a new paragraph rather than a continuation. An earlier
            // pass added `text-balance` to even those two lines out, which
            // treated the symptom — the client wants the sentence on one line,
            // and at ~1000px it fits the container with room to spare on any
            // desktop. So: no cap, no balancing, and it wraps only when the
            // viewport genuinely runs out of room.
            hasTitle
              ? "measure"
              : "text-[1.15rem] text-pretty sm:text-[1.25rem]",
            align === "center" && "mx-auto",
            onDark ? "text-slate-300" : "text-slate-600",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
