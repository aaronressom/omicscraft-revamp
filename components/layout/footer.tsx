import {
  SOCIAL_LABELS,
  SOCIAL_MARKS,
} from "@/components/visuals/social-marks";
import { Container } from "@/components/layout/container";
import { SITE } from "@/lib/content";

/**
 * Footer — contact details, copyright, social links, on one row.
 *
 * ── WHAT IS HERE AND WHY ───────────────────────────────────────────────────
 * This was a four-column block: a company description, a Platform column, a
 * Company column, a Contact column, a funding attribution strip, and the whole
 * top navigation repeated a second time. It read as a wall of text, and most
 * of it existed somewhere better — the nav is fixed to the top of every page,
 * and the NIH/NSF attribution now opens /projects next to the awards it refers
 * to. Those are gone and should stay gone.
 *
 * THE CONTACT DETAILS ARE NOT IN THAT CATEGORY. They came out with the rest
 * and went straight back at the client's request, which was the right call:
 * an address, an email and a phone number in the footer are what a reader
 * expects to find without navigating anywhere, and a form on /contact is not a
 * substitute for either. They are the only content in here.
 *
 * The logo came out in the same round — the header carries the mark on every
 * page, and a second one at the foot of a two-line footer was decoration.
 *
 * ONE THING IS LOAD-BEARING BESIDES: the copyright line names the legal
 * entity, and nothing else on the site does.
 *
 * WCAG 2.5.8: the email and phone are standalone links, so they need a 24px
 * minimum target. `min-h-9` gives them 36 without stretching the row.
 */
const FOOTER_LINK_CLASS =
  "inline-flex min-h-9 w-fit items-center text-cyan-400 hover:text-cyan-300 hover:underline";

export function Footer() {
  const socials = Object.entries(SITE.social).filter(
    ([, href]) => typeof href === "string" && href.length > 0,
  ) as [string, string][];

  return (
    <footer className="on-dark border-t border-white/10 bg-navy-950">
      <Container className="py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            {/* One line on a wide screen, stacked on a narrow one. The
                separators are decorative and disappear with the row, since a
                mid-dot at the start of a stacked line reads as a bullet. */}
            <address className="flex flex-col items-center gap-x-2.5 text-center text-sm not-italic text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:text-left">
              <span>{SITE.address.full}</span>
              <Separator />
              <a href={`mailto:${SITE.email}`} className={FOOTER_LINK_CLASS}>
                {SITE.email}
              </a>
              <Separator />
              <a href={SITE.phoneHref} className={FOOTER_LINK_CLASS}>
                {SITE.phone}
              </a>
            </address>

            <p className="text-center text-sm text-slate-500 sm:text-left">
              © {SITE.copyrightYear} {SITE.legalName}. All rights reserved.
            </p>
          </div>

          {socials.length > 0 ? (
            <ul className="flex shrink-0 items-center gap-2">
              {socials.map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-xl text-slate-400 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/25"
                  >
                    {/* Real glyph where we have one; the two-letter badge
                        remains the fallback for any network without a mark, so
                        adding a URL to SITE.social never renders nothing. */}
                    {SOCIAL_MARKS[network] ? (
                      SOCIAL_MARKS[network]({ className: "size-5" })
                    ) : (
                      <span className="text-sm font-semibold capitalize">
                        {network.slice(0, 2)}
                      </span>
                    )}
                    <span className="sr-only">
                      {SITE.name} on {SOCIAL_LABELS[network] ?? network} (opens
                      in new tab)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}

function Separator() {
  return (
    <span aria-hidden className="hidden text-slate-600 sm:inline">
      ·
    </span>
  );
}
