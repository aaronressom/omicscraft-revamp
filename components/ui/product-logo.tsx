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
