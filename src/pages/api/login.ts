import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope = [
    "user-top-read",
    "user-read-recently-played",
    "user-read-email",
  ].join(" ");

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
