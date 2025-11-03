import { timeRange } from "@/app/constants";
import { requireSession } from "@/lib/auth";
import {
  getArtistsSnapshotCollection,
  getTracksSnapshotCollection,
} from "@/lib/models/TopSnapshot";
import fetchFromSpotify from "@/lib/spotify/getSpotifyData";
import { SpotifyDataType, TimeRange } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

    const userId = session.user.id;
    const timeRangeValue: TimeRange = timeRange.short;
    const types: SpotifyDataType[] = ["artists", "tracks"];
    const artistsSnapshotCollection = await getArtistsSnapshotCollection();
    const tracksSnapshotCollection = await getTracksSnapshotCollection();

    for (const type of types) {
      const data = await fetchFromSpotify({
        type,
        timeRange: timeRange.medium,
        accessToken: session.user.accessToken,
      });

      // Use the appropriate collection based on type
      const collection =
        type === "artists"
          ? artistsSnapshotCollection
          : tracksSnapshotCollection;

      await collection.insertOne({
        userId,
        timeRange: timeRangeValue,
        items: data.items,
        takenAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Snapshot saved" });
  } catch (error: unknown) {
    console.error("Error creating top snapshot:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
