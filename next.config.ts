import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Preserve inbound links and search rankings from the old Wix site.
   *
   * Verified against https://www.omicscraft.com/pages-sitemap.xml (/services,
   * /research, /aboutus) plus the live navigation. Note `/tools` — that is the
   * real old products page; `/products` returns 404 there, and is kept only as
   * a harmless safety net for anything that ever guessed it.
   */
  async redirects() {
    return [
      { source: "/aboutus", destination: "/about", permanent: true },
      { source: "/research", destination: "/projects", permanent: true },
      { source: "/tools", destination: "/platform", permanent: true },
      { source: "/products", destination: "/platform", permanent: true },
    ];
  },
};

/*
 * Indexing note: an `X-Robots-Tag: noindex` header used to sit here while the
 * News page carried placeholder announcements. Those are now real, verified
 * entries, and the client has opted in to indexing — so the header is gone and
 * `app/robots.ts` allows crawling.
 */

export default nextConfig;
