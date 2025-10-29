import { SpotifyRefreshErrorResponse, SpotifyRefreshResponse } from "@/types";
import fetch from "node-fetch";

function isSpotifyErrorResponse(
  data: SpotifyRefreshResponse
): data is SpotifyRefreshErrorResponse {
  return "error" in data;
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const data = (await response.json()) as SpotifyRefreshResponse;

    if (isSpotifyErrorResponse(data)) {
      console.error(
        "Spotify token refresh failed:",
        data.error,
        data.error_description
      );
      throw new Error(`Spotify refresh error: ${data.error}`);
    }

    if (!data.access_token) {
      console.error("[REFRESH] No access_token returned:", data);
      throw new Error("Spotify did not return an access token");
    }

    const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

    return {
      accessToken: data.access_token,
      expiresAt,
      refreshToken: data.refresh_token || refreshToken,
    };
  } catch (err) {
    console.error("[REFRESH] Error refreshing token:", err);
    return {};
  }
}
