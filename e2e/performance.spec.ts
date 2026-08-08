import { expect, test } from "@playwright/test";

/**
 * Guards for the optimisations, so they cannot be quietly undone.
 *
 * Each of these failed before the performance pass and passes after. They
 * assert the MECHANISM (what the browser actually requested), not a byte count,
 * so they stay meaningful as the site grows.
 */

/**
 * The scripts a route's OWN DOCUMENT loads — its critical path.
 *
 * NOT "every script the browser ever requested". Next prefetches the chunks for
 * routes linked from the page, and the Header links to all seven — so after
 * `networkidle` a page has pulled half the site at idle priority. That is a
 * deliberate Next optimisation and says nothing about what this route costs to
 * render. Parsing the served HTML is what "shipped on this route" means.
 */
async function criticalScripts(
  request: import("@playwright/test").APIRequestContext,
  route: string,
) {
  const html = await (await request.get(route)).text();
  const urls = new Set<string>();
  for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(
    /<link[^>]+rel="preload"[^>]+href="([^"]+\.js)"/g,
  ))
    urls.add(m[1]);

  return Promise.all(
    [...urls].map(async (url) => {
      try {
        return await (await request.get(url)).text();
      } catch {
        return "";
      }
    }),
  );
}

test.describe("bundle composition", () => {
  test("the animation library is NOT on the critical path of routes that do not animate", async ({
    request,
  }) => {
    // The Header used to import `motion` for the nav underline, and the Header
    // is in the root layout — so every route rendered it. The underline is CSS
    // now, and only the home page's carousel still pulls the library.
    //
    // `VisualElement` + `projection` are motion's layout engine: the expensive
    // part that `layoutId` specifically required.
    const isMotion = (b: string) =>
      b.includes("VisualElement") && b.includes("projection");

    for (const route of ["/about", "/services", "/projects", "/contact"]) {
      const bodies = await criticalScripts(request, route);
      expect(
        bodies.filter(isMotion),
        `motion library on the critical path of ${route}`,
      ).toHaveLength(0);
    }

    // POSITIVE CONTROL. Without this the test would still pass if the detector
    // silently stopped matching — it must find the library where it genuinely
    // is, or it is proving nothing.
    const home = await criticalScripts(request, "/");
    expect(
      home.filter(isMotion).length,
      "detector failed to find motion on /, where the carousel uses it",
    ).toBeGreaterThan(0);
  });

  test("the news editor's form stack is not shipped to signed-out visitors", async ({
    request,
  }) => {
    // add-news-dialog pulls react-hook-form + zod. It is behind next/dynamic
    // and only fetched once someone signs in.
    const bodies = await criticalScripts(request, "/news");
    expect(
      bodies.filter((b) => b.includes("Add announcement")),
      "admin form on the critical path for signed-out visitors",
    ).toHaveLength(0);
  });
});

test.describe("image delivery", () => {
  test("the header lockup is not preloaded at source resolution", async ({
    page,
  }) => {
    await page.goto("/");

    // `priority` emits a <link rel=preload>. It should ask for a candidate
    // sized to the 44px-tall header, not the ~1100px artwork.
    const preloadedWidth = await page.evaluate(() => {
      const link = document.querySelector<HTMLLinkElement>(
        'link[rel="preload"][as="image"]',
      );
      const url = link?.getAttribute("imagesrcset") ?? link?.href ?? "";
      const widths = [...url.matchAll(/[?&]w=(\d+)/g)].map((m) => Number(m[1]));
      return widths.length ? Math.min(...widths) : null;
    });

    if (preloadedWidth !== null) {
      expect(
        preloadedWidth,
        "header logo preloaded far larger than it renders",
      ).toBeLessThanOrEqual(768);
    }
  });

  test("team avatars are served sharp on a phone, not at the desktop size", async ({
    page,
  }) => {
    // THE MOBILE DEFECT THIS PASS FIXED. width={176} with a `w-full` class
    // meant Next offered at most 352w for a box that renders ~310 CSS px —
    // under 2x, so every avatar was soft on a phone.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about", { waitUntil: "load" });

    const avatar = page.locator('img[alt*="Ressom"]').first();
    await avatar.scrollIntoViewIfNeeded();
    await expect(avatar).toBeVisible();

    const { rendered, servedWidth } = await avatar.evaluate((el) => {
      const img = el as HTMLImageElement;
      const match = /[?&]w=(\d+)/.exec(img.currentSrc);
      return {
        rendered: img.getBoundingClientRect().width,
        servedWidth: match ? Number(match[1]) : img.naturalWidth,
      };
    });

    // At least 2x the rendered box — the definition of "sharp on retina".
    expect(
      servedWidth,
      `avatar renders at ${Math.round(rendered)}px but was served ${servedWidth}px`,
    ).toBeGreaterThanOrEqual(rendered * 2);
  });

  test("no image is served enormously larger than it displays", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const oversized = await page.evaluate(() => {
      const out: string[] = [];
      for (const img of Array.from(document.images)) {
        const box = img.getBoundingClientRect();
        if (box.width === 0) continue;
        const match = /[?&]w=(\d+)/.exec(img.currentSrc);
        const served = match ? Number(match[1]) : img.naturalWidth;
        // 4x the CSS box is past even a 3x phone display.
        if (served > box.width * 4) {
          out.push(`${img.alt || img.src}: ${served}px for a ${Math.round(box.width)}px box`);
        }
      }
      return out;
    });

    expect(oversized, "images served far larger than displayed").toEqual([]);
  });
});
