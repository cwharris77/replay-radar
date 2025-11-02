import { createAuthOptions } from "@/auth/authOptions";
import NextAuth from "next-auth";

/**
 * NextAuth handler with static callback URL support.
 *
 * Strategy:
 * 1. Always use production URL as callback (configured via NEXTAUTH_URL)
 * 2. Store original origin in cookie before OAuth (done client-side)
 * 3. After callback, read cookie in redirect callback and redirect back to original origin
 */
const handler = NextAuth(createAuthOptions());

export { handler as GET, handler as POST };
