export const dynamic = "force-dynamic";

import { getServerAuthData } from "@/lib/serverAuth";
import { Artist } from "@/types";
import { Suspense } from "react";
import About from "./components/About";
import DashboardSummary from "./components/DashboardSummary";
import ErrorDisplay from "./components/ErrorDisplay";
import Loading from "./components/Loading";
import { createDefaultArtist } from "./utils/defaults";

export default async function Home() {
  const { isAuthenticated, topArtists, topTracks, recentlyPlayed } =
    await getServerAuthData();

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 min-h-screen p-4 bg-black text-white'>
        <Suspense fallback={<Loading size='2xl' />}>
          <ErrorDisplay />
        </Suspense>
        <About />
      </div>
    );
  }

  const topArtist: Artist = topArtists[0] || createDefaultArtist();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalMinutes =
    recentlyPlayed.length > 0
      ? Math.round(
          recentlyPlayed
            .filter(
              (track) =>
                track.played_at && new Date(track.played_at) >= startOfToday
            )
            .reduce((acc, track) => acc + (track.duration_ms || 0), 0) / 60000
        )
      : 0;

  const trendData = [5, 10, 8, 15, 12, 20, 18, 25, 22];

  return (
    <div className='flex flex-col justify-center items-center gap-4 min-h-screen p-4 bg-black text-white'>
      <Suspense fallback={<Loading size='2xl' />}>
        <ErrorDisplay />
      </Suspense>

      <DashboardSummary
        topArtist={topArtist}
        topTracks={topTracks}
        totalMinutes={totalMinutes}
        trendData={trendData}
        recentlyPlayed={recentlyPlayed}
      />
    </div>
  );
}
