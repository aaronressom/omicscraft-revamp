import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { AboutBlocks } from "@/components/sections/about-blocks";
import { TeamGrid } from "@/components/sections/team-grid";
import { ABOUT, HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT.company.body,
};

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={HEADINGS.about.eyebrow}
        title={HEADINGS.about.title}
        description={HEADINGS.about.description}
      />
      <AboutBlocks />
      <TeamGrid />
    </main>
  );
}
