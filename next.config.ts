import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * ALLOWLIST — REQUIRED, AND IT SILENTLY CLAMPS.
     *
     * Next 16 defaults this to `[75]`, and a `quality` prop that is not in the
     * list does not warn or error: the optimizer substitutes the CLOSEST
     * allowed value. So every image on the site was being served at 75 —
     * `quality={95}` on the "Our aim" photograph and `quality={85}` on the
     * hero slides included. That clamp is why the lab photo looked
     * over-compressed on top of being upscaled.
     *
     * One entry per quality actually used in the codebase:
     *   75  — Next's default, for anything that does not ask.
     *   85  — the hero carousel photographs.
     *   100 — the "Our aim" photograph, which is small and upscaled and so
     *         cannot afford to lose anything else to re-compression.
     *
     * Adding a `quality` prop anywhere else means adding it here too, or it
     * will quietly render at whichever of these is nearest.
     */
    qualities: [75, 85, 100],
  },

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
