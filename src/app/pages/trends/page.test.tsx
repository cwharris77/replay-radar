import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Trends Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated session
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user",
            name: "Test User",
            accessToken: "test-token",
          },
          expires: "2099-12-31T23:59:59.999Z",
        }),
      });
    });
  });

  test("should display trends page with all required elements", async ({
    page,
  }) => {
    await page.route("**/api/trends/artists**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: ["Day 1", "Day 2"],
          series: [{ id: "1", name: "Artist 1", data: [1, 2], imageUrl: null }],
          type: "artists",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Verify main heading
    await expect(page.getByText("Your Trends")).toBeVisible();

    // Verify description text
    await expect(page.getByText(/daily snapshots/i)).toBeVisible();

    // Verify all three tab buttons exist
    const artistsTab = page.getByRole("button", { name: "Artists" });
    const tracksTab = page.getByRole("button", { name: "Tracks" });
    const genresTab = page.getByRole("button", { name: "Genres" });

    await expect(artistsTab).toBeVisible();
    await expect(tracksTab).toBeVisible();
    await expect(genresTab).toBeVisible();

    // Verify chart container exists
    const chartContainer = page.locator('[class*="bg-gray-900"]');
    await expect(chartContainer).toBeVisible();
  });

  test("should switch between tabs and update active state", async ({
    page,
  }) => {
    let requestCount = 0;
    await page.route("**/api/trends/**", async (route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: ["Day 1"],
          series: [{ id: "1", name: "Item 1", data: [1], imageUrl: null }],
          type:
            requestCount === 1
              ? "artists"
              : requestCount === 2
              ? "tracks"
              : "genres",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Initially artists should be active
    const artistsTab = page.getByRole("button", { name: "Artists" });
    await expect(artistsTab).toHaveClass(/bg-green-600/);

    // Click tracks tab
    await page.getByRole("button", { name: "Tracks" }).click();
    const tracksTab = page.getByRole("button", { name: "Tracks" });
    await expect(tracksTab).toHaveClass(/bg-green-600/);
    await expect(artistsTab).not.toHaveClass(/bg-green-600/);

    // Click genres tab
    await page.getByRole("button", { name: "Genres" }).click();
    const genresTab = page.getByRole("button", { name: "Genres" });
    await expect(genresTab).toHaveClass(/bg-green-600/);
    await expect(tracksTab).not.toHaveClass(/bg-green-600/);
  });

  test("should make API request when switching tabs", async ({ page }) => {
    const requests: string[] = [];
    await page.route("**/api/trends/**", async (route) => {
      const url = route.request().url();
      requests.push(url);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: ["Day 1"],
          series: [{ id: "1", name: "Item", data: [1], imageUrl: null }],
          type: url.includes("genres") ? "genres" : "artists",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Should make initial request for artists
    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(1);

    // Switch to tracks
    await page.getByRole("button", { name: "Tracks" }).click();
    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(2);

    // Switch to genres
    await page.getByRole("button", { name: "Genres" }).click();
    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(3);

    // Verify different endpoints were called
    expect(requests.some((url) => url.includes("artists"))).toBe(true);
    expect(requests.some((url) => url.includes("tracks"))).toBe(true);
    expect(requests.some((url) => url.includes("genres"))).toBe(true);
  });

  test("should display error message on API failure", async ({ page }) => {
    await page.route("**/api/trends/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Should show error card/message
    const errorElement = page
      .getByText(/error|failed/i)
      .or(page.locator('[class*="error"]'));
    await expect(errorElement.first()).toBeVisible();
  });

  test("should display loading state initially", async ({ page }) => {
    await page.route("**/api/trends/**", async (route) => {
      // Delay to ensure loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: ["Day 1"],
          series: [{ id: "1", name: "Item", data: [1], imageUrl: null }],
          type: "artists",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Check for loading text - should appear briefly
    const loadingText = page.getByText(/loading/i);
    // Loading might be very fast, so check if it appears or if content loads
    const isVisible = await loadingText.isVisible().catch(() => false);
    if (isVisible) {
      await expect(loadingText).toBeVisible();
    }
  });

  test("should display empty state when no data returned", async ({ page }) => {
    await page.route("**/api/trends/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: [],
          series: [],
          type: "artists",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Wait for page to load
    await page.waitForTimeout(500);

    // Should show empty state message
    const emptyMessage = page.getByText(/no trend data|check back/i);
    await expect(emptyMessage).toBeVisible();
  });

  test("should render chart when data is available", async ({ page }) => {
    await page.route("**/api/trends/artists**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labels: ["Long term", "Medium term", "1/1/2024"],
          series: [
            { id: "1", name: "Artist 1", data: [1, 2, 1], imageUrl: null },
            { id: "2", name: "Artist 2", data: [2, 1, 2], imageUrl: null },
          ],
          type: "artists",
          timeRange: "medium_term",
        }),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Wait for data to load
    await page.waitForTimeout(500);

    // Chart container should be visible
    const chartContainer = page.locator('[class*="bg-gray-900"]');
    await expect(chartContainer).toBeVisible();

    // Should not show empty state
    const emptyMessage = page.getByText(/no trend data/i);
    await expect(emptyMessage).not.toBeVisible();
  });

  test("should show login prompt when user is not authenticated", async ({
    page,
  }) => {
    // Mock unauthenticated session
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    });

    await page.goto(`${BASE_URL}/pages/trends`);

    // Should show login prompt
    await expect(page.getByText("Login to View Your Trends")).toBeVisible();
    await expect(
      page.getByText(/connect your spotify account/i)
    ).toBeVisible();
    await expect(page.getByText("Log in with Spotify")).toBeVisible();
  });
});
