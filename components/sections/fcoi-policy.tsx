import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

import {
  FCOI_EFFECTIVE,
  FCOI_ORG,
  FCOI_SECTIONS,
  FCOI_TITLE,
} from "@/lib/fcoi";

/**
 * Financial Conflicts of Interest policy.
 *
 * Reproduced in full and verbatim. PHS FCOI regulations require the policy to
 * be publicly accessible and maintained, so it stays on the site.
 *
 * DELIBERATELY QUIET. It used to occupy its own full-width white section under
 * the projects list, which gave a compliance document the same visual weight as
 * the research — the client's father read it as a seventh project. So it now
 * renders inline at the foot of the projects list, on the same tint, as a muted
 * hairline row: findable by anyone who needs it, prominent to nobody.
 *
 * This is a presentation change only. It renders no `<section>` and no
 * `<Container>` of its own; it inherits the projects column so the two align.
 *
 * WHAT MUST NOT CHANGE: `hiddenUntilFound` keeps the entire policy text in the
 * DOM while collapsed, so find-in-page and crawlers still reach it. Making this
 * quieter must never make it unreachable — that is the regulatory requirement,
 * not a styling preference.
 */
export function FcoiPolicy() {
  return (
    <div className="mt-12 border-t border-slate-200 pt-6">
      <Accordion multiple={false} hiddenUntilFound>
        {/* px matches the project cards above so the row's text starts on the
            same vertical as their titles. */}
        <AccordionItem value="fcoi" className="border-none px-5 sm:px-7">
          <AccordionTrigger className="py-2 text-slate-500 hover:no-underline">
            <span className="flex flex-1 items-center gap-2.5 pr-4 text-left">
              <FileText className="size-3.5 shrink-0" aria-hidden />
              <span className="text-[0.8rem] font-medium">
                {FCOI_TITLE}
                <span className="text-slate-400">
                  {" "}
                  · {FCOI_ORG} · {FCOI_EFFECTIVE}
                </span>
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-8 pb-8 pt-4">
              {FCOI_SECTIONS.map((section, sectionIndex) => (
                <section key={section.heading ?? `intro-${sectionIndex}`}>
                  {section.heading ? (
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-navy-900">
                      {section.heading}
                    </h3>
                  ) : null}

                  <div className="mt-3 flex flex-col gap-3">
                    {section.items.map((item, itemIndex) => (
                      <p
                        key={itemIndex}
                        className={
                          item.bullet
                            ? "relative pl-5 text-sm leading-relaxed text-slate-700 before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-cyan-500/60"
                            : "text-sm leading-relaxed text-slate-700"
                        }
                      >
                        {item.text}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
