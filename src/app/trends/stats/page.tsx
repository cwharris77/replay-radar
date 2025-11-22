import { Carousel, StatsHeatmap } from "@/components";
import {
  buildContinuousDailyArray,
  getUserDailySummaries,
} from "@/lib/models/DailySummary";
import { getServerAuthData } from "@/lib/serverAuth";
import { buildWeeklyGrid } from "@/utils/trends";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const { session } = await getServerAuthData();
  if (!session) return redirect("/login");

  const summaries = await getUserDailySummaries(session.user.id);
  const daily = buildContinuousDailyArray(summaries);
  const grid = buildWeeklyGrid(daily);

  return (
    <>
      <h1>Stats</h1>
      <div className='w-full h-full '>
        <Carousel
          baseWidth={300}
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
        <StatsHeatmap grid={grid} />
      </div>
    </>
  );
}
