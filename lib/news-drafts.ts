import { z } from "zod";

import type { NewsCategory } from "@/lib/news";

/**
 * Announcements added through the in-app editor.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THESE ARE SAVED IN ONE BROWSER. THEY ARE NOT PUBLISHED.
 * ─────────────────────────────────────────────────────────────────────────────
 * The site is statically generated: every page is built ahead of time from
 * `lib/news.ts` and served as flat files. There is no database and no writable
 * store behind it, so a form in the browser has nowhere to send an
 * announcement. This module puts it in `localStorage` instead, which means:
 *
 *   - it survives a refresh and a restart, on THAT computer, in THAT browser;
 *   - nobody else sees it — not a colleague, not a visitor, not Google;
 *   - clearing browsing data deletes it.
 *
 * Every card created this way is therefore badged "Saved on this device" where
 * it renders. That badge is not decoration; it is the only thing standing
 * between this feature and someone believing they have published a press
 * release. Do not remove it while the storage is local.
 *
 * TO ACTUALLY PUBLISH, one of two things has to happen: the entry is added to
 * `lib/news.ts` and the site redeployed, or the site gains a real content
 * store. See the recommendation in the handover notes.
 */

export const NEWS_DRAFTS_KEY = "omicscraft:news-drafts:v1";

/** The three the client asked for — a subset of NewsCategory. */
export const DRAFT_CATEGORIES = [
  "Publication",
  "Presentation",
  "Platform Update",
] as const satisfies readonly NewsCategory[];

/**
 * URL RULE — SECURITY, NOT VALIDATION FUSS.
 *
 * This value is written straight into an anchor's `href`. Zod's `.url()` alone
 * is not enough: it accepts anything the URL constructor accepts, and that
 * includes `javascript:alert(1)`, which would execute on click. Only http and
 * https get through, here at the door and again at render time in
 * `safeHref` — the stored copy can be edited by hand in devtools, so the
 * render path cannot trust that this check ever ran.
 */
const httpUrl = z
  .string()
  .trim()
  .min(1, "Add the link this card should open.")
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "Start the link with https:// so it opens as a web address.",
  })
  .refine(
    (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: "That does not look like a complete web address." },
  );

export const newsDraftSchema = z.object({
  category: z.enum(DRAFT_CATEGORIES),
  title: z
    .string()
    .trim()
    .min(4, "Give the announcement a heading.")
    .max(160, "Headings work best under 160 characters."),
  summary: z
    .string()
    .trim()
    .min(10, "Add a sentence describing the announcement.")
    .max(600, "Keep the description under 600 characters."),
  /** `<input type="date">` always hands back YYYY-MM-DD. */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  linkHref: httpUrl,
  linkText: z
    .string()
    .trim()
    .min(2, "Name the link, e.g. “Read the paper”.")
    .max(40, "Keep the link text short."),
});

export type NewsDraftInput = z.infer<typeof newsDraftSchema>;

export type NewsDraft = NewsDraftInput & {
  id: string;
  /** When it was added, for ordering two drafts saved on the same day. */
  createdAt: string;
};

/**
 * Only http(s) reaches an `href`. Anything else renders as no link at all
 * rather than as a live `javascript:` URL. See the note on `httpUrl` above.
 */
export function safeHref(value: string): string | null {
  return /^https?:\/\//i.test(value.trim()) ? value.trim() : null;
}

/* -------------------------------------------------------------------------- */
/* The store                                                                   */
/*                                                                             */
/* Read through useSyncExternalStore (see news-board.tsx), which is what keeps  */
/* a value the server cannot see from causing a hydration mismatch. That hook   */
/* imposes one hard rule: getSnapshot MUST return the same object identity      */
/* until the data actually changes, or React re-renders forever. Hence the      */
/* cache below — the parsed array is rebuilt only when the raw string differs.  */
/* -------------------------------------------------------------------------- */

const DRAFTS_EVENT = "omicscraft:news-drafts-change";

/** Shared empty array, so "no drafts" is also a stable identity. */
const NO_DRAFTS: NewsDraft[] = [];

let cachedRaw: string | null = null;
let cachedDrafts: NewsDraft[] = NO_DRAFTS;

/**
 * Parse the stored list, discarding anything that no longer matches the
 * schema.
 *
 * Storage is not a trusted input: it can hold a draft written by an older
 * version of this form, or something someone typed into devtools. Anything
 * that fails validation is dropped rather than rendered, so a malformed entry
 * costs one card instead of breaking the page.
 */
function parseDrafts(raw: string | null): NewsDraft[] {
  if (!raw) return NO_DRAFTS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return NO_DRAFTS;

    const valid = parsed.flatMap((entry) => {
      const result = newsDraftSchema.safeParse(entry);
      if (!result.success) return [];
      const { id, createdAt } = entry as Partial<NewsDraft>;
      if (typeof id !== "string" || typeof createdAt !== "string") return [];
      return [{ ...result.data, id, createdAt }];
    });
    return valid.length > 0 ? valid : NO_DRAFTS;
  } catch {
    return NO_DRAFTS;
  }
}

export function subscribeToNewsDrafts(onChange: () => void): () => void {
  // `storage` fires in OTHER tabs, so a second window showing the News page
  // picks up an addition without a reload; the custom event covers this one.
  window.addEventListener(DRAFTS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DRAFTS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getNewsDraftsSnapshot(): NewsDraft[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(NEWS_DRAFTS_KEY);
  } catch {
    return NO_DRAFTS;
  }
  if (raw === cachedRaw) return cachedDrafts;
  cachedRaw = raw;
  cachedDrafts = parseDrafts(raw);
  return cachedDrafts;
}

/** The server has no storage, and neither does the first hydration render. */
export function getNewsDraftsServerSnapshot(): NewsDraft[] {
  return NO_DRAFTS;
}

/**
 * Overwrite the stored list and notify every subscriber.
 *
 * Returns false if the browser refused the write — quota exceeded, or storage
 * disabled entirely. The caller has to surface that: silently dropping
 * somebody's typed-out announcement is the one failure this feature cannot
 * afford.
 */
export function writeNewsDrafts(drafts: NewsDraft[]): boolean {
  try {
    window.localStorage.setItem(NEWS_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(DRAFTS_EVENT));
  return true;
}

export function newDraftId(): string {
  // crypto.randomUUID is available in every browser this site supports; the
  // fallback covers insecure-origin dev servers, where it is not exposed.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
