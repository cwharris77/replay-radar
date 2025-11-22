import { timeRange, trendPeriod } from "@/app/constants";
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
  GenreSnapshot,
  getGenreSnapshotCollection,
} from "@/lib/models/GenreSnapshot";
import {
  getArtistsSnapshotCollection,
  getTracksSnapshotCollection,
  TopSnapshot,
} from "@/lib/models/TopSnapshot";
import { getUserCollection } from "@/lib/models/User";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure this route is not cached

async function aggregateItems(
  snapshots: TopSnapshot[],
  limit: number = 20
): Promise<TopSnapshot["items"]> {
  // ... implementation unchanged ...
  const appearanceCounts = new Map<string, { count: number; item: any }>();

  snapshots.forEach((snap) => {
    snap.items.forEach((item) => {
      const current = appearanceCounts.get(item.id) || { count: 0, item };
      appearanceCounts.set(item.id, {
        count: current.count + 1,
        item: item,
      });
    });
  });

  // Sort by count descending
  const sortedItems = Array.from(appearanceCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => entry.item);

  return sortedItems;
}

async function aggregateGenres(
  snapshots: GenreSnapshot[],
  limit: number = 20
): Promise<Record<string, number>> {
  // ... implementation unchanged ...
  const genreCounts = new Map<string, number>();

  snapshots.forEach((snap) => {
    Object.entries(snap.counts).forEach(([genre, count]) => {
      const current = genreCounts.get(genre) || 0;
      genreCounts.set(genre, current + count);
    });
  });

  return Object.fromEntries(genreCounts);
}

export async function GET() {
  try {
    const usersCollection = await getUserCollection();
    const users = await usersCollection.find({}).toArray();

    const artistsCollection = await getArtistsSnapshotCollection();
    const tracksCollection = await getTracksSnapshotCollection();
    const genresCollection = await getGenreSnapshotCollection();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let processedUsers = 0;

    for (const user of users) {
      const userId = user._id;
      if (!userId) continue;

      // --- Monthly Aggregation ---
      const monthlyArtistsCollection = await getMonthlyTopArtistsCollection();
      const monthlyTracksCollection = await getMonthlyTopTracksCollection();
      const monthlyGenresCollection = await getMonthlyTopGenresCollection();

      // Fetch daily snapshots for this month
      const dailyArtists = await artistsCollection
        .find({
          userId,
          timeRange: timeRange.short,
          takenAt: { $gte: startOfMonth },
        })
        .toArray();

      const dailyTracks = await tracksCollection
        .find({
          userId,
          timeRange: timeRange.short,
          takenAt: { $gte: startOfMonth },
        })
        .toArray();

      const dailyGenres = await genresCollection
        .find({
          userId,
          timeRange: timeRange.short,
          takenAt: { $gte: startOfMonth },
        })
        .toArray();

      if (dailyArtists.length > 0) {
        const aggregatedArtists = await aggregateItems(dailyArtists);
        await monthlyArtistsCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.monthly,
            takenAt: startOfMonth, // Identify the month by its start date
          },
          {
            $set: {
              items: aggregatedArtists,
              takenAt: startOfMonth,
            },
          },
          { upsert: true }
        );
      }

      if (dailyTracks.length > 0) {
        const aggregatedTracks = await aggregateItems(dailyTracks);
        await monthlyTracksCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.monthly,
            takenAt: startOfMonth,
          },
          {
            $set: {
              items: aggregatedTracks,
              takenAt: startOfMonth,
            },
          },
          { upsert: true }
        );
      }

      if (dailyGenres.length > 0) {
        const aggregatedGenres = await aggregateGenres(dailyGenres);
        await monthlyGenresCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.monthly,
            takenAt: startOfMonth,
          },
          {
            $set: {
              counts: aggregatedGenres,
              takenAt: startOfMonth,
            },
          },
          { upsert: true }
        );
      }

      // --- Yearly Aggregation ---
      const yearlyArtistsCollection = await getYearlyTopArtistsCollection();
      const yearlyTracksCollection = await getYearlyTopTracksCollection();
      const yearlyGenresCollection = await getYearlyTopGenresCollection();

      // Fetch monthly snapshots for this year from the MONTHLY collection
      // Note: We just upserted the current month, so it's included.
      const monthlyArtists = await monthlyArtistsCollection
        .find({
          userId,
          timeRange: trendPeriod.monthly,
          takenAt: { $gte: startOfYear },
        })
        .toArray();

      const monthlyTracks = await monthlyTracksCollection
        .find({
          userId,
          timeRange: trendPeriod.monthly,
          takenAt: { $gte: startOfYear },
        })
        .toArray();

      const monthlyGenres = await monthlyGenresCollection
        .find({
          userId,
          timeRange: trendPeriod.monthly,
          takenAt: { $gte: startOfYear },
        })
        .toArray();

      if (monthlyArtists.length > 0) {
        const aggregatedArtists = await aggregateItems(monthlyArtists);
        await yearlyArtistsCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.yearly,
            takenAt: startOfYear,
          },
          {
            $set: {
              items: aggregatedArtists,
              takenAt: startOfYear,
            },
          },
          { upsert: true }
        );
      }

      if (monthlyTracks.length > 0) {
        const aggregatedTracks = await aggregateItems(monthlyTracks);
        await yearlyTracksCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.yearly,
            takenAt: startOfYear,
          },
          {
            $set: {
              items: aggregatedTracks,
              takenAt: startOfYear,
            },
          },
          { upsert: true }
        );
      }

      if (monthlyGenres.length > 0) {
        const aggregatedGenres = await aggregateGenres(monthlyGenres);
        await yearlyGenresCollection.updateOne(
          {
            userId,
            timeRange: trendPeriod.yearly,
            takenAt: startOfYear,
          },
          {
            $set: {
              counts: aggregatedGenres,
              takenAt: startOfYear,
            },
          },
          { upsert: true }
        );
      }

      processedUsers++;
    }

    return NextResponse.json({
      success: true,
      message: `Aggregated trends for ${processedUsers} users.`,
    });
  } catch (error) {
    console.error("Error aggregating trends:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
