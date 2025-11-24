import { requireSession } from "@/lib/auth";
import { SpotifyCache } from "@/lib/models/SpotifyCache";
import { fetchRecentlyPlayed } from "@/lib/spotify/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

    const userId = session.user.id;

    // Check cache first (skip for demo)
    if (userId !== "demo") {
      const cachedData = await SpotifyCache.getCache(userId, "recently-played");

      if (cachedData) {
        return NextResponse.json(cachedData.data);
      }
    }

    const recentTracks = await fetchRecentlyPlayed(session);

    // Cache the transformed data
    if (userId !== "demo") {
      await SpotifyCache.setCache(userId, "recently-played", recentTracks);
    }

    return NextResponse.json(recentTracks);
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
