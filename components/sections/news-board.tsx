"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { useAuth } from "@/components/admin/use-auth";
import {
  SOCIAL_LABELS,
  SOCIAL_MARKS,
} from "@/components/visuals/social-marks";
import { SITE } from "@/lib/content";
import {
  CATEGORY_STYLES,
  formatNewsDate,
  newsDateTime,
  type ResolvedNewsItem,
} from "@/lib/news";
import {
  getNewsDraftsServerSnapshot,
  getNewsDraftsSnapshot,
  safeHref,
  subscribeToNewsDrafts,
  writeNewsDrafts,
  type NewsDraft,
} from "@/lib/news-drafts";
import { cn } from "@/lib/utils";

/**
 * The editor tile, loaded only when someone is actually signed in.
 *
 * WHY THIS IS DYNAMIC. `add-news-dialog.tsx` pulls in react-hook-form, zod and
 * @hookform/resolvers — a substantial dependency stack. Imported statically it
 * landed in the /news bundle for EVERY visitor, even though the tile it powers
 * renders for one person. Behind `next/dynamic` it is a separate chunk that is
 * requested only when `canEdit` first turns true.
 *
 * `ssr: false` because the tile can never appear in server-rendered markup
 * anyway: whether anyone is signed in is read from sessionStorage, which the
 * server cannot see (see components/admin/use-auth.ts).
 *
 * No `loading` fallback on purpose. A skeleton card would appear in the grid
 * before the real tile and reflow it — the same jump the AddNewsCard's fixed
 * min-height exists to prevent. The chunk is small and local; the tile simply
 * appears.
 */
const AddNewsCard = dynamic(
  () => import("@/components/admin/add-news-dialog").then((m) => m.AddNewsCard),
  { ssr: false },
);

/**
 * The News page's cards.
 *
 * A client component, which the published announcements alone would not need —
 * it is here because the page also shows announcements saved in this browser
 * by the in-app editor, and because the editor's tile only appears for signed-in
 * users. Both are things the server cannot know.
 *
 * The published items arrive already resolved (see `news-list.tsx`): their
 * links have been worked out server-side, where the filesystem is readable.
 * This file does not know how a published link is built and should not learn.
 *
 * DRAFTS ARE MARKED, ALWAYS. Anything saved locally carries a visible badge —
 * see the note at the top of lib/news-drafts.ts for why that is not optional.
 */
export function NewsBoard({
  featured,
  rest,
}: {
  featured: ResolvedNewsItem | null;
  rest: ResolvedNewsItem[];
}) {
  const { user } = useAuth();
  const [storageFailed, setStorageFailed] = useState(false);

  // The drafts live in localStorage, which the server cannot see. This hook
  // renders the empty server snapshot through hydration and then swaps in the
  // real list, so the markup always matches — see the note in lib/news-drafts.
  const drafts = useSyncExternalStore(
    subscribeToNewsDrafts,
    getNewsDraftsSnapshot,
    getNewsDraftsServerSnapshot,
  );

  // No local copy in React state: the store is the single source of truth, so
  // a failed write cannot leave the screen showing a card that was never
  // saved. If the write fails the list is unchanged and the notice below says
  // so, rather than the card quietly vanishing on the next reload.
  function update(next: NewsDraft[]) {
    setStorageFailed(!writeNewsDrafts(next));
  }

  const socials = Object.entries(SITE.social).filter(
    ([, href]) => typeof href === "string" && href.length > 0,
  ) as [string, string][];

  // Drafts sit in date order among the published items rather than in a
  // separate tray, because the point is to see how the card will look in
  // context. The badge is what keeps the two apart.
  const cards = [...rest, ...drafts.map(draftToItem)].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const canEdit = Boolean(user);

  return (
    <>
      {featured ? <FeaturedCard item={featured} /> : null}

      {storageFailed ? (
        <p
          role="alert"
          className="mt-8 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            This browser would not save the announcement — its storage is full
            or turned off. Nothing was lost from the page, but the change will
            not survive a reload.
          </span>
        </p>
      ) : null}

      <h2 className="type-h3 mt-16 text-navy-900">More announcements</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* First tile, not last: it is the reason a signed-in user came to
            this page, and hunting for it at the end of a grid is the kind of
            thing that makes someone give up and email the web team instead. */}
        {canEdit ? (
          <li>
            <AddNewsCard
              onCreate={(draft) => update([draft, ...drafts])}
            />
          </li>
        ) : null}

        {cards.map((item) => (
          <li key={item.slug}>
            <NewsCard
              item={item}
              onRemove={
                canEdit && item.isDraft
                  ? () => update(drafts.filter((d) => d.id !== item.slug))
                  : undefined
              }
            />
          </li>
        ))}

        {/* Sits as the last tile in the same grid rather than as a banner
            below it: this page is a short list of occasional announcements,
            and "the next one lands here" belongs at the end of that list, in
            the same shape as the cards it follows. */}
        {socials.length > 0 ? (
          <li>
            <FollowCard links={socials} />
          </li>
        ) : null}
      </ul>
    </>
  );
}

