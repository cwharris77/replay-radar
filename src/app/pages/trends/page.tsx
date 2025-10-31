"use client";

import ErrorCard from "@/app/components/ErrorCard";
import Loading from "@/app/components/Loading";
import TrendLineChart from "@/app/components/TrendLineChart";
import { useEffect, useMemo, useState } from "react";

type TabType = "artists" | "tracks" | "genres";

interface TrendsResponse {
  labels: string[];
  series: Array<{
    id: string;
    name: string;
    imageUrl?: string | null;
    data: (number | null)[];
  }>;
  type: TabType;
  timeRange: "short_term" | "medium_term" | "long_term";
}

export default function TrendsPage() {
  const [tab, setTab] = useState<TabType>("artists");
  const [data, setData] = useState<TrendsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const endpoint =
          tab === "genres" ? "/api/trends/genres" : `/api/trends/${tab}`;
        const res = await fetch(`${endpoint}?limit=12&maxSeries=5`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Failed to load trends");
        }
        const json = (await res.json()) as TrendsResponse;
        setData(json);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [tab]);

  const hasData = useMemo(
    () => data && data.labels.length > 0 && data.series.length > 0,
    [data]
  );

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
        Your Trends
      </h1>
      <p className='text-gray-300 mb-6'>
        Daily snapshots visualized over time. Lower rank number is better for
        artists/tracks; genres show listen counts.
      </p>

      <div className='flex gap-2 mb-6'>
        {(["artists", "tracks", "genres"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg border text-sm md:text-base transition-all ${
              tab === t
                ? "bg-green-600 text-white border-green-500"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            }`}
          >
            {t === "artists" ? "Artists" : t === "tracks" ? "Tracks" : "Genres"}
          </button>
        ))}
      </div>

      {loading && <Loading size='md' text='Loading trends...' />}
      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
          {hasData ? (
            <TrendLineChart
              labels={data!.labels}
              series={data!.series}
              maxRank={10}
              mode={tab === "genres" ? "count" : "rank"}
            />
          ) : (
            <div className='text-gray-400'>
              No trend data yet. Check back after the daily snapshot runs.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
