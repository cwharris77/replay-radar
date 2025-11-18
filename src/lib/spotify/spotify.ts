import { TimeRange, timeRange, TopDataType } from "@/app/constants";
import { Artist, SpotifyResponse, Track } from "@/types";
import { Session } from "next-auth";
import { refreshAccessToken } from "./refreshAccessToken";

/**
 * Helper to call Spotify Web API.
 */
async function spotifyFetch<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error(`Spotify API error: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch top artists or tracks.
 */
export async function fetchSpotifyData({
  type,
  session,
  timeRangeValue = timeRange.short,
  limit = 20,
}: {
  type: TopDataType;
  session: Session;
  timeRangeValue?: TimeRange;
  limit?: number;
}): Promise<Artist[] | Track[]> {
  let accessToken = session?.user?.accessToken;
  if (!accessToken) return [];

  if (session.user.expiresAt && Date.now() > session.user.expiresAt) {
    const { accessToken: refreshedAccessToken } = await refreshAccessToken(
      session.user.refreshToken || ""
    );

    if (!refreshedAccessToken) {
      return [];
    }
    accessToken = refreshedAccessToken;
  }

  const endpoint = `https://api.spotify.com/v1/me/top/${type}?limit=${limit}&time_range=${timeRangeValue}`;
  const data = await spotifyFetch<SpotifyResponse>(endpoint, accessToken);

  return data.items;
}

/**
 * Fetch recently played tracks.
 */
export async function fetchRecentlyPlayed(
  session: Session,
  limit: number = 20
): Promise<Track[]> {
  let accessToken = session?.user?.accessToken;
  if (!accessToken) return [];

  if (session.user.expiresAt && Date.now() > session.user.expiresAt) {
    const { accessToken: refreshedAccessToken } = await refreshAccessToken(
      session.user.refreshToken || ""
    );

    if (!refreshedAccessToken) {
      return [];
    }
    accessToken = refreshedAccessToken;
  }

  const endpoint = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
  const data = await spotifyFetch<{
    items: { track: Track; played_at: string }[];
  }>(endpoint, accessToken);
  // Map into Track objects with played_at
  return data.items.map((item) => ({
    ...item.track,
    played_at: item.played_at,
  }));
}
