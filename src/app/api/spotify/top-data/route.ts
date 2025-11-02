import { timeRange as timeRangeConst } from "@/app/constants";
import { requireSession } from "@/lib/auth";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import fetchFromSpotify from "@/lib/spotify/getSpotifyData";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { SpotifyDataType, TimeRange } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const timeRange = (searchParams.get("time_range") ||
      timeRangeConst.short) as TimeRange;

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
    if (session.user.expiresAt && Date.now() > session.user.expiresAt) {
      try {
        const { accessToken: refreshedAccessToken, expiresAt } =
          await refreshAccessToken(session.user.refreshToken || "");
        accessToken = refreshedAccessToken;
        session.user.accessToken = accessToken;
        session.user.expiresAt = expiresAt;
      } catch (err) {
        console.error("Failed to refresh token:", err);
        return NextResponse.json(
          { error: "Spotify token expired" },
          { status: 401 }
        );
      }
    }

    const data = await fetchFromSpotify({ type, timeRange, accessToken });

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
