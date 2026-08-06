import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ProjectsList } from "@/components/sections/projects-list";
import { TrustBand } from "@/components/sections/trust-band";
import { HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: HEADINGS.projects.description,
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <PageHero
        pattern={2}
        eyebrow={HEADINGS.projects.eyebrow}
        title={HEADINGS.projects.title}
        description={HEADINGS.projects.description}
      />
      {/* Moved here from the landing page at the client's request. It belongs
          on this page more than it did there: the awards it counts — two Phase
          II, four Phase I — are the six projects listed directly below it, and
          the NIH/NSF logos are the funders of those projects. */}
      <TrustBand />
      {/* FCOI policy now renders inside ProjectsList, at the foot of the same
          column — see fcoi-policy.tsx. */}
      <ProjectsList />
    </main>
  );
}
