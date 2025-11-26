import { getPlayCollection, Play } from "@/lib/models/Play";
import { getUserCollection } from "@/lib/models/User";
import { fetchRecentlyPlayed } from "@/lib/spotify/spotify";
import { Track } from "@/types";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cronToken = req.headers.get("authorization");
    if (cronToken !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const usersCollection = await getUserCollection();
    const playsCollection = await getPlayCollection();

    const users = await usersCollection.find({}).toArray();

    for (const user of users) {
      const userId = user._id!.toString();

      // Construct fake session for Spotify fetch
      const session: Session = {
        user: {
          id: userId,
          accessToken: user.spotify.accessToken,
          refreshToken: user.spotify.refreshToken,
          expiresAt: user.spotify.expiresAt,
        },
        expires: new Date(user.spotify.expiresAt).toISOString(),
      };

      const recentTracks: Track[] = await fetchRecentlyPlayed(session, 50);
      if (!recentTracks?.length) continue;

      for (const track of recentTracks) {
        const play: Play = {
          userId,
          trackId: track.id,
          playedAt: track.played_at!,
          durationMs: track.duration_ms,
          processed: false,
        };

        // Dedupe on user + playedAt
        await playsCollection.updateOne(
          { userId, trackId: track.id, playedAt: track.played_at! },
          { $setOnInsert: play },
          { upsert: true }
        );
      }
    }
    console.log(`Successfully fetched plays for ${users.length} users`);
    return NextResponse.json({
      success: true,
      message: `Successfully fetched plays for ${users.length} users`,
    });
  } catch (error) {
    console.error("Error fetching plays:", error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch plays: ${error}` },
      { status: 500 }
    );
  }
}
