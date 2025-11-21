import { timeRange as timeRanges } from "@/app/constants";
import { authOptions } from "@/auth/authOptions";
import { LoginPrompt } from "@/components";
import { getTopItemTrendData } from "@/utils/trends";
import { getServerSession } from "next-auth";
import TrendLineChart from "../components/TrendLineChart";

export default async function ArtistsPage() {
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
  const limit = 5
  const { labels, series } = await getTopItemTrendData({
    userId: session.user.id,
    timeRange: timeRanges.short,
    limit,
    type: "artists",
  });

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
        Artist Trends
      </h1>
      <p className='text-gray-300 mb-6'>
        Daily snapshots of your top artists. Lower rank number is better.
      </p>

      {series.length > 0 ? (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
          <TrendLineChart
            labels={labels}
            series={series}
            maxRank={limit}
            mode='rank'
          />
        </div>
      ) : (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-400'>
          No trend data yet. Check back after the daily snapshot runs.
        </div>
      )}
    </div>
  );
}
