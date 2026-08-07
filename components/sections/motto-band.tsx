import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BrainCircuit, ChevronDown, Target, Timer } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MottoStatement } from "@/components/sections/motto-statement";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { MOTTO } from "@/lib/content";
import { publicAssetExists } from "@/lib/assets";

/**
 * Home motto — three pillars converging on one aim.
 *
 * ── THE DIAGRAM ────────────────────────────────────────────────────────────
 * The client supplied a slide with Mission, Value and Product as three stacked
 * cards and a bracket arrow gathering them into a single point, and asked for
 * that to lead into the "Our aim" plaque. So the three run across the top, a
 * connector collects them, and the arrow drops into the plaque below: the
 * three statements are what the aim is made of, and the page says so
 * structurally rather than by putting them in a list somewhere.
 *
 * THE CONNECTOR IS CSS, NOT AN SVG, AND THAT IS DELIBERATE. It has to line up
 * with the centre of each card exactly, at every width. An SVG would need the
 * stems at fixed percentages of its viewBox, which is only right when the
 * gutters are zero — with `gap-5` between three cards the true centres sit
 * about 0.8% inside those percentages, enough to see a stem hanging off the
 * middle of a card. Here each stem is drawn inside its own cell of an
 * identical flex row, so it is centred by the same layout that centres the
 * card. The cross rails are `calc(100% + 1.25rem)` wide because the distance
 * from one cell's centre to the next is one cell plus one gap — change `gap-5`
 * and that 1.25rem changes with it.
 *
 * Built for exactly three pillars. A fourth means a fourth stem and re-doing
 * the rail arithmetic; see MOTTO.pillars in lib/content.ts.
 *
 * ── THE PLAQUE ─────────────────────────────────────────────────────────────
 * The motto was once a full-bleed navy band in large white type, which the
 * client found "right in your face" and which shared a background with the
 * navy hero directly above. It is an object now, not a background: a card
 * sitting in the light region under the hero, picture first and motto beneath
 * it.
 *
 * RESOLUTION IS THE LIMIT, NOT THE LAYOUT. The client's original photograph is
 * 537x310. At this width it is already upscaled ~1.3x and every further step
 * up is visibly softer, which is why the card is capped at max-w-3xl. A
 * higher-resolution original at the same path is the only thing that buys more
 * size, and it needs no code change.
 *
 * CONTRAST NOTE. An early version set white type directly over this
 * photograph, which is the exact failure mode of the original omicscraft.com
 * headline. This layout retires that risk entirely: no glyph ever sits on the
 * image. Navy-900 on white is ~15:1.
 *
 * The photograph is decorative — empty alt, aria-hidden — and nothing here
 * claims it depicts OmicsCraft's own facility or staff.
 */

/** Keyed to MOTTO.pillars. Icons are presentation, so they live here rather
 *  than in the copy file. */
const PILLAR_ICONS: Record<string, LucideIcon> = {
  mission: Target,
  value: Timer,
  product: BrainCircuit,
};

export function MottoBand() {
  const hasPhoto = publicAssetExists(MOTTO.image);

  return (
    /* The landing page's colour break, and its closing section: the hero above
       is navy, so this sits on a light tint to stop the page reading as one
       slab of blue. */
    <section className="relative isolate overflow-hidden bg-surface-tint pb-20 pt-16 lg:pb-24 lg:pt-20">
      {/* clearCenter: everything here is centred, so without the mask the
          artwork runs straight behind it. */}
      <MolecularBackdrop variant="light" clearCenter pattern={4} />

      <Container className="relative">
        {/* Wider than the plaque below on purpose — three feeds narrowing into
            one aim is the shape of the thing. */}
        <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {MOTTO.pillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id];
            return (
              <li key={pillar.id} className="flex">
                <article className="flex w-full items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/12 text-cyan-ink ring-1 ring-cyan-500/20">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    {/* h2, not h3: the page's h1 is the hero headline and
                        nothing between them takes a level, so h3 here would
                        skip one. */}
                    <h2 className="font-display text-[0.8rem] font-bold uppercase tracking-[0.12em] text-cyan-ink">
                      {pillar.label}
                    </h2>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-navy-900">
                      {pillar.body}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <Connector />

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

               quality={100} — displayed above its native size, so anything the
               optimizer takes off on top of that shows. 100 has to be listed in
               `images.qualities` in next.config.ts or Next silently clamps to
               the nearest allowed value and the prop does nothing.

               `sizes` is deliberately generous: the cell is at most 44rem of
               layout width but has to be requested at 2x for a retina display,
               so this declares 100vw rather than letting the browser settle on
               a 750w candidate. */
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

/**
 * The bracket: a stem under each pillar, a rail gathering them, and one arrow
 * dropping into the plaque. Decorative — the relationship it draws is stated
 * by the copy either side of it, so there is nothing here for a screen reader
 * to miss.
 *
 * The stem row only exists while the pillars are actually in a row. Stacked
 * below md, three stems would point at nothing, so only the arrow remains —
 * which still reads correctly as "all of the above leads to this".
 */
function Connector() {
  return (
    <div aria-hidden className="mx-auto max-w-5xl">
      <div className="hidden md:flex md:gap-5">
        <ConnectorCell rail="right" />
        <ConnectorCell />
        <ConnectorCell rail="left" />
      </div>

      <div className="flex flex-col items-center">
        <span className="h-7 w-px bg-cyan-ink/25 md:h-9" />
        {/* Pulled up over the end of the line so the stroke runs into the
            chevron rather than stopping short of it. */}
        <ChevronDown
          className="-mt-2.5 size-6 text-cyan-ink/45"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

function ConnectorCell({ rail }: { rail?: "left" | "right" }) {
  return (
    <div className="relative h-8 flex-1">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-ink/25" />
      {rail ? (
        /* One cell plus one gap wide: that is the distance from this cell's
           centre to the next one's. The two rails meet over the middle stem,
           so the three read as one continuous bracket. */
        <span
          className={`absolute bottom-0 h-px w-[calc(100%+1.25rem)] bg-cyan-ink/25 ${
            rail === "right" ? "left-1/2" : "right-1/2"
          }`}
        />
      ) : null}
    </div>
  );
}
