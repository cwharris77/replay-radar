import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID ? "Set" : "Missing",
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET ? "Set" : "Missing",
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? "Set" : "Missing",
  });
}
