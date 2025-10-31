import { requireSession } from "@/lib/auth";
import { getTopSnapshotCollection } from "@/lib/models/TopSnapshot";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { buildRankAnchors } from "@/lib/trends/anchors";
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

    // Ensure valid access token (refresh if expired)
    let accessToken = session.user.accessToken || "";
    if (session.user.expiresAt && Date.now() > session.user.expiresAt) {
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

    // Get most recent N snapshots for this user/type/timeRange
    const snapshots = await collection
      .find({ userId: session.user.id, type, timeRange })
      .sort({ takenAt: -1 })
      .limit(limit)
      .toArray();

    // Build live anchors (Long/Medium) to extend earlier context
    const {
      labels: anchorLabels,
      rankMaps: anchorRankMaps,
      mediumItems,
    } = await buildRankAnchors(type, accessToken);

    // Fallback for first-time users: if no snapshots, build a 2-point (or 0) trend
    // using live Spotify data across long/medium term
    if (snapshots.length === 0) {
      if (!accessToken) {
        return NextResponse.json({ labels: [], series: [] });
      }

      const labels = anchorLabels;
      const rankMaps = anchorRankMaps;
      const candidateItems = (mediumItems || []).slice(0, maxSeries);

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

    // Reverse to chronological order and prepend anchors
    const chronological = [...snapshots].reverse();
    const labels = [
      ...anchorLabels,
      ...chronological.map((s) => new Date(s.takenAt).toLocaleDateString()),
    ];

    // Build rank map per snapshot: id -> rank (1-based)
    const rankMaps = [
      ...anchorRankMaps,
      ...chronological.map((s) => {
        const map = new Map<string, number>();
        s.items.forEach((item, idx) => map.set(item.id, idx + 1));
        return map;
      }),
    ];

    // Choose top items by their most recent rank
    const latest = chronological[chronological.length - 1];
    const candidateItems = (latest?.items || mediumItems).slice(0, maxSeries);

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
