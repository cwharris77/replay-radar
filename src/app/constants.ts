export const timeRange = {
  short: "short_term",
  medium: "medium_term",
  long: "long_term",
} as const;

export type TimeRange = (typeof timeRange)[keyof typeof timeRange];

export const userData = {
  artists: "artists",
  tracks: "tracks",
};

export const TIME_RANGES = [
  { label: "This Week", value: timeRange.short },
  { label: "Last 6 Months", value: timeRange.medium },
  { label: "All Time", value: timeRange.long },
];
