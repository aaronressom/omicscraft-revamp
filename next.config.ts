import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Preserve inbound links and search rankings from the old Wix site.
   * Verified against https://www.omicscraft.com/pages-sitemap.xml, which lists
   * /services, /research and /aboutus. `/products` is not in the sitemap but is
   * linked from the live navigation, so it is redirected as a safety net.
   */
  async redirects() {
    return [
      { source: "/aboutus", destination: "/about", permanent: true },
      { source: "/research", destination: "/projects", permanent: true },
      { source: "/products", destination: "/platform", permanent: true },
    ];
  },

  /**
   * Keep this staging deployment out of search engines.
   *
   * This build carries placeholder News entries (invented dates announcing SBIR
   * awards for a real company) and unfinished product links. None of that
   * should be indexable, and a Vercel *production* deployment — which the first
   * deploy of a project becomes by default — is indexable unless told otherwise.
   *
   * REMOVE THIS BLOCK (and `app/robots.ts`) ONLY when the site is genuinely
   * ready to launch: real news entries, real product URLs, client sign-off.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
