import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  TriangleAlert,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import {
  SOCIAL_LABELS,
  SOCIAL_MARKS,
} from "@/components/visuals/social-marks";
import { publicAssetExists } from "@/lib/assets";
import { SITE } from "@/lib/content";
import {
  CATEGORY_STYLES,
  HAS_PLACEHOLDER_NEWS,
  featuredNews,
  formatNewsDate,
  newsDateTime,
  sortedNews,
  type NewsItem,
} from "@/lib/news";
import { cn } from "@/lib/utils";

/**
 * News index: featured item, then the announcements grid.
 *
 * Entries currently in `lib/news.ts` are scaffolded placeholders, so this
 * renders a visible notice while any remain. See the header of that file.
 */
export function NewsList() {
  const featured = featuredNews();
  const rest = sortedNews().filter((item) => item.slug !== featured?.slug);
  // Same filter the footer applies, so the two never disagree about which
  // accounts exist. Key order in SITE.social is render order.
  const socialLinks = Object.entries(SITE.social).filter(
    ([, href]) => typeof href === "string" && href.length > 0,
  ) as [string, string][];

  return (
    <section className="relative isolate overflow-hidden bg-surface-tint pb-20 pt-12 lg:pb-24 lg:pt-14">
      <MolecularBackdrop variant="light" pattern={6} />

      <Container className="relative">
        {HAS_PLACEHOLDER_NEWS ? <PlaceholderNotice /> : null}

        {featured ? <FeaturedCard item={featured} /> : null}

        {rest.length > 0 ? (
          <>
            {/* "More announcements": the page's h1 is already "Announcements",
                so repeating it verbatim here read as a duplicate heading. */}
            <h2 className="type-h3 mt-16 text-navy-900">More announcements</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((item) => (
                <li key={item.slug}>
                  <NewsCard item={item} />
                </li>
              ))}

              {/* Sits as the last tile in the same grid rather than as a banner
                  below it: this page is a short list of occasional
                  announcements, and "the next one lands here" belongs at the
                  end of that list, in the same shape as the cards it follows.
                  Renders only while at least one account is set — an empty
                  "follow us" card is worse than none. */}
              {socialLinks.length > 0 ? (
                <li>
                  <FollowCard links={socialLinks} />
                </li>
              ) : null}
            </ul>
          </>
        ) : null}
      </Container>
    </section>
  );
}

