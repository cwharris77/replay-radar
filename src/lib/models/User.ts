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
}

export async function getUserCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  return db.collection<User>("users");
}
