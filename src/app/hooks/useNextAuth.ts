"use client";

import { timeRange } from "@/app/constants";
import { Artist, Track } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { isArtist, isTrack } from "../utils/defaults";

interface SpotifyData {
  items: Artist[] | Track[];
}

export function useNextAuth() {
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);

  const fetchSpotifyData = async (
    type: "artists" | "tracks",
    timeRangeValue: string = timeRange.short
  ) => {
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

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: SpotifyData = await response.json();

      if (type === "artists") {
        const artists = data.items.filter(isArtist);
        setTopArtists(artists);
      } else {
        const tracks = data.items.filter(isTrack);
        setTopTracks(tracks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
