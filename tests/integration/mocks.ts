import { Client } from "@mocky-balboa/client";

export const mockSession = {
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
};

export const mockArtists = [
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
];

export const mockTracks = [
  {
    id: "track1",
    name: "Track 1",
    album: { images: [{ url: "https://example.com/track1.jpg" }] },
    external_urls: { spotify: "https://spotify.com/track1" },
  },
  {
    id: "track2",
    name: "Track 2",
    album: { images: [{ url: "https://example.com/track2.jpg" }] },
    external_urls: { spotify: "https://spotify.com/track2" },
  },
];

export function registerMocks(mocky: Client) {
  // Session
  mocky.route("**/api/auth/session", (route) => {
    return route.fulfill({
      status: 200,
      body: JSON.stringify(mockSession),
      headers: { "Content-Type": "application/json" },
    });
  });

  // Top data
  mocky.route("**/api/spotify/top-data**", (route) => {
    const url = new URL(route.request.url);
    const type = url.searchParams.get("type");
    const data = type === "artists" ? mockArtists : mockTracks;

    return route.fulfill({
      status: 200,
      body: JSON.stringify({ items: data }),
      headers: { "Content-Type": "application/json" },
    });
  });

  // Recently played
  mocky.route("**/api/spotify/recently-played", (route) => {
    return route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      headers: { "Content-Type": "application/json" },
    });
  });
}
