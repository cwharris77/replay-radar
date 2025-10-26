import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should show login button when not authenticated", async ({ page }) => {
    await page.goto("/");

    // Check if login button is visible
    const loginButton = page.getByRole("button", { name: /sign in/i });
    await expect(loginButton).toBeVisible();
  });

  test("should redirect to Spotify login when clicking sign in", async ({
    page,
  }) => {
    await page.goto("/");

    // Click the login button
    const loginButton = page.getByRole("button", { name: /sign in/i });

    // Since this will redirect to Spotify, we'll just verify the click starts a navigation
    await Promise.all([page.waitForNavigation(), loginButton.click()]);

    // Verify we're redirected to Spotify's domain
    expect(page.url()).toContain("accounts.spotify.com");
  });
});
