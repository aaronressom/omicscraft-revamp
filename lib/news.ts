/**
 * News & announcements.
 *
 * Every entry below is a REAL, dated announcement supplied by OmicsCraft and
 * checked against its own source before publication. Where the check corrected
 * or filled in what was supplied — no publication date came with the
 * Bioinformatics paper, for instance — it is noted inline on the entry.
 *
 * Headings and summaries are the client's own wording. They were rewritten to
 * their current form on 6 Aug 2026 after the migration drafts ran long; treat
 * them as copy the company owns rather than as text to tighten.
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
  /**
   * Used when `href` points at a self-hosted file that is not present yet.
   * Keeps the link working rather than shipping a 404 while the asset is
   * outstanding. Resolved in `news-list.tsx` via `publicAssetExists`.
   */
  hrefFallback?: string;
  /**
   * Secondary link, where the source and the publisher's landing page differ.
   * For the Bioinformatics paper: `href` is the free PMC full text (opens in
   * the browser, never downloads) and `siteHref` is the journal's own page.
   */
  siteHref?: string;
  featured?: boolean;
  /** Set only on scaffolded drafts; re-arms the "not for publication" banner. */
  placeholder?: boolean;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    /**
     * Heading and summary are the client's own wording, supplied 6 Aug 2026,
     * and replace the longer versions written during migration. The summary is
     * the talk's title verbatim — do not reword it. The date and session link
     * are unchanged and remain the ones verified against the EMBC programme.
     */
    slug: "embc-2026-dce-mri",
    title: "OmicsCraft gave a talk at EMBC 2026 in Toronto, ON",
    summary:
      "Tumor-Centric Deep Learning Framework for Survival Prediction in Multiphase DCE-MRI",
    date: "2026-07-28",
    category: "Presentation",
    href: "https://cmsworkshops.com/EMBC2026/view_paper.php?PaperNum=3915&SessionID=1029",
  },
  {
    /**
     * Heading and summary are the client's own wording, supplied 6 Aug 2026.
     * The summary is the paper's subtitle verbatim — do not reword it. Date,
     * volume and issue remain as verified against the journal: no publication
     * date was ever supplied, and the journal gives 15 July 2026.
     */
    slug: "aisysmet-bioinformatics",
    title: "aiSysMet published in Bioinformatics",
    summary: "AI-powered systems metabolomics for biomarker discovery",
    date: "2026-07-15",
    category: "Publication",
    /**
     * The publisher's own PDF, supplied by the client 6 Aug 2026, and now the
     * single link on this entry.
     *
     * It replaces an arrangement that self-hosted the PDF at
     * `/papers/aisysmet-bioinformatics-2026.pdf` and fell back to the free PMC
     * full text until that file was added — the file never was, so the link
     * had been serving the fallback. Redistribution was permitted (the article
     * is the company's own work, Open Access under CC BY), so self-hosting can
     * be restored by putting the file back at that path and setting `href` and
     * `hrefFallback` again; `news-list.tsx` still supports both.
     *
     * `siteHref` is dropped with it: the client asked for one link, "Read the
     * paper", so the featured card no longer carries a second "View on
     * Bioinformatics" alongside it.
     *
     * NOTE: this URL opens the PDF in a new tab rather than downloading it —
     * `download` is ignored cross-origin, and `news-list.tsx` labels the link
     * accordingly.
     */
    href: "https://academic.oup.com/bioinformatics/article-pdf/42/7/btag520/68969188/btag520.pdf",
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
