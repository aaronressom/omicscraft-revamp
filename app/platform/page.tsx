import type { Metadata } from "next";

import {
  PlatformShowcase,
  type ProductWithAsset,
} from "@/components/sections/platform-showcase";
import { PLATFORM, PRODUCTS } from "@/lib/content";
import { publicAssetExists } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Platform",
  description: PLATFORM.blurb,
};

export default function PlatformPage() {
  // Logo availability is resolved on the server so a not-yet-supplied asset
  // renders a wordmark instead of requesting a missing file.
  const products: ProductWithAsset[] = PRODUCTS.map((product) => ({
    ...product,
    logoAvailable: publicAssetExists(product.logo),
  }));

  return (
    <main id="main">
      <PlatformShowcase
        products={products}
        platformLogoAvailable={publicAssetExists(PLATFORM.logo)}
      />
    </main>
  );
}
