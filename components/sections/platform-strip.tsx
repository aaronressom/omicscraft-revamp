import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductLogo } from "@/components/ui/product-logo";
import { HEADINGS, PLATFORM } from "@/lib/content";
import type { ProductWithAsset } from "@/components/sections/platform-showcase";

/**
 * Compact platform row for the home page.
 *
 * Puts the four tools one click from the front door - the audit's second
 * finding was that the product was buried in an About paragraph.
 *
 * SCOPE: link-out only. Cards with a supplied AWS URL are external links;
 * cards without one are inert tiles, never dead links.
 */
export function PlatformStrip({ products }: { products: ProductWithAsset[] }) {
  return (
    <section className="bg-white py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={HEADINGS.platform.eyebrow}
            title={HEADINGS.platform.title}
            description={HEADINGS.platform.description}
          />
          <Link
            href="/platform"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg text-sm font-semibold text-cyan-ink hover:underline"
          >
            Explore {PLATFORM.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const card = (
              <>
                <ProductLogo
                  src={product.logo}
                  name={product.name}
                  available={product.logoAvailable}
                  className="shadow-none ring-1 ring-slate-200"
                />
                <span className="mt-4 flex items-center justify-between gap-2">
                  <span className="font-display text-base font-semibold text-navy-900">
                    {product.name}
                  </span>
                  {product.href ? (
                    <ArrowUpRight
                      className="size-4 shrink-0 text-cyan-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  ) : (
                    <span className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
                      Coming soon
                    </span>
                  )}
                </span>
              </>
            );

            return (
              <li key={product.id}>
                {product.href ? (
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg"
                  >
                    {card}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    {card}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
