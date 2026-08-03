import { cn } from "@/lib/utils";

/**
 * Ambient radial glow for dark sections.
 *
 * This exists as one component rather than repeated inline gradients so the
 * hero, CTA band, and footer stay visually identical. Purely decorative and
 * `aria-hidden` - it must never carry meaning, because it is invisible to
 * screen readers and to anyone in forced-colors mode.
 */
export function GlowBackdrop({
  className,
  grid = true,
  intensity = "default",
}: {
  className?: string;
  grid?: boolean;
  intensity?: "subtle" | "default" | "strong";
}) {
  const opacity = {
    subtle: "opacity-40",
    default: "opacity-70",
    strong: "opacity-100",
  }[intensity];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {grid ? (
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      ) : null}

      <div className={cn("absolute inset-0", opacity)}>
        {/* Cyan bloom, upper left of the content area. */}
        <div className="absolute -top-40 left-[10%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        {/* Emerald counterweight, lower right. */}
        <div className="absolute -bottom-52 right-[5%] h-[32rem] w-[32rem] rounded-full bg-emerald-500/14 blur-[130px]" />
      </div>

      {/* Hairline that reads as a horizon against the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
