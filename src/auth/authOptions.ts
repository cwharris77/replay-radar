import clientPromise from "@/lib/mongodb";
import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-recently-played user-top-read user-read-private",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at! * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string | undefined;
      session.user.refreshToken = token.refreshToken as string | undefined;
      session.user.expiresAt = token.expiresAt as number | undefined;
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db("replay-radar");
      const users = db.collection("users");

      await users.updateOne(
        { userId: user.id },
        {
          $set: {
            userId: user.id,
            name: user.name,
            email: user.email,
            accessToken: account?.access_token,
            refreshToken: account?.refresh_token,
            joinedAt: new Date(),
          },
        },
        { upsert: true }
      );
    },
  },
};

export default authOptions;
