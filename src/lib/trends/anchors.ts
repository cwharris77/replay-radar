import { timeRange } from "@/app/constants";
import getSpotifyData from "@/lib/spotify/getSpotifyData";
import { TimeRange } from "@/types";

export type TimeKey = Extract<TimeRange, "long_term" | "medium_term">;

export interface AnchorRankItem {
  id: string;
  name: string;
  images?: { url: string }[];
  album?: { images?: { url: string }[] };
}

export interface AnchorRankResult {
  labels: string[]; // ["Long term", "Medium term"] when available
  rankMaps: Array<Map<string, number>>; // per-anchor id -> rank (1-based)
  mediumItems: AnchorRankItem[]; // items from medium_term, for candidate selection
}

export async function buildRankAnchors(
  type: "artists" | "tracks",
  accessToken?: string
): Promise<AnchorRankResult> {
  if (!accessToken) {
    return { labels: [], rankMaps: [], mediumItems: [] };
  }

  const ranges: Array<{ key: TimeKey; label: string }> = [
    { key: timeRange.long, label: "Long term" },
    { key: timeRange.medium, label: "Medium term" },
  ];

  const responses = await Promise.all(
    ranges.map((r) => getSpotifyData({ type, timeRange: r.key, accessToken }))
  );

  const rankMaps = responses.map((resp) => {
    const map = new Map<string, number>();
    resp.items.forEach((item, idx) => map.set(item.id, idx + 1));
    return map;
  });

  const mediumIndex = ranges.findIndex((r) => r.key === timeRange.medium);
  const mediumItems = (responses[mediumIndex] || { items: [] })
    .items as AnchorRankItem[];

  return { labels: ranges.map((r) => r.label), rankMaps, mediumItems };
}

export interface AnchorCountResult {
  labels: string[]; // ["Long term", "Medium term"] when available
  countsList: Record<string, number>[]; // per-anchor genre -> count
}

export async function buildGenreAnchors(
  accessToken?: string
): Promise<AnchorCountResult> {
  if (!accessToken) {
    return { labels: [], countsList: [] };
  }

  const ranges: Array<{ key: TimeKey; label: string }> = [
    { key: timeRange.long, label: "Long term" },
    { key: timeRange.medium, label: "Medium term" },
  ];

  const responses = await Promise.all(
    ranges.map((r) =>
      getSpotifyData({
        type: "artists",
        timeRange: r.key,
        accessToken,
        limit: 50,
      })
    )
  );

  const countsList = responses.map((resp) => {
    const counts = new Map<string, number>();
    resp.items.forEach((artist: { genres?: string[] }) => {
      (artist.genres || []).forEach((g: string) => {
        counts.set(g, (counts.get(g) || 0) + 1);
      });
    });
    return Object.fromEntries(counts);
  });

  return { labels: ranges.map((r) => r.label), countsList };
}
