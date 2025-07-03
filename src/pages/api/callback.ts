import * as cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user denied authorization
  const error = req.query.error as string;
  const errorDescription = req.query.error_description as string;

  if (error) {
    console.log("Authorization denied:", error, errorDescription);

    if (error === "access_denied") {
      // User clicked "Cancel" or denied permission
      res.redirect(
        "/?error=access_denied&message=Authorization was denied. Please try again."
      );
      return;
    }

    res.redirect(
      `/?error=${error}&message=${
        errorDescription || "An error occurred during login"
      }`
    );
    return;
  }

  const code = req.query.code as string;

  if (!code) {
    res.redirect("/?error=no_code&message=No authorization code received");
    return;
  }

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    res.status(tokenResponse.status).json({ error: tokenData });
    return;
  }

  res.setHeader("Set-Cookie", [
    cookie.serialize("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
      sameSite: "lax",
    }),
    cookie.serialize("spotify_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    }),
  ]);

  res.redirect("/");
}
