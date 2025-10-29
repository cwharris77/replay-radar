import { getTopSnapshotCollection } from "@/lib/models/TopSnapshot";
import { getUserCollection } from "@/lib/models/User";
import getSpotifyData from "@/lib/spotify/getSpotifyData";
import { refreshAccessToken } from "@/lib/spotify/refreshAccessToken";
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

    const users = await usersCollection.find({}).toArray();

    for (const user of users) {
      let { accessToken, expiresAt, refreshToken } = user.spotify;

      // Refresh if expired
      if (true || Date.now() > expiresAt) {
        const tokenData = await refreshAccessToken(refreshToken);
        accessToken = tokenData.accessToken || accessToken;
        expiresAt = tokenData.expiresAt || expiresAt;
        refreshToken = tokenData.refreshToken || refreshToken;

        console.log(
          `Refreshed token for user ${user._id}\nAccess Token: ${accessToken}\nExpires At: ${expiresAt} refreshToken: ${refreshToken}`
        );

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

      const types: ("artists" | "tracks")[] = ["artists", "tracks"];
      for (const type of types) {
        const data = await getSpotifyData(type, "medium_term", accessToken);
        await topSnapshotCollection.insertOne({
          userId: user._id?.toString() || "",
          type,
          timeRange: "medium_term",
          items: data.items,
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
