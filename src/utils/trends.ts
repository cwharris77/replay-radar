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

import {
  MOCK_ARTIST_TRENDS_DAILY,
  MOCK_ARTIST_TRENDS_MONTHLY,
  MOCK_ARTIST_TRENDS_YEARLY,
  MOCK_GENRE_TRENDS_DAILY,
  MOCK_GENRE_TRENDS_MONTHLY,
  MOCK_GENRE_TRENDS_YEARLY,
  MOCK_TRACK_TRENDS_DAILY,
  MOCK_TRACK_TRENDS_MONTHLY,
  MOCK_TRACK_TRENDS_YEARLY,
  MOCK_TREND_LABELS_DAILY,
  MOCK_TREND_LABELS_MONTHLY,
  MOCK_TREND_LABELS_YEARLY,
} from "@/lib/demo/mockData";

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
  if (userId === "demo") {
    let labels = MOCK_TREND_LABELS_DAILY;
    let series: { id: string; name: string; data: (number | null)[] }[] =
      type === "artists" ? MOCK_ARTIST_TRENDS_DAILY : MOCK_TRACK_TRENDS_DAILY;

    if (period === trendPeriod.monthly) {
      labels = MOCK_TREND_LABELS_MONTHLY;
      series =
        type === "artists"
          ? MOCK_ARTIST_TRENDS_MONTHLY
          : MOCK_TRACK_TRENDS_MONTHLY;
    } else if (period === trendPeriod.yearly) {
      labels = MOCK_TREND_LABELS_YEARLY;
      series =
        type === "artists"
          ? MOCK_ARTIST_TRENDS_YEARLY
          : MOCK_TRACK_TRENDS_YEARLY;
    }

    return { labels, series };
  }

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
        case trendPeriod.daily:
          collection = await getArtistsSnapshotCollection();
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
        case trendPeriod.daily:
          collection = await getTracksSnapshotCollection();
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
    case trendPeriod.daily:
      timeRangeToFetch = timeRange.short;
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
  if (userId === "demo") {
    let labels = MOCK_TREND_LABELS_DAILY;
    let series: { id: string; name: string; data: (number | null)[] }[] =
      MOCK_GENRE_TRENDS_DAILY;

    if (period === trendPeriod.monthly) {
      labels = MOCK_TREND_LABELS_MONTHLY;
      series = MOCK_GENRE_TRENDS_MONTHLY;
    } else if (period === trendPeriod.yearly) {
      labels = MOCK_TREND_LABELS_YEARLY;
      series = MOCK_GENRE_TRENDS_YEARLY;
    }

    return { labels, series };
  }

  let collection;
  switch (period) {
    case trendPeriod.monthly:
      collection = await getMonthlyTopGenresCollection();
      break;
    case trendPeriod.yearly:
      collection = await getYearlyTopGenresCollection();
      break;
    case trendPeriod.daily:
      collection = await getGenreSnapshotCollection();
      break;
    default:
      throw new Error("Invalid period");
  }

  let timeRangeToFetch: TimeRange | TrendPeriod = timeRange.short;
  switch (period) {
    case trendPeriod.daily:
      timeRangeToFetch = timeRange.short;
      break;
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

export function buildWeeklyGrid(daily: { day: string; count: number }[]) {
  if (daily.length === 0) return [];

  const grid = [];

  // Find the first Sunday before the dataset begins
  const start = new Date(daily[0].day);
  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1);
  }

  // Find the last Saturday after the dataset ends
  const end = new Date(daily[daily.length - 1].day);
  while (end.getDay() !== 6) {
    end.setDate(end.getDate() + 1);
  }

  // Cursor across full range
  const cursor = start;
  let week = [];

  const dailyMap = new Map(daily.map((d) => [d.day, d.count]));

  const pad = (n: number) => String(n).padStart(2, "0");

  while (cursor <= end) {
    const dayStr = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(
      cursor.getDate()
    )}`;

    week.push({
      day: dayStr,
      count: dailyMap.get(dayStr) ?? 0,
    });

    if (cursor.getDay() === 6) {
      grid.push(week);
      week = [];
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return grid;
}
