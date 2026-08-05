import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductLogo } from "@/components/ui/product-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { PlatformTools } from "@/components/sections/platform-tools";
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
 * This stays a server component: the only interactivity on the page is the
 * connector and its hover states, which live in `PlatformTools`.
 */
export function PlatformShowcase({
  products,
  platformLogoAvailable,
}: {
  products: ProductWithAsset[];
  platformLogoAvailable: boolean;
}) {
  return (
    /* No bottom padding: the light tool band below closes the section. */
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 pt-36 lg:pt-44">
      <GlowBackdrop intensity="subtle" grid={false} />
      <MolecularBackdrop pattern={6} fadeTop />

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

        {/* Platform-level lockup.
            Solid navy-900 rather than the old bg-white/[0.03]: a 3% white wash
            over navy-950 is barely a shade apart from the page behind it, so
            the panel had no edge and the copy inside read as floating loose on
            the background. navy-900 is a real step up in lightness, which lifts
            the whole block forward. */}
        <div className="mt-8 grid items-center gap-10 rounded-3xl border border-white/12 bg-navy-900 p-6 shadow-xl shadow-navy-950/40 sm:p-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
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

      </Container>

      {/* Colour break: the page header and the aiSysMet lockup above are both
          navy, so the tool row sits on a light band. Without it the whole page
          reads as one continuous slab of blue. */}
      <div className="relative mt-16 border-y border-slate-200 bg-surface-tint py-14">
        <MolecularBackdrop variant="light" pattern={3} />
        <PlatformTools products={products} />
      </div>
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
