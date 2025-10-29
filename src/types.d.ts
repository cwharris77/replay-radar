export interface Artist {
  id: string;
  name: string;
  popularity: number;
  genres: string[];
  external_urls: {
    spotify: string;
  };
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  uri: string;
}

export interface Track {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  played_at?: string;
  artists: {
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }[];
  album: {
    id: string;
    name: string;
    release_date: string;
    external_urls: {
      spotify: string;
    };
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    uri: string;
  };
  uri: string;
}

export interface SpotifyResponse {
  items: Artist[] | Track[];
}

export type TimeRange = "short_term" | "medium_term" | "long_term";
export type SpotifyDataType = "artists" | "tracks";

export interface SpotifyRefreshSuccessResponse {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  expires_in: number; // seconds until expiration
  refresh_token?: string;
}

export interface SpotifyRefreshErrorResponse {
  error: string;
  error_description?: string;
}

export type SpotifyRefreshResponse =
  | SpotifyRefreshSuccessResponse
  | SpotifyRefreshErrorResponse;
