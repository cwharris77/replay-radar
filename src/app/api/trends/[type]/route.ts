import { requireSession } from "@/lib/auth";
import { getTopSnapshotCollection } from "@/lib/models/TopSnapshot";
import getSpotifyData from "@/lib/spotify/getSpotifyData";
import { NextRequest, NextResponse } from "next/server";

type AllowedType = "artists" | "tracks";

export async function GET(
  req: NextRequest,
  { params }: { params: { type: AllowedType } }
) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const type = params.type;
    if (type !== "artists" && type !== "tracks") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 12); // last N snapshots
    const maxSeries = Number(searchParams.get("maxSeries") || 5); // top N items to plot
    const timeRange = (searchParams.get("timeRange") || "medium_term") as
      | "short_term"
      | "medium_term"
      | "long_term";

    const collection = await getTopSnapshotCollection();

    // Get most recent N snapshots for this user/type/timeRange
    const snapshots = await collection
      .find({ userId: session.user.id, type, timeRange })
      .sort({ takenAt: -1 })
      .limit(limit)
      .toArray();

    // Fallback for first-time users: if no snapshots, build a 3-point trend
    // using live Spotify data across short/medium/long term
    if (snapshots.length === 0) {
      if (!session.user.accessToken) {
        return NextResponse.json({ labels: [], series: [] });
      }

      const fallbackRanges: ("short_term" | "medium_term" | "long_term")[] = [
        "short_term",
        "medium_term",
        "long_term",
      ];

      const responses = await Promise.all(
        fallbackRanges.map((tr) =>
          getSpotifyData(type, tr, session.user.accessToken || "")
        )
      );

      const labels = ["Short term", "Medium term", "Long term"];

      // Build rank maps per range: id -> rank (1-based)
      const rankMaps = responses.map((resp) => {
        const map = new Map<string, number>();
        resp.items.forEach((item, idx) => map.set(item.id, idx + 1));
        return map;
      });

      // Choose candidates from medium_term response (index 1) or first available
      const midIndex = 1;
      const midResp = (responses[midIndex] ||
        responses.find((r) => r) || { items: [] }) as {
        items: Array<{
          id: string;
          name: string;
          images?: { url: string }[];
          album?: { images?: { url: string }[] };
        }>;
      };
      const candidateItems = (midResp.items || []).slice(0, maxSeries);

      const series = candidateItems.map((item) => {
        const data = rankMaps.map((rm) => rm.get(item.id) ?? null);
        return {
          id: item.id,
          name: item.name,
          imageUrl:
            (type === "artists"
              ? item.images?.[0]?.url
              : item.album?.images?.[0]?.url) || null,
          data,
        };
      });

      return NextResponse.json({ labels, series, type, timeRange });
    }

    // Reverse to chronological order
    const chronological = [...snapshots].reverse();
    const labels = chronological.map((s) =>
      new Date(s.takenAt).toLocaleDateString()
    );

    // Build rank map per snapshot: id -> rank (1-based)
    const rankMaps = chronological.map((s) => {
      const map = new Map<string, number>();
      s.items.forEach((item, idx) => map.set(item.id, idx + 1));
      return map;
    });

    // Choose top items by their most recent rank
    const latest = chronological[chronological.length - 1];
    const candidateItems = latest.items.slice(0, maxSeries);

    const series = candidateItems.map((item) => {
      const data = rankMaps.map((rm) => rm.get(item.id) ?? null);
      return {
        id: item.id,
        name: item.name,
        imageUrl:
          (type === "artists"
            ? item.images?.[0]?.url
            : item.album?.images?.[0]?.url) || null,
        data, // ranks, null if missing
      };
    });

    return NextResponse.json({ labels, series, type, timeRange });
  } catch (err) {
    console.error("[TrendsAPI] Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
