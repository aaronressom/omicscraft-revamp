import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { PipelineDiagram } from "@/components/visuals/pipeline-diagram";
import { HERO } from "@/lib/content";

/**
 * Home hero.
 *
 * The audit's headline failure was dark navy type over a mid-tone photograph.
 * The fix is structural, not cosmetic: the background is a solid navy fill with
 * decorative glows confined to low opacity, so headline contrast is a fixed
 * ~15:1 regardless of viewport. No photographic imagery sits behind text.
 */
export function Hero() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950">
      <GlowBackdrop grid={false} />
      <MolecularBackdrop />

      <Container className="relative pb-20 pt-36 lg:pb-28 lg:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-cyan-400"
              />
              {HERO.eyebrow}
            </span>

            <h1 className="type-display measure-tight mt-6 text-white">
              {HERO.headline}
            </h1>

            <p className="type-lead measure mt-6 text-slate-300">
              {HERO.subhead}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink size="xl" href={HERO.primaryCta.href}>
                {HERO.primaryCta.label}
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink
                size="xl"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                href={HERO.secondaryCta.href}
              >
                {HERO.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <PipelineDiagram />
        </div>
      </Container>
    </section>
  );
}
