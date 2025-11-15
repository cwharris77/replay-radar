import { TimeRange } from "@/app/constants";
import { getTracksSnapshotCollection } from "@/lib/models/TopSnapshot";

/**
 * Returns chart data (labels + series) showing historical top 5 tracks.
 * Each track that was ever in the top 5 is included.
 */
export async function getTop5TrendData(
  userId: string,
  timeRange: TimeRange
): Promise<{
  labels: string[];
  series: { id: string; name: string; data: (number | null)[] }[];
}> {
  const collection = await getTracksSnapshotCollection();

  // 1. Fetch all snapshots for this user/timeRange, sorted by date ascending
  const snapshots = await collection
    .find({ userId, timeRange })
    .sort({ takenAt: 1 })
    .toArray();

  // 2. Build labels and series
  const labels = snapshots.map((snap) =>
    snap.takenAt.toISOString().slice(0, 10)
  );

  // Map of trackId -> series object
  const trackMap = new Map<
    string,
    { id: string; name: string; data: (number | null)[] }
  >();

  snapshots.forEach((snap, idx) => {
    const top5 = snap.items.slice(0, 5); // only care about top 5

    top5.forEach((track, rankIndex) => {
      if (!trackMap.has(track.id)) {
        trackMap.set(track.id, {
          id: track.id,
          name: track.name,
          data: Array(snapshots.length).fill(null),
        });
      }

      // rankIndex 0 = #1
      trackMap.get(track.id)!.data[idx] = rankIndex + 1;
    });
  });

  const series = Array.from(trackMap.values());

  return { labels, series };
}
