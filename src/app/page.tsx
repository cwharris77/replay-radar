"use client";
import { Artist } from "@/types";
import { Suspense } from "react";
import About from "./components/About";
import DashboardSummary from "./components/DashboardSummary";
import ErrorDisplay from "./components/ErrorDisplay";
import Loading from "./components/Loading";
import { useNextAuth } from "./hooks/useNextAuth";
import { createDefaultArtist } from "./utils/defaults";

export default function Home() {
  const { isAuthenticated, isLoading, topArtists, topTracks, recentlyPlayed } =
    useNextAuth();

  const topArtist: Artist = topArtists[0] || createDefaultArtist();

  const totalMinutes =
    topTracks.length > 0
      ? Math.round(
          topTracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0) /
            60000
        )
      : 0;

  const trendData = [5, 10, 8, 15, 12, 20, 18, 25, 22];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen p-4 bg-black text-white'>
        <Loading size='2xl' />
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 min-h-screen p-4 bg-black text-white'>
      <Suspense fallback={null}>
        <ErrorDisplay />
      </Suspense>
      {!isAuthenticated ? (
        <About />
      ) : (
        <DashboardSummary
          topArtist={topArtist}
          topTracks={topTracks}
          totalMinutes={totalMinutes}
          trendData={trendData}
          recentlyPlayed={recentlyPlayed}
        />
      )}
    </div>
  );
}
