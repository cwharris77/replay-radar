import { timeRange } from "@/app/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "./authenticate";

export default async function fetchTopData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = await authenticate(req, res);

  if (!accessToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { endpoint, limit = "20", time_range = timeRange.long } = req.query;

  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${endpoint}?limit=${limit}&time_range=${time_range}`,
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
