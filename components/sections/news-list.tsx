import { TriangleAlert } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { NewsBoard } from "@/components/sections/news-board";
import { publicAssetExists } from "@/lib/assets";
import {
  HAS_PLACEHOLDER_NEWS,
  featuredNews,
  sortedNews,
  type NewsItem,
  type ResolvedNewsItem,
} from "@/lib/news";

/**
 * News index — the server half.
 *
 * This file resolves each announcement's link and hands plain data to
 * `NewsBoard`, which renders the cards on the client. The split exists because
 * `publicAssetExists` reads the filesystem: it cannot run in the browser, and
 * the cards have to, since the page also shows announcements saved locally by
 * the in-app editor.
 *
 * Everything that needs the filesystem, or the content files, or a build, lives
 * on this side of the line. Nothing on the other side knows how a link is put
 * together.
 */
export function NewsList() {
  const featured = featuredNews();
  const rest = sortedNews().filter((item) => item.slug !== featured?.slug);

  return (
    <section className="relative isolate overflow-hidden bg-surface-tint pb-20 pt-12 lg:pb-24 lg:pt-14">
      <MolecularBackdrop variant="light" pattern={6} />

      <Container className="relative">
        {HAS_PLACEHOLDER_NEWS ? <PlaceholderNotice /> : null}

        <NewsBoard
          featured={featured ? resolveNewsItem(featured) : null}
          rest={rest.map(resolveNewsItem)}
        />
      </Container>
    </section>
  );
}

/**
 * Work out the link a card should carry.
 *
 * TWO RULES LIVE HERE, both of which need the server:
 *
 * 1. A self-hosted target that has not been added to `public/` yet falls back
 *    to its remote equivalent, so the link is never a 404 while the file is
 *    outstanding. That check is `publicAssetExists`, i.e. `node:fs`.
 * 2. `download` only works same-origin — a browser ignores it on a
 *    cross-origin URL — so it is set solely when the PDF is genuinely ours,
 *    and the label is chosen to match what will actually happen.
 */
function resolveNewsItem(item: NewsItem): ResolvedNewsItem {
  const base: ResolvedNewsItem = {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    date: item.date,
    datePrecision: item.datePrecision,
    category: item.category,
    featured: item.featured,
    siteHref: item.siteHref,
    link: null,
  };

  if (!item.href) return base;

  const isLocal = item.href.startsWith("/");
  const href =
    isLocal && !publicAssetExists(item.href)
      ? (item.hrefFallback ?? item.href)
      : item.href;
  const servesLocalPdf = href.startsWith("/") && href.endsWith(".pdf");

  const label =
    item.category === "Publication"
      ? servesLocalPdf
        ? "Download the paper (PDF)"
        : "Read the paper"
      : item.category === "Presentation"
        ? "View the session"
        : "Open aiSysMet";

  return {
    ...base,
    link: {
      href,
      label,
      ...(servesLocalPdf
        ? { download: "aiSysMet-Bioinformatics-2026.pdf" }
        : {}),
    },
  };
}

/**
 * Visible while placeholder entries remain in `lib/news.ts`. Deliberately not
 * subtle: an unmarked page of fabricated announcements would be misleading, so
 * this has to be impossible to miss during review.
 *
 * Not to be confused with the "Saved on this device" badge on editor drafts —
 * that one is about where a card lives, this one about whether it is real.
 */
function PlaceholderNotice() {
  return (
    <div
      role="note"
      className="mb-12 flex items-start gap-3.5 rounded-2xl border border-amber-500/35 bg-amber-50 p-5"
    >
      <TriangleAlert
        className="mt-0.5 size-5 shrink-0 text-amber-600"
        aria-hidden
      />
      <div>
        <p className="font-display text-sm font-bold text-navy-900">
          Sample content — not for publication
        </p>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-700">
          These entries are scaffolded from projects already published on this
          site, with placeholder dates and summaries. No real announcement,
          award date, publication or figure is represented here. Replace them in{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.8rem] text-navy-900">
            lib/news.ts
          </code>{" "}
          before launch; this notice disappears once no entry is marked as a
          placeholder.
        </p>
      </div>
    </div>
  );
}
