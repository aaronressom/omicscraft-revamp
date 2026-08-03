import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ProjectsList } from "@/components/sections/projects-list";
import { FcoiPolicy } from "@/components/sections/fcoi-policy";
import { HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: HEADINGS.projects.description,
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={HEADINGS.projects.eyebrow}
        title={HEADINGS.projects.title}
        description={HEADINGS.projects.description}
      />
      <ProjectsList />
      <FcoiPolicy />
    </main>
  );
}
