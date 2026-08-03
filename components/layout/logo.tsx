import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The OmicsCraft mark plus wordmark.
 *
 * The wordmark is set in type rather than shipped as the original raster
 * logo: the source PNG is 304x248 with the wordmark baked in at low
 * resolution, which goes soft on retina displays. Rendering the word as live
 * text keeps it crisp at any size, stays selectable, and is readable to
 * screen readers without alt-text duplication.
 */
export function Logo({
  className,
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/omicscraft-mark.png"
        alt=""
        width={304}
        height={248}
        priority
        className="h-8 w-auto"
      />
      <span
        className={cn(
          "font-display text-xl font-bold tracking-tight",
          onDark ? "text-white" : "text-navy-900",
        )}
      >
        Omics
        <span className={onDark ? "text-cyan-400" : "text-cyan-ink"}>Craft</span>
      </span>
    </span>
  );
}
