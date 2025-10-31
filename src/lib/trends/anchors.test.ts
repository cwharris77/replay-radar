import { expect, test } from "@playwright/test";

// Mock fetch before importing modules that use it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
global.fetch = async (input: RequestInfo | URL, _init?: RequestInit) => {
  const urlString =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  // Mock Spotify API responses
  if (urlString.includes("api.spotify.com/v1/me/top")) {
    const mockItems = [
      {
        id: "item1",
        name: "Item 1",
        images: [{ url: "https://example.com/item1.jpg" }],
        genres: ["Rock", "Pop"],
      },
      {
        id: "item2",
        name: "Item 2",
        images: [{ url: "https://example.com/item2.jpg" }],
        genres: ["Rock", "Jazz"], // Rock appears twice for aggregation test
      },
    ];

    return Promise.resolve({
      ok: true,
      json: async () => ({
        items: mockItems,
      }),
    } as Response);
  }

  // Default response for any other fetch calls
  return Promise.resolve({
    ok: false,
    status: 404,
    text: async () => "Not Found",
  } as Response);
};

import { buildGenreAnchors, buildRankAnchors } from "./anchors";

test.describe("Trend Anchors Helpers", () => {
  test.describe("buildRankAnchors", () => {
    test("should return empty data when no access token", async () => {
      const result = await buildRankAnchors("artists", undefined);
      expect(result.labels).toEqual([]);
      expect(result.rankMaps).toEqual([]);
      expect(result.mediumItems).toEqual([]);
    });

    test("should return empty data when access token is empty string", async () => {
      const result = await buildRankAnchors("tracks", "");
      expect(result.labels).toEqual([]);
      expect(result.rankMaps).toEqual([]);
      expect(result.mediumItems).toEqual([]);
    });

    test("should return correct label structure when token provided", async () => {
      const result = await buildRankAnchors("artists", "test-token");
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.rankMaps)).toBe(true);
      expect(Array.isArray(result.mediumItems)).toBe(true);
      expect(result.labels.length).toBe(2);
      expect(result.labels).toEqual(["Long term", "Medium term"]);
      expect(result.rankMaps.length).toBe(2);
      expect(result.mediumItems.length).toBe(2);
    });

    test("should work with both artists and tracks types", async () => {
      const artistsResult = await buildRankAnchors("artists", undefined);
      const tracksResult = await buildRankAnchors("tracks", undefined);

      expect(artistsResult.labels).toEqual([]);
      expect(tracksResult.labels).toEqual([]);
      expect(artistsResult.rankMaps).toEqual([]);
      expect(tracksResult.rankMaps).toEqual([]);
    });

    test("should create correct rank maps", async () => {
      const result = await buildRankAnchors("artists", "test-token");

      // Check that rank maps are created correctly (1-based indexing)
      expect(result.rankMaps.length).toBe(2);
      result.rankMaps.forEach((map) => {
        expect(map.get("item1")).toBe(1);
        expect(map.get("item2")).toBe(2);
      });
    });
  });

  test.describe("buildGenreAnchors", () => {
    test("should return empty data when no access token", async () => {
      const result = await buildGenreAnchors(undefined);
      expect(result.labels).toEqual([]);
      expect(result.countsList).toEqual([]);
    });

    test("should return empty data when access token is empty string", async () => {
      const result = await buildGenreAnchors("");
      expect(result.labels).toEqual([]);
      expect(result.countsList).toEqual([]);
    });

    test("should return correct structure when token provided", async () => {
      const result = await buildGenreAnchors("test-token");
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.countsList)).toBe(true);
      expect(result.labels.length).toBe(2);
      expect(result.countsList.length).toBe(2);
    });

    test("should return labels for long_term and medium_term", async () => {
      const result = await buildGenreAnchors("test-token");
      expect(result.labels.length).toBe(2);
      expect(result.labels).toEqual(["Long term", "Medium term"]);
    });

    test("should aggregate genre counts correctly", async () => {
      const result = await buildGenreAnchors("test-token");

      // Should have counts for each time range
      expect(result.countsList.length).toBe(2);

      // Check that genre counts are aggregated
      result.countsList.forEach((counts) => {
        expect(typeof counts).toBe("object");
        // Rock appears twice in mock data (once per item), Pop and Jazz appear once each
        expect(counts["Rock"]).toBe(2);
        expect(counts["Pop"]).toBe(1);
        expect(counts["Jazz"]).toBe(1);
      });
    });
  });
});
