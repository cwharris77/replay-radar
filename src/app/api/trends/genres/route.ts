import { requireSession } from "@/lib/auth";
import { getGenreSnapshotCollection } from "@/lib/models/GenreSnapshot";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 12);
    const maxSeries = Number(searchParams.get("maxSeries") || 5);
    const timeRange = (searchParams.get("timeRange") || "medium_term") as
      | "short_term"
      | "medium_term"
      | "long_term";

    const collection = await getGenreSnapshotCollection();

    const snapshots = await collection
      .find({ userId: session.user.id, timeRange })
      .sort({ takenAt: -1 })
      .limit(limit)
      .toArray();

    if (snapshots.length === 0) {
      return NextResponse.json({
        labels: [],
        series: [],
        type: "genres",
        timeRange,
      });
    }

    const chronological = [...snapshots].reverse();
    const labels = chronological.map((s) =>
      new Date(s.takenAt).toLocaleDateString()
    );

    // Determine top genres by most recent snapshot counts
    const latestCounts = chronological[chronological.length - 1].counts;
    const topGenres = Object.entries(latestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxSeries)
      .map(([genre]) => genre);

    const series = topGenres.map((genre) => {
      const data = chronological.map((snap) => snap.counts[genre] ?? 0);
      return { id: genre, name: genre, data };
    });

    return NextResponse.json({ labels, series, type: "genres", timeRange });
  } catch (err) {
    console.error("[GenresTrendsAPI] Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
