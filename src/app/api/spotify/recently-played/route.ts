import { authOptions } from "@/auth/authOptions";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import { refreshSpotifyToken } from "@/lib/spotify";
import { Track } from "@/types";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

interface SpotifyRecentlyPlayedResponse {
  items: {
    track: Track;
    played_at: string;
  }[];
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.accessToken || !session.user.refreshToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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
      const refreshedTokenResponse = await refreshSpotifyToken(
        session.user.refreshToken
      );
      if (!refreshedTokenResponse || !refreshedTokenResponse.access_token) {
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 401 }
        );
      }
      accessToken = refreshedTokenResponse.access_token;
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
