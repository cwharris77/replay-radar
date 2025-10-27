import { SpotifyDataType, SpotifyResponse, TimeRange } from "@/types";

export default async function fetchFromSpotify(
  type: SpotifyDataType,
  timeRange: TimeRange,
  accessToken: string
): Promise<SpotifyResponse> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?limit=20&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Spotify API error:", text);
    throw new Error(`Failed to fetch from Spotify: ${text}`);
  }

  return response.json();
}
