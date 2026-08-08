import { defineConfig, devices } from "@playwright/test";

/**
 * E2E configuration.
 *
 * Runs against a PRODUCTION build (`next build` + `next start`), not `next dev`.
 * The things these tests are here to prove — bundle behaviour, dynamic imports,
 * image sizing — only behave correctly in a production build; dev serves
 * unoptimized images and eagerly loads everything.
 *
 * `reuseExistingServer` so a server already running on 3000 is used as-is,
 * which keeps repeated local runs fast.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
