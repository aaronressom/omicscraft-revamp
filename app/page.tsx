import { Hero } from "@/components/sections/hero";
import { MottoBand } from "@/components/sections/motto-band";
import { TrustBand } from "@/components/sections/trust-band";

/**
 * Landing page.
 *
 * Deliberately minimal at the client's direction: the platform strip and the
 * services grid were removed from here, so the top nav is the only route into
 * those pages.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <MottoBand />
      <TrustBand />
    </main>
  );
}
