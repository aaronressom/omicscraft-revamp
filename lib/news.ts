/**
 * News & announcements.
 *
 * Every entry below is a REAL, dated announcement supplied by OmicsCraft and
 * checked against its own source before publication. Two corrections came out
 * of that check and are noted inline — the supplied publication title contained
 * a typo, and no publication date was supplied.
 *
 * The `placeholder` flag remains in the type. An earlier draft of this page
 * carried six scaffolded entries behind a visible "not for publication" banner;
 * the mechanism is kept so any future draft entry re-arms that banner
 * automatically rather than depending on someone remembering a switch.
 *
 * RULE: do not add an entry here that has not been verified against a primary
 * source. Corporate news — awards, publications, releases — is exactly the
 * category people rely on.
 */

export type NewsCategory =
  | "Publication"
  | "Presentation"
  | "Platform Update"
  | "Grant Award"
  | "Research"
  | "Company";

export type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  /** ISO 8601. See `datePrecision` when the day is not known. */
  date: string;
  /**
   * "month" renders as e.g. "July 2026". Used where only a month was supplied —
   * inventing a specific day on a real announcement is a small fabrication that
   * this page should not make.
   */
  datePrecision?: "day" | "month";
  category: NewsCategory;
  /** External source: the paper, the session page, the application. */
  href?: string;
  featured?: boolean;
  /** Set only on scaffolded drafts; re-arms the "not for publication" banner. */
  placeholder?: boolean;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "embc-2026-dce-mri",
    title:
      "OmicsCraft presents a tumor-centric deep learning framework for survival prediction at IEEE EMBC 2026",
    summary:
      "Sara Hashemi presented “Tumor-Centric Deep Learning Framework for Survival Prediction in Multiphase DCE-MRI” in the Oncologic Imaging and Radiogenomics session at IEEE EMBC 2026 in Toronto, Ontario.",
    date: "2026-07-28",
    category: "Presentation",
    href: "https://cmsworkshops.com/EMBC2026/view_paper.php?PaperNum=3915&SessionID=1029",
  },
  {
    /**
     * Title, date, volume and issue verified against the journal.
     * The title supplied read "...systems metabolomics GOT biomarker
     * discovery"; the published title reads "...FOR biomarker discovery",
     * which is what appears here. No publication date was supplied — the
     * journal gives 15 July 2026.
     */
    slug: "aisysmet-bioinformatics",
    title:
      "aiSysMet published in Bioinformatics: AI-powered systems metabolomics for biomarker discovery",
    summary:
      "The paper describing the aiSysMet platform appears in Bioinformatics, volume 42, issue 7. It sets out the cloud-based approach to LC-MS data processing, metabolite annotation, and multi-omics integration for disease biomarker discovery.",
    date: "2026-07-15",
    category: "Publication",
    href: "https://academic.oup.com/bioinformatics/article/42/7/btag520/8735226",
    featured: true,
  },
  {
    /* Supplied as "July 2026" with no day — hence month precision. */
    slug: "aisysmet-v1-5",
    title: "aiSysMet v1.5 released",
    summary:
      "The latest release of the aiSysMet platform is available, bringing MetCraft, MetaboQuest, ImgCraft and IntSys together in a single cloud workspace for building analysis pipelines.",
    date: "2026-07-01",
    datePrecision: "month",
    category: "Platform Update",
    href: "https://tools.omicscraft.com/aiSysMet/",
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
  Publication: "border-emerald-500/30 bg-emerald-500/10 text-emerald-ink",
  Presentation: "border-navy-700/25 bg-navy-900/[0.06] text-navy-800",
  "Platform Update": "border-cyan-500/30 bg-cyan-500/10 text-cyan-ink",
  "Grant Award": "border-emerald-500/30 bg-emerald-500/10 text-emerald-ink",
  Research: "border-navy-700/25 bg-navy-900/[0.06] text-navy-800",
  Company: "border-slate-300 bg-slate-100 text-slate-700",
};

export function formatNewsDate(
  iso: string,
  precision: "day" | "month" = "day",
): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    ...(precision === "day" ? { day: "numeric" } : null),
    timeZone: "UTC",
  });
}

/** `datetime` attribute: YYYY-MM for month precision, full ISO otherwise. */
export function newsDateTime(item: NewsItem): string {
  return item.datePrecision === "month" ? item.date.slice(0, 7) : item.date;
}
