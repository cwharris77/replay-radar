import { timeRange } from "@/app/constants";
import TrendLineChart from "@/app/trends/components/TrendLineChart";
import { requireSession } from "@/lib/auth";
import { getTop5TrendData } from "@/utils/trends";
import { NextResponse } from "next/server";

export default async function Test() {
  const session = await requireSession();
  if (session instanceof NextResponse) return <></>;

  const { labels, series } = await getTop5TrendData(
    session?.user.id,
    timeRange.short
  );

  return (
    <TrendLineChart labels={labels} series={series} maxRank={5} mode='rank' />
  );
}
