import clientPromise from "../mongodb";
import { GenreSnapshot } from "./GenreSnapshot";

export interface AggregatedGenreSnapshot extends GenreSnapshot {
  // Inherits structure from GenreSnapshot
}

/**
 * Get the monthly top genres collection.
 */
export async function getMonthlyTopGenresCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedGenreSnapshot>("monthlyTopGenres");
}

/**
 * Get the yearly top genres collection.
 */
export async function getYearlyTopGenresCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME);
  return db.collection<AggregatedGenreSnapshot>("yearlyTopGenres");
}
