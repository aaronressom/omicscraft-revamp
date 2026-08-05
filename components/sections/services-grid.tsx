import {
  Atom,
  ChartSpline,
  FlaskConical,
  Handshake,
  Layers,
  Microscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { HEADINGS, SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Handshake,
  FlaskConical,
  Microscope,
  Atom,
  ChartSpline,
  Layers,
};

/**
 * Services grid.
 *
 * The original site used six unrelated stock photographs here, which is what
 * made the section read as a template. One icon language across all six cards
 * replaces that with a single coherent system. Descriptions are verbatim.
 */
export function ServicesGrid({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-tint pb-24 pt-14 lg:pb-28 lg:pt-16">
      {/* Light-variant chemistry watermark, echoing the previous site's use of
          skeletal structures behind body content. */}
      <MolecularBackdrop variant="light" pattern={6} />
      <Container className="relative">
        {withHeading ? (
          <SectionHeading
            eyebrow={HEADINGS.services.eyebrow}
            title={HEADINGS.services.title}
            description={HEADINGS.services.description}
          />
        ) : null}

        {/* The heading offset must not survive when the heading is suppressed,
            or the page hero is followed by a large empty band. */}
        <ul
          className={cn(
            "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
            withHeading && "mt-14",
          )}
        >
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon] ?? Handshake;
            return (
              <li key={service.title}>
                <article className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-navy-950/8">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/12 to-emerald-500/12 text-cyan-ink ring-1 ring-cyan-500/20 transition-colors group-hover:from-cyan-500/20 group-hover:to-emerald-500/20">
                    <Icon className="size-5.5" aria-hidden />
                  </span>

                  <h3 className="font-display mt-5 text-lg font-semibold tracking-tight text-navy-900">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-600">
                    {service.body}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
