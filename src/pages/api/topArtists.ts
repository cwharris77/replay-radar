import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "./authenticate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = await authenticate(req, res);

  if (!accessToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const response = await fetch(
    // todo: update so user can select number of artists/time range
    "https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Spotify API error:", error);
    res.status(response.status).json({ error });
    return;
  }

  const data = await response.json();

  res.status(200).json(data);
}
