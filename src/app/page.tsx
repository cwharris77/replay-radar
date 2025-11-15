export const dynamic = "force-dynamic";

import { getDailySummary } from "@/lib/models/DailySummary";
import { getUserById } from "@/lib/models/User";
import { getServerAuthData } from "@/lib/serverAuth";
import { Artist } from "@/types";
import { Suspense } from "react";
import About from "./components/About";
import DashboardSummary from "./components/DashboardSummary";
import ErrorDisplay from "./components/ErrorDisplay";
import Loading from "./components/Loading";
import { createDefaultArtist } from "./utils/defaults";

export default async function Home() {
  const { isAuthenticated, topArtists, topTracks, recentlyPlayed, session } =
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

  const user = await getUserById(session?.user.id);

  const dailySummary = await getDailySummary(
    user?._id || "",
    new Date(),
    user?.timeZone || "UTC"
  );

  return (
    <div className='flex flex-col justify-center items-center gap-4 min-h-screen p-4 bg-black text-white'>
      <Suspense fallback={<Loading size='2xl' />}>
        <ErrorDisplay />
      </Suspense>

      <DashboardSummary
        topArtist={topArtist}
        topTracks={topTracks}
        totalMinutes={dailySummary?.minutes ? dailySummary.minutes : 0}
        recentlyPlayed={recentlyPlayed}
      />
    </div>
  );
}
