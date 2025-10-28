import { requireSession } from "@/lib/auth";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { Track } from "@/types";
import { NextResponse } from "next/server";

interface SpotifyRecentlyPlayedResponse {
  items: {
    track: Track;
    played_at: string;
  }[];
}

export async function GET() {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

    const userId = session.user.id;

    // Check cache first
    const cachedData = await SpotifyCache.getCache(userId, "recently-played");

    if (cachedData) {
      return NextResponse.json(cachedData.data);
    }

    let accessToken = session.user.accessToken;

    // Check if token expired
    const now = Date.now();
    if (session.user.expiresAt && session.user.expiresAt < now) {
      const { accessToken: refreshedAccessToken } = await refreshAccessToken(
        session.user.refreshToken || ""
      );

      if (!refreshedAccessToken) {
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 401 }
        );
      }
      accessToken = refreshedAccessToken;
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=20",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable cache
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: "Failed to fetch recently played tracks",
          details: errorText,
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as SpotifyRecentlyPlayedResponse;

    // Transform the response to include played_at timestamp
    const recentTracks = data.items.map((item) => ({
      ...item.track,
      played_at: item.played_at,
    }));

    // Cache the transformed data
    await SpotifyCache.setCache(userId, "recently-played", recentTracks);

    return NextResponse.json(recentTracks);
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
