import { Artist, Track } from "@/types";

export function createDefaultArtist(): Artist {
  return {
    id: "",
    name: "Loading...",
    popularity: 0,
    genres: [],
    external_urls: { spotify: "" },
    images: [],
    uri: "",
  };
}

export function createDefaultTrack(): Track {
  return {
    id: "",
    name: "Loading...",
    duration_ms: 0,
    explicit: false,
    popularity: 0,
    preview_url: null,
    external_urls: { spotify: "" },
    artists: [],
    album: {
      id: "",
      name: "",
      release_date: "",
      external_urls: { spotify: "" },
      images: [],
      uri: "",
    },
    uri: "",
  };
}

export function isArtist(item: Artist | Track): item is Artist {
  return "genres" in item;
}

export function isTrack(item: Artist | Track): item is Track {
  return "duration_ms" in item;
}
