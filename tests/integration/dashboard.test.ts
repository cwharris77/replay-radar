import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000/";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Mock NextAuth session
    await page.route("**/api/auth", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            name: "Test User",
            email: "test@example.com",
            image: null,
          },
          expires: "2099-12-31T23:59:59.999Z",
        }),
      });
    });

    await page.route(
      "**/api/spotify/top-data?type=artists&time_range=long_term",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ name: "Artist 1" }, { name: "Artist 2" }]),
        });
      }
    );

    await page.route(
      "**/api/spotify/top-data?type=tracks&time_range=long_term",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ name: "Track 1" }, { name: "Track 2" }]),
        });
      }
    );
  });

  test("should display top artists section", async ({ page }) => {
    await page.goto(BASE_URL + "pages/artists");

    const artistsSection = page.getByTestId("top-artists");
    await expect(artistsSection).toBeAttached();
  });

  test("should display top tracks section", async ({ page }) => {
    await page.goto(BASE_URL + "pages/tracks");

    const tracksSection = page.getByTestId("top-tracks");
    await expect(tracksSection).toBeAttached();
  });
});
