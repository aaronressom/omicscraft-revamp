# OmicsCraft — website

Marketing site for OmicsCraft LLC. Next.js 16 (App Router), TypeScript,
Tailwind v4, shadcn/ui on Base UI.

## Scope

This repo is the **marketing front door only**. The computational products —
aiSysMet, MetCraft, MetaboQuest, ImgCraft, IntSys — run on AWS and are owned by
a separate team. This site contains no application logic, pipeline code, data
handling, or auth for them; it describes each tool and links out to it.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev                  # http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build + type check |
| `npm run lint` | ESLint |

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for mail | Without it `/api/contact` returns 503 and the form shows an error with a mailto fallback — it never silently drops a message. |
| `CONTACT_TO_EMAIL` | No | Recipient. Defaults to `info@omicscraft.com`. |
| `CONTACT_FROM_EMAIL` | No | Sender; must be on a Resend-verified domain. Defaults to `onboarding@resend.dev` (testing only). |

## Routes

`/` · `/about` · `/platform` · `/services` · `/projects` · `/news` · `/contact`
plus `POST /api/contact`.

Legacy Wix URLs redirect permanently (308): `/aboutus → /about`,
`/research → /projects`, `/tools → /platform`, `/products → /platform`.

Note `/tools` is the real old products page — `/products` 404s on the old site
and is kept only as a safety net.

## Editing content

**All copy lives in [`lib/content.ts`](lib/content.ts).** Nothing is hardcoded
in JSX.

Fields marked `@verbatim` are migrated word-for-word from the previous site and
state the platform's scientific capabilities. **Do not reword, trim, or
summarize them** — only OmicsCraft can change a scientific claim. Headlines,
eyebrows, and section titles carry no claims and are freely editable.

Four spelling corrections were applied during migration and are documented at
the top of the file. One of them — ImgCraft's duplicated "feature extraction",
now reading "quantitative analysis" — was confirmed by the client.

[`lib/fcoi.ts`](lib/fcoi.ts) holds the Financial Conflicts of Interest policy.
It was **extracted programmatically** from the live site rather than retyped,
because PHS regulations require it to remain publicly accessible and accurate.
It renders inside an accordion that uses `hiddenUntilFound`, so the text stays
in the DOM for find-in-page and crawlers even when collapsed.

### Design system rules

- Custom type classes use a **`type-`** prefix (`type-display`, `type-h2`, …).
  Do not rename them to `text-*`: that namespace collides with Tailwind's own
  utilities, and tailwind-merge inside `cn()` will silently drop them.
- Colour pairings are contract-documented at the top of
  [`app/globals.css`](app/globals.css) with measured contrast ratios.
  `cyan-500` is decorative only — use `cyan-ink` for accent text on light
  surfaces (it measures 5.1:1; `cyan-500` measures ~2.5:1 and fails AA).
- Links styled as buttons use [`ButtonLink`](components/ui/button-link.tsx),
  never `<Button render={<Link/>}>` — the latter puts button semantics on an
  anchor.
- Every page must open with a dark band (`PageHero` or `Hero`). The sticky
  header is transparent at scroll 0 and renders white nav text.
- Sections use [`MolecularBackdrop`](components/visuals/molecular-backdrop.tsx)
  — hand-drawn skeletal structures — rather than gradient glow alone. This is
  deliberate: the previous site's chemistry watermarks signalled the domain
  before anyone read a word, and an ambient glow reads as generic SaaS.

### No fabricated data anywhere

The platform tabs render **process schematics**
([`tool-flow.tsx`](components/visuals/tool-flow.tsx)), not mock results. Every
stage name traces to the tool's own verbatim description in `lib/content.ts`.

An earlier version showed mock "readouts" — a fake CLI session, a spectrum with
invented intensities, a fabricated segmentation grid — which needed an
"Illustrative" disclaimer precisely because they implied results that were never
produced. A schematic asserts no outcome, so it needs no disclaimer. **Do not
reintroduce invented figures here.**

### News page

[`lib/news.ts`](lib/news.ts) holds three **real, verified** announcements: the
Bioinformatics paper, the IEEE EMBC 2026 talk, and the aiSysMet v1.5 release.
Each was checked against its primary source before publication, which caught two
things worth keeping in mind:

- the supplied paper title read "…systems metabolomics **got** biomarker
  discovery"; the published title reads "…**for**", which is what ships;
- the release was supplied as "July 2026" with no day, so it uses
  `datePrecision: "month"` and renders as "July 2026". **Do not invent a day** to
  make a date look tidier.

**Rule: no entry goes on this page without a primary source.** The
`placeholder: true` flag remains in the type — set it on any draft entry and
`/news` re-arms a prominent "Sample content — not for publication" banner
automatically.

## Outstanding — needs client input

1. ~~Product logo files~~ — **done.** Recovered from the live site's `/tools`
   page into `public/logos/`. Note `intsys.png` is only 193×121 and will look
   soft if ever displayed large; a higher-resolution original would help.
   The official lockup (`public/brand/omicscraft-logo.png`) came from
   `tools.omicscraft.com`. **It is white-on-transparent — dark backgrounds
   only.** A light-background placement needs a dark-ink version supplied; do
   not recolour it with CSS filters.
2. **Remaining product URLs** → `href` on MetCraft, MetaboQuest, ImgCraft and
   IntSys in `lib/content.ts`. A `null` href renders an inert "Coming soon" tile
   rather than a dead link. `PLATFORM.href` is **done**
   (`tools.omicscraft.com/aiSysMet/`).
3. **NIH SBIR/STTR and NSF logo files** — lazy-loaded on the old Wix site and
   not extractable. Funding is currently credited typographically.
4. **Social profile URLs** → `SITE.social` in `lib/content.ts`. All are `null`,
   so no social icons render (a dead link is worse than none).
5. `RESEND_API_KEY` for the contact form.

## Indexing

The site is **indexable**: [`app/robots.ts`](app/robots.ts) allows crawling
(except `/api/`) and there is no `X-Robots-Tag` header. A `noindex` guard existed
while the News page carried placeholder entries; it was lifted once those became
real and the client opted in.

Two things are therefore publicly visible in their current state: the four tools
show "Coming soon" until their URLs land, and the contact form returns a
configuration error until `RESEND_API_KEY` is set.

## Accessibility

Verified across all seven routes (`/`, `/about`, `/platform`, `/projects`,
`/services`, `/news`, `/contact`) at 375 / 768 / 1024 / 1440 px:

- No horizontal overflow at any breakpoint.
- No console errors or warnings.
- Interactive targets meet WCAG 2.5.8 (AA, 24×24). Primary CTAs, form fields,
  nav items and tabs meet the stricter 2.5.5 (AAA, 44×44). Footer text links
  are 36px. Inline links inside sentences are intentionally exempt.
- Text contrast meets AA by construction; see the contract in `globals.css`.
- `prefers-reduced-motion` is honoured globally and verified on the hero
  pipeline animation.
- Keyboard: visible focus ring on every interactive element, roving tabindex on
  tabs, focus trapping in the drawer and bio dialogs.
