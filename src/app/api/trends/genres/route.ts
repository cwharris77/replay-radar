import { requireSession } from "@/lib/auth";
import { getGenreSnapshotCollection } from "@/lib/models/GenreSnapshot";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { buildGenreAnchors } from "@/lib/trends/anchors";
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

    // Ensure valid access token (refresh if expired)
    let accessToken = session.user.accessToken || "";
    const now = Date.now();
    if (session.user.expiresAt && session.user.expiresAt < now) {
      try {
        const { accessToken: refreshedAccessToken = "", expiresAt } =
          await refreshAccessToken(session.user.refreshToken || "");
        accessToken = refreshedAccessToken || "";
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

    const snapshots = await collection
      .find({ userId: session.user.id, timeRange })
      .sort({ takenAt: -1 })
      .limit(limit)
      .toArray();

    // Build anchors from live Spotify data (long_term, medium_term)
    const { labels: anchorLabels, countsList } = await buildGenreAnchors(
      accessToken
    );
    const anchors = anchorLabels.map((label, i) => ({
      label,
      counts: countsList[i],
    }));

    const chronological = [...snapshots].reverse();
    const snapshotLabels = chronological.map((s) =>
      new Date(s.takenAt).toLocaleDateString()
    );
    const labels = [...anchors.map((a) => a.label), ...snapshotLabels];

    const latestCounts: Record<string, number> | null =
      chronological.length > 0
        ? chronological[chronological.length - 1].counts
        : anchors.find((a) => a.label === "Medium term")?.counts ||
          anchors[0]?.counts ||
          null;

    if (!latestCounts) {
      return NextResponse.json({
        labels: [],
        series: [],
        type: "genres",
        timeRange,
      });
    }

    const topGenres = Object.entries(latestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxSeries)
      .map(([genre]) => genre);

    const series = topGenres.map((genre) => {
      const anchorData = anchors.map((a) => a.counts[genre] ?? 0);
      const snapshotData = chronological.map((snap) => snap.counts[genre] ?? 0);
      return { id: genre, name: genre, data: [...anchorData, ...snapshotData] };
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
