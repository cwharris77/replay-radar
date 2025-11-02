import { timeRange } from "@/app/constants";
import { getGenreSnapshotCollection } from "@/lib/models/GenreSnapshot";
import { getTopSnapshotCollection } from "@/lib/models/TopSnapshot";
import { getUserCollection } from "@/lib/models/User";
import getSpotifyData from "@/lib/spotify/getSpotifyData";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
import { Artist, TimeRange } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cronToken = req.headers.get("authorization");
    if (cronToken !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const usersCollection = await getUserCollection();
    const topSnapshotCollection = await getTopSnapshotCollection();
    const genreSnapshotCollection = await getGenreSnapshotCollection();

    const users = await usersCollection.find({}).toArray();

    for (const user of users) {
      let { accessToken, expiresAt, refreshToken } = user.spotify;

      // Refresh if expired
      if (Date.now() > expiresAt) {
        const tokenData = await refreshAccessToken(refreshToken);
        accessToken = tokenData.accessToken || accessToken;
        expiresAt = tokenData.expiresAt || expiresAt;
        refreshToken = tokenData.refreshToken || refreshToken;

        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              "spotify.accessToken": accessToken,
              "spotify.expiresAt": expiresAt,
              "spotify.refreshToken": refreshToken,
              updatedAt: new Date(),
            },
          }
        );
      }

      for (const range of Object.values(timeRange) as TimeRange[]) {
        // Fetch artists and tracks separately for this timeRange
        const [artistsData, tracksData] = await Promise.all([
          getSpotifyData({ type: "artists", timeRange: range, accessToken }),
          getSpotifyData({ type: "tracks", timeRange: range, accessToken }),
        ]);

        await topSnapshotCollection.insertOne({
          userId: user._id?.toString() || "",
          type: "artists",
          timeRange: range,
          items: artistsData.items,
          takenAt: new Date(),
        });

        await topSnapshotCollection.insertOne({
          userId: user._id?.toString() || "",
          type: "tracks",
          timeRange: range,
          items: tracksData.items,
          takenAt: new Date(),
        });

        // Compute genre counts from artists
        // Type assertion safe here since type: "artists" guarantees Artist[]
        const artists = artistsData.items as Artist[];
        const genreCounts = new Map<string, number>();
        for (const artist of artists) {
          const genres = artist.genres || [];
          for (const g of genres) {
            genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
          }
        }

        await genreSnapshotCollection.insertOne({
          userId: user._id?.toString() || "",
          timeRange: range,
          counts: Object.fromEntries(genreCounts),
          takenAt: new Date(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Snapshots created for all users",
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
