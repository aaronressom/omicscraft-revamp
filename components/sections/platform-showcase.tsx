import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductLogo } from "@/components/ui/product-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { ToolFlow } from "@/components/visuals/tool-flow";
import { HEADINGS, PLATFORM, type Product } from "@/lib/content";
import { cn } from "@/lib/utils";

export type ProductWithAsset = Product & { logoAvailable: boolean };

/**
 * aiSysMet showcase.
 *
 * SCOPE: presentational only. The products run on AWS and are owned by another
 * team; nothing here implements or proxies them. Each tool links out, and a
 * tool with a null `href` renders an inert tile rather than a dead link.
 *
 * All four tools render simultaneously — the tab interface this replaced hid
 * three quarters of the suite behind a control most visitors never touched.
 * Per-tool logos are deliberately absent; the aiSysMet lockup above carries the
 * branding and repeating four more logos crowded the schematics.
 *
 * No client state remains, so this is a server component.
 */
export function PlatformShowcase({
  products,
  platformLogoAvailable,
}: {
  products: ProductWithAsset[];
  platformLogoAvailable: boolean;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 pb-24 pt-36 lg:pb-32 lg:pt-44">
      <GlowBackdrop intensity="subtle" grid={false} />
      <MolecularBackdrop />

      <Container className="relative">
        {/* as="h1": this route has no PageHero, so the section heading is the
            page's only top-level heading. */}
        <SectionHeading
          as="h1"
          eyebrow={HEADINGS.platform.eyebrow}
          title={HEADINGS.platform.title}
          description={HEADINGS.platform.description}
          onDark
        />

        {/* Platform-level lockup */}
        <div className="mt-14 grid items-center gap-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
          <ProductLogo
            src={PLATFORM.logo}
            name={PLATFORM.name}
            available={platformLogoAvailable}
            priority
          />

          <div>
            <h2 className="type-h3 text-white">{PLATFORM.name}</h2>
            <p className="type-body measure mt-4 text-slate-300">
              {PLATFORM.blurb}
            </p>

            <div className="mt-7">
              {PLATFORM.href ? (
                <ButtonLink size="xl" href={PLATFORM.href} external>
                  Launch {PLATFORM.name}
                  <ArrowUpRight aria-hidden />
                </ButtonLink>
              ) : (
                <ComingSoon label={`${PLATFORM.name} access`} />
              )}
            </div>
          </div>
        </div>

        {/* All four tools, side by side */}
        <ul className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-8">
          {products.map((product) => (
            <li key={product.id}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                <h2 className="type-h3 text-white">{product.name}</h2>
                <p className="type-body mt-3 text-slate-300">{product.blurb}</p>

                <div className="mt-7">
                  <ToolFlow id={product.id} />
                </div>

                {/* mt-auto: the four flows have different step counts, so
                    without it each CTA floats at the end of its own content
                    and they land at four different heights across the grid. */}
                <div className="mt-auto pt-7">
                  {product.href ? (
                    <ButtonLink
                      variant="outline"
                      href={product.href}
                      external
                      className="h-11 border-white/25 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
                    >
                      Open {product.name}
                      <ArrowUpRight aria-hidden />
                    </ButtonLink>
                  ) : (
                    <ComingSoon label={`${product.name} access`} />
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * Stands in for a link whose destination has not been supplied.
 * Deliberately not a link or a button: there is nowhere to go, so it must not
 * be focusable or announced as interactive.
 */
function ComingSoon({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-xl border border-dashed border-white/25 px-5 text-sm font-medium text-slate-400",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-slate-500" />
      {label} — coming soon
    </span>
  );
}
