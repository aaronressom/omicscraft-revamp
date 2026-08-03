"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PIPELINE_STAGES } from "@/lib/content";
import { cn } from "@/lib/utils";

const CYCLE_MS = 1900;

/**
 * Animated multi-omics workflow teaser for the hero.
 *
 * Purely decorative: it illustrates the stage names already stated in copy and
 * introduces no new claims. The whole figure is exposed to assistive tech as a
 * single labelled group rather than 5 unlabelled boxes, and the animation is
 * frozen on the first stage under `prefers-reduced-motion`.
 */
export function PipelineDiagram({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % PIPELINE_STAGES.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const progress =
    PIPELINE_STAGES.length > 1
      ? (active / (PIPELINE_STAGES.length - 1)) * 100
      : 0;

  return (
    <figure
      className={cn(
        "glass relative rounded-2xl p-6 shadow-2xl shadow-navy-950/50 sm:p-8",
        className,
      )}
      aria-label="The OmicsCraft analysis pipeline: raw data, processing, annotation, integration, biomarkers."
    >
      {/* Panel chrome */}
      <div className="mb-7 flex items-center gap-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          analysis pipeline
        </span>
      </div>

      <div className="relative" aria-hidden>
        {/* Rail behind the nodes */}
        <div className="absolute bottom-5 left-[15px] top-5 w-px bg-white/12" />
        {/* Progress fill travelling down the rail */}
        <motion.div
          className="absolute left-[15px] top-5 w-px origin-top bg-gradient-to-b from-cyan-400 to-emerald-400"
          initial={false}
          animate={{ height: `calc(${progress}% * 0.86)` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 22 }
          }
        />

        <ul className="flex flex-col gap-5">
          {PIPELINE_STAGES.map((stage, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <li key={stage.label} className="flex items-start gap-4">
                <span className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center">
                  {isActive ? (
                    <motion.span
                      layoutId="pipeline-halo"
                      className="absolute inset-0 rounded-full bg-cyan-400/20 ring-2 ring-cyan-400"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative size-2.5 rounded-full transition-colors duration-500",
                      isActive
                        ? "bg-cyan-400"
                        : isDone
                          ? "bg-emerald-400"
                          : "bg-white/25",
                    )}
                  />
                </span>

                <span className="min-w-0 flex-1 pt-1">
                  <span
                    className={cn(
                      "block text-sm font-semibold transition-colors duration-500",
                      isActive ? "text-white" : "text-slate-300",
                    )}
                  >
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      "block text-xs transition-colors duration-500",
                      isActive ? "text-cyan-300" : "text-slate-500",
                    )}
                  >
                    {stage.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
