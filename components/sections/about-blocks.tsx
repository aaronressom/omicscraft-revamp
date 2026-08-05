import Image from "next/image";
import Link from "next/link";
import { Building2, Cpu, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
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
    <section className="relative isolate overflow-hidden bg-surface-tint pb-14 pt-14 lg:pb-16 lg:pt-16">
      <MolecularBackdrop variant="light" subtle pattern={2} />
      {/* slate-400/70, not slate-200: this section and the team grid below sit
          on the same tint, so the divider is the only thing separating them.
          At slate-200 it had almost no contrast left against #ecfbfd and the
          two ran together. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/70 to-transparent"
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
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-cyan-500/35 hover:shadow-xl hover:shadow-navy-950/[0.06] ${
        featured ? "" : "h-full"
      }`}
    >
      {/* Left accent rail, brightening on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-emerald-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />

      {featured ? <CompanyWatermark /> : null}

      <div className="relative flex items-center gap-3">
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

      {/* The Company paragraph is short. It briefly sat in a two-column row
          with the mark rendered beside it as a solid image, which left the
          card mostly empty — a few lines of text and a large logo with a gap
          between them. It reads better as one plain paragraph over the
          watermark, which is where the mark was to begin with. */}
      <p
        className={`relative mt-5 leading-relaxed text-slate-700 ${
          /* pr-24, not pr-44: 11rem of reserved gutter pushed the paragraph so
             far clear of the watermark that the card read as text on one side
             and a mark on the other with a void between them. The mark is at
             7% opacity, so the copy can run much closer to it. */
          featured ? "text-[1.0625rem] sm:pr-24" : "measure text-[0.975rem]"
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
 * Hexagon mark, set into the Company card as a watermark.
 *
 * SIZED DOWN, NOT UP. The earlier watermark looked soft because it was scaled
 * past the source: `omicscraft-mark.png` is 304x248, and blowing a 304px asset
 * up to fill a card edge is what produced the mushy, stretched look. It is now
 * capped below its native width and given explicit intrinsic dimensions, so the
 * aspect ratio is fixed by the file rather than by the layout box.
 */
function CompanyWatermark() {
  return (
    <Image
      src="/brand/omicscraft-mark.png"
      alt=""
      aria-hidden
      width={304}
      height={248}
      className="pointer-events-none absolute -right-6 top-1/2 hidden w-56 max-w-none -translate-y-1/2 opacity-[0.07] sm:block"
    />
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
