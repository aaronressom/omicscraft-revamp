import { Mail, MapPin, Phone, Map as MapIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/sections/contact-form";
import { SITE } from "@/lib/content";

/* No "use client" needed any more: with the map loading automatically this
   section holds no state. ContactForm remains its own client component. */

export function ContactSection() {
  return (
    <section className="bg-surface-tint py-24 lg:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col gap-5">
              <ContactDetail icon={MapPin} label="Office">
                <span className="not-italic">{SITE.address.full}</span>
              </ContactDetail>
              <ContactDetail icon={Mail} label="Email">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-cyan-ink hover:underline"
                >
                  {SITE.email}
                </a>
              </ContactDetail>
              <ContactDetail icon={Phone} label="Phone">
                <a
                  href={SITE.phoneHref}
                  className="text-cyan-ink hover:underline"
                >
                  {SITE.phone}
                </a>
              </ContactDetail>
            </ul>

            <MapCard />
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-ink ring-1 ring-slate-200">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </span>
        <span className="mt-1 text-[0.95rem] leading-relaxed text-slate-700">
          {children}
        </span>
      </span>
    </li>
  );
}

/**
 * Map embed.
 *
 * Loads automatically at the client's request. This was previously
 * click-to-load, because the Google embed is a third-party iframe that sets
 * cookies and contacts Google on load; deferring it kept that off the initial
 * page load. The client preferred not to make visitors press a button, so the
 * privacy trade-off is accepted deliberately.
 *
 * `loading="lazy"` still holds the request until the map scrolls into view, so
 * it costs nothing above the fold.
 */
function MapCard() {
  const query = SITE.mapQuery;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <iframe
        title={`Map showing ${SITE.legalName} at ${SITE.address.full}`}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-4/3 w-full border-0"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center gap-2 border-t border-slate-200 px-4 text-sm font-semibold text-cyan-ink hover:underline"
      >
        <MapIcon className="size-4" aria-hidden />
        Open in Google Maps
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </div>
  );
}
