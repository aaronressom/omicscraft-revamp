import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { FUNDERS, NAV, SITE } from "@/lib/content";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const PLATFORM_LINKS = [
  { label: "Software Platform", href: "/platform" },
  { label: "Services", href: "/services" },
];

/**
 * Footer links are standalone navigation, not inline-in-sentence links, so
 * WCAG 2.5.8 (AA) applies: the target must be at least 24x24 CSS px. Plain
 * text links measure ~17px tall, which fails. min-h-9 gives a comfortable
 * 36px without inflating the footer.
 */
const FOOTER_LINK_CLASS = "inline-flex min-h-9 w-fit items-center";

export function Footer() {
  const socials = Object.entries(SITE.social).filter(
    ([, href]) => typeof href === "string" && href.length > 0,
  ) as [string, string][];

  return (
    <footer className="on-dark border-t border-white/10 bg-navy-950">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              {SITE.description}
            </p>
          </div>

          <FooterColumn title="Platform" links={PLATFORM_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Contact
            </h2>
            <address className="flex flex-col gap-1 text-sm not-italic text-slate-300">
              <span className="mb-1">{SITE.address.full}</span>
              <a
                href={`mailto:${SITE.email}`}
                className={FOOTER_LINK_CLASS + " text-cyan-400"}
              >
                {SITE.email}
              </a>
              <a
                href={SITE.phoneHref}
                className={FOOTER_LINK_CLASS + " text-cyan-400"}
              >
                {SITE.phone}
              </a>
            </address>
          </div>
        </div>

        {/* Funding attribution - factual, and the same two agencies named on
            the current site. Replace with official logo files when supplied. */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Research supported by
            </span>
            <span className="text-sm text-slate-400">
              {FUNDERS.map((f) => f.name).join(" · ")}
            </span>
          </div>

          {socials.length > 0 ? (
            <ul className="flex items-center gap-2">
              {socials.map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-xl text-slate-400 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/25"
                  >
                    <span className="text-sm font-semibold capitalize">
                      {network.slice(0, 2)}
                    </span>
                    <span className="sr-only">
                      {SITE.name} on {network} (opens in new tab)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {SITE.copyrightYear} {SITE.legalName}. All rights reserved.
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${FOOTER_LINK_CLASS} text-sm text-slate-400 hover:text-white`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${FOOTER_LINK_CLASS} text-sm text-slate-300 hover:text-white`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
