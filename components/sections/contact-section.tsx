import { Mail, MapPin, Phone, Map as MapIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MolecularBackdrop } from "@/components/visuals/molecular-backdrop";
import { ContactForm } from "@/components/sections/contact-form";
import { SITE } from "@/lib/content";

/* No "use client" needed any more: with the map loading automatically this
   section holds no state. ContactForm remains its own client component. */

/**
 * Contact.
 *
 * TWO PANELS, NOT SIX FLOATING PIECES. The details, the map, the form and its
 * submit row previously sat directly on the tinted background as separate
 * fragments, which read as clutter rather than as two things to do. They are
 * now grouped into one solid white card each — "here is where we are" and
 * "here is how to reach us" — so the page has exactly two objects on it.
 *
 * Solid white on purpose: a translucent panel over the tint produced a third
 * in-between colour and made the grouping ambiguous, which was the problem the
 * grouping was meant to solve.
 */
export function ContactSection() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-tint py-24 lg:py-32">
      <MolecularBackdrop variant="light" subtle pattern={1} />

      <Container className="relative">
        <div className="grid items-start gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <Panel>
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
          </Panel>

          <Panel>
            <ContactForm />
          </Panel>
        </div>
      </Container>
    </section>
  );
}

/**
 * The grouping bubble. Both columns use it, so they read as a matched pair.
 *
 * NO `h-full`. Stretching both panels to the taller of the two left a slab of
 * empty white under the Send button, because the details-and-map column is
 * always taller than the form. Level bottoms are not worth a dead half-screen
 * inside the panel people are meant to fill in.
 */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
      {children}
    </div>
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
      {/* bg-surface-tint, not bg-white: the chip now sits on a white panel,
          where a white fill was invisible. */}
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-tint text-cyan-ink ring-1 ring-slate-200">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200">
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
