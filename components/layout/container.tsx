import { cn } from "@/lib/utils";

/**
 * The single horizontal rhythm for the whole site. Every section body goes
 * through this so gutters never drift between pages.
 */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        // Padding widens with the viewport so content never sits flush to the
        // screen edge. Between ~1024 and 1536 the max-width cap (80rem) is at
        // or above the viewport, so this padding is the ONLY breathing room
        // the layout gets — it must NOT be reduced at `xl`, whose breakpoint
        // (1280px) is precisely the problem width. It relaxes at 2xl, where
        // the max-width cap produces real side margins on its own.
        "mx-auto w-full px-6 sm:px-8 lg:px-12 2xl:px-8",
        size === "narrow" && "max-w-4xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[88rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
