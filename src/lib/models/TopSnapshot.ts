import { TimeRange } from "@/app/constants";
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb";

export interface TopItem {
  id: string;
  name: string;
  popularity: number;
  genres?: string[];
  images?: { url: string }[];
  external_urls?: { spotify: string };
  // For tracks
  artists?: { name: string; id: string }[];
  album?: { name: string; images?: { url: string }[] };
}

export interface TopSnapshot {
  _id?: ObjectId;
  userId: string;
  timeRange: TimeRange;
  items: TopItem[];
  takenAt: Date;
}

/**
 * Get the artists snapshot collection.
 * Separated from tracks for better query performance and clarity.
 */
export async function getArtistsSnapshotCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<TopSnapshot>("artistsSnapshots");
}

/**
 * Get the tracks snapshot collection.
 * Separated from artists for better query performance and clarity.
 */
export async function getTracksSnapshotCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<TopSnapshot>("tracksSnapshots");
}
