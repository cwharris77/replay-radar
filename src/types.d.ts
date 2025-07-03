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
