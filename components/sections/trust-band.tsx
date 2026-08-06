import Image from "next/image";
import { Award, Landmark, Microscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { TRUST_STATS, TRUST_DATA_SOURCES, FUNDERS } from "@/lib/content";

/**
 * Funding ribbon — opens the Projects page.
 *
 * It ran on the landing page until the client moved it here, and it reads
 * better for it: the figures below (two Phase II, four Phase I) count the six
 * projects listed immediately underneath, and the NIH/NSF logos are those
 * projects' funders. Every figure is sourced from the company's own published
 * project list. No publication counts, customer counts, or data-volume figures
 * appear because none are verifiable.
 *
 * ── A RIBBON, NOT A HERO ───────────────────────────────────────────────────
 * This was a centred vertical stack — 128px award circles, then the funders,
 * then the data sources, each with its own heading — and it ran the better
 * part of a screen before the first project. The client asked for a sponsor
 * banner instead, so the three groups now sit side by side on one row and the
 * decoration is gone: no circles, no oversized numerals, smaller logos, and a
 * fraction of the vertical padding.
 *
 * The copy came down with it. The "NIH & NSF SBIR-funded" pill duplicated the
 * "Supported by" logos beside it, and the line explaining that TCGA/CPTAC/
 * TCIA/CRDC are public cancer research repositories no longer fits a single-
 * row band. Both are gone rather than shrunk into unreadability.
 *
 * UNDERSTATED IN TONE. The client's note was that this must not be a "big
 * cocky thing" — plain figures, no superlatives. That constraint survives the
 * resize unchanged; if anything the ribbon serves it better than the circles
 * did.
 */
export function TrustBand() {
  return (
    <section
      aria-label="Research funding and data sources"
      /* border-b only, and it earns its keep here: this and the accordion
         below share one tint, so the rule is what separates the funding
         summary from the list of projects it describes. No top border — the
         page hero above is navy and provides its own edge. */
      className="relative isolate overflow-hidden border-b border-slate-200 bg-surface-tint py-8 lg:py-9"
    >
      <MolecularBackdrop variant="light" subtle pattern={4} />

      <Container className="relative">
        {/* Stacked and centred below lg — three groups side by side needs
            roughly 860px, and the container only clears that from the lg
            breakpoint up. The row gap is deliberately tighter than the stacked
            one for the same reason: at exactly 1024px there is about 60px of
            slack across the whole row, and `justify-between` spends whatever
            is going spare. */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <Group label="SBIR-funded projects" icon={Award}>
            <dl className="flex items-center gap-7">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  {/* DOM order is dt then dd, which is what a definition list
                      requires; `order-first` is what puts the numeral on the
                      left visually. The previous markup put <dd> first in the
                      source to get the same effect, which is invalid. */}
                  <dd className="order-first font-display text-[2rem] font-bold leading-none tracking-tight text-navy-900">
                    {stat.value}
                  </dd>
                  <dt className="max-w-[6.5rem] text-left text-[0.8rem] font-medium leading-tight text-slate-600">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Group>

          <Divider />

          <Group label="Supported by" icon={Landmark}>
            <ul className="flex items-center gap-3">
              {FUNDERS.map((funder) => (
                <li key={funder.short}>
                  {/* The agency's full name lives in the image's alt text, so
                      the visible label can be the short form without costing a
                      screen reader anything. At this size the small print
                      inside the NIH artwork is unreadable anyway — the mark is
                      what identifies it. */}
                  <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                      <Image
                        src={funder.logo}
                        alt={funder.name}
                        width={96}
                        height={96}
                        className="size-full object-contain"
                      />
                    </span>
                    <span className="text-[0.8rem] font-semibold text-slate-700">
                      {funder.short}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Group>

          <Divider />

          <Group label="Working with data from" icon={Microscope}>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {TRUST_DATA_SOURCES.map((source) => (
                <li key={source}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-ink/20 bg-white py-1 pl-2.5 pr-3 font-mono text-[0.75rem] tracking-wide text-cyan-ink">
                    <span aria-hidden className="size-1 rounded-full bg-cyan-ink" />
                    {source}
                  </span>
                </li>
              ))}
            </ul>
          </Group>
        </div>
      </Container>
    </section>
  );
}

/**
 * One labelled group in the ribbon. The label is an h2 rather than a styled
 * span: these were headings when this was a stacked band, and shrinking a
 * section does not stop its parts needing names in the outline.
 */
function Group({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 lg:items-start">
      <h2 className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="size-3" aria-hidden />
        {label}
      </h2>
      {children}
    </div>
  );
}

/** Hairline between groups. Only on the row layout — stacked, it would be a
 *  rule across nothing. */
function Divider() {
  return (
    <span aria-hidden className="hidden h-14 w-px bg-slate-300 lg:block" />
  );
}
