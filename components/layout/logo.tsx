import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official OmicsCraft lockup — hexagon mark plus wordmark.
 *
 * This is the letterhead artwork, sourced from the company's own application
 * server (`tools.omicscraft.com/.../logoWix.png`) so the site matches the
 * branding already in production. It replaces an earlier approximation that
 * paired the hexagon with the wordmark set in Plus Jakarta Sans — the real
 * wordmark is an engraved small-caps face that type substitution did not match.
 *
 * DARK BACKGROUNDS ONLY. The wordmark is pure white with no dark variant, so it
 * disappears on light surfaces. Every current placement (header over the dark
 * hero band, mobile drawer, footer) is dark. If a light-background placement is
 * ever needed, a dark-ink version of the artwork has to be supplied — do not
 * attempt to recolour this one with CSS filters, which would also invert the
 * mark's blue and red.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/omicscraft-logo.png"
      alt="OmicsCraft"
      width={1095}
      height={269}
      priority
      /* w-fit is load-bearing: the footer places this in a `flex flex-col`,
         whose default align-items:stretch pulls the image to the full column
         width while h-11 pins the height — stretching the lockup. `w-auto`
         does not override stretch; `w-fit` does. Inert in the header's row. */
      className={cn("h-11 w-fit max-w-full object-contain", className)}
    />
  );
}
