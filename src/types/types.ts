export type TrackRank = {
  trackId: string;
  rank: number;
};

export type DayData = {
  date: string;
  tracks: TrackRank[];
};

export type Series = {
  id: string;
  name: string;
  imageUrl?: string | null;
  data: Array<number | null>;
};
