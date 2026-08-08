import { expect, test } from "@playwright/test";

import { ADMIN } from "./routes";

/**
 * The temporary Ressom/Georgetown sign-in and the News editor behind it.
 *
 * NOTE: these credentials are deliberately not secret — see the header of
 * lib/admin-auth.ts. They gate a form that writes to the visitor's own browser
 * storage and nothing else, so hard-coding them in a test costs nothing that is
 * not already public.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Username").fill(ADMIN.username);
  await page.getByLabel("Password").fill(ADMIN.password);
  await page.getByRole("button", { name: "Login" }).click();
}

/**
 * Fills every REQUIRED field on the news form.
 *
 * All five are required by `newsDraftSchema`, and the form validates before it
 * submits — so omitting even one (Link text is the easy one to miss) means the
 * dialog silently stays open and the card never appears.
 */
async function fillNewsForm(
  page: import("@playwright/test").Page,
  title: string,
  summary = "Created by the automated end-to-end suite.",
) {
  await page.getByLabel("Subject line").fill(title);
  await page.getByLabel("Subtext").fill(summary);
  await page.getByLabel("Link address").fill("https://example.com/paper");
  await page.getByLabel("Link text").fill("Read the paper");
}

test.describe("admin sign-in", () => {
  test("correct credentials flip the header control to signed-in", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

    await signIn(page);

    // The dialog closes and the icon relabels itself with who is signed in.
    await expect(
      page.getByRole("button", { name: `Account — signed in as ${ADMIN.username}` }),
    ).toBeVisible();
  });

  test("a wrong password shows one shared error and clears the field", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByLabel("Username").fill(ADMIN.username);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Login" }).click();

    // One message for both fields — naming the wrong half tells an attacker
    // which half to keep.
    await expect(page.getByRole("alert")).toHaveText(
      "That username and password did not match.",
    );
    await expect(page.getByLabel("Password")).toHaveValue("");
  });

  test("a wrong username is rejected the same way", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByLabel("Username").fill("NotTheAdmin");
    await page.getByLabel("Password").fill(ADMIN.password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "That username and password did not match.",
    );
  });

  test("the session survives navigation and sign-out clears it", async ({
    page,
  }) => {
    await page.goto("/");
    await signIn(page);

    // sessionStorage-backed, so it must hold across a route change.
    await page.goto("/news");
    const account = page.getByRole("button", {
      name: `Account — signed in as ${ADMIN.username}`,
    });
    await expect(account).toBeVisible();

    await account.click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});

test.describe("news editor", () => {
  test("the add tile is hidden when signed out", async ({ page }) => {
    await page.goto("/news");
    await expect(
      page.getByRole("button", { name: /Add an announcement/ }),
    ).toBeHidden();
  });

  test("signed in, the modal saves a card and marks it as a local draft", async ({
    page,
  }) => {
    await page.goto("/news");
    await signIn(page);

    const addTile = page.getByRole("button", { name: /Add an announcement/ });
    await expect(addTile).toBeVisible();
    await addTile.click();

    await expect(
      page.getByRole("heading", { name: "New announcement" }),
    ).toBeVisible();

    const title = `E2E test announcement ${Date.now()}`;
    await fillNewsForm(page, title);

    // `exact` matters: the trigger tile is "Add an announcement" and the submit
    // button is "Add announcement", so a loose match hits both.
    await page
      .getByRole("button", { name: "Add announcement", exact: true })
      .click();

    // The card appears...
    const card = page.locator("article").filter({ hasText: title });
    await expect(card).toBeVisible();

    // ...and it is unmistakably marked as local-only. This badge is the one
    // thing standing between this feature and someone believing they have
    // published a press release.
    await expect(card.getByText("Saved on this device")).toBeVisible();
  });

  test("a saved draft survives a reload and can be removed", async ({ page }) => {
    await page.goto("/news");
    await signIn(page);

    const title = `E2E persistence check ${Date.now()}`;
    await page.getByRole("button", { name: /Add an announcement/ }).click();
    await fillNewsForm(page, title, "Checking localStorage round-trip.");
    await page
      .getByRole("button", { name: "Add announcement", exact: true })
      .click();

    await expect(page.locator("article").filter({ hasText: title })).toBeVisible();

    // localStorage-backed, so it must come back after a reload.
    await page.reload();
    const card = page.locator("article").filter({ hasText: title });
    await expect(card).toBeVisible();

    await card.getByRole("button", { name: /Remove/ }).click();
    await expect(card).toBeHidden();
  });
});
