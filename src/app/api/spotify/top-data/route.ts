import { requireSession } from "@/lib/auth";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import { refreshSpotifyToken } from "@/lib/spotify";
import fetchFromSpotify from "@/lib/spotify/getSpotifyData";
import { SpotifyDataType, TimeRange } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

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
        const refreshed = await refreshSpotifyToken(
          session.user.refreshToken || ""
        );
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

    const data = await fetchFromSpotify(type, timeRange, accessToken || "");

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
