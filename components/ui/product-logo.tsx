import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Product logo in a light card.
 *
 * All five supplied logos are raster art on white with a heavy blue keyline,
 * so they cannot sit directly on the dark section - they would read as broken
 * transparency. The white card makes that background deliberate, and the fixed
 * aspect box normalizes wildly different source dimensions (833x523 for
 * aiSysMet down to 275x175 for IntSys) to one optical size.
 *
 * When the file is not present yet, falls back to a typographic wordmark in the
 * same box, so layout is identical before and after the real asset lands.
 */
export function ProductLogo({
  src,
  name,
  available,
  className,
  priority = false,
}: {
  src: string;
  name: string;
  available: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-white p-5 shadow-lg shadow-navy-950/20",
        className,
      )}
    >
      {available ? (
        <Image
          src={src}
          alt={name}
          width={833}
          height={523}
          priority={priority}
          /* The box is an aspect-[16/9] card in a multi-column grid, never the
           * 833px the source happens to be. Without `sizes` the srcset is built
           * from `width` alone and the browser takes the ~833w candidate at
           * every breakpoint, including a phone where the card is ~300px.
           * Declared as a share of the viewport instead, so the requested
           * candidate tracks the card. */
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="max-h-full w-auto object-contain"
        />
      ) : (
        <span className="font-display text-2xl font-bold tracking-tight text-navy-900">
          {name}
        </span>
      )}
    </div>
  );
}
