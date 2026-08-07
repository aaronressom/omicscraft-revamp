"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The motto and the rule beneath it.
 *
 * Split out of `motto-band.tsx` — which stays a server component — because the
 * rule has to be exactly as wide as the sentence above it, and that width is
 * not knowable without laying the text out.
 *
 * WHY MEASURE AT ALL. Two cheaper attempts failed. Sizing the rule to the text
 * column overshot badly, because `text-balance` was evening the two lines out
 * and leaving both well short of the column. Dropping `text-balance` so the
 * first line wraps greedily closed most of that gap, but not all of it: a line
 * ends at the last word that fits, so there is always a ragged remainder. No
 * CSS length resolves to "the width of the longest wrapped line" —
 * `fit-content` and `max-content` both reflow the text onto one line and then
 * clamp to the available width, which is just the column again.
 *
 * So the paragraph's own line boxes are measured with a Range, which is exact.
 * Before hydration, and if measurement ever fails, the rule falls back to the
 * full column — the previous behaviour, which is close rather than wrong.
 */
export function MottoStatement({ headline }: { headline: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lineWidth, setLineWidth] = useState<number | null>(null);

  // Layout effect, not effect: this sets a width, so running it before paint
  // avoids a visible jump from full-column to measured on first render.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      // One client rect per line box. The widest is the sentence's true width.
      const rects = Array.from(range.getClientRects()).filter(
        (rect) => rect.width > 0,
      );
      if (rects.length === 0) return;
      setLineWidth(Math.max(...rects.map((rect) => rect.width)));
    };

    measure();

    // Re-measure on resize: a different column width rewraps the sentence.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [headline]);

  // Webfonts land after first paint and change where the line breaks, so the
  // pre-font measurement would be stale. Separate effect: `fonts.ready` is
  // async, so there is nothing for useLayoutEffect to buy here.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter(
        (rect) => rect.width > 0,
      );
      if (rects.length > 0) {
        setLineWidth(Math.max(...rects.map((rect) => rect.width)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [headline]);

  return (
    <>
      {/* type-h3, not type-h2: deliberately below the hero headline in the
          page's visual hierarchy. It is a statement of intent, not a second
          headline competing with the first.

          NO `text-balance` — see the note above. Balancing is what pulled the
          lines short of the rule in the first place.

          No top margin: the caller owns the spacing above this, which since
          the motto moved under the photograph is a gap from an image rather
          than from an eyebrow.

          ONE LINE FROM lg UP. At `.type-h3`'s full size the sentence ran about
          5% wider than the plaque's interior and dropped "days!" onto a line
          of its own. The size is trimmed rather than the card widened: the
          card's width is what sets the photograph's, and that photograph is
          already being upscaled past its source resolution (see
          motto-band.tsx), so buying room for the type there would cost
          sharpness.

          Only from lg, and deliberately not with `whitespace-nowrap`. From lg
          the plaque is pinned at max-w-3xl, so the width this has to fit into
          is a constant and the size can be picked against it — about 10% of
          slack at 1.5rem. Below lg the card tracks the viewport and the
          sentence is meant to wrap. No nowrap because the failure mode matters:
          if a future edit lengthens this sentence it should wrap, as it does
          today, rather than run out through the side of the card. */}
      <p ref={ref} className="type-h3 text-navy-900 lg:text-[1.5rem]">
        {headline}
      </p>

      <CompressionRule width={lineWidth} />
    </>
  );
}

/**
 * Decorative rule beneath the motto: tick marks whose spacing compresses from
 * left to right, echoing a duration collapsing without stating a figure.
 *
 * NO DATA. It carries no axis labels, no units and no numbers, because there
 * are none to carry — see the note on MOTTO in lib/content.ts. It is texture,
 * not a chart, and must not acquire labels later.
 */
function CompressionRule({ width }: { width: number | null }) {
  // Geometric spacing: each gap is RATIO times the one before it.
  //
  // Count-bounded, not position-bounded. A `while (x < 300)` loop here never
  // terminates: the gaps shrink geometrically, so x converges and never
  // reaches the end of the axis. Build a fixed number of ticks and normalise
  // them onto the viewBox instead.
  //
  // Enough ticks for the series to visibly CONVERGE at the right-hand end
  // rather than stop. At six the spacing was still wide when the axis ran out,
  // so the rule looked truncated — as though the pattern had been cut off
  // mid-way. Thirteen carries the compression through to gaps of a few pixels,
  // which is what makes it read as a duration collapsing.
  //
  // No opacity falloff anywhere: the density is the whole idea, and fading the
  // end out would just be the same truncation by another means.
  const COUNT = 13;
  const RATIO = 0.78;

  const raw: number[] = [0];
  let gap = 1;
  for (let i = 1; i < COUNT; i += 1) {
    raw.push(raw[i - 1] + gap);
    gap *= RATIO;
  }

  const span = raw[COUNT - 1];
  const ticks = raw.map((value) => (value / span) * 300);

  return (
    <svg
      aria-hidden
      viewBox="0 0 300 14"
      // preserveAspectRatio="none": only axis-aligned ticks, so the horizontal
      // stretch is invisible, and non-scaling-stroke keeps them hairline.
      preserveAspectRatio="none"
      // max-w-full so a stale measurement can never push the rule wider than
      // its container.
      className="mt-7 h-4 w-full max-w-full text-cyan-ink/45"
      style={width ? { width: `${width}px` } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      {/* vector-effect does NOT inherit, so it goes on every path rather than
          once on the <svg>. Without it the horizontal stretch would thicken
          the vertical ticks. */}
      <path
        d="M0 13 H300"
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      {ticks.map((tick, index) => (
        <path
          key={index}
          d={`M${tick.toFixed(2)} 13 V2`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
