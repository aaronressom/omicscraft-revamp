import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { NewsList } from "@/components/sections/news-list";
import { HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: HEADINGS.news.description ?? undefined,
};

export default function NewsPage() {
  return (
    <main id="main">
      <PageHero
        pattern={3}
        eyebrow={HEADINGS.news.eyebrow}
        title={HEADINGS.news.title}
        description={HEADINGS.news.description}
      />
      <NewsList />
    </main>
  );
}
