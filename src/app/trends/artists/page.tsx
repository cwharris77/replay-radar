import { trendPeriod, TrendPeriod } from "@/app/constants";
import { authOptions } from "@/auth/authOptions";
import { LoginPrompt } from "@/components";
import { getTopItemTrendData } from "@/utils/trends";
import { getServerSession } from "next-auth";
import { TimeRangeSelector } from "../components/TimeRangeSelector";
import TrendLineChart from "../components/TrendLineChart";

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
          Artist Trends
        </h1>
        <LoginPrompt
          title='Login to View Your Trends'
          message='Connect your Spotify account to see your listening trends over time.'
        />
      </div>
    );
  }

  const range = (params.range as TrendPeriod) || trendPeriod.daily;
  const limit = 5;
  const { labels, series } = await getTopItemTrendData({
    userId: session.user.id,
    period: range,
    limit,
    type: "artists",
  });

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
          Artist Trends
        </h1>
        <TimeRangeSelector />
      </div>

      {series.length > 0 ? (
        <div className='bg-card border border-border rounded-xl p-4'>
          <TrendLineChart
            labels={labels}
            series={series}
            maxRank={limit}
            mode='rank'
          />
        </div>
      ) : (
        <div className='bg-card border border-border rounded-xl p-4 text-muted-foreground'>
          No trend data yet for this time range.
        </div>
      )}
    </div>
  );
}
