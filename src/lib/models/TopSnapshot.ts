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
  type: "artists" | "tracks";
  timeRange: "short_term" | "medium_term" | "long_term";
  items: TopItem[];
  takenAt: Date;
}

export async function getTopSnapshotCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<TopSnapshot>("topSnapshots");
}
