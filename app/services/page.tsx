import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: HEADINGS.services.description,
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={HEADINGS.services.eyebrow}
        title={HEADINGS.services.title}
        description={HEADINGS.services.description}
      />
      <ServicesGrid withHeading={false} />
    </main>
  );
}
