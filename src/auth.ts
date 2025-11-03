import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { getUserCollection, SpotifyTokens } from "./lib/models/User";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-read-recently-played user-top-read user-read-private",
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user, account }) {
      if (!account) return;

      const users = await getUserCollection();

      // Calculate token expiration
      const expiresAt = account.expires_at
        ? account.expires_at * 1000
        : Date.now() + 3600 * 1000; // fallback 1 hour

      const spotify: SpotifyTokens = {
        accessToken: account.access_token || "",
        refreshToken: account.refresh_token || "",
        expiresAt,
      };

      await users.updateOne(
        { _id: user.id },
        {
          $set: {
            name: user.name || undefined,
            email: user.email || undefined,
            spotify,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: { strategy: "jwt" },
});
