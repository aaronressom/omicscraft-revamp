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
};

export default nextConfig;
