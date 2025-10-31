import { requireSession } from "@/lib/auth";
import { getTopSnapshotCollection } from "@/lib/models/TopSnapshot";
import fetchFromSpotify from "@/lib/spotify/getSpotifyData";
import { SpotifyDataType, TimeRange } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();

    if (session instanceof NextResponse) return session;

    const userId = session.user.id;
    const timeRange: TimeRange = "short_term";
    const types: SpotifyDataType[] = ["artists", "tracks"];
    const topSnapshotCollection = await getTopSnapshotCollection();

    for (const type of types) {
      const data = await fetchFromSpotify({
        type,
        timeRange: "medium_term",
        accessToken: session.user.accessToken,
      });

      await topSnapshotCollection.insertOne({
        userId,
        type: "artists",
        timeRange,
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
