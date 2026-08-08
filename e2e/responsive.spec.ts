import { expect, test } from "@playwright/test";

import { NAV_ITEMS, ROUTES, VIEWPORTS } from "./routes";

/**
 * THE HORIZONTAL SCROLL CHECK.
 *
 * This is the one that catches the classic mobile break: a fixed width, a
 * `100vw` next to a padded container, or a long unbroken string pushing the
 * body wider than the viewport. Asserted on every route at every width rather
 * than spot-checked, because the failure is always in the one place nobody
 * looked.
 *
 * A 1px tolerance absorbs sub-pixel rounding at fractional device ratios; a
 * real overflow is never 1px.
 */

const TOLERANCE = 1;

test.describe("no horizontal overflow", () => {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route} at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(route, { waitUntil: "load" });

        // Let fonts settle — a webfont swap can rewrap text and is exactly the
        // kind of thing that produces a late overflow.
        await page.evaluate(() => document.fonts.ready);

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(
          scrollWidth,
          `${route} overflows by ${scrollWidth - clientWidth}px at ${viewport.width}px`,
        ).toBeLessThanOrEqual(clientWidth + TOLERANCE);
      });
    }
  }
});

test.describe("no element escapes the viewport", () => {
  // Narrow widths only: this is where squished/overlapping layout shows up.
  for (const viewport of VIEWPORTS.filter((v) => v.width <= 768)) {
    test(`no wide element on / at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);

      // Name the offenders rather than just failing, so a break is actionable.
      //
      // TWO EXCLUSIONS, both deliberate:
      //
      //  - Anything inside an ancestor that clips (overflow hidden/clip). The
      //    decorative SVG backdrops deliberately extend past the section edge
      //    and are cut off by it; they are painted correctly and cannot cause
      //    scroll. Flagging them buries a real break in a dozen false ones.
      //  - SVG internals (<path>, <g>, <text>). They live in the viewBox
      //    coordinate system, so their client rects say nothing about page
      //    layout — the <svg> element itself is the thing worth checking.
      const offenders = await page.evaluate((tolerance) => {
        const clipped = (el: Element) => {
          let node: Element | null = el.parentElement;
          while (node && node !== document.documentElement) {
            const { overflowX, overflow } = getComputedStyle(node);
            if (/hidden|clip|auto|scroll/.test(overflowX + overflow)) return true;
            node = node.parentElement;
          }
          return false;
        };

        const out: string[] = [];
        for (const el of Array.from(document.body.querySelectorAll("*"))) {
          if (el.namespaceURI === "http://www.w3.org/2000/svg" && el.tagName !== "svg")
            continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.right <= window.innerWidth + tolerance && rect.left >= -tolerance)
            continue;
          if (clipped(el)) continue;

          const tag = el.tagName.toLowerCase();
          const cls =
            typeof el.className === "string"
              ? el.className.split(/\s+/).slice(0, 3).join(".")
              : "";
          out.push(
            `${tag}.${cls} left=${Math.round(rect.left)} right=${Math.round(rect.right)}`,
          );
        }
        return out.slice(0, 10);
      }, TOLERANCE);

      expect(offenders, "elements extending past the viewport").toEqual([]);
    });
  }
});

test.describe("mobile hamburger menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, lists every nav item, navigates and closes", async ({ page }) => {
    await page.goto("/");

    // The desktop nav must be hidden at this width, or we are testing nothing.
    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();

    const drawer = page.getByRole("navigation", { name: "Mobile" });
    await expect(drawer).toBeVisible();

    for (const item of NAV_ITEMS) {
      await expect(
        drawer.getByRole("link", { name: item.label, exact: true }),
      ).toBeVisible();
    }

    await drawer.getByRole("link", { name: "About", exact: true }).click();

    await expect(page).toHaveURL(/\/about$/);
    // Closing via state, not <SheetClose> — assert the drawer actually went.
    await expect(drawer).toBeHidden();
  });

  test("the account control is reachable at mobile width", async ({ page }) => {
    await page.goto("/");
    // A sign-in that only works on a laptop is not one — see header.tsx.
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
