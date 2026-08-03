import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Braces,
  Brain,
  Database,
  FileStack,
  FlaskConical,
  GitMerge,
  Grid2x2Check,
  Layers,
  ListOrdered,
  Ruler,
  ScanLine,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Data-flow schematics for the platform tools.
 *
 * These replaced an earlier set of mock "readout" panels (a fake CLI session, a
 * spectrum with invented m/z intensities, a fabricated segmentation grid).
 * Those needed an "Illustrative" disclaimer precisely because they implied
 * results that were never produced.
 *
 * A process schematic carries no fabricated data at all: every stage below is
 * taken from the tool's own verbatim description in `lib/content.ts`. Nothing
 * here asserts an outcome, so nothing here needs a disclaimer.
 *
 * If a stage name is ever changed, it must still match the product copy.
 */

type Stage = {
  label: string;
  note: string;
  icon: LucideIcon;
  /** Rendered side-by-side with the previous stage as a parallel branch. */
  parallel?: boolean;
};

type Flow = {
  input: { label: string; note: string; icon: LucideIcon };
  stages: Stage[];
  output: { label: string; note: string; icon: LucideIcon };
};

/** Every stage traces to the verbatim product copy — see lib/content.ts. */
const FLOWS: Record<string, Flow> = {
  metcraft: {
    input: { label: "Raw metabolomics data", note: "LC-MS acquisition", icon: FlaskConical },
    stages: [
      { label: "Peak detection", note: "feature extraction", icon: Waves },
      { label: "Normalization", note: "scale alignment", icon: SlidersHorizontal },
      { label: "Missing value imputation", note: "gap filling", icon: Grid2x2Check },
      { label: "Batch correction", note: "cross-run alignment", icon: Layers },
    ],
    output: { label: "Analysis-ready matrix", note: "quantitative analysis", icon: FileStack },
  },
  metaboquest: {
    input: { label: "Mass spectrometric data", note: "measured features", icon: Waves },
    stages: [
      { label: "Mass-based search", note: "compound databases", icon: Database },
      { label: "Spectral matching", note: "reference libraries", icon: Search, parallel: true },
      { label: "Deep-learning ranking", note: "candidate scoring", icon: Brain },
    ],
    output: { label: "Ranked candidate IDs", note: "putative metabolites", icon: ListOrdered },
  },
  imgcraft: {
    input: { label: "Raw medical images", note: "whole slide · CT · MR", icon: ScanLine },
    stages: [
      { label: "Image segmentation", note: "region delineation", icon: Boxes },
      { label: "Feature extraction", note: "morphology · texture", icon: Braces },
      { label: "Quantitative analysis", note: "measurement", icon: Ruler },
    ],
    output: { label: "Image feature set", note: "ready for integration", icon: FileStack },
  },
  intsys: {
    input: { label: "Multi-omics + imaging", note: "harmonized inputs", icon: GitMerge },
    stages: [
      { label: "Statistical modelling", note: "association testing", icon: SlidersHorizontal },
      { label: "Machine learning", note: "predictive models", icon: Brain, parallel: true },
      { label: "Generative AI", note: "hypothesis support", icon: Sparkles, parallel: true },
    ],
    output: { label: "Selected biomarkers", note: "prioritized candidates", icon: Target },
  },
};

export function ToolFlow({ id }: { id: string }) {
  const flow = FLOWS[id];
  if (!flow) return null;

  // Group consecutive parallel stages so branches render side by side.
  const groups: Stage[][] = [];
  for (const stage of flow.stages) {
    if (stage.parallel && groups.length > 0) groups[groups.length - 1].push(stage);
    else groups.push([stage]);
  }

  return (
    <figure className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 backdrop-blur-sm sm:p-7">
      <figcaption className="mb-6 flex items-center gap-2.5">
        <span aria-hidden className="h-px w-6 bg-cyan-400/70" />
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan-300">
          Data flow
        </span>
      </figcaption>

      <ol className="flex flex-col">
        <Node {...flow.input} kind="input" />

        {groups.map((group, groupIndex) => (
          <li key={groupIndex} className="contents">
            <Connector branches={group.length} />
            <div
              className={cn(
                "grid gap-2.5",
                group.length === 1 && "grid-cols-1",
                group.length === 2 && "sm:grid-cols-2",
                group.length >= 3 && "sm:grid-cols-3",
              )}
            >
              {group.map((stage) => (
                <Node
                  key={stage.label}
                  {...stage}
                  kind="stage"
                  index={
                    groups.slice(0, groupIndex).flat().length +
                    group.indexOf(stage) +
                    1
                  }
                />
              ))}
            </div>
          </li>
        ))}

        <Connector />
        <Node {...flow.output} kind="output" />
      </ol>
    </figure>
  );
}

function Node({
  label,
  note,
  icon: Icon,
  kind,
  index,
}: {
  label: string;
  note: string;
  icon: LucideIcon;
  kind: "input" | "stage" | "output";
  index?: number;
}) {
  const isTerminal = kind !== "stage";

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-colors",
        kind === "input" &&
          "border-white/18 bg-white/[0.07] ring-1 ring-inset ring-white/5",
        kind === "stage" && "border-white/10 bg-navy-900/50 hover:border-cyan-400/35",
        kind === "output" &&
          "border-emerald-400/35 bg-emerald-400/[0.08] ring-1 ring-inset ring-emerald-400/10",
      )}
    >
      <span
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
          kind === "input" && "bg-white/10 text-slate-200",
          kind === "stage" && "bg-cyan-500/12 text-cyan-300 ring-1 ring-cyan-400/20",
          kind === "output" && "bg-emerald-400/15 text-emerald-300",
        )}
      >
        <Icon className="size-4.5" aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[0.9rem] font-semibold leading-snug",
            isTerminal ? "text-white" : "text-slate-100",
          )}
        >
          {label}
        </span>
        <span className="block text-xs text-slate-400">{note}</span>
      </span>

      {isTerminal ? (
        <span
          className={cn(
            "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider",
            kind === "input"
              ? "border-white/20 text-slate-400"
              : "border-emerald-400/40 text-emerald-300",
          )}
        >
          {kind}
        </span>
      ) : (
        <span
          aria-hidden
          className="shrink-0 font-mono text-[0.68rem] text-slate-600"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

/**
 * Vertical rail between nodes. When the next step runs as parallel branches,
 * the rail forks into exactly that many legs — the fork is generated from the
 * branch count rather than hardcoded, so a 3-way group (IntSys) draws three
 * legs, not two with one orphaned.
 */
function Connector({ branches = 1 }: { branches?: number }) {
  if (branches <= 1) {
    return (
      <div aria-hidden className="flex h-6 justify-center sm:h-7">
        <span className="w-px bg-gradient-to-b from-white/25 to-white/10" />
      </div>
    );
  }

  const width = 120;
  const legs = Array.from({ length: branches }, (_, i) => {
    // Evenly spaced leg centres across the row width.
    const x = ((i + 0.5) / branches) * width;
    return `M${width / 2} 10 H${x} V28`;
  });

  return (
    <div aria-hidden>
      {/* Below sm the branches stack into one column, so a fork would point at
          nothing — draw the plain rail instead. */}
      <div className="flex h-6 justify-center sm:hidden">
        <span className="w-px bg-gradient-to-b from-white/25 to-white/10" />
      </div>

      <div className="hidden h-7 justify-center sm:flex">
        <svg
          viewBox={`0 0 ${width} 28`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d={`M${width / 2} 0 V10 ${legs.join(" ")}`}
            fill="none"
            stroke="currentColor"
            className="text-white/20"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
