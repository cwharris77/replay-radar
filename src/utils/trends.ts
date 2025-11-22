import {
  timeRange,
  TimeRange,
  TrendPeriod,
  trendPeriod,
} from "@/app/constants";
import {
  getMonthlyTopGenresCollection,
  getYearlyTopGenresCollection,
} from "@/lib/models/AggregatedGenreSnapshot";
import {
  getMonthlyTopArtistsCollection,
  getMonthlyTopTracksCollection,
  getYearlyTopArtistsCollection,
  getYearlyTopTracksCollection,
} from "@/lib/models/AggregatedTopSnapshot";
import { getGenreSnapshotCollection } from "@/lib/models/GenreSnapshot";
import {
  getArtistsSnapshotCollection,
  getTracksSnapshotCollection,
} from "@/lib/models/TopSnapshot";

// ... interfaces ...

/**
 * Returns chart data (labels + series) showing historical top items (tracks/artists).
 */
export async function getTopItemTrendData({
  userId,
  period = trendPeriod.daily,
  limit = 5,
  type,
}: {
  userId: string;
  period?: TrendPeriod;
  limit?: number;
  type: "artists" | "tracks";
}): Promise<{
  labels: string[];
  series: { id: string; name: string; data: (number | null)[] }[];
}> {
  let collection;

  if (type === "artists") {
    if (period === trendPeriod.monthly) {
      collection = await getMonthlyTopArtistsCollection();
    } else if (period === trendPeriod.yearly) {
      collection = await getYearlyTopArtistsCollection();
    } else {
      collection = await getArtistsSnapshotCollection();
    }
  } else {
    // tracks
    if (period === trendPeriod.monthly) {
      collection = await getMonthlyTopTracksCollection();
    } else if (period === trendPeriod.yearly) {
      collection = await getYearlyTopTracksCollection();
    } else {
      collection = await getTracksSnapshotCollection();
    }
  }

  let timeRangeToFetch: TimeRange | TrendPeriod = timeRange.short;
  if (period === trendPeriod.monthly) timeRangeToFetch = trendPeriod.monthly;
  if (period === trendPeriod.yearly) timeRangeToFetch = trendPeriod.yearly;

  const snapshots = await collection
    .find({ userId, timeRange: timeRangeToFetch })
    .sort({ takenAt: 1 })
    .toArray();

  const labels = snapshots.map((snap) => {
    if (period === trendPeriod.monthly) {
      // Format: YYYY-MM
      const date = new Date(snap.takenAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else if (period === trendPeriod.yearly) {
      // Format: YYYY
      return `${new Date(snap.takenAt).getFullYear()}`;
    }
    return snap.takenAt.toISOString().slice(0, 10);
  });

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
      itemMap.get(item.id)!.data[idx] = rankIndex + 1;
    });
  });

  return { labels, series: Array.from(itemMap.values()) };
}

/**
 * Returns chart data (labels + series) showing historical top genres.
 */
export async function getGenreTrendData({
  userId,
  period,
  limit,
}: {
  userId: string;
  period: TrendPeriod;
  limit: number;
}): Promise<{
  labels: string[];
  series: { id: string; name: string; data: (number | null)[] }[];
}> {
  let collection;
  if (period === trendPeriod.monthly) {
    collection = await getMonthlyTopGenresCollection();
  } else if (period === trendPeriod.yearly) {
    collection = await getYearlyTopGenresCollection();
  } else {
    collection = await getGenreSnapshotCollection();
  }

  let timeRangeToFetch: TimeRange | TrendPeriod = timeRange.short;
  if (period === trendPeriod.monthly) timeRangeToFetch = trendPeriod.monthly;
  if (period === trendPeriod.yearly) timeRangeToFetch = trendPeriod.yearly;

  const snapshots = await collection
    .find({ userId, timeRange: timeRangeToFetch })
    .sort({ takenAt: 1 })
    .toArray();

  const labels = snapshots.map((snap) => {
    if (period === trendPeriod.monthly) {
      const date = new Date(snap.takenAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else if (period === trendPeriod.yearly) {
      return `${new Date(snap.takenAt).getFullYear()}`;
    }
    return snap.takenAt.toISOString().slice(0, 10);
  });

  const genreMap = new Map<
    string,
    { id: string; name: string; data: (number | null)[] }
  >();

  snapshots.forEach((snap, idx) => {
    const sortedGenres = Object.entries(snap.counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    sortedGenres.forEach((genre, rankIndex) => {
      const id = genre.name;
      if (!genreMap.has(id)) {
        genreMap.set(id, {
          id: id,
          name: genre.name,
          data: Array(snapshots.length).fill(null),
        });
      }
      genreMap.get(id)!.data[idx] = rankIndex + 1;
    });
  });

  return { labels, series: Array.from(genreMap.values()) };
}
