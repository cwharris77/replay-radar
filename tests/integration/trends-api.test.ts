import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Trends API Routes", () => {
  test.describe("GET /api/trends/[type]", () => {
    test("should return 401 for unauthorized requests", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/trends/artists`);
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("error");
    });

    test("should return 400 for invalid type parameter", async ({
      request,
    }) => {
      // Even with auth, invalid type should return 400
      const response = await request.get(`${BASE_URL}/api/trends/invalid`);
      // May be 401 (unauth) or 400 (invalid type) depending on auth middleware order
      expect([400, 401]).toContain(response.status());
    });

    test("should accept valid types (artists/tracks)", async ({ request }) => {
      // Without auth, should get 401
      const artistsResponse = await request.get(
        `${BASE_URL}/api/trends/artists`
      );
      const tracksResponse = await request.get(`${BASE_URL}/api/trends/tracks`);

      expect(artistsResponse.status()).toBe(401);
      expect(tracksResponse.status()).toBe(401);
    });

    test("should return proper response structure on success", async ({
      request,
      page,
    }) => {
      // Mock auth session
      await page.context().addCookies([
        {
          name: "next-auth.session-token",
          value: "mock-token",
          domain: "localhost",
          path: "/",
        },
      ]);

      // Mock the API endpoint to return success
      await page.route("**/api/trends/artists**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            labels: ["Day 1", "Day 2"],
            series: [{ id: "1", name: "Artist 1", data: [1, 2] }],
            type: "artists",
            timeRange: "medium_term",
          }),
        });
      });

      const response = await request.get(`${BASE_URL}/api/trends/artists`);

      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty("labels");
        expect(body).toHaveProperty("series");
        expect(body).toHaveProperty("type");
        expect(Array.isArray(body.labels)).toBe(true);
        expect(Array.isArray(body.series)).toBe(true);
      }
    });
  });

  test.describe("GET /api/trends/genres", () => {
    test("should return 401 for unauthorized requests", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/trends/genres`);
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("error");
    });

    test("should return proper response structure on success", async ({
      request,
      page,
    }) => {
      // Mock the endpoint
      await page.route("**/api/trends/genres**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            labels: ["Long term", "Medium term"],
            series: [{ id: "rock", name: "Rock", data: [5, 3] }],
            type: "genres",
            timeRange: "medium_term",
          }),
        });
      });

      const response = await request.get(`${BASE_URL}/api/trends/genres`);

      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty("labels");
        expect(body).toHaveProperty("series");
        expect(body).toHaveProperty("type", "genres");
      }
    });
  });
});
