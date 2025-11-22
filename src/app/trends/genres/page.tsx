import { timeRange as timeRanges } from "@/app/constants";
import { authOptions } from "@/auth/authOptions";
import { LoginPrompt } from "@/components";
import { getTopGenreTrendData } from "@/utils/trends";
import { getServerSession } from "next-auth";
import TrendLineChart from "../components/TrendLineChart";

export default async function GenresPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
          Genre Trends
        </h1>
        <LoginPrompt
          title='Login to View Your Trends'
          message='Connect your Spotify account to see your listening trends over time.'
        />
      </div>
    );
  }

  const limit = 5;
  const { labels, series } = await getTopGenreTrendData({
    userId: session.user.id,
    timeRange: timeRanges.short,
    limit,
  });

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
        Genre Trends
      </h1>

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
          No trend data yet. Check back after the daily snapshot runs.
        </div>
      )}
    </div>
  );
}
