import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000/";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Mock NextAuth session - must include accessToken for authentication to work
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user",
            name: "Test User",
            email: "test@example.com",
            image: null,
            accessToken: "test-access-token",
            refreshToken: "test-refresh-token",
            expiresAt: Date.now() + 3600000,
          },
          expires: "2099-12-31T23:59:59.999Z",
        }),
      });
    });

    // Mock top-data API - must return { items: [...] } format
    await page.route("**/api/spotify/top-data**", async (route) => {
      const url = new URL(route.request().url());
      const type = url.searchParams.get("type");

      if (type === "artists") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                id: "artist1",
                name: "Artist 1",
                images: [{ url: "https://example.com/artist1.jpg" }],
                external_urls: { spotify: "https://spotify.com/artist1" },
              },
              {
                id: "artist2",
                name: "Artist 2",
                images: [{ url: "https://example.com/artist2.jpg" }],
                external_urls: { spotify: "https://spotify.com/artist2" },
              },
            ],
          }),
        });
      } else if (type === "tracks") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                id: "track1",
                name: "Track 1",
                album: {
                  images: [{ url: "https://example.com/track1.jpg" }],
                },
                external_urls: { spotify: "https://spotify.com/track1" },
              },
              {
                id: "track2",
                name: "Track 2",
                album: {
                  images: [{ url: "https://example.com/track2.jpg" }],
                },
                external_urls: { spotify: "https://spotify.com/track2" },
              },
            ],
          }),
        });
      }
    });
  });

  test("should display top artists section", async ({ page }) => {
    await page.goto(BASE_URL + "pages/artists");

    // Wait for the component to load
    const artistsSection = page.getByTestId("top-artists");
    await expect(artistsSection).toBeAttached({ timeout: 10000 });
  });

  test("should display top tracks section", async ({ page }) => {
    await page.goto(BASE_URL + "pages/tracks");

    // Wait for the component to load
    const tracksSection = page.getByTestId("top-tracks");
    await expect(tracksSection).toBeAttached({ timeout: 10000 });
  });
});
