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
  minutes: number; // total listening time in ms
  trackCount?: number; // number of plays
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

export function toUserLocalDay(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // "YYYY-MM-DD"
  return formatter.format(date);
}

export async function getDailySummary(userId: string, date: Date, tz: string) {
  const summaries = await getDailySummariesCollection();
  const dayKey = toUserLocalDay(date, tz);

  return await summaries.findOne({ userId, day: dayKey });
}

export async function getUserDailySummaries(userId: string) {
  const collection = await getDailySummariesCollection();

  return await collection
    .find({ userId })
    .sort({ day: 1 }) // ensure chronological order
    .toArray();
}

export function buildContinuousDailyArray(summaries: DailySummary[]) {
  if (summaries.length === 0) return [];

  const result = [];
  const summaryMap = new Map(summaries.map((s) => [s.day, s.trackCount ?? 0]));

  // Parse dates without timezone conversion
  const parseLocalDate = (dayStr: string) => {
    const [year, month, day] = dayStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseLocalDate(summaries[0].day);
  const end = parseLocalDate(summaries[summaries.length - 1].day);

  const cursor = new Date(start);

  while (cursor <= end) {
    // Format the cursor date as YYYY-MM-DD in local time
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const dayStr = `${year}-${month}-${day}`;

    result.push({ day: dayStr, count: summaryMap.get(dayStr) ?? 0 });

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}
