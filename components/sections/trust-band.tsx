import { Landmark, Microscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { TRUST_STATS, TRUST_DATA_SOURCES, FUNDERS } from "@/lib/content";

/**
 * Trust band.
 *
 * Every figure is sourced from the company's own published project list: six
 * SBIR awards (two Phase II, four Phase I) and the four-tool aiSysMet suite.
 * No publication counts, customer counts, or data-volume figures appear
 * because none are verifiable. If a number cannot be traced to published
 * material, it does not belong in this component.
 *
 * TODO(client): supply official NIH SBIR/STTR and NSF logo files to replace
 * the typographic funder badges. They are lazy-loaded on the current Wix site
 * and could not be extracted.
 */
export function TrustBand() {
  return (
    <section
      aria-label="Research funding and platform scale"
      className="on-dark relative isolate overflow-hidden border-y border-white/10 bg-navy-900 py-16 lg:py-20"
    >
      <GlowBackdrop intensity="subtle" grid={false} />

      <Container className="relative">
        {/* Metrics */}
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.07] lg:p-6"
            >
              {/* Corner accent that warms on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-cyan-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-cyan-400/25"
              />
              <dt className="sr-only">{stat.label}</dt>
              <dd className="relative flex flex-col gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium leading-snug text-slate-400">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          {/* Funders */}
          <div>
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <Landmark className="size-3.5" aria-hidden />
              Supported by
            </h2>

            <ul className="mt-4 flex flex-wrap gap-3">
              {FUNDERS.map((funder) => (
                <li key={funder.short}>
                  <span className="flex items-center gap-3.5 rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.03] py-3 pl-3.5 pr-5 transition-colors hover:border-white/30">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/95 font-display text-sm font-extrabold tracking-tight text-navy-950 shadow-sm">
                      {funder.short}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[0.82rem] font-semibold leading-tight text-white">
                        {funder.name.split(" — ")[0]}
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-wider text-cyan-300/90">
                        {funder.name.includes("—")
                          ? funder.name.split(" — ")[1]
                          : "Federal research funding"}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <Microscope className="size-3.5" aria-hidden />
              Working with data from
            </h2>

            <ul className="mt-4 flex flex-wrap gap-2">
              {TRUST_DATA_SOURCES.map((source) => (
                <li key={source}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] py-2 pl-3 pr-4 font-mono text-xs font-medium tracking-wide text-cyan-200 transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/15">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-cyan-400"
                    />
                    {source}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-slate-500">
              Public cancer research repositories used across our SBIR projects.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
