import { Artist, Track } from "@/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

type SpotifyDataType = "artists" | "tracks";
type TimeRange = "short_term" | "medium_term" | "long_term";

interface SpotifyResponse {
  items: Artist[] | Track[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const timeRangeParam = searchParams.get("time_range") || "short_term";

    // Type validation
    if (!typeParam || !isValidType(typeParam)) {
      return NextResponse.json(
        { error: "Invalid type parameter. Must be 'artists' or 'tracks'" },
        { status: 400 }
      );
    }

    const type: SpotifyDataType = typeParam as SpotifyDataType;
    const timeRange: TimeRange = timeRangeParam as TimeRange;

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?limit=20&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Spotify API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Spotify" },
        { status: response.status }
      );
    }

    const data: SpotifyResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidType(type: string): type is SpotifyDataType {
  return type === "artists" || type === "tracks";
}
