"use client";

import { TIME_RANGES, TimeRange } from "@/app/constants";
import clsx from "clsx";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  className?: string;
  buttonClassName?: string;
}

export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  buttonClassName = "",
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center px-2 sm:px-4",
        className
      )}
    >
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={clsx(
            "min-w-[90px] px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium sm:font-semibold transition-all duration-200 border border-border text-sm sm:text-base",
            selectedRange === range.value
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95",
            buttonClassName
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
