import { Artist, Track } from "@/types";
import clientPromise from "../mongodb";

interface CachedData {
  userId: string;
  type: "artists" | "tracks" | "recently-played";
  timeRange?: string;
  data: Artist[] | Track[];
  lastUpdated: Date;
}

export class SpotifyCache {
  // Cache durations in milliseconds
  private static CACHE_DURATIONS = {
    "recently-played": 60 * 60 * 1000, // 1 hour
    short_term: 24 * 60 * 60 * 1000, // 24 hours
    medium_term: 7 * 24 * 60 * 60 * 1000, // 1 week
    long_term: 30 * 24 * 60 * 60 * 1000, // 30 days
    default: 24 * 60 * 60 * 1000, // 24 hours
  };

  private static getCacheDuration(type: string, timeRange?: string): number {
    if (type === "recently-played") {
      return this.CACHE_DURATIONS["recently-played"];
    }

    if (timeRange && timeRange in this.CACHE_DURATIONS) {
      return this.CACHE_DURATIONS[
        timeRange as keyof typeof this.CACHE_DURATIONS
      ];
    }

    return this.CACHE_DURATIONS.default;
  }

  static async getCache(
    userId: string,
    type: "artists" | "tracks" | "recently-played",
    timeRange?: string
  ): Promise<CachedData | null> {
    const client = await clientPromise;
    const collection = client
      .db(process.env.MONGO_DB_NAME)
      .collection("top-data-cache");

    const cache = await collection.findOne<CachedData>({
      userId,
      type,
      ...(timeRange && { timeRange }),
    });

    if (!cache) return null;

    // Check if cache is expired based on type and time range
    const now = new Date();
    const cacheDuration = this.getCacheDuration(type, timeRange);
    if (now.getTime() - cache.lastUpdated.getTime() > cacheDuration) {
      // Cache is expired, delete it
      await collection.deleteOne({
        userId,
        type,
        ...(timeRange && { timeRange }),
      });
      return null;
    }

    return cache;
  }

  static async setCache(
    userId: string,
    type: "artists" | "tracks" | "recently-played",
    data: Artist[] | Track[],
    timeRange?: string
  ): Promise<void> {
    try {
      const client = await clientPromise;
      const collection = client
        .db(process.env.MONGO_DB_NAME)
        .collection("top-data-cache");

      const cacheData: CachedData = {
        userId,
        type,
        data,
        lastUpdated: new Date(),
        ...(timeRange && { timeRange }),
      };

      await collection.updateOne(
        {
          userId,
          type,
          ...(timeRange && { timeRange }),
        },
        { $set: cacheData },
        { upsert: true }
      );
    } catch (error) {
      console.error("Failed to cache data:", error);
      throw error;
    }
  }

  static async clearCache(userId: string): Promise<void> {
    const client = await clientPromise;
    const collection = client
      .db(process.env.MONGO_DB_NAME)
      .collection("top-data-cache");
    await collection.deleteMany({ userId });
  }
}
