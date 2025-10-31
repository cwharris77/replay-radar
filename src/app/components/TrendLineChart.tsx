"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Series = {
  id: string;
  name: string;
  imageUrl?: string | null;
  data: Array<number | null>;
};

export interface TrendLineChartProps {
  labels: string[];
  series: Series[];
  maxRank?: number;
  mode?: "rank" | "count";
}

const COLORS = [
  "#22c55e",
  "#60a5fa",
  "#f59e0b",
  "#ef4444",
  "#a78bfa",
  "#14b8a6",
  "#f472b6",
];

export default function TrendLineChart({ labels, series, maxRank = 20, mode = "rank" }: TrendLineChartProps) {
  const data = useMemo<ChartData<"line">>(() => {
    return {
      labels,
      datasets: series.map((s, idx) => {
        const color = COLORS[idx % COLORS.length];
        return {
          label: s.name,
          data: s.data,
          borderColor: color,
          backgroundColor: color,
          spanGaps: true,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.2,
        };
      }),
    };
  }, [labels, series]);

  const options = useMemo<ChartOptions<"line">>(() => {
    const isRank = mode === "rank";
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest" as const, intersect: false },
      plugins: {
        legend: { display: true, position: "bottom" as const },
        tooltip: {
          callbacks: {
            label: (ctx: TooltipItem<"line">) => {
              const label = ctx.dataset?.label ?? "";
              const value = typeof ctx.parsed.y === "number" ? ctx.parsed.y : null;
              if (value == null) return `${label}: ${isRank ? "not ranked" : 0}`;
              return isRank ? `${label}: #${value}` : `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: isRank
          ? {
              reverse: false,
              min: 1,
              max: maxRank,
              ticks: { stepSize: 1, callback: (v) => `#${v}` },
            }
          : {
              beginAtZero: true,
            },
      },
    };
  }, [maxRank, mode]);

  return (
    <div className='w-full h-[320px] md:h-[420px]'>
      <Line data={data} options={options} />
    </div>
  );
}


