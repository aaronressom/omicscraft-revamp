/**
 * News & announcements.
 *
 * ⚠️  EVERY ENTRY BELOW IS A PLACEHOLDER (`placeholder: true`).
 *
 * No real OmicsCraft announcement, press release, publication or award date
 * was available when this page was built. Rather than invent announcements for
 * a real company — fabricated corporate news is materially misleading, and a
 * grant award notice is exactly the kind of thing people rely on — these entries
 * are scaffolded from facts already published on omicscraft.com (the six SBIR
 * projects and the four-tool aiSysMet suite) with **placeholder dates and
 * summaries**.
 *
 * Nothing here states a dollar amount, a grant number, a journal, a quote, or a
 * partner name, because none of those were verifiable.
 *
 * While any entry has `placeholder: true`, the /news page renders a visible
 * notice at the top. Replacing the entries with real items removes that notice
 * automatically — there is no separate flag to remember to switch off.
 *
 * TO PUBLISH: replace each entry with a real announcement, set a real `date`,
 * and delete `placeholder: true`.
 */

export type NewsCategory =
  | "Grant Award"
  | "Platform Update"
  | "Research"
  | "Company";

export type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  /** ISO 8601. Placeholder entries carry approximate, unverified dates. */
  date: string;
  category: NewsCategory;
  featured?: boolean;
  /** Remove once the entry describes a real, dated announcement. */
  placeholder?: boolean;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "aisysmet-phase-ii",
    title:
      "aiSysMet advances to Phase II SBIR for integrative analysis of multimodal data",
    summary:
      "Phase II support continues development of the AI-powered, cloud-based platform for integrative analysis of imaging and multi-omics data from TCGA, CPTAC and TCIA via the Cancer Research Data Commons.",
    date: "2026-05-14",
    category: "Grant Award",
    featured: true,
    placeholder: true,
  },
  {
    slug: "metaboquest-phase-ii",
    title: "MetaboQuest receives Phase II SBIR support for metabolite annotation",
    summary:
      "The suite addresses the central bottleneck in metabolomics — metabolite identification — by combining compound databases, pathways, biochemical networks and mass spectral libraries.",
    date: "2026-03-02",
    category: "Grant Award",
    placeholder: true,
  },
  {
    slug: "aisysmet-four-tools",
    title: "aiSysMet brings MetCraft, MetaboQuest, ImgCraft and IntSys into one suite",
    summary:
      "Four integrated tools now span raw data processing, metabolite annotation, medical image analysis, and cross-omics biomarker selection within a single cloud platform.",
    date: "2026-01-21",
    category: "Platform Update",
    placeholder: true,
  },
  {
    slug: "imgcraft-imaging-pipeline",
    title: "ImgCraft extends the platform to whole slide, CT and MR imaging",
    summary:
      "Image segmentation, feature extraction and quantitative analysis bring medical imaging into the same workflow as multi-omics measurements.",
    date: "2025-11-06",
    category: "Platform Update",
    placeholder: true,
  },
  {
    slug: "intsys-generative-ai",
    title: "IntSys applies statistical, machine learning and generative AI methods",
    summary:
      "Integrative analysis across multi-omics and imaging data supports biomarker selection using a combination of classical statistics and modern model families.",
    date: "2025-09-18",
    category: "Research",
    placeholder: true,
  },
  {
    slug: "sbir-portfolio",
    title: "Six federally funded SBIR projects supported by NIH and NSF",
    summary:
      "Two Phase II and four Phase I awards span systems metabolomics, metabolite identification, and integrative analysis of multi-omics and imaging data.",
    date: "2025-07-30",
    category: "Company",
    placeholder: true,
  },
];

/** True while any entry is still scaffolded rather than a real announcement. */
export const HAS_PLACEHOLDER_NEWS = NEWS_ITEMS.some((item) => item.placeholder);

/** Newest first. */
export function sortedNews(): NewsItem[] {
  return [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));
}

export function featuredNews(): NewsItem | undefined {
  const sorted = sortedNews();
  return sorted.find((item) => item.featured) ?? sorted[0];
}

export const CATEGORY_STYLES: Record<NewsCategory, string> = {
  "Grant Award":
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-ink",
  "Platform Update": "border-cyan-500/30 bg-cyan-500/10 text-cyan-ink",
  Research: "border-navy-700/25 bg-navy-900/[0.06] text-navy-800",
  Company: "border-slate-300 bg-slate-100 text-slate-700",
};

export function formatNewsDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
