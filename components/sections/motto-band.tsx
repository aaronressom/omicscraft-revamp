import Image from "next/image";

import { Container } from "@/components/layout/container";
import { MottoStatement } from "@/components/sections/motto-statement";
import { MOTTO } from "@/lib/content";
import { publicAssetExists } from "@/lib/assets";

/**
 * Home motto.
 *
 * This was a full-bleed navy band carrying the motto in large white type. Two
 * problems with that, both raised by the client: it shared a background with
 * the navy hero directly above it, so the two read as one continuous slab; and
 * a full-width statement in display type was, in their words, right in your
 * face.
 *
 * So the motto is no longer a background at all — it is an object. A plaque
 * that overlaps the seam between the dark hero and the light band below,
 * sitting half on each. That is what separates it from the hero: it is
 * physically in front of it rather than continuing it.
 *
 * CONTRAST NOTE. The earlier version set white type directly over a
 * photograph, which is the exact failure mode of the original omicscraft.com
 * headline, and needed a measured scrim to be safe. This layout retires that
 * risk entirely: the photograph is a separate tile beside the text, and no
 * glyph ever sits on it. Navy-900 on white is ~15:1.
 *
 * The photograph is decorative — empty alt, aria-hidden — and nothing here
 * claims it depicts OmicsCraft's own facility or staff.
 */
export function MottoBand() {
  const hasPhoto = publicAssetExists(MOTTO.image);

  return (
    /* Same tint as the funding band below, so the two form one continuous
       light region with the plaque floating at its top edge.

       `flow-root` is load-bearing. The plaque is pulled up by a negative top
       margin, and without a block formatting context that margin collapses
       through to the section itself — dragging the tinted background up with
       the card, so the card lands exactly on the seam instead of straddling
       it. flow-root keeps the background where it is and lets only the card
       overflow upward.

       z-10 puts that overflow above the hero. The hero's own `overflow-hidden`
       does not clip a sibling. */
    <section className="relative z-10 flow-root bg-surface-tint pb-6">
      <Container>
        {/* The photo is INSET, not bled to the card edges: it shares the card's
            padding, so its top lines up with the eyebrow and its bottom with the
            rule beneath the motto. Edge-to-edge made the plaque read as two
            panels stuck together rather than as one object with a picture in
            it. `items-stretch` (the grid default) is what gives the photo cell
            the text block's exact height. */}
        <div
          className={`mx-auto -mt-16 grid gap-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-navy-950/10 sm:p-9 lg:-mt-24 ${
            hasPhoto
              ? /* Stepped, not one width: the photo is generous at lg where
                   there is room, but a single large width at the sm
                   breakpoint would leave the motto ~240px of column and wrap it
                   to four lines. Capped at 22rem at lg: the source photo is
                   537x310, and pushing the cell wider than this upscales it
                   hard enough to see. See MOTTO in lib/content.ts. */
                "max-w-5xl sm:grid-cols-[minmax(0,1fr)_15rem] md:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[minmax(0,1fr)_22rem]"
              : /* Narrower without the photo, or the plaque is mostly empty. */
                "max-w-3xl"
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cyan-ink">
              <span aria-hidden className="h-px w-6 bg-cyan-ink/60" />
              Our aim
            </span>

            {/* Motto + rule. Client component: the rule is sized to the
                sentence's measured width, which needs layout. */}
            <MottoStatement headline={MOTTO.headline} />
          </div>

          {hasPhoto ? (
            /* `fill` inside a stretched grid cell: the photo takes whatever
               height the text sets, so it starts and ends exactly level with
               the text however the motto wraps. min-h covers the single-column
               case below sm, where there is no text cell beside it to give it
               a height. */
            <div className="relative min-h-48 overflow-hidden rounded-2xl sm:min-h-full">
              <Image
                src={MOTTO.image}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 18rem, (min-width: 640px) 15rem, 100vw"
                quality={95}
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
