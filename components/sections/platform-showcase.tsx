"use client";

import { ArrowUpRight } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
 * team; nothing here implements or proxies them. Each card is an outbound link.
 * A product with a null `href` renders as a non-interactive tile with a
 * "Coming soon" badge rather than a dead link.
 */
export function PlatformShowcase({
  products,
  platformLogoAvailable,
}: {
  products: ProductWithAsset[];
  platformLogoAvailable: boolean;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-24 lg:py-32">
      <GlowBackdrop intensity="subtle" grid={false} />
      <MolecularBackdrop />

      <Container className="relative">
        <SectionHeading
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
            <h3 className="type-h3 text-white">{PLATFORM.name}</h3>
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

        {/* Tool tabs */}
        <div className="mt-16">
          <Tabs defaultValue={products[0]?.id}>
            {/* overflow-y-hidden: without it the horizontal scroll container
                also reports a vertical overflow and paints a stray scrollbar.
                h-auto + h-11 on the trigger: the stock trigger inherits its
                height from the list (25px here), under the 44px tap minimum. */}
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto overflow-y-hidden border border-white/10 bg-white/[0.04] p-1.5">
              {products.map((product) => (
                <TabsTrigger
                  key={product.id}
                  value={product.id}
                  /* The stock active state resolves to --background, which on a
                     dark section is darker than the track and reads as a hole.
                     Lift the active tab above the track instead. */
                  className="h-11 px-4 text-sm text-slate-400 data-active:bg-white/12 data-active:text-white"
                >
                  {product.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {products.map((product) => {
              return (
                <TabsContent
                  key={product.id}
                  value={product.id}
                  className="mt-8 focus-visible:outline-none"
                >
                  {/* Schematic leads, copy follows: the data flow is the argument. */}
                  <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
                    <ToolFlow id={product.id} />

                    <div className="flex flex-col">
                      {/* The product logos already carry strong identity, so
                          they are the lockup here - an extra generic icon
                          alongside them just competed for attention. */}
                      <ProductLogo
                        src={product.logo}
                        name={product.name}
                        available={product.logoAvailable}
                        className="aspect-auto h-20 w-auto max-w-[15rem] p-2.5"
                      />

                      <h3 className="type-h3 mt-6 text-white">
                        {product.name}
                      </h3>
                      <p className="type-body measure mt-3 text-slate-300">
                        {product.blurb}
                      </p>

                      <div className="mt-7">
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
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
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
