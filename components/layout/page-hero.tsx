import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { GlowBackdrop } from "@/components/visuals/glow-backdrop";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";

/**
 * Dark page header for inner routes.
 *
 * Every page must open with a dark band. The sticky header is transparent at
 * scroll position 0 and renders its nav in white - if a page began on a light
 * background, the navigation would be invisible until the user scrolled.
 */
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | null;
  /** Optional — omit it and the eyebrow becomes the page's h1. */
  title?: string | null;
  description?: string | null;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950">
      <GlowBackdrop intensity="subtle" grid={false} />
      <MolecularBackdrop />
      {/* Padding tracks how much content the band actually holds. Without a
          display title it would otherwise be mostly empty space — and with
          neither title nor description it is a bare eyebrow, so it tightens
          again. */}
      <Container
        className={
          title
            ? "relative pb-16 pt-36 lg:pb-20 lg:pt-44"
            : description
              ? "relative pb-12 pt-32 lg:pb-14 lg:pt-36"
              : "relative pb-9 pt-30 lg:pb-10 lg:pt-32"
        }
      >
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
          onDark
        />
      </Container>
    </section>
  );
}
