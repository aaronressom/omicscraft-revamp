"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Map as MapIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/sections/contact-form";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content";

export function ContactSection() {
  return (
    <section className="bg-surface py-24 lg:py-32">
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
 * Click-to-load map.
 *
 * The embed is a third-party iframe that sets cookies and phones home to
 * Google on load. Deferring it until the visitor asks keeps that off the
 * initial page load entirely, and the "Open in Google Maps" link means the
 * address is always reachable without loading the embed at all.
 */
function MapCard() {
  const [loaded, setLoaded] = useState(false);
  const query = SITE.mapQuery;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {loaded ? (
        <iframe
          title={`Map showing ${SITE.legalName} at ${SITE.address.full}`}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-4/3 w-full border-0"
        />
      ) : (
        <div className="flex aspect-4/3 flex-col items-center justify-center gap-4 bg-slate-100 p-6 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-cyan-ink ring-1 ring-slate-200">
            <MapIcon className="size-5" aria-hidden />
          </span>
          <p className="text-sm text-slate-600">
            The map loads from Google. Load it here, or open it in a new tab.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button className="h-11 px-5" onClick={() => setLoaded(true)}>
              Load map
            </Button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold text-cyan-ink hover:underline"
            >
              Open in Google Maps
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
