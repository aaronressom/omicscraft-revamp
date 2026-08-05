import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Six federally funded SBIR projects.
 *
 * The live site prints all six full abstracts inline, producing a wall of text
 * several screens deep. Collapsing them keeps every word available - nothing is
 * summarized - while making the list scannable. The first is open by default so
 * the section never reads as empty.
 */
export function ProjectsList() {
  return (
    <section className="bg-surface-tint pb-24 pt-14 lg:pb-28 lg:pt-16">
      <Container>
        {/* Base UI: `multiple` + array `defaultValue` (no type/collapsible).
            hiddenUntilFound keeps every abstract in the DOM, so browser
            find-in-page and crawlers still reach collapsed text. */}
        <Accordion
          multiple={false}
          hiddenUntilFound
          defaultValue={PROJECTS[0] ? [PROJECTS[0].id] : []}
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
                <p className="pb-6 pr-8 text-[0.95rem] leading-relaxed text-slate-700">
                  {project.abstract}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
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
