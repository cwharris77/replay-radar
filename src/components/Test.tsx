import { timeRange } from "@/app/constants";
import TrendLineChart from "@/app/trends/components/TrendLineChart";
import { requireSession } from "@/lib/auth";
import { getTopItemTrendData } from "@/utils/trends";
import { NextResponse } from "next/server";

export default async function TopItemsTrends() {
  const session = await requireSession();
  if (session instanceof NextResponse) return <></>;
  const limit = 5;

  const { labels, series } = await getTopItemTrendData({
    userId: session?.user.id,
    timeRange: timeRange.short,
    limit,
    type: "artists",
  });

  // const {labels, series} = await getTopGenreTrendData({
  //   userId: session?.user.id,
  //   timeRange: timeRange.short,
  //   limit,
  // });

  console.log(series);

  return (
    <TrendLineChart labels={labels} series={series} maxRank={limit} mode='rank' />
  );
}
