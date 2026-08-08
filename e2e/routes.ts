/**
 * Shared fixtures for the e2e suite.
 *
 * Kept in step with `NAV` in lib/content.ts and `redirects()` in
 * next.config.ts. If a route is added to either, add it here — these lists are
 * what makes "every page" in the specs mean every page.
 */

export const ROUTES = [
  "/",
  "/platform",
  "/services",
  "/projects",
  "/news",
  "/about",
  "/contact",
] as const;

/** Legacy Wix URLs preserved by next.config.ts. */
export const REDIRECTS = [
  { from: "/aboutus", to: "/about" },
  { from: "/research", to: "/projects" },
  { from: "/tools", to: "/platform" },
  { from: "/products", to: "/platform" },
] as const;

/** Every entry in NAV, in order. */
export const NAV_ITEMS = [
  { label: "Software Platform", href: "/platform" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Viewports the responsive audit runs at. 320 is the narrowest phone still
 *  worth supporting; 390 is a current iPhone; 768 an iPad portrait. */
export const VIEWPORTS = [
  { name: "320-small-phone", width: 320, height: 640 },
  { name: "390-iphone", width: 390, height: 844 },
  { name: "768-tablet", width: 768, height: 1024 },
  { name: "1280-laptop", width: 1280, height: 800 },
  { name: "1920-desktop", width: 1920, height: 1080 },
] as const;

/** Matches lib/admin-auth.ts. */
export const ADMIN = { username: "Ressom", password: "Georgetown" } as const;

/** SLIDES.length + 1 — the site's own hero slide plus six photographic ones. */
export const TOTAL_SLIDES = 7;

/** SLIDE_MS in hero-carousel.tsx. */
export const SLIDE_MS = 6000;
