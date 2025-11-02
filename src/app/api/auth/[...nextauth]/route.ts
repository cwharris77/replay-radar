import { createAuthOptions } from "@/auth/authOptions";
import NextAuth from "next-auth";

/**
 * NextAuth handler with dynamic URL support.
 * NextAuth v4 automatically detects the callback URL from the request headers,
 * which works perfectly for Vercel preview environments where each branch gets a unique URL.
 * The redirect URI sent to Spotify is automatically constructed from the request's origin.
 */
const handler = NextAuth(createAuthOptions());

export { handler as GET, handler as POST };
