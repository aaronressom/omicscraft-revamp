import { expect, test } from "@playwright/test";

import { NAV_ITEMS, REDIRECTS, ROUTES } from "./routes";

/**
 * Every route resolves, every link goes somewhere real, and no page logs an
 * error on the way in.
 */

test.describe("routing", () => {
  for (const route of ROUTES) {
    test(`${route} responds 200 and logs no console errors`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(route, { waitUntil: "load" });
      expect(response?.status(), `${route} status`).toBe(200);

      // The page must actually render a main landmark, not just return 200
      // with an error boundary.
      await expect(page.locator("main#main")).toBeVisible();

      expect(errors, `${route} console errors`).toEqual([]);
    });
  }

  for (const { from, to } of REDIRECTS) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to}$`));
    });
  }

  test("a genuinely missing route 404s", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
  });
});

test.describe("navigation targets", () => {
  test("every desktop nav item navigates to its route", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    for (const item of NAV_ITEMS) {
      await page.goto("/");
      const link = page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: item.label, exact: true });

      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${item.href}$`));
      await expect(page.locator("main#main")).toBeVisible();
    }
  });

  test("no internal link anywhere on the site 404s", async ({ page, request }) => {
    const seen = new Set<string>();

    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((links) =>
          links.map((l) => (l as HTMLAnchorElement).getAttribute("href") ?? ""),
        );

      for (const href of hrefs) {
        // Skip in-page anchors and anything already checked.
        if (!href || href.startsWith("/#") || seen.has(href)) continue;
        seen.add(href);
      }
    }

    // Assert on the collected set so a failure names the offending href.
    const broken: string[] = [];
    for (const href of seen) {
      const res = await request.get(href);
      if (res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
    }
    expect(broken, "internal links returning >=400").toEqual([]);
  });

  test("the skip link reaches main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
  });
});
