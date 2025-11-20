"use client";

import { TimeRange, timeRange, TopDataType } from "@/app/constants";
import { Artist, Track } from "@/types";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { isArtist, isTrack } from "../utils/defaults";

export function useNextAuth() {
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);

  const fetchSpotifyData = useCallback(
    async (type: TopDataType, timeRangeValue: TimeRange = timeRange.short) => {
      if (!session?.user?.accessToken) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/spotify/top-data?type=${type}&time_range=${timeRangeValue}`,
          {
            credentials: "include",
          }
        );

        const json = await response.json();

        if (!response.ok || "error" in json) {
          throw new Error(json.error ?? "Failed to fetch data");
        }

        if (type === "artists") {
          const artists = json.filter(isArtist);
          setTopArtists(artists);
        } else {
          const tracks = json.filter(isTrack);
          setTopTracks(tracks);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.accessToken]
  );

  const fetchRecentlyPlayed = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/spotify/recently-played", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recently played tracks");
      }

      const tracks: Track[] = await response.json();
      setRecentlyPlayed(tracks.filter(isTrack));
      setRecentlyPlayed(tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading" || loading,
    authError: error,
    topArtists,
    topTracks,
    fetchSpotifyData,
    fetchRecentlyPlayed,
    recentlyPlayed,
  };
}
