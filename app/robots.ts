import type { MetadataRoute } from "next";

/**
 * Staging robots policy: disallow everything.
 *
 * Belt and braces alongside the `X-Robots-Tag: noindex` header in
 * `next.config.ts` — a crawler that ignores one generally respects the other.
 *
 * DELETE THIS FILE at launch, together with the `headers()` block in
 * `next.config.ts`. While it exists, the site will not appear in search
 * results at all.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
