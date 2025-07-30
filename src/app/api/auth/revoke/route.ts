import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // Revoke the access token with Spotify
    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: session.accessToken,
      }),
    });

    if (response.ok) {
      return NextResponse.json({
        message: "Access revoked successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to revoke access" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error revoking access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
