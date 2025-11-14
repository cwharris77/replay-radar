import { Collection } from "mongodb";
import clientPromise from "../mongodb";

export interface Play {
  _id?: string;
  userId: string;
  trackId: string;
  playedAt: Date; // Timestamp of when the track started (UTC)
  durationMs: number;
  processed?: boolean; // mark this play as processed for aggregation to avoid recalculating metrics
}

export async function getPlayCollection(): Promise<Collection<Play>> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || "replay-radar-dev");
  return db.collection<Play>("plays");
}
