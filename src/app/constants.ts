export const timeRange = {
  short: "short_term",
  medium: "medium_term",
  long: "long_term",
} as const;

export type TimeRange = (typeof timeRange)[keyof typeof timeRange];

export const topDataTypes = {
  artists: "artists" as const,
  tracks: "tracks" as const,
};

export type TopDataType = (typeof topDataTypes)[keyof typeof topDataTypes];

export const trendPeriod = {
  daily: "daily",
  monthly: "monthly",
  yearly: "yearly",
} as const;

export type TrendPeriod = (typeof trendPeriod)[keyof typeof trendPeriod];

export const TIME_RANGES = [
  { label: "Last 4 Weeks", value: timeRange.short },
  { label: "Last 6 Months", value: timeRange.medium },
  { label: "This Year", value: timeRange.long },
];

export const TREND_TIME_RANGES = [
  { label: "Last 4 Weeks", value: trendPeriod.daily },
  { label: "Monthly", value: trendPeriod.monthly },
  { label: "Yearly", value: trendPeriod.yearly },
];
