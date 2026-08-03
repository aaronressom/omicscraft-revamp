import { Hero } from "@/components/sections/hero";
import { TrustBand } from "@/components/sections/trust-band";
import { PlatformStrip } from "@/components/sections/platform-strip";
import { ServicesGrid } from "@/components/sections/services-grid";
import type { ProductWithAsset } from "@/components/sections/platform-showcase";
import { PRODUCTS } from "@/lib/content";
import { publicAssetExists } from "@/lib/assets";

export default function Home() {
  const products: ProductWithAsset[] = PRODUCTS.map((product) => ({
    ...product,
    logoAvailable: publicAssetExists(product.logo),
  }));

  return (
    <main id="main">
      <Hero />
      <TrustBand />
      <PlatformStrip products={products} />
      <ServicesGrid />
    </main>
  );
}