/**
 * Visible while placeholder entries remain. Deliberately not subtle: an
 * unmarked page of fabricated grant announcements would be misleading, so this
 * has to be impossible to miss during review.
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

function FeaturedCard({ item }: { item: NewsItem }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-cyan-500/35 hover:shadow-xl hover:shadow-navy-950/[0.06]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-500"
      />

      <div className="grid gap-8 p-7 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center lg:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryTag item={item} />
            <DateLine item={item} />
            {/* The emoji is decorative and aria-hidden — a screen reader
                announcing "pushpin" before the word "Pinned" is noise, and
                emoji names vary between platforms. */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-amber-700">
              <span aria-hidden>📌</span>
              Pinned
            </span>
          </div>

          <h2 className="type-h3 mt-5 text-navy-900">{item.title}</h2>
          {/* No `measure`. It caps the line at 65ch, which on the featured card
              stopped the summary a third of the way short of the date panel and
              left a column of dead white between them. The grid gap is what
              keeps the two apart. */}
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-700">
            {item.summary}
          </p>

          <SourceLink item={item} className="mt-6" />
        </div>

        {/* Index card. The year/month block stays decorative, but the link is
            deliberately OUTSIDE the aria-hidden subtree — a focusable anchor
            inside hidden content is reachable by keyboard yet invisible to
            screen readers. */}
        <div className="hidden rounded-2xl border border-slate-200 bg-surface p-6 lg:block">
          <div aria-hidden>
            <span className="block font-display text-5xl font-bold tracking-tight text-navy-900">
              {new Date(`${item.date}T00:00:00Z`).getUTCFullYear()}
            </span>
            <span className="mt-2 block text-sm text-slate-500">
              {new Date(`${item.date}T00:00:00Z`).toLocaleDateString("en-US", {
                month: "long",
                timeZone: "UTC",
              })}
            </span>
          </div>

          {item.siteHref ? (
            <a
              href={item.siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/site mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg text-sm font-semibold text-cyan-ink hover:underline"
            >
              View on {publisherName(item.siteHref)}
              <ArrowRight
                className="size-4 transition-transform group-hover/site:translate-x-0.5"
                aria-hidden
              />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/35 hover:shadow-lg hover:shadow-navy-950/[0.06]">
      <div className="flex flex-wrap items-center gap-2.5">
        <CategoryTag item={item} />
      </div>

      <h3 className="font-display mt-4 text-base font-semibold leading-snug tracking-tight text-navy-900">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 text-[0.925rem] leading-relaxed text-slate-600">
        {item.summary}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <DateLine item={item} />
        <SourceLink item={item} compact />
      </div>
    </article>
  );
}

/**
 * "Follow OmicsCraft" tile, closing the announcements grid.
 *
 * It was a single LinkedIn card on a navy panel. Now that there are three
 * accounts it is one card carrying all three, on the pale cyan the client
 * asked for — the tile stops being the inverse of a news card and becomes the
 * one coloured thing on a page of white ones, which is a better way to mark it
 * as an action rather than another dated announcement.
 *
 * NOT ONE ANCHOR ANY MORE. The old tile was a single link wrapping the whole
 * card, which is the right shape when there is one destination and the wrong
 * one when there are three — nesting three anchors inside a fourth is invalid,
 * and the outer one would swallow their clicks. The card is a plain container
 * and each network is its own button-sized link.
 *
 * CONTRAST. Navy-900 text on cyan-500/12 over white measures ~13:1, and the
 * cyan-ink labels under the icons ~5.5:1 — both past AA at these sizes. Do not
 * deepen the tint without re-checking the labels; this palette's cyan goes
 * illegible against navy type quickly.
 */
function FollowCard({ links }: { links: [string, string][] }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.12] p-6">
      <div>
        <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-navy-900">
          Follow OmicsCraft
        </h3>
        <p className="mt-2 text-[0.925rem] leading-relaxed text-slate-700">
          Papers, presentations and platform releases land here first.
        </p>
      </div>

      <ul className="mt-5 flex items-center gap-2.5 border-t border-cyan-ink/15 pt-4">
        {links.map(([network, href]) => {
          const Mark = SOCIAL_MARKS[network];
          const label = SOCIAL_LABELS[network] ?? network;
          return (
            <li key={network}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                /* 44px target, and the white tile is what separates the marks
                   from the tinted card behind them. */
                className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-cyan-ink ring-1 ring-cyan-ink/15 transition-all hover:-translate-y-0.5 hover:text-navy-900 hover:ring-cyan-ink/40"
              >
                {Mark ? (
                  <Mark className="size-4.5" />
                ) : (
                  <span className="text-sm font-semibold capitalize">
                    {network.slice(0, 2)}
                  </span>
                )}
                <span className="sr-only">
                  {SITE.name} on {label} (opens in new tab)
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * External source for an announcement — the paper, the session page, the app.
 *
 * Always an anchor with a visible affordance and an sr-only "(opens in new
 * tab)", matching `ButtonLink`. Renders nothing when an entry has no source.
 */
function SourceLink({
  item,
  compact = false,
  className,
}: {
  item: NewsItem;
  compact?: boolean;
  className?: string;
}) {
  if (!item.href) return null;

  // A self-hosted target that has not been added yet falls back to its remote
  // equivalent, so the link is never a 404 while the file is outstanding.
  const isLocal = item.href.startsWith("/");
  const href =
    isLocal && !publicAssetExists(item.href)
      ? (item.hrefFallback ?? item.href)
      : item.href;
  // `download` only works same-origin — a browser ignores it on a cross-origin
  // URL. So it is applied solely when the self-hosted PDF is actually present,
  // and the label matches what will really happen.
  const servesLocalPdf = href.startsWith("/") && href.endsWith(".pdf");

  const label =
    item.category === "Publication"
      ? servesLocalPdf
        ? "Download the paper (PDF)"
        : "Read the paper"
      : item.category === "Presentation"
        ? "View the session"
        : "Open aiSysMet";

  return (
    <a
      href={href}
      {...(servesLocalPdf
        ? { download: "aiSysMet-Bioinformatics-2026.pdf" }
        : { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group/src inline-flex min-h-9 items-center gap-1.5 rounded-lg font-semibold text-cyan-ink hover:underline",
        compact ? "text-[0.8rem]" : "text-sm",
        className,
      )}
    >
      {label}
      {servesLocalPdf ? (
        <Download
          className="size-4 transition-transform group-hover/src:translate-y-0.5"
          aria-hidden
        />
      ) : (
        <ArrowUpRight
          className="size-4 transition-transform group-hover/src:-translate-y-0.5 group-hover/src:translate-x-0.5"
          aria-hidden
        />
      )}
      {/* The announcement must match the behaviour: one downloads a file, the
          other opens a tab. */}
      <span className="sr-only">
        {servesLocalPdf ? " (downloads a PDF)" : " (opens in new tab)"}
      </span>
    </a>
  );
}

/** Names the destination so the link says where it goes, not just "Latest". */
function publisherName(href: string): string {
  if (href.includes("academic.oup.com")) return "Bioinformatics";
  if (href.includes("cmsworkshops.com")) return "EMBC";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "publisher site";
  }
}

function CategoryTag({ item }: { item: NewsItem }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider",
        CATEGORY_STYLES[item.category],
      )}
    >
      {item.category}
    </span>
  );
}

function DateLine({ item }: { item: NewsItem }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-slate-500">
      <CalendarDays className="size-3.5" aria-hidden />
      <time dateTime={newsDateTime(item)}>
        {formatNewsDate(item.date, item.datePrecision)}
      </time>
    </span>
  );
}
