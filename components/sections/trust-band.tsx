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
 * UNDERSTATED IN TONE, GENEROUS IN SCALE. The client's note was that it must
 * not be a "big cocky thing" — so it stays plain figures with no superlatives.
 * That is a copy constraint, not a size one: this and the motto plaque are all
 * that stand between the hero and the footer, so the badges are sized to
 * actually occupy the space rather than float in it.
 *
 * It is also the landing page's colour break — the hero above is navy, so this
 * sits on a light tinted surface to stop the page reading as one slab of blue.
 */
export function TrustBand() {
  return (
    <section
      aria-label="Research funding and data sources"
      /* border-b only: the motto plaque above sits on this same tint, so a top
         border would draw a rule straight through what should read as one
         continuous light region. */
      className="relative isolate overflow-hidden border-b border-slate-200 bg-surface-tint pb-20 pt-8 lg:pb-24 lg:pt-10"
    >
      {/* clearCenter: this section is centre-aligned, so the artwork ran
          directly behind the numbers and labels. */}
      <MolecularBackdrop variant="light" clearCenter pattern={4} />

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-ink/25 bg-white px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-cyan-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-cyan-ink" />
            {HERO.eyebrow}
          </span>

          <h2 className="mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            SBIR-Funded Projects
          </h2>

          {/* Circular award badges, centred. Two wide rectangles left a lot of
              dead horizontal space across the container; the circles are then
              sized generously because the band is the only thing between the
              motto and the footer and was otherwise swimming in empty space. */}
          <dl className="mt-7 flex flex-wrap items-start justify-center gap-x-16 gap-y-8 sm:gap-x-24">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3.5">
                <dd className="flex size-32 items-center justify-center rounded-full border border-cyan-ink/20 bg-white shadow-sm ring-8 ring-white/60 sm:size-36">
                  <span className="font-display text-5xl font-bold tracking-tight text-navy-900 sm:text-6xl">
                    {stat.value}
                  </span>
                </dd>
                <dt className="max-w-[10rem] text-[0.95rem] font-medium leading-snug text-slate-600">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* Funders */}
          <h2 className="mt-14 flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Landmark className="size-3.5" aria-hidden />
            Supported by
          </h2>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {FUNDERS.map((funder) => (
              <li key={funder.short}>
                <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-2 pl-2 pr-5 shadow-sm">
                  <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                    <Image
                      src={funder.logo}
                      alt={funder.name}
                      width={96}
                      height={96}
                      className="size-full object-contain"
                    />
                  </span>
                  <span className="text-left text-[0.875rem] leading-tight text-slate-700">
                    {funder.name.split(" — ")[0]}
                    {funder.name.includes("—") ? (
                      <span className="block text-[0.7rem] uppercase tracking-wider text-cyan-ink">
                        {funder.name.split(" — ")[1]}
                      </span>
                    ) : null}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Data sources */}
          <h2 className="mt-14 flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Microscope className="size-3.5" aria-hidden />
            Working with data from
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {TRUST_DATA_SOURCES.map((source) => (
              <li key={source}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-ink/20 bg-white py-1.5 pl-3 pr-4 font-mono text-[0.8rem] tracking-wide text-cyan-ink">
                  <span aria-hidden className="size-1 rounded-full bg-cyan-ink" />
                  {source}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-slate-500">
            Public cancer research repositories used across our SBIR projects.
          </p>
        </div>
      </Container>
    </section>
  );
}
