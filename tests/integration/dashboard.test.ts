import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should display top artists section", async ({ page }) => {
    // Note: You'll need to mock authentication and data for this test to work
    await page.goto("/artists");

    // Check if the top artists section is present
    const artistsSection = page.getByTestId("top-artists");
    await expect(artistsSection).toBeVisible();
  });

  test("should display top tracks section", async ({ page }) => {
    await page.goto("/tracks");

    // Check if the top tracks section is present
    const tracksSection = page.getByTestId("top-tracks");
    await expect(tracksSection).toBeVisible();
  });
});
