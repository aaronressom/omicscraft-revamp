import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ProjectsList } from "@/components/sections/projects-list";
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
      {/* FCOI policy now renders inside ProjectsList, at the foot of the same
          column — see fcoi-policy.tsx. */}
      <ProjectsList />
    </main>
  );
}
