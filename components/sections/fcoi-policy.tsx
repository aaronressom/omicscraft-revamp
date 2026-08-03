import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
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
 * be publicly accessible and maintained, so it stays on the site - it is
 * collapsed rather than removed, and the trigger is a plain expandable region
 * so the text remains in the DOM for search engines and in-page find.
 */
export function FcoiPolicy() {
  return (
    <section className="border-t border-slate-200 bg-white py-16 lg:py-20">
      <Container size="narrow">
        {/* hiddenUntilFound is the point here: the policy must stay publicly
            accessible, so collapsing it must not remove it from the DOM,
            find-in-page, or search indexing. */}
        <Accordion multiple={false} hiddenUntilFound>
          <AccordionItem
            value="fcoi"
            className="rounded-2xl border border-slate-200 px-5 sm:px-7"
          >
            <AccordionTrigger className="py-6 hover:no-underline">
              <span className="flex flex-col gap-1 pr-4 text-left">
                <span className="font-display text-base font-semibold tracking-tight text-navy-900">
                  {FCOI_TITLE}
                </span>
                <span className="text-sm text-slate-600">
                  {FCOI_ORG} · {FCOI_EFFECTIVE}
                </span>
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-8 pb-8 pt-2">
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
      </Container>
    </section>
  );
}
