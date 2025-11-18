import { timeRange } from "@/app/constants";
import { requireSession } from "@/lib/auth";
import {
  getArtistsSnapshotCollection,
  getTracksSnapshotCollection,
} from "@/lib/models/TopSnapshot";
import { fetchSpotifyData } from "@/lib/spotify/spotify";
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
      const data = await fetchSpotifyData({
        type,
        timeRangeValue: timeRange.medium,
        session,
      });

      // Use the appropriate collection based on type
      const collection =
        type === "artists"
          ? artistsSnapshotCollection
          : tracksSnapshotCollection;

      await collection.insertOne({
        userId,
        timeRange: timeRangeValue,
        items: data,
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
