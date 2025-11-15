"use client";

import ErrorCard from "@/app/components/ErrorCard";
import Loading from "@/app/components/Loading";
import LoginPrompt from "@/app/components/LoginPrompt";
import TrendLineChart from "@/app/components/TrendLineChart";
import { timeRange as timeRanges } from "@/app/constants";
import { useNextAuth } from "@/app/hooks/useNextAuth";
import { TimeRange } from "@/types";
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
  timeRange: TimeRange;
}

export default function TrendsPage() {
  const { isAuthenticated, isLoading: authLoading } = useNextAuth();
  const [tab, setTab] = useState<TabType>("artists");
  const [data, setData] = useState<TrendsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const endpoint =
          tab === "genres" ? "/api/trends/genres" : `/api/trends/${tab}`;
        const res = await fetch(
          `${endpoint}?limit=12&maxSeries=7&timeRange=${timeRanges.short}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) {
          if (res.status === 401) {
            setError("Authentication required. Please log in.");
            return;
          }
          const errorData = await res
            .json()
            .catch(() => ({ error: "Failed to load trends" }));
          throw new Error(errorData.error || "Failed to load trends");
        }
        const json = (await res.json()) as TrendsResponse;

        // Format dates in user's local timezone
        // ISO date strings from API are converted to user's local date format
        const formattedLabels = json.labels.map((label) => {
          // Check if label is an ISO date string (format: YYYY-MM-DDTHH:mm:ss.sssZ)
          if (label.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            try {
              const date = new Date(label);
              if (!isNaN(date.getTime())) {
                // Format in user's local timezone
                return date.toLocaleDateString(undefined, {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                });
              }
            } catch {
              // If parsing fails, return original (e.g., "Long term", "Medium term")
            }
          }
          // Return non-date labels as-is (anchor labels like "Long term")
          return label;
        });

        setData({ ...json, labels: formattedLabels });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [tab, isAuthenticated]);

  const hasData = useMemo(
    () => data && data.labels.length > 0 && data.series.length > 0,
    [data]
  );

  if (authLoading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        <Loading size='md' text='Loading...' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
          Your Trends
        </h1>
        <LoginPrompt
          title='Login to View Your Trends'
          message='Connect your Spotify account to see your listening trends over time.'
        />
      </div>
    );
  }

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
