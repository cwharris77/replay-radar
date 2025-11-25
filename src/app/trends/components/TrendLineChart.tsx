"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

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
  orientation?: "horizontal" | "vertical" | "auto";
}

import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { generateDistinctColors } from "@/utils/colors";

export default function TrendLineChart({
  labels,
  series,
  maxRank = 20,
  mode = "rank",
  orientation = "auto",
}: TrendLineChartProps) {
  const isMobile = useIsMobile();
  const useHorizontal =
    orientation === "horizontal" || (isMobile && orientation === "auto");

  const data = useMemo<ChartData<"line">>(() => {
    const colors = generateDistinctColors(series.length);
    return {
      labels,
      datasets: series.map((s, idx) => {
        const color = colors[idx];
        return {
          label: s.name,
          data: s.data,
          borderColor: color,
          backgroundColor: color,
          spanGaps: false,
          // Larger points on mobile for better touch targets
          pointRadius: isMobile ? 4 : 3,
          pointHoverRadius: isMobile ? 7 : 5,
          // Thicker lines on mobile for better visibility
          borderWidth: isMobile ? 2.5 : 2,
          tension: 0.2,
        };
      }),
    };
  }, [labels, series, isMobile]);

  const options = useMemo<ChartOptions<"line">>(() => {
    const isRank = mode === "rank";
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: useHorizontal ? "x" : "y",
      interaction: {
        mode: "nearest" as const,
        intersect: false,
        // Larger interaction radius on mobile
        axis: useHorizontal ? "x" : "y",
      },
      // Add layout padding to prevent clipping
      layout: {
        padding: {
          top: 10,
          right: isMobile ? 10 : 15,
          bottom: 10,
          left: isMobile ? 5 : 10,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom" as const,
          labels: {
            // Smaller font on mobile to fit more items
            font: {
              size: isMobile ? 10 : 12,
            },
            padding: isMobile ? 8 : 10,
            boxWidth: isMobile ? 30 : 40,
          },
        },
        tooltip: {
          // Larger tooltips on mobile for touch interaction
          padding: isMobile ? 12 : 10,
          titleFont: {
            size: isMobile ? 13 : 12,
          },
          bodyFont: {
            size: isMobile ? 12 : 11,
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              return items[0].label; // Show date
            },
            label: (ctx: TooltipItem<"line">) => {
              const label = ctx.dataset?.label ?? "";
              const value =
                typeof ctx.parsed.y === "number" ? ctx.parsed.y : null;
              if (value == null) return `${label}: Not ranked`;
              return isRank ? `${label}: #${value}` : `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: useHorizontal
          ? // Horizontal: X is dates
            {
              grid: { display: false },
              ticks: {
                maxTicksLimit: 8,
                maxRotation: 0,
                minRotation: 0,
                font: {
                  size: isMobile ? 10 : 11,
                },
                autoSkip: true,
                autoSkipPadding: 5,
              },
            }
          : // Vertical: X is rank/count
          isRank
          ? {
              reverse: true,
              suggestedMin: 1,
              suggestedMax: maxRank,
              title: {
                display: true,
                text: "Rank",
                font: { size: isMobile ? 11 : 12 },
              },
              ticks: {
                stepSize: 1,
                precision: 0,
                callback: (v) => `#${v}`,
                font: { size: isMobile ? 10 : 11 },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            }
          : {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
                font: { size: isMobile ? 11 : 12 },
              },
              ticks: {
                font: { size: isMobile ? 10 : 11 },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
        y: useHorizontal
          ? // Horizontal: Y is rank/count
            isRank
            ? {
                reverse: true,
                suggestedMin: 1,
                suggestedMax: maxRank,
                title: {
                  display: true,
                  text: "Rank",
                  font: { size: isMobile ? 11 : 12 },
                },
                ticks: {
                  stepSize: 1,
                  precision: 0,
                  callback: (v) => `#${v}`,
                  font: { size: isMobile ? 10 : 11 },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              }
            : {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Count",
                  font: { size: isMobile ? 11 : 12 },
                },
                ticks: {
                  font: { size: isMobile ? 10 : 11 },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              }
          : // Vertical: Y is dates
            {
              grid: { display: false },
              ticks: {
                font: { size: isMobile ? 10 : 11 },
                autoSkip: true,
              },
            },
      },
    };
  }, [maxRank, mode, isMobile, useHorizontal]);

  return (
    <div
      className={cn(
        "w-full md:h-[420px]",
        useHorizontal ? "h-[280px]" : "h-screen"
      )}
    >
      <Line data={data} options={options} />
    </div>
  );
}
