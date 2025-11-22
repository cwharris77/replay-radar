"use client";

import { TREND_TIME_RANGES, TrendPeriod, trendPeriod } from "@/app/constants";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function TimeRangeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange =
    (searchParams.get("range") as TrendPeriod) || trendPeriod.daily;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className='flex items-center space-x-1 bg-muted p-1 rounded-lg'>
      {TREND_TIME_RANGES.map((range) => {
        const isActive = currentRange === range.value;
        return (
          <button
            key={range.value}
            onClick={() => {
              router.push(
                pathname + "?" + createQueryString("range", range.value)
              );
            }}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
