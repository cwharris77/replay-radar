import { topDataTypes } from "@/app/constants";
import authOptions from "@/auth/authOptions";
import { MOCK_ARTISTS, MOCK_TRACKS } from "@/lib/demo/mockData";
import { fetchRecentlyPlayed, fetchSpotifyData } from "@/lib/spotify/spotify";
import { Artist, Track } from "@/types";
import { getServerSession, Session } from "next-auth";

export interface ServerAuthData {
  isAuthenticated: boolean;
  topArtists: Artist[];
  topTracks: Track[];
  recentlyPlayed: Track[];
  session: Session | null;
}

/**
 * Server-side equivalent of useNextAuth().
 * Fetches session + Spotify data on the server for SSR.
 */
export async function getServerAuthData(): Promise<ServerAuthData> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    return {
      isAuthenticated: false,
      topArtists: [],
      topTracks: [],
      recentlyPlayed: [],
      session: null,
    };
  }

  if (session.user.id === "demo") {
    return {
      isAuthenticated: true,
      topArtists: MOCK_ARTISTS,
      topTracks: MOCK_TRACKS,
      recentlyPlayed: MOCK_TRACKS,
      session,
    };
  }

  const [topArtists, topTracks, recentlyPlayed] = await Promise.all([
    fetchSpotifyData({ type: topDataTypes.artists, session }),
    fetchSpotifyData({ type: topDataTypes.tracks, session }),
    fetchRecentlyPlayed(session),
  ]);

  return {
    isAuthenticated: true,
    topArtists: topArtists as Artist[],
    topTracks: topTracks as Track[],
    recentlyPlayed: recentlyPlayed as Track[],
    session,
  };
}
