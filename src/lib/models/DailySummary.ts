import { Collection, Db } from "mongodb";
import clientPromise from "../mongodb";

/**
 * DailySummary:
 * Precomputed daily listening stats
 *
 * Each document represents a single user's listening summary for a single day.
 * Day is stored in "YYYY-MM-DD" format relative to the user's time zone.
 */
export interface DailySummary {
  _id?: string;
  userId: string;
  day: string; // "2025-11-13"
  totalMs: number; // total listening time in ms
  trackCount: number; // number of plays
  updatedAt: Date;
}

/**
 * Helper that returns the daily_summaries MongoDB collection.
 * Ensures indexes exist (idempotent).
 */
let cached: Collection<DailySummary> | null = null;

export async function getDailySummariesCollection(): Promise<
  Collection<DailySummary>
> {
  if (cached) return cached;

  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGO_DB_NAME || "replay-radar-dev");
  const collection = db.collection<DailySummary>("daily_summaries");

  // Ensure indexes — fast upsert & lookups
  // Combination of userId + day is unique.
  await collection.createIndex({ userId: 1, day: 1 }, { unique: true });
  await collection.createIndex({ day: 1 });
  await collection.createIndex({ updatedAt: 1 });

  cached = collection;
  return collection;
}
