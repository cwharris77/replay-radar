import clientPromise from "../mongodb";
import { TopSnapshot } from "./TopSnapshot";

export type AggregatedTopSnapshot = TopSnapshot;

/**
 * Get the monthly top artists collection.
 */
export async function getMonthlyTopArtistsCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedTopSnapshot>("monthlyTopArtists");
}

/**
 * Get the yearly top artists collection.
 */
export async function getYearlyTopArtistsCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedTopSnapshot>("yearlyTopArtists");
}

/**
 * Get the monthly top tracks collection.
 */
export async function getMonthlyTopTracksCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedTopSnapshot>("monthlyTopTracks");
}

/**
 * Get the yearly top tracks collection.
 */
export async function getYearlyTopTracksCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedTopSnapshot>("yearlyTopTracks");
}
