import { TimeRange, timeRange, TopDataType } from "@/app/constants";
import {
  MOCK_ARTISTS_DAILY,
  MOCK_ARTISTS_MONTHLY,
  MOCK_ARTISTS_YEARLY,
  MOCK_TRACKS,
  MOCK_TRACKS_DAILY,
  MOCK_TRACKS_MONTHLY,
  MOCK_TRACKS_YEARLY,
} from "@/lib/demo/mockData";
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

  if (session.user.id === "demo") {
    if (type === "artists") {
      switch (timeRangeValue) {
        case timeRange.long:
          return MOCK_ARTISTS_YEARLY;
        case timeRange.medium:
          return MOCK_ARTISTS_MONTHLY;
        case timeRange.short:
        default:
          return MOCK_ARTISTS_DAILY;
      }
    } else {
      switch (timeRangeValue) {
        case timeRange.long:
          return MOCK_TRACKS_YEARLY;
        case timeRange.medium:
          return MOCK_TRACKS_MONTHLY;
        case timeRange.short:
        default:
          return MOCK_TRACKS_DAILY;
      }
    }
  }

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

  if (session.user.id === "demo") {
    return MOCK_TRACKS;
  }

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
