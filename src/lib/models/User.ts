import { Collection } from "mongodb";
import clientPromise from "../mongodb";

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp in ms
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  spotify: SpotifyTokens;
  createdAt?: Date;
  updatedAt?: Date;
  timeZone?: string;
  role?: "user" | "admin";
}

export async function getUserCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_NAME || "replay-radar-dev");
  return db.collection<User>("users");
}

export async function getUserById(userId?: string): Promise<User | null> {
  if (!userId) return null;

  const users = await getUserCollection();

  return await users.findOne({ _id: userId });
}
