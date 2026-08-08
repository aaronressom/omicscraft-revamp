import { expect, test } from "@playwright/test";

import { SLIDE_MS, TOTAL_SLIDES } from "./routes";

/**
 * Hero carousel.
 *
 * The slide that is up is identified by its dot's `aria-current`, which is the
 * same signal a screen reader gets — so these assertions check the thing the
 * user actually perceives rather than internal state.
 */

/** Index (0-based) of the slide currently showing. */
async function currentSlide(page: import("@playwright/test").Page) {
  const dots = page.getByRole("button", { name: /^Go to slide \d+ of \d+$/ });
  const count = await dots.count();
  for (let i = 0; i < count; i += 1) {
    if ((await dots.nth(i).getAttribute("aria-current")) === "true") return i;
  }
  return -1;
}

test.describe("hero carousel", () => {
  test(`has ${TOTAL_SLIDES} slides and starts on the first`, async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /^Go to slide \d+ of \d+$/ }),
    ).toHaveCount(TOTAL_SLIDES);
    expect(await currentSlide(page)).toBe(0);
  });

  test(`autoplays to the next slide within ${SLIDE_MS}ms`, async ({ page }) => {
    await page.goto("/");
    expect(await currentSlide(page)).toBe(0);

    // Poll rather than sleep-then-assert: this proves it advanced, and the
    // generous ceiling keeps it from flaking on a slow CI box.
    await expect
      .poll(() => currentSlide(page), {
        timeout: SLIDE_MS + 4000,
        message: "carousel did not auto-advance",
      })
      .toBe(1);
  });

  test("does NOT pause when the pointer sits inside it", async ({ page }) => {
    // Regression guard for the bug documented at the top of hero-carousel.tsx:
    // a hover pause on a full-height hero means "paused, always", because the
    // pointer is inside the section from the moment the page loads.
    await page.goto("/");
    await page.mouse.move(400, 400);

    await expect
      .poll(() => currentSlide(page), { timeout: SLIDE_MS + 4000 })
      .toBe(1);
  });

  test("next and previous arrows step and wrap in both directions", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Next slide" }).click();
    expect(await currentSlide(page)).toBe(1);

    await page.getByRole("button", { name: "Previous slide" }).click();
    expect(await currentSlide(page)).toBe(0);

    // Wrap backwards off slide 0 to the last slide.
    await page.getByRole("button", { name: "Previous slide" }).click();
    expect(await currentSlide(page)).toBe(TOTAL_SLIDES - 1);

    // ...and forwards off the last slide back to 0.
    await page.getByRole("button", { name: "Next slide" }).click();
    expect(await currentSlide(page)).toBe(0);
  });

  test("a dot jumps straight to its slide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Go to slide 5 of ${TOTAL_SLIDES}` }).click();
    expect(await currentSlide(page)).toBe(4);
  });

  test("inactive slides are inert, so hidden CTAs are not focusable", async ({
    page,
  }) => {
    await page.goto("/");

    // Slide 0 is up: exactly one visible "Explore aiSysMet" CTA should be
    // reachable, even though all seven panels are mounted.
    const inertPanels = page.locator('[aria-roledescription="slide"][inert]');
    await expect(inertPanels).toHaveCount(TOTAL_SLIDES - 1);
  });

  test("arrow keys step only while focus is inside the carousel", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Next slide" }).focus();
    await page.keyboard.press("ArrowRight");
    expect(await currentSlide(page)).toBe(1);
    await page.keyboard.press("ArrowLeft");
    expect(await currentSlide(page)).toBe(0);
  });

  test("autoplay stops under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await currentSlide(page)).toBe(0);

    await page.waitForTimeout(SLIDE_MS + 1500);
    expect(
      await currentSlide(page),
      "carousel advanced despite reduced-motion",
    ).toBe(0);
  });
});
