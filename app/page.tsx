import { HeroCarousel } from "@/components/sections/hero-carousel";
import { MottoBand } from "@/components/sections/motto-band";

/**
 * Landing page.
 *
 * Deliberately minimal at the client's direction: the platform strip and the
 * services grid were removed from here, so the top nav is the only route into
 * those pages. The SBIR funding band went the same way — it now opens
 * /projects, which is where the awards it counts are actually listed.
 *
 * The hero is a seven-slide carousel — slide one is the site's own headline and
 * CTAs, slides two to seven are the client's photographic slides. See
 * `hero-carousel.tsx`, particularly the contrast note.
 */
export default function Home() {
  return (
    <main id="main">
      <HeroCarousel />
      <MottoBand />
    </main>
  );
}
