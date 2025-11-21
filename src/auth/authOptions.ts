import { getUserCollection, SpotifyTokens } from "@/lib/models/User";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { cookies } from "next/headers";

/**
 * Get the production base URL for the static callback.
 * This should be your production Vercel URL (e.g., https://your-app.vercel.app)
 */
export function getProductionBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://your-app.vercel.app"
  );
}

/**
 * Create auth options for NextAuth.
 * Uses a static callback URL (production URL) and redirects back to the original origin
 * after authentication. This allows preview deployments to work without wildcard redirect URIs.
 */
export function createAuthOptions(): NextAuthOptions {
  const productionBaseUrl = getProductionBaseUrl();
  const staticCallbackUrl = `${productionBaseUrl}/api/auth/callback/spotify`;

  return {
    providers: [
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        authorization: {
          url: "https://accounts.spotify.com/authorize",
          params: {
            scope: "user-read-recently-played user-top-read user-read-private",
            // Explicitly set the redirect_uri to the static production URL
            redirect_uri: staticCallbackUrl,
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        // Initial sign-in
        if (account) {
          token.accessToken = account.access_token;
          token.expiresAt = account.expires_at! * 1000;

          if (account?.refresh_token) {
            token.refreshToken = account.refresh_token;
          }

          // Fetch user role from database
          const users = await getUserCollection();
          const dbUser = await users.findOne({ _id: token.sub });
          token.role = dbUser?.role || "user";

          return token;
        }

        // If token is still valid, return it
        const now = Date.now();
        // Ensure expiresAt is a number
        const expiresAt = Number(token.expiresAt ?? 0);
        if (Number.isFinite(expiresAt) && now < expiresAt - 60_000) {
          // 60s buffer
          return token;
        }

        // Token is expired → refresh
        console.log("[AUTH] Access token expired, refreshing…");

        const refreshed = await refreshAccessToken(
          token.refreshToken as string
        );

        if (!refreshed || !refreshed.accessToken) {
          console.error("[AUTH] Failed to refresh access token");
          return token; // fallback (forces re-login soon)
        }

        // Update the token
        token.accessToken = refreshed.accessToken;
        token.expiresAt = refreshed.expiresAt;
        token.refreshToken = refreshed.refreshToken ?? token.refreshToken;

        return token;
      },
      async session({ session, token }) {
        session.user.id = token.sub as string;
        session.user.accessToken = token.accessToken as string | undefined;
        session.user.refreshToken = token.refreshToken as string | undefined;
        session.user.expiresAt = token.expiresAt as number | undefined;
        session.user.role = token.role as "user" | "admin" | undefined;
        return session;
      },
      /**
       * Redirect callback: After authentication, check for stored origin cookie
       * and redirect back to the original preview URL if present.
       */
      async redirect({ url, baseUrl }) {
        // Try to read the cookie to get the original origin
        // Note: In App Router, we need to use dynamic import for cookies
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const originalOrigin = cookieStore.get("auth_original_origin")?.value;

          if (originalOrigin) {
            // If we have an original origin and the redirect URL contains the base URL,
            // replace it with the original origin to send user back to preview URL
            if (url.startsWith(baseUrl)) {
              const path = url.replace(baseUrl, "");
              return `${originalOrigin}${path}`;
            }

            // If url is relative, prepend original origin
            if (url.startsWith("/")) {
              return `${originalOrigin}${url}`;
            }
          }
        } catch (error) {
          // If we can't read cookies, fall through to default behavior
          console.error("Error reading auth_original_origin cookie:", error);
        }

        // Default behavior: redirect to the callbackUrl if it's relative
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }

        // If url is absolute and on same origin, allow it
        if (url.startsWith(baseUrl)) {
          return url;
        }

        // Default: redirect to base URL
        return baseUrl;
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

        const cookieStore = await cookies();
        const tz = cookieStore.get("user_timezone")?.value || "UTC";

        // Validate TZ
        const validTZ = /^[A-Za-z_]+\/[A-Za-z_]+$/.test(tz) ? tz : "UTC";

        await users.updateOne(
          { _id: user.id },
          {
            $set: {
              name: user.name || undefined,
              email: user.email || undefined,
              spotify,
              updatedAt: new Date(),
              timeZone: validTZ,
            },
            $setOnInsert: {
              createdAt: new Date(),
              role: "user",
            },
          },
          { upsert: true }
        );
      },
    },
  };
}

// Export a default instance for backwards compatibility
// This uses the environment-based URL detection
export const authOptions = createAuthOptions();

export default authOptions;
