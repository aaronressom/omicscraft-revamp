import type { MetadataRoute } from "next";

/**
 * Public robots policy: allow indexing.
 *
 * This previously disallowed everything, alongside an `X-Robots-Tag: noindex`
 * header in `next.config.ts`, because the News page carried scaffolded
 * placeholder announcements. Those are now real, verified entries and the
 * client has opted to be indexed, so both guards are lifted.
 *
 * `/api/` stays disallowed — the contact endpoint is not a page and has nothing
 * for a crawler to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
  };
}
