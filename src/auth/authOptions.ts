import { getUserCollection, SpotifyTokens } from "@/lib/models/User";
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
      session.user.id = token.sub as string;
      session.user.accessToken = token.accessToken as string | undefined;
      session.user.refreshToken = token.refreshToken as string | undefined;
      session.user.expiresAt = token.expiresAt as number | undefined;
      return session;
    },
  },
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
};

export default authOptions;
