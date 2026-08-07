import { Container } from "@/components/layout/container";
import {
  SOCIAL_LABELS,
  SOCIAL_MARKS,
} from "@/components/visuals/social-marks";
import { Logo } from "@/components/layout/logo";
import { SITE } from "@/lib/content";

/**
 * Footer — one row: logo, copyright, social links.
 *
 * ── WHAT CAME OUT, AND WHY IT IS NOT COMING BACK ───────────────────────────
 * This was a four-column block: the company description, a Platform column, a
 * Company column, a Contact column with the full address, then a funding
 * attribution strip, then the whole top navigation repeated a second time.
 * The client's note was that it read as a wall of text, and every part of it
 * appeared somewhere better on the site already — the nav is fixed to the top
 * of every page, the address and email are the substance of /contact, and the
 * NIH/NSF attribution now opens /projects, next to the awards it refers to.
 *
 * So the trim was deliberate, not incidental. If any of it returns, it should
 * return because that information is genuinely missing elsewhere.
 *
 * ONE THING IS LOAD-BEARING: the copyright line. It is the only place on the
 * site that names the legal entity.
 */
export function Footer() {
  const socials = Object.entries(SITE.social).filter(
    ([, href]) => typeof href === "string" && href.length > 0,
  ) as [string, string][];

  return (
    <footer className="on-dark border-t border-white/10 bg-navy-950">
      {/* py-8, down from py-16/20. At this height the footer is a rule under
          the page rather than a section of its own, which is the point. */}
      <Container className="py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-8">
          {/* Logo and copyright travel together: the mark identifies the
              company, the line beneath it names the legal entity, and splitting
              them across the row left the copyright orphaned in the middle. */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <Logo />
            <p className="text-center text-sm text-slate-500 sm:text-left">
              © {SITE.copyrightYear} {SITE.legalName}. All rights reserved.
            </p>
          </div>

          {socials.length > 0 ? (
            <ul className="flex items-center gap-2">
              {socials.map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* size-11 is a 44px target — these are now the only links
                       in the footer, so they carry all of its tap area. */
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
