import Image from "next/image";
import Link from "next/link";
import { Building2, Cpu, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ABOUT, PLATFORM } from "@/lib/content";

/**
 * Company / Product / Who We Are.
 *
 * All three paragraphs are verbatim. Two presentation decisions:
 *  - the "aiSysMet" mention in the Product block becomes a real link to
 *    /platform rather than plain body text, which was the audit's "product is
 *    buried" finding in its most literal form;
 *  - Company leads full-width as the executive statement, with Product and Who
 *    We Are paired beneath it, so the three blocks read as a briefing rather
 *    than three equal paragraphs in a column.
 */

const META: Record<string, { icon: LucideIcon; kicker: string }> = {
  // "Overview", not "Who we are" — the third block is literally titled
  // "Who We Are", and repeating it as a kicker here read as a duplicate.
  Company: { icon: Building2, kicker: "Overview" },
  Product: { icon: Cpu, kicker: "What we build" },
  "Who We Are": { icon: Users, kicker: "The team" },
};

export function AboutBlocks() {
  const [lead, ...rest] = [ABOUT.company, ABOUT.product, ABOUT.whoWeAre];

  return (
    <section className="relative isolate overflow-hidden bg-white py-24 lg:py-32">
      {/* Brand watermark. Fills the empty right field without competing with
          text — clipped by the section and held well below body contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-16 hidden w-[34rem] opacity-[0.045] lg:block"
      >
        <Image
          src="/brand/omicscraft-mark.png"
          alt=""
          width={304}
          height={248}
          className="h-auto w-full"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
      />

      <Container className="relative">
        <AboutCard block={lead} featured />

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {rest.map((block) => (
            <AboutCard key={block.label} block={block} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function AboutCard({
  block,
  featured = false,
}: {
  block: { label: string; body: string };
  featured?: boolean;
}) {
  const meta = META[block.label] ?? { icon: Building2, kicker: "" };
  const Icon = meta.icon;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-surface transition-all duration-300 hover:border-cyan-500/35 hover:shadow-xl hover:shadow-navy-950/[0.06] ${
        featured ? "p-7 lg:p-10" : "h-full p-7"
      }`}
    >
      {/* Left accent rail, brightening on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-emerald-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/12 to-emerald-500/12 text-cyan-ink ring-1 ring-cyan-500/20">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <div className="flex flex-col">
          <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
            {block.label}
          </h2>
          {meta.kicker ? (
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {meta.kicker}
            </span>
          ) : null}
        </div>
      </div>

      <p
        className={`measure mt-5 leading-relaxed text-slate-700 ${
          featured ? "text-[1.0625rem]" : "text-[0.975rem]"
        }`}
      >
        {block.label === ABOUT.product.label
          ? renderWithPlatformLink(block.body)
          : block.body}
      </p>
    </article>
  );
}

/**
 * Splits the verbatim Product paragraph around the single "aiSysMet" mention
 * and links it. The text itself is untouched — only wrapped.
 */
function renderWithPlatformLink(text: string) {
  const term = PLATFORM.name;
  const index = text.indexOf(term);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <Link
        href="/platform"
        className="font-semibold text-cyan-ink underline decoration-cyan-ink/35 underline-offset-4 hover:decoration-cyan-ink"
      >
        {term}
      </Link>
      {text.slice(index + term.length)}
    </>
  );
}
