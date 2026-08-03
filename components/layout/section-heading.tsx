import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  align?: "left" | "center";
  /** Set on dark sections so the eyebrow/description pick legible tones. */
  onDark?: boolean;
  className?: string;
  as?: "h1" | "h2";
};

/**
 * The only way to render a section header. Centralizing it is what fixes the
 * audit's "inconsistent header sizing" - there is no second code path that
 * could drift.
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
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]",
            onDark ? "text-cyan-400" : "text-cyan-ink",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-px w-6",
              onDark ? "bg-cyan-400/60" : "bg-cyan-ink/50",
            )}
          />
          {eyebrow}
        </span>
      ) : null}

      <Tag
        className={cn(
          Tag === "h1" ? "type-display" : "type-h2",
          onDark ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={cn(
            "type-lead measure",
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
