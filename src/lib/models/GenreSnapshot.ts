import { TimeRange, TrendPeriod } from "@/app/constants";
import clientPromise from "../mongodb";

export interface GenreSnapshot {
  userId: string;
  timeRange: TimeRange | TrendPeriod;
  counts: Record<string, number>; // genre -> count for this day
  takenAt: Date;
}

export async function getGenreSnapshotCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<GenreSnapshot>("genreSnapshots");
}
