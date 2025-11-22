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
import {
  getArtistsSnapshotCollection,
  getTracksSnapshotCollection,
} from "@/lib/models/TopSnapshot";

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
  switch (type) {
    case "artists":
      switch (period) {
        case trendPeriod.monthly:
          collection = await getMonthlyTopArtistsCollection();
          break;
        case trendPeriod.yearly:
          collection = await getYearlyTopArtistsCollection();
          break;
        default:
          collection = await getArtistsSnapshotCollection();
      }
      break;
    case "tracks":
      switch (period) {
        case trendPeriod.monthly:
          collection = await getMonthlyTopTracksCollection();
          break;
        case trendPeriod.yearly:
          collection = await getYearlyTopTracksCollection();
          break;
        default:
          collection = await getTracksSnapshotCollection();
      }
      break;
    default:
      throw new Error("Invalid type");
  }

  let timeRangeToFetch: TimeRange | TrendPeriod = timeRange.short;
  switch (period) {
    case trendPeriod.monthly:
      timeRangeToFetch = trendPeriod.monthly;
      break;
    case trendPeriod.yearly:
      timeRangeToFetch = trendPeriod.yearly;
      break;
    default:
      timeRangeToFetch = timeRange.short;
  }

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
  switch (period) {
    case trendPeriod.monthly:
      collection = await getMonthlyTopGenresCollection();
      break;
    case trendPeriod.yearly:
      collection = await getYearlyTopGenresCollection();
      break;
    default:
      throw new Error("Invalid period");
  }

  let timeRangeToFetch: TimeRange | TrendPeriod = timeRange.short;
  switch (period) {
    case trendPeriod.monthly:
      timeRangeToFetch = trendPeriod.monthly;
      break;
    case trendPeriod.yearly:
      timeRangeToFetch = trendPeriod.yearly;
      break;
    default:
      throw new Error("Invalid period");
  }

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
