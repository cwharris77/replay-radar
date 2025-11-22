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

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: userTz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date(play.playedAt));
    const year = parts.find((p) => p.type === "year")!.value;
    const month = parts.find((p) => p.type === "month")!.value;
    const dayNum = parts.find((p) => p.type === "day")!.value;

    const dayKey = `${year}-${month}-${dayNum}`; // YYYY-MM-DD
    const bucketKey = `${userId}:${dayKey}`;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, { userId, day: dayKey, plays: [] });
    }
    buckets.get(bucketKey)!.plays.push(play);
  }

  const toMs = (p: Play) =>
    typeof p.playedAt === "string"
      ? Date.parse(p.playedAt)
      : p.playedAt.getTime();

  /** Aggregate per bucket */
  for (const { userId, day, plays } of buckets.values()) {
    // Sort by playedAt ascending
    plays.sort((a, b) => toMs(a) - toMs(b));
    let totalMs = 0;

    for (let i = 0; i < plays.length; i++) {
      const current = plays[i];
      const next = plays[i + 1];

      if (!next) {
        totalMs += current.durationMs;
        break;
      }

      const delta = toMs(next) - toMs(current);

      totalMs += Math.min(delta, current.durationMs);
    }

    const minutes = Math.round(totalMs / 1000 / 60);

    await dailyCollection.updateOne(
      { userId, day },
      {
        $inc: { minutes, trackCount: plays.length || 0 },
        $set: { updatedAt: new Date() },
      },
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

  return NextResponse.json({
    success: true,
  });
}
