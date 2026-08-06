"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { PIPELINE_STAGES } from "@/lib/content";
import { cn } from "@/lib/utils";

/** ms each stage holds before the trace steps on.
 *
 *  CEILING: 1500. The hero carousel gives every slide a flat 6s (SLIDE_MS in
 *  hero-carousel.tsx) and the full run is four hand-offs — 4.8s here — so the
 *  pathway reaches 05/05 with time to spare. Anything above 1500 would leave
 *  slide 0 changing mid-run. Lowered from 2600 when the client asked for a
 *  faster rotation; that setting put the run at 10.4s and dictated the whole
 *  carousel's pace. */
export const CYCLE_MS = 1200;

/**
 * Time from 01/05 to 05/05 — four hand-offs, not five.
 *
 * Nothing imports this any more: the carousel used to derive its slide
 * durations from it and now runs a flat interval instead. Kept because it is
 * the figure the CEILING above is about, and it stays correct on its own if
 * either CYCLE_MS or the number of stages changes.
 */
export const PIPELINE_RUN_MS = (PIPELINE_STAGES.length - 1) * CYCLE_MS;

/* Geometry. The bonds are drawn in one SVG laid over the node rail, and the
   nodes are positioned as a percentage of that same box, so the two are
   guaranteed to line up at any size without measuring anything.

   viewBox units: the rail is 100 wide and 100 tall per stage. Node centres
   alternate between x=34 and x=66 — the zigzag is what makes this read as a
   skeletal formula rather than as a list with bullets. */
const ROW = 100;
const X_EVEN = 34;
const X_ODD = 66;
const nodeX = (i: number) => (i % 2 === 0 ? X_EVEN : X_ODD);
const nodeY = (i: number) => ROW / 2 + i * ROW;

/**
 * Analysis pipeline, drawn as a pathway scheme.
 *
 * ── WHY IT LOOKS LIKE THIS ─────────────────────────────────────────────────
 * Two earlier versions were rejected as looking machine-made, and both had the
 * same underlying shape: a straight vertical stack of round nodes joined by a
 * straight line, inside a rounded card. That shape is the default step-timeline
 * of every generated landing page, and dressing it up — glass card, traffic
 * lights, crop marks, graph paper — only changed the decoration on top of it.
 *
 * So the shape itself is different here. The stages are a zigzag chain of
 * hexagons joined by bonds, the way a metabolic pathway or a skeletal formula
 * is drawn — the client's own field, and the motif already used across the
 * site's molecular backdrops. Traversed bonds are drawn double, upcoming ones
 * single and dashed, which is chemistry's own notation for a stronger and a
 * weaker link rather than an invented convention.
 *
 * ── WHAT MUST NOT CHANGE ───────────────────────────────────────────────────
 * The stage names and details are the client's, from PIPELINE_STAGES. This is
 * a redesign of the frame, not the content.
 *
 * The hexagons are structure, not chemistry: no formula, mass, or spectrum is
 * shown, so the figure states nothing that could be read as data. Keep it that
 * way — a plausible-looking m/z or a named metabolite here would be fabricated.
 *
 * Purely decorative: exposed to assistive tech as one labelled group, and the
 * animation freezes on the first stage under `prefers-reduced-motion`.
 */
