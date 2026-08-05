"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ToolFlow } from "@/components/visuals/tool-flow";
import type { ProductWithAsset } from "@/components/sections/platform-showcase";
import { cn } from "@/lib/utils";

/**
 * The four aiSysMet tools.
 *
 * Hovering a tool raises its card and dims the other three, so the row reads
 * one tool at a time rather than as four equal walls of text.
 *
 * There was briefly a drawn connector here — a trunk from the aiSysMet lockup
 * forking to each card, with flow animated along it. Two rounds of redesign did
 * not make it look like anything other than plumbing, and the client removed
 * it. The hover behaviour it drove is what survived, which is why this is still
 * a client component. If a connector is ever revisited, note that its geometry
 * has to be derived from the grid below (column centres of `lg:grid-cols-4
 * gap-4`) and that it must render BELOW the cards, not above them.
 */
export function PlatformTools({ products }: { products: ProductWithAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <Container className="relative">
        {/* All four tools in a single row. Two columns at md so the cards do
            not become unreadably narrow on tablets. */}
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const isActive = activeIndex === index;
            const isDimmed = activeIndex !== null && !isActive;

            return (
              <li
                key={product.id}
                // Focus as well as hover: if a tool URL is ever supplied the
                // card gains a link, and tabbing to it should light the same
                // branch that hovering does. React bubbles focus/blur.
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
              >
                {/* Solid card, not a translucent tint: on the light band the
                    previous bg-white/[0.02] was effectively invisible. */}
                <article
                  className={cn(
                    "flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-300",
                    isActive
                      ? "-translate-y-1 border-cyan-500/60 shadow-xl shadow-navy-950/10 ring-1 ring-cyan-500/25"
                      : "border-slate-200 shadow-sm",
                    isDimmed && "opacity-65",
                  )}
                >
                  <h2 className="font-display text-lg font-semibold tracking-tight text-navy-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-600">
                    {product.blurb}
                  </p>

                  {/* No `mt-auto` here. Bottom-aligning the schematics left a
                      large gap under the three shorter blurbs; the client asked
                      for the diagram to follow its text directly. */}
                  <div className="pt-5">
                    <ToolFlow
                      id={product.id}
                      compact
                      variant="light"
                      active={isActive}
                    />
                  </div>

                  {/* No "coming soon" tile: with no tool URLs these cards are
                      informational, and an inert badge on all four read as
                      clutter. `product.href` still renders a real link if one
                      is ever supplied. */}
                  {product.href ? (
                    <div className="mt-auto pt-4">
                      <ButtonLink
                        variant="outline"
                        href={product.href}
                        external
                        className="h-10 w-full px-4 text-[0.8rem]"
                      >
                        Open {product.name}
                        <ArrowUpRight aria-hidden />
                      </ButtonLink>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
