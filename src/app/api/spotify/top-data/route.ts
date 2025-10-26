import { authOptions } from "@/auth/authOptions";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import { refreshSpotifyToken } from "@/lib/spotify";
import { Artist, Track } from "@/types";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

type SpotifyDataType = "artists" | "tracks";
type TimeRange = "short_term" | "medium_term" | "long_term";

interface SpotifyResponse {
  items: Artist[] | Track[];
}

async function fetchFromSpotify(
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

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.accessToken || !session.user.refreshToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const timeRange = (searchParams.get("time_range") ||
      "short_term") as TimeRange;

    if (!typeParam || !isValidType(typeParam)) {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    const type = typeParam as SpotifyDataType;
    const userId = session.user.id;

    // Check cache first
    const cachedData = await SpotifyCache.getCache(userId, type, timeRange);
    if (cachedData) {
      return NextResponse.json({ items: cachedData.data });
    }

    let accessToken = session.user.accessToken;

    // Check if token expired
    const now = Date.now();
    if (session.user.expiresAt && session.user.expiresAt < now) {
      try {
        const refreshed = await refreshSpotifyToken(session.user.refreshToken);
        accessToken = refreshed.access_token;
        session.user.accessToken = accessToken;
        session.user.expiresAt = now + refreshed.expires_in * 1000;
      } catch (err) {
        console.error("Failed to refresh token:", err);
        return NextResponse.json(
          { error: "Spotify token expired" },
          { status: 401 }
        );
      }
    }

    const data = await fetchFromSpotify(type, timeRange, accessToken);

    // Cache the new data
    await SpotifyCache.setCache(userId, type, data.items, timeRange);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidType(type: string): type is SpotifyDataType {
  return type === "artists" || type === "tracks";
}