export function PipelineDiagram({
  className,
  /**
   * Whether the trace should be running. The hero carousel keeps this figure
   * mounted on every slide (all seven share one grid cell), so left to itself
   * the pathway would keep stepping out of sight and be at some arbitrary
   * stage whenever slide 0 came back round. Gating it here means the run
   * always starts from 01/05 the moment the slide is shown — which is what
   * lets the carousel assume the run fits inside one slide interval.
   *
   * To restart the run, remount with a changed React `key`; the carousel keys
   * this off its own slide timer so the two can never drift.
   */
  running = true,
}: {
  className?: string;
  running?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!running || reduceMotion) return;
    const id = window.setInterval(
      // Clamps at the last stage rather than wrapping: the carousel moves on
      // shortly after, and a restart here would read as a stutter. Once
      // clamped the updater returns the same value, so it stops re-rendering.
      () => setActive((i) => Math.min(i + 1, PIPELINE_STAGES.length - 1)),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [running, reduceMotion]);

  const total = PIPELINE_STAGES.length;

  return (
    <figure
      className={cn(
        "relative rounded-2xl border border-white/12 bg-navy-950/50 p-5 backdrop-blur-sm sm:p-6",
        className,
      )}
      aria-label="The OmicsCraft analysis pipeline: raw data, processing, annotation, integration, biomarkers."
    >
      {/* Header: what it is, and a readout of where the trace has got to.
          A step counter rather than a row of progress dots — an instrument
          reads out a number, and dots would put back the shape this is
          replacing. */}
      <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-slate-300">
          Analysis pathway
        </span>
        <span className="font-mono text-[0.66rem] tabular-nums text-slate-500">
          <span className="text-cyan-300">
            {String(active + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        {/* Rail: bonds and nodes share one coordinate box. */}
        <div
          aria-hidden
          className="relative w-[5.5rem] shrink-0 sm:w-[6.5rem]"
          style={{ height: `${total * 3.4}rem` }}
        >
          <svg
            viewBox={`0 0 100 ${total * ROW}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {PIPELINE_STAGES.slice(0, -1).map((stage, i) => {
              const traversed = i < active;
              return (
                <Bond
                  key={stage.label}
                  from={[nodeX(i), nodeY(i)]}
                  to={[nodeX(i + 1), nodeY(i + 1)]}
                  traversed={traversed}
                  // The bond leaving the current stage draws itself in across
                  // the dwell, so 01 hands off to 02 instead of cutting.
                  charging={i === active && running && !reduceMotion}
                  chargeKey={active}
                />
              );
            })}
          </svg>

          {PIPELINE_STAGES.map((stage, i) => (
            <HexNode
              key={stage.label}
              index={i}
              state={i === active ? "active" : i < active ? "done" : "ahead"}
              charge={i === active && running && !reduceMotion}
              chargeKey={active}
              style={{
                left: `${nodeX(i)}%`,
                top: `${(nodeY(i) / (total * ROW)) * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Labels. One row per stage at the same fixed height as the rail's
            rows, so each sits level with its own hexagon. */}
        <ol className="flex flex-1 flex-col" aria-hidden>
          {PIPELINE_STAGES.map((stage, i) => {
            const isActive = i === active;
            const isDone = i < active;

            return (
              <li
                key={stage.label}
                className="flex min-w-0 flex-col justify-center"
                style={{ height: "3.4rem" }}
              >
                <span
                  className={cn(
                    "block truncate text-sm font-semibold leading-snug transition-colors duration-500",
                    isActive
                      ? "text-white"
                      : isDone
                        ? "text-slate-300"
                        : "text-slate-400",
                  )}
                >
                  {stage.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block font-mono text-[0.66rem] leading-snug transition-colors duration-500",
                    isActive ? "text-cyan-300" : "text-slate-500",
                  )}
                >
                  {stage.detail}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}

/**
 * A bond between two stages. Double while traversed, single and dashed while
 * still ahead.
 *
 * The offset for the second line is horizontal rather than truly perpendicular:
 * the viewBox is stretched non-uniformly, so a computed normal would not stay
 * normal on screen anyway, and at this angle the difference is invisible.
 * `vectorEffect` is what keeps the stroke a hairline through that stretch — it
 * does not inherit, so it is set on each line.
 */
function Bond({
  from,
  to,
  traversed,
  charging = false,
  chargeKey = 0,
}: {
  from: [number, number];
  to: [number, number];
  traversed: boolean;
  /** Draw this bond in over one dwell — the hand-off to the next stage. */
  charging?: boolean;
  /** Remounts the charge line so its CSS animation replays each stage. */
  chargeKey?: number;
}) {
  const common = {
    vectorEffect: "non-scaling-stroke" as const,
    strokeWidth: 1,
    className: cn(
      "transition-[stroke] duration-500",
      traversed ? "stroke-cyan-400/70" : "stroke-white/20",
    ),
  };

  return (
    <>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        strokeDasharray={traversed ? undefined : "4 5"}
        {...common}
      />
      {traversed ? (
        <line
          x1={from[0] + 5}
          y1={from[1]}
          x2={to[0] + 5}
          y2={to[1]}
          {...common}
        />
      ) : null}

      {/* The charge. `pathLength=1` normalizes the line's length to 1 unit, so
          one dash of 1 covers it exactly whatever the geometry — the offset
          can then run 1 → 0 without measuring anything. It lands on the next
          hexagon at the moment the timer flips to it. */}
      {charging ? (
        <line
          key={chargeKey}
          x1={from[0]}
          y1={from[1]}
          x2={to[0]}
          y2={to[1]}
          pathLength={1}
          strokeDasharray={1}
          vectorEffect="non-scaling-stroke"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="stroke-cyan-300"
          style={{ animation: `bond-charge ${CYCLE_MS}ms linear forwards` }}
        />
      ) : null}
    </>
  );
}

/**
 * One stage: a hexagon with its step number inside, centred on its coordinate.
 * Drawn as an SVG polygon rather than a clip-path so it can carry a hairline
 * outline — clipping removes the border.
 */
function HexNode({
  index,
  state,
  style,
  charge = false,
  chargeKey = 0,
}: {
  index: number;
  state: "active" | "done" | "ahead";
  style: React.CSSProperties;
  /** Brighten across the dwell, in step with the bond leaving this node. */
  charge?: boolean;
  chargeKey?: number;
}) {
  return (
    <span
      style={style}
      className={cn(
        // A slightly softer spring on the scale than the old linear ease: the
        // node settles into size rather than snapping to it.
        "absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        state === "active" && "scale-110",
      )}
    >
      <svg
        key={charge ? chargeKey : "static"}
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        style={
          charge
            ? { animation: `hex-charge ${CYCLE_MS}ms ease-in forwards` }
            : undefined
        }
      >
        {/* Opaque base. The bonds are drawn from centre to centre, so without
            something solid behind the ring they would be visible running
            through it. */}
        <polygon
          points="50,4 91,27 91,73 50,96 9,73 9,27"
          className="fill-navy-950"
        />
        {/* Flat-topped hexagon, matching the mark in the site's backdrops. */}
        <polygon
          points="50,4 91,27 91,73 50,96 9,73 9,27"
          strokeWidth={4}
          className={cn(
            "transition-all duration-500",
            state === "active"
              ? "fill-cyan-400/20 stroke-cyan-300"
              : state === "done"
                ? "fill-cyan-400/10 stroke-cyan-400/50"
                : "fill-navy-950/60 stroke-white/25",
          )}
        />
      </svg>

      <span
        className={cn(
          "relative font-mono text-[0.62rem] tabular-nums transition-colors duration-500",
          state === "active"
            ? "text-cyan-200"
            : state === "done"
              ? "text-slate-300"
              : "text-slate-500",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}
