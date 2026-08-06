import Image from "next/image";

import { Container } from "@/components/layout/container";
import { MottoStatement } from "@/components/sections/motto-statement";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
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
 * So the motto is not a background at all — it is an object. A plaque sitting
 * in the light region below the hero.
 *
 * ── IT NO LONGER STRADDLES THE SEAM ────────────────────────────────────────
 * The plaque used to be pulled up by a negative margin so it overlapped the
 * dark/light boundary, half on each. The client moved it down into the light
 * band outright, so the negative margin, the `flow-root` that stopped that
 * margin collapsing, and the `z-10` that lifted the overflow above the hero
 * are all gone with it. If an overlap is ever wanted back, all three have to
 * return together — see the git history of this file.
 *
 * ── PHOTO ON TOP, MOTTO UNDER IT ───────────────────────────────────────────
 * The photograph used to be an inset tile beside the text, capped at 22rem
 * wide. The client asked for it much bigger, so the card is now a single
 * centred column — picture first, motto beneath it — which lets the image run
 * the full width of the plaque instead of sharing the row with a text column.
 *
 * RESOLUTION IS THE LIMIT, NOT THE LAYOUT. The client's original is 537x310.
 * At this width it is already being upscaled ~1.3x, and every further step up
 * is visibly softer, which is why the card is capped at max-w-3xl rather than
 * running the full container. A higher-resolution original dropped in at the
 * same path is the only thing that buys more size; no code change is needed
 * for it. See MOTTO in lib/content.ts.
 *
 * CONTRAST NOTE. An early version set white type directly over this
 * photograph, which is the exact failure mode of the original omicscraft.com
 * headline. This layout retires that risk entirely: no glyph ever sits on the
 * image. Navy-900 on white is ~15:1.
 *
 * The photograph is decorative — empty alt, aria-hidden — and nothing here
 * claims it depicts OmicsCraft's own facility or staff.
 */
export function MottoBand() {
  const hasPhoto = publicAssetExists(MOTTO.image);

  return (
    /* The landing page's colour break, and now its closing section: the hero
       above is navy, so this sits on a light tint to stop the page reading as
       one slab of blue. The funding band that used to follow it moved to
       /projects, so the padding here is a section's own rather than the
       shoulder it used to share with that band. */
    <section className="relative isolate overflow-hidden bg-surface-tint pb-20 pt-16 lg:pb-24 lg:pt-20">
      {/* clearCenter: the plaque is centred, so without the mask the artwork
          runs straight behind it. */}
      <MolecularBackdrop variant="light" clearCenter pattern={4} />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-navy-950/10 sm:p-8">
          <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cyan-ink">
            <span aria-hidden className="h-px w-6 bg-cyan-ink/60" />
            Our aim
            <span aria-hidden className="h-px w-6 bg-cyan-ink/60" />
          </span>

          {hasPhoto ? (
            /* Fixed to the source photograph's own 537x310 aspect ratio, so it
               is never cropped and the card's height follows its width at any
               breakpoint.

               ── SHARPNESS ─────────────────────────────────────────────────
               quality={100}: this file is being displayed well above its
               native size, so it starts out soft. Everything the optimizer
               takes off on top of that shows. 100 is in the allowlist in
               next.config.ts — without an entry there Next clamps silently to
               the nearest allowed value and the prop does nothing.

               `sizes` is deliberately generous. The card's image cell is at
               most 44rem (704px) of layout width, but it has to be requested
               at 2x for a retina display, so this declares 100vw and lets the
               browser pick from the full srcset rather than settling on a 750w
               candidate. Over-declaring costs bytes; under-declaring costs
               sharpness, and this image cannot spare any.

               THE REAL CEILING IS THE FILE. public/img/lab-bench.png is
               537x310. Next does not enlarge past a source's own dimensions,
               so no prop here can produce more detail than that — at this size
               it is a ~1.3x upscale on a standard display and ~2.6x on a
               retina one, which is what reads as blur. A ~1500x866 original at
               the same path fixes it with no code change. */
            <div className="relative mt-6 aspect-[537/310] w-full overflow-hidden rounded-2xl">
              <Image
                src={MOTTO.image}
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                quality={100}
                className="object-cover"
              />
            </div>
          ) : null}

          {/* Motto + rule, under the picture. Client component: the rule is
              sized to the sentence's measured width, which needs layout. */}
          <div className="mt-7 flex w-full flex-col items-center">
            <MottoStatement headline={MOTTO.headline} />
          </div>
        </div>
      </Container>
    </section>
  );
}
