"use client";

import { TimeRange, timeRange, TopDataType } from "@/app/constants";
import { Artist, Track } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
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

  const login = () => {
    // Store the current origin in a cookie before initiating OAuth
    // This allows the callback handler to redirect back to the preview URL
    const currentOrigin = window.location.origin;
    document.cookie = `auth_original_origin=${currentOrigin}; path=/; max-age=600; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    // Force both login and consent to ensure password entry
    signIn("spotify", {
      callbackUrl: "/",
      prompt: "login consent",
    });
  };

  const logout = async () => {
    const callbackUrl =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || window.location.origin;

    // First, try to revoke the Spotify token
    try {
      await fetch("/api/auth/revoke", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to revoke token:", error);
    }

    // Then clear the NextAuth session
    signOut({
      callbackUrl,
      redirect: true,
    });
  };

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading" || loading,
    authError: error,
    topArtists,
    topTracks,
    login,
    logout,
    fetchSpotifyData,
    fetchRecentlyPlayed,
    recentlyPlayed,
  };
}
