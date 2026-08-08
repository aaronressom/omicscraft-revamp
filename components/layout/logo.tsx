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
      /* SIZED TO THE BOX IT RENDERS IN, NOT TO THE SOURCE FILE.
       *
       * These were 1095x269 — the artwork's own dimensions. For a non-`fill`
       * image Next builds its srcset from `width`, so it was offering a
       * ~1095px-wide PNG for a slot that is 179px wide (h-11 = 44px at the
       * artwork's 4.07 ratio). With `priority` below turning that into a
       * <link rel="preload"> in <head>, every page on the site was preloading
       * an oversized logo ahead of its own content.
       *
       * 358x88 is the rendered box at 2x, so retina still gets a pixel-exact
       * lockup. The ratio is identical (4.07), so nothing about the layout
       * moves — `h-11` was always what set the displayed size.
       *
       * If the header height changes, change these to match: 2 x the new
       * pixel height, times 4.07 for the width. */
      width={358}
      height={88}
      /* Kept: this genuinely is above the fold, in the fixed header, on every
       * route. It is now a preload of ~180px of artwork instead of ~1100px. */
      priority
      /* w-fit is load-bearing: the footer places this in a `flex flex-col`,
         whose default align-items:stretch pulls the image to the full column
         width while h-11 pins the height — stretching the lockup. `w-auto`
         does not override stretch; `w-fit` does. Inert in the header's row. */
      className={cn("h-11 w-fit max-w-full object-contain", className)}
    />
  );
}
