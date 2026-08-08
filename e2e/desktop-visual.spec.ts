import { expect, test } from "@playwright/test";

import { ROUTES } from "./routes";

/**
 * DESKTOP MUST NOT CHANGE.
 *
 * The hard constraint on this whole optimisation pass is that the desktop UI is
 * untouched. These snapshots are what proves it: they are captured BEFORE the
 * performance work and re-run after, so any accidental desktop change fails the
 * suite instead of shipping.
 *
 * On the first run Playwright writes the baselines and reports the tests as
 * failed-then-written; that run is the "before" capture. Every run after that
 * is a real comparison.
 *
 * The home page is excluded from strict comparison because the hero carousel
 * autoplays — a screenshot of it is a picture of whatever slide happened to be
 * up. It gets its own pinned-to-slide-0 shot below instead.
 *
 * The nav underline is the ONE approved visual change (spring animation ->
 * CSS transition). If only the underline moves, update the baseline.
 */

const WIDTHS = [1280, 1920] as const;

test.describe("desktop visual baseline", () => {
  for (const width of WIDTHS) {
    for (const route of ROUTES.filter((r) => r !== "/")) {
      test(`${route} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1080 });
        await page.goto(route, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);

        // Kill motion so hover/entrance animations cannot make the shot flaky.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForTimeout(400);

        await expect(page).toHaveScreenshot(
          `${route.replace(/\//g, "_") || "_root"}-${width}.png`,
          { fullPage: true, maxDiffPixelRatio: 0.01, animations: "disabled" },
        );
      });
    }
  }

  for (const width of WIDTHS) {
    test(`home hero (slide 0, motion off) at ${width}px`, async ({ page }) => {
      // reduced-motion disables carousel autoplay outright, which pins this to
      // slide 0 and makes the shot deterministic.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 1080 });
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      await expect(page).toHaveScreenshot(`home-${width}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
      });
    });
  }
});
