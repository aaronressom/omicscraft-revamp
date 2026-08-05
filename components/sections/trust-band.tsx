import Image from "next/image";
import { Landmark, Microscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import {
  HERO,
  TRUST_STATS,
  TRUST_DATA_SOURCES,
  FUNDERS,
} from "@/lib/content";

/**
 * Funding band.
 *
 * Every figure is sourced from the company's own published project list: six
 * SBIR awards (two Phase II, four Phase I). No publication counts, customer
 * counts, or data-volume figures appear because none are verifiable.
 *
 * DELIBERATELY UNDERSTATED — the client's note was that it must not be a "big
 * cocky thing" on the landing page. It is also the landing page's colour
 * break: the hero and motto band above it are both dark, so this sits on a
 * light tinted surface to stop the page reading as one unbroken slab of navy.
 */
export function TrustBand() {
  return (
    <section
      aria-label="Research funding and data sources"
      className="relative isolate overflow-hidden border-y border-slate-200 bg-surface-tint py-14"
    >
      {/* clearCenter: this section is centre-aligned, so the artwork ran
          directly behind the numbers and labels. */}
      <MolecularBackdrop variant="light" clearCenter />

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-ink/25 bg-white px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cyan-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-cyan-ink" />
            {HERO.eyebrow}
          </span>

          <h2 className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            SBIR-Funded Projects
          </h2>

          {/* Circular award badges, centred. Two wide rectangles left a lot of
              dead horizontal space across the container. */}
          <dl className="mt-5 flex flex-wrap items-start justify-center gap-x-12 gap-y-6 sm:gap-x-16">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2.5">
                <dd className="flex size-20 items-center justify-center rounded-full border border-cyan-ink/20 bg-white shadow-sm">
                  <span className="font-display text-3xl font-bold tracking-tight text-navy-900">
                    {stat.value}
                  </span>
                </dd>
                <dt className="max-w-[8.5rem] text-[0.8rem] font-medium leading-snug text-slate-600">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* Funders */}
          <h2 className="mt-10 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Landmark className="size-3" aria-hidden />
            Supported by
          </h2>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {FUNDERS.map((funder) => (
              <li key={funder.short}>
                <span className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                    <Image
                      src={funder.logo}
                      alt={funder.name}
                      width={96}
                      height={96}
                      className="size-full object-contain"
                    />
                  </span>
                  <span className="text-left text-[0.75rem] leading-tight text-slate-700">
                    {funder.name.split(" — ")[0]}
                    {funder.name.includes("—") ? (
                      <span className="block text-[0.65rem] uppercase tracking-wider text-cyan-ink">
                        {funder.name.split(" — ")[1]}
                      </span>
                    ) : null}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Data sources */}
          <h2 className="mt-9 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Microscope className="size-3" aria-hidden />
            Working with data from
          </h2>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {TRUST_DATA_SOURCES.map((source) => (
              <li key={source}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-ink/20 bg-white py-1 pl-2.5 pr-3 font-mono text-[0.7rem] tracking-wide text-cyan-ink">
                  <span aria-hidden className="size-1 rounded-full bg-cyan-ink" />
                  {source}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 max-w-md text-[0.75rem] leading-relaxed text-slate-500">
            Public cancer research repositories used across our SBIR projects.
          </p>
        </div>
      </Container>
    </section>
  );
}
