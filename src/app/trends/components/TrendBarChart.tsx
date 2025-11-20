"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Series = {
  id: string;
  name: string;
  data: number[];
};

export interface TrendBarChartProps {
  labels: string[];
  series: Series[];
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

const COLOR_NAMES = ["Green", "Blue", "Amber", "Red", "Violet", "Teal", "Pink"];

export default function TrendBarChart({ labels, series }: TrendBarChartProps) {
  const data = useMemo<ChartData<"bar">>(() => {
    return {
      labels,
      datasets: series.map((s, idx) => {
        const color = COLORS[idx % COLORS.length];
        const colorName = COLOR_NAMES[idx % COLOR_NAMES.length];
        return {
          label: `${s.name} (${colorName})`,
          data: s.data,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        } as const;
      }),
    };
  }, [labels, series]);

  const options = useMemo<ChartOptions<"bar">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { display: true, position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx: TooltipItem<"bar">) => {
              const label = ctx.dataset?.label ?? "";
              const value = typeof ctx.parsed.y === "number" ? ctx.parsed.y : 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: { stacked: false, grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    };
  }, []);

  return (
    <div className='w-full h-[320px] md:h-[420px]'>
      <Bar data={data} options={options} />
    </div>
  );
}
