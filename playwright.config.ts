import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Base test directory
  testDir: ".",
  testIgnore: ["**/.next/**", "**/node_modules/**"],

  /* Fail build if .only left in CI */
  forbidOnly: !!process.env.CI,

  /* Retry on CI */
  retries: process.env.CI ? 2 : 0,

  /* Limit concurrency on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Default reporter */
  reporter: "html",

  /* Global use options */
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  /* Projects for different test scopes */
  projects: [
    // Unit tests
    {
      name: "unit",
      testDir: "src",
      testMatch: ["**/*.test.{ts,tsx}"],
      use: { headless: true },
    },

    // Integration tests
    {
      name: "integration",
      testDir: "tests/integration",
      testMatch: ["**/*.test.{ts,tsx}"],
      use: { headless: true },
    },

    // End-to-end tests
    {
      name: "e2e",
      testDir: "tests/e2e",
      testMatch: ["**/*.test.{ts,tsx}"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
        headless: true,
        trace: "on-first-retry",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
