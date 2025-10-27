import { authOptions } from "@/auth/authOptions";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

/**
 * Fetches the current session and enforces authentication.
 * Throws or returns a NextResponse with 401 if not logged in.
 */
export async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken || !session.user.refreshToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return session;
}
