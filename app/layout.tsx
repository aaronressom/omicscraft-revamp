import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face. Space Grotesk replaced Plus Jakarta Sans: the geometric
 * Jakarta letterforms are narrow and close-fitting, which is what made the
 * hero headline read as one continuous word. Space Grotesk sits wider on the
 * line and has a more technical character suited to the audience.
 *
 * Swapping it is a one-line change — the rest of the type scale reads from
 * the --font-display variable.
 */
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

/** Organization schema. Only facts published on the current site. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OmicsCraft LLC",
  url: SITE.url,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${displayFont.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white">
        <a
          href="#main"
          className="sr-only rounded-md bg-navy-950 px-5 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center"
        >
          Skip to content
        </a>
        {/* No auth provider wrapping this. The two places that care who is
            signed in — the header's account icon and the News editor — both
            read the same external store through `useAuth`, so they agree
            without a shared React tree. See components/admin/use-auth.ts. */}
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          // Static, developer-authored object - no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
