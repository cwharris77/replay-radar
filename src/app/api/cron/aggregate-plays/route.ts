import { getDailySummariesCollection } from "@/lib/models/DailySummary";
import { getPlayCollection, Play } from "@/lib/models/Play";
import { getUserCollection } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cronToken = req.headers.get("authorization");
  if (cronToken !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const playsCollection = await getPlayCollection();
  const usersCollection = await getUserCollection();
  const dailyCollection = await getDailySummariesCollection();

  const users = await usersCollection.find({}).toArray();

  // Build a map of userId → timezone
  const tzMap = new Map(
    users.map((u) => [u._id!.toString(), u.timeZone || "UTC"])
  );

  const unprocessed = playsCollection.find({ processed: { $ne: true } });

  /** Group plays by (userId + local day) */
  const buckets = new Map<
    string,
    { userId: string; day: string; plays: Play[] }
  >();

  for await (const play of unprocessed) {
    const userId = play.userId;
    const userTz = tzMap.get(userId) ?? "UTC";

    const local = new Date(
      play.playedAt.toLocaleString("en-US", { timeZone: userTz })
    );

    const dayKey = local.toISOString().slice(0, 10); // YYYY-MM-DD
    const bucketKey = `${userId}:${dayKey}`;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, { userId, day: dayKey, plays: [] });
    }
    buckets.get(bucketKey)!.plays.push(play);
  }

  /** Aggregate per bucket */
  for (const { userId, day, plays } of buckets.values()) {
    // Sort by playedAt ascending
    plays.sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime());

    let totalMs = 0;

    for (let i = 0; i < plays.length; i++) {
      const current = plays[i];
      const next = plays[i + 1];

      if (!next) {
        totalMs += current.durationMs;
        break;
      }

      const delta = next.playedAt.getTime() - current.playedAt.getTime();

      totalMs += Math.min(delta, current.durationMs);
    }

    const minutes = Math.round(totalMs / 1000 / 60);

    await dailyCollection.updateOne(
      { userId, day },
      { $set: { minutes, updatedAt: new Date() } },
      { upsert: true }
    );

    // Mark plays processed
    const ids = plays.map((p) => p._id).filter((id): id is string => !!id);
    if (ids.length > 0) {
      await playsCollection.updateMany(
        { _id: { $in: ids } },
        { $set: { processed: true } }
      );
    }
  }

  return NextResponse.json({ success: true });
}
