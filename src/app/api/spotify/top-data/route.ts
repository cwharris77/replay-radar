import { authOptions } from "@/auth/authOptions";
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

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.accessToken || !session.user.refreshToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let accessToken = session.user.accessToken;

    //Check if token expired
    const now = Date.now();
    if (session.user.expiresAt && session.user.expiresAt < now) {
      try {
        const refreshed = await refreshSpotifyToken(session.user.refreshToken);
        accessToken = refreshed.access_token;
        session.user.accessToken = accessToken;
        session.user.expiresAt = now + refreshed.expires_in * 1000;
        // Optional: update your MongoDB user with the new access token
      } catch (err) {
        console.error("Failed to refresh token:", err);
        return NextResponse.json(
          { error: "Spotify token expired" },
          { status: 401 }
        );
      }
    }

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const timeRangeParam = (searchParams.get("time_range") ||
      "short_term") as TimeRange;

    if (!typeParam || !isValidType(typeParam)) {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    const type: SpotifyDataType = typeParam as SpotifyDataType;

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?limit=20&time_range=${timeRangeParam}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Spotify API error:", text);
      return NextResponse.json(
        { error: "Failed to fetch from Spotify" },
        { status: response.status }
      );
    }

    const data: SpotifyResponse = await response.json();
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
