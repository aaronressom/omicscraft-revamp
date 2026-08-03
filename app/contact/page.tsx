import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ContactSection } from "@/components/sections/contact-section";
import { HEADINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: HEADINGS.contact.description,
};

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={HEADINGS.contact.eyebrow}
        title={HEADINGS.contact.title}
        description={HEADINGS.contact.description}
      />
      <ContactSection />
    </main>
  );
}
