import { ArrowUpRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { FcoiPolicy } from "@/components/sections/fcoi-policy";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Six federally funded SBIR projects.
 *
 * The live site prints all six full abstracts inline, producing a wall of text
 * several screens deep. Collapsing them keeps every word available - nothing is
 * summarized - while making the list scannable.
 *
 * Every item starts closed. An earlier draft opened the first one so the
 * section would not read as empty, but that gave aiSysMet a full screen of
 * abstract on arrival while the other five were a single line each — it looked
 * like the page had one project and five footnotes.
 *
 * The FCOI policy renders at the end of this same list rather than as its own
 * section (see fcoi-policy.tsx).
 */
export function ProjectsList() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-tint pb-24 pt-14 lg:pb-28 lg:pt-16">
      <MolecularBackdrop variant="light" subtle pattern={5} />

      <Container className="relative">
        {/* Base UI: `multiple` + array `defaultValue` (no type/collapsible).
            hiddenUntilFound keeps every abstract in the DOM, so browser
            find-in-page and crawlers still reach collapsed text. */}
        <Accordion
          multiple={false}
          hiddenUntilFound
          defaultValue={[]}
          className="flex flex-col gap-3"
        >
          {PROJECTS.map((project) => (
            <AccordionItem
              key={project.id}
              value={project.id}
              className="rounded-2xl border border-slate-200 bg-white px-5 sm:px-7"
            >
              <AccordionTrigger className="py-6 hover:no-underline">
                <span className="flex flex-1 flex-col gap-2 pr-4 text-left sm:flex-row sm:items-center sm:gap-4">
                  <PhaseBadge phase={project.phase} />
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold tracking-tight text-navy-900 sm:text-lg">
                      {project.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600">
                      {project.subtitle}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent>
                {/* No `measure` here. It caps the line at 65ch while the panel
                    runs the full card width, which is why the abstracts looked
                    like they stopped short of the container. pr-8 keeps the
                    text clear of the chevron in the trigger above. */}
                <p className="pr-8 text-[0.95rem] leading-relaxed text-slate-700">
                  {project.abstract}
                </p>

                {/* The award record, inside the panel rather than on the
                    trigger row. Everything above it — the phase, the funder,
                    the abstract — comes from this page, so it belongs at the
                    end of the abstract as its source, not next to the project
                    name as a second thing to click.

                    Safe to leave in the collapsed markup: `hiddenUntilFound`
                    on the accordion sets `hidden="until-found"`, which keeps
                    the text findable by the browser's find-in-page and by
                    crawlers while taking the link out of the tab order. */}
                <AwardLink href={project.awardHref} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <FcoiPolicy />
      </Container>
    </section>
  );
}

/**
 * Link to the award's public record.
 *
 * The destination is NAMED rather than left as "Learn more": these are the
 * primary sources for the abstract above, and which agency's register a reader
 * is being sent to is the useful half of that.
 */
function AwardLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/award mb-6 mt-5 inline-flex min-h-9 items-center gap-1.5 rounded-lg text-sm font-semibold text-cyan-ink hover:underline"
    >
      View the award on {awardSource(href)}
      <ArrowUpRight
        className="size-4 transition-transform group-hover/award:-translate-y-0.5 group-hover/award:translate-x-0.5"
        aria-hidden
      />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

/**
 * Which register a link points at, read from the URL itself so the label can
 * never contradict the destination.
 *
 * `projectreporter.nih.gov` is the retired pre-2018 RePORTER host — one of the
 * six awards is still recorded under it (see PROJECTS in lib/content.ts), and
 * it is the same register, so it gets the same name.
 */
function awardSource(href: string): string {
  try {
    const host = new URL(href).hostname;
    if (host.endsWith("nih.gov")) return "NIH RePORTER";
    if (host.endsWith("nsf.gov")) return "NSF Award Search";
    return host.replace(/^www\./, "");
  } catch {
    return "the funding agency";
  }
}

function PhaseBadge({ phase }: { phase: "Phase I" | "Phase II" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit shrink-0 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wide ring-1",
        phase === "Phase II"
          ? "bg-emerald-500/10 text-emerald-ink ring-emerald-500/25"
          : "bg-cyan-500/10 text-cyan-ink ring-cyan-500/25",
      )}
    >
      {phase} SBIR
    </span>
  );
}
