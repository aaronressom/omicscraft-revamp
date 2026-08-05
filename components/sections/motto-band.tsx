import Image from "next/image";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { MOTTO } from "@/lib/content";
import { publicAssetExists } from "@/lib/assets";

/**
 * Home motto band.
 *
 * CONTRAST IS THE WHOLE RISK HERE. The original omicscraft.com failed its
 * headline because dark type sat over a mid-tone photograph; this section
 * deliberately reintroduces text-over-photo, so the guard has to be structural
 * rather than a matter of taste:
 *
 *   - a flat navy-950/80 scrim covers the entire image, and
 *   - a second left-weighted gradient darkens the side the text sits on.
 *
 * White on that stack measures well past 4.5:1 regardless of which part of the
 * photo happens to sit behind a given glyph. Do not lighten the scrim without
 * re-measuring.
 *
 * The photograph is decorative: empty alt and aria-hidden, and nothing here
 * claims it depicts OmicsCraft's own facility or staff.
 */
export function MottoBand() {
  const hasPhoto = publicAssetExists(MOTTO.image);

  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950">
      {hasPhoto ? (
        <>
          <Image
            src={MOTTO.image}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-navy-950/80"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/55"
          />
        </>
      ) : (
        /* No photo supplied yet — fall back to the site's own dark treatment
           rather than a broken image. Drops in automatically once the file
           lands at public/img/. */
        <MolecularBackdrop />
      )}

      <Container className="relative py-20 lg:py-24">
        <p className="type-h2 mx-auto max-w-4xl text-balance text-center text-white">
          {MOTTO.headline}
        </p>
      </Container>
    </section>
  );
}
