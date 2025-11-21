import { TimeRange } from "@/app/constants";
import { getGenreSnapshotCollection } from "@/lib/models/GenreSnapshot";
import { getArtistsSnapshotCollection, getTracksSnapshotCollection } from "@/lib/models/TopSnapshot";

/**
 * Returns chart data (labels + series) showing historical top 5 tracks.
 * Each track that was ever in the top 5 is included.
 */
/**
 * Returns chart data (labels + series) showing historical top items (tracks/artists).
 */
export async function getTopItemTrendData({
  userId,
  timeRange,
  limit = 5,
  type,
}: {
  userId: string;
  timeRange: TimeRange;
  limit?: number;
  type: "artists" | "tracks";
}): Promise<{
  labels: string[];
  series: { id: string; name: string; data: (number | null)[] }[];
}> {
  const collection =
    type === "artists"
      ? await getArtistsSnapshotCollection()
      : await getTracksSnapshotCollection();

  // 1. Fetch all snapshots for this user/timeRange, sorted by date ascending
  const snapshots = await collection
    .find({ userId, timeRange })
    .sort({ takenAt: 1 })
    .toArray();

  // 2. Build labels and series
  const labels = snapshots.map((snap) =>
    snap.takenAt.toISOString().slice(0, 10)
  );

  // Map of itemId -> series object
  const itemMap = new Map<
    string,
    { id: string; name: string; data: (number | null)[] }
  >();

  snapshots.forEach((snap, idx) => {
    const topItems = snap.items.slice(0, limit);

    topItems.forEach((item, rankIndex) => {
      if (!itemMap.has(item.id)) {
        itemMap.set(item.id, {
          id: item.id,
          name: item.name,
          data: Array(snapshots.length).fill(null),
        });
      }

      // rankIndex 0 = #1
      itemMap.get(item.id)!.data[idx] = rankIndex + 1;
    });
  });

  const series = Array.from(itemMap.values());

  return { labels, series };
}

/**
 * Returns chart data (labels + series) showing historical top genres.
 */
export async function getTopGenreTrendData({
  userId,
  timeRange,
  limit = 5,
}: {
  userId: string;
  timeRange: TimeRange;
  limit?: number;
}): Promise<{
  labels: string[];
  series: { id: string; name: string; data: (number | null)[] }[];
}> {
  const collection = await getGenreSnapshotCollection();

  // 1. Fetch all snapshots for this user/timeRange, sorted by date ascending
  const snapshots = await collection
    .find({ userId, timeRange })
    .sort({ takenAt: 1 })
    .toArray();

  // 2. Build labels and series
  const labels = snapshots.map((snap) =>
    snap.takenAt.toISOString().slice(0, 10)
  );

  // Map of genre name -> series object (genres don't have IDs usually, using name as ID)
  const genreMap = new Map<
    string,
    { id: string; name: string; data: (number | null)[] }
  >();

  snapshots.forEach((snap, idx) => {
    // Convert counts to array of { name, count } and sort by count descending
    const sortedGenres = Object.entries(snap.counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    sortedGenres.forEach((genre, rankIndex) => {
      const id = genre.name; // Genres don't have IDs, use name
      if (!genreMap.has(id)) {
        genreMap.set(id, {
          id: id,
          name: genre.name,
          data: Array(snapshots.length).fill(null),
        });
      }

      // rankIndex 0 = #1
      genreMap.get(id)!.data[idx] = rankIndex + 1;
    });
  });

  const series = Array.from(genreMap.values());

  return { labels, series };
}