/** A locally-saved draft, in the same shape the cards render. */
function draftToItem(draft: NewsDraft): ResolvedNewsItem {
  // safeHref again, not just in the form's schema: this value came back out of
  // localStorage, which anyone can edit by hand, so the render path validates
  // it independently. A rejected link renders as no link at all.
  const href = safeHref(draft.linkHref);
  return {
    slug: draft.id,
    title: draft.title,
    summary: draft.summary,
    date: draft.date,
    category: draft.category,
    link: href ? { href, label: draft.linkText } : null,
    isDraft: true,
  };
}

function FeaturedCard({ item }: { item: ResolvedNewsItem }) {
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

function NewsCard({
  item,
  onRemove,
}: {
  item: ResolvedNewsItem;
  /** Provided only for locally-saved drafts, and only when signed in. */
  onRemove?: () => void;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/35 hover:shadow-lg hover:shadow-navy-950/[0.06]",
        // A draft is visibly a draft at a glance, before anyone reads the
        // badge.
        item.isDraft ? "border-dashed border-amber-500/50" : "border-slate-200",
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <CategoryTag item={item} />
        {item.isDraft ? <DraftBadge /> : null}
      </div>

      <h3 className="font-display mt-4 text-base font-semibold leading-snug tracking-tight text-navy-900">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 text-[0.925rem] leading-relaxed text-slate-600">
        {item.summary}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <DateLine item={item} />
        <div className="flex items-center gap-3">
          <SourceLink item={item} compact />
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-1 text-[0.8rem] font-semibold text-slate-500 transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove
              <span className="sr-only"> {item.title}</span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * The one thing standing between this feature and someone believing they have
 * published a press release. See lib/news-drafts.ts.
 */
function DraftBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-amber-700">
      Saved on this device
    </span>
  );
}

/**
 * "Follow OmicsCraft" tile, closing the announcements grid.
 *
 * Not one anchor wrapping the card: there are three destinations, and nesting
 * three links inside a fourth is invalid markup that would swallow their
 * clicks. Navy-900 on this tint measures ~13:1.
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
 * `target="_blank"` with `rel="noopener noreferrer"` on every one, including
 * links typed into the editor: `noopener` stops the opened page reaching back
 * through `window.opener`, and it is not something a person filling in a form
 * should have to know about. The exception is a same-origin PDF, which
 * downloads instead — `download` is ignored cross-origin, so it is only ever
 * set when the file is actually ours, and the label says which will happen.
 */
function SourceLink({
  item,
  compact = false,
  className,
}: {
  item: ResolvedNewsItem;
  compact?: boolean;
  className?: string;
}) {
  if (!item.link) return null;
  const { href, label, download } = item.link;

  return (
    <a
      href={href}
      {...(download
        ? { download }
        : { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group/src inline-flex min-h-9 items-center gap-1.5 rounded-lg font-semibold text-cyan-ink hover:underline",
        compact ? "text-[0.8rem]" : "text-sm",
        className,
      )}
    >
      {label}
      {download ? (
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
        {download ? " (downloads a PDF)" : " (opens in new tab)"}
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

function CategoryTag({ item }: { item: ResolvedNewsItem }) {
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

function DateLine({ item }: { item: ResolvedNewsItem }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-slate-500">
      <CalendarDays className="size-3.5" aria-hidden />
      <time dateTime={newsDateTime(item)}>
        {formatNewsDate(item.date, item.datePrecision)}
      </time>
    </span>
  );
}
