import { Artist, Track } from "@/types";

// --- Artists ---

const ARTIST_1: Artist = {
  id: "demo-artist-1",
  name: "The Demo Band",
  popularity: 85,
  genres: ["indie rock", "alternative"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist1/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo1",
};

const ARTIST_2: Artist = {
  id: "demo-artist-2",
  name: "Mock Star",
  popularity: 92,
  genres: ["pop", "dance"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist2/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo2",
};

const ARTIST_3: Artist = {
  id: "demo-artist-3",
  name: "Lorem Ipsum",
  popularity: 78,
  genres: ["classical", "instrumental"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist3/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo3",
};

const ARTIST_4: Artist = {
  id: "demo-artist-4",
  name: "Pixel Perfect",
  popularity: 65,
  genres: ["chiptune", "electronic"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist4/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo4",
};

const ARTIST_5: Artist = {
  id: "demo-artist-5",
  name: "The Placeholders",
  popularity: 55,
  genres: ["rock", "garage"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist5/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo5",
};

// Additional artists for variety
const ARTIST_6: Artist = {
  id: "demo-artist-6",
  name: "Neon Dreams",
  popularity: 70,
  genres: ["synthwave", "retrowave"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist6/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo6",
};

const ARTIST_7: Artist = {
  id: "demo-artist-7",
  name: "Acoustic Soul",
  popularity: 60,
  genres: ["acoustic", "folk"],
  external_urls: { spotify: "#" },
  images: [
    {
      url: "https://picsum.photos/seed/artist7/640/640",
      height: 640,
      width: 640,
    },
  ],
  uri: "spotify:artist:demo7",
};

// Export specific lists for different time ranges
export const MOCK_ARTISTS_DAILY: Artist[] = [
  ARTIST_1,
  ARTIST_2,
  ARTIST_3,
  ARTIST_4,
  ARTIST_5,
];
export const MOCK_ARTISTS_MONTHLY: Artist[] = [
  ARTIST_2,
  ARTIST_6,
  ARTIST_1,
  ARTIST_5,
  ARTIST_3,
];
export const MOCK_ARTISTS_YEARLY: Artist[] = [
  ARTIST_3,
  ARTIST_1,
  ARTIST_7,
  ARTIST_2,
  ARTIST_6,
];

// Fallback for generic usage
export const MOCK_ARTISTS = MOCK_ARTISTS_DAILY;

// --- Tracks ---

const TRACK_1: Track = {
  id: "demo-track-1",
  name: "Hello World",
  duration_ms: 215000,
  explicit: false,
  popularity: 88,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_1],
  album: {
    id: "demo-album-1",
    name: "First Commit",
    release_date: "2023-01-01",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album1/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo1",
  },
  uri: "spotify:track:demo1",
};

const TRACK_2: Track = {
  id: "demo-track-2",
  name: "Debugging Blues",
  duration_ms: 184000,
  explicit: true,
  popularity: 75,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_2],
  album: {
    id: "demo-album-2",
    name: "Stack Trace",
    release_date: "2023-02-15",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album2/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo2",
  },
  uri: "spotify:track:demo2",
};

const TRACK_3: Track = {
  id: "demo-track-3",
  name: "Infinite Loop",
  duration_ms: 342000,
  explicit: false,
  popularity: 95,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_3],
  album: {
    id: "demo-album-3",
    name: "Runtime Error",
    release_date: "2023-03-10",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album3/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo3",
  },
  uri: "spotify:track:demo3",
};

const TRACK_4: Track = {
  id: "demo-track-4",
  name: "Null Pointer",
  duration_ms: 156000,
  explicit: false,
  popularity: 60,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_4],
  album: {
    id: "demo-album-4",
    name: "Undefined",
    release_date: "2023-04-20",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album4/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo4",
  },
  uri: "spotify:track:demo4",
};

const TRACK_5: Track = {
  id: "demo-track-5",
  name: "Refactor Me",
  duration_ms: 198000,
  explicit: false,
  popularity: 70,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_2],
  album: {
    id: "demo-album-5",
    name: "Clean Code",
    release_date: "2023-05-05",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album5/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo5",
  },
  uri: "spotify:track:demo5",
};

const TRACK_6: Track = {
  id: "demo-track-6",
  name: "Syntax Sugar",
  duration_ms: 205000,
  explicit: false,
  popularity: 82,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_6],
  album: {
    id: "demo-album-6",
    name: "Sweet Compilation",
    release_date: "2023-06-15",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album6/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo6",
  },
  uri: "spotify:track:demo6",
};

const TRACK_7: Track = {
  id: "demo-track-7",
  name: "Git Push Force",
  duration_ms: 175000,
  explicit: true,
  popularity: 68,
  preview_url: null,
  external_urls: { spotify: "#" },
  artists: [ARTIST_5],
  album: {
    id: "demo-album-7",
    name: "Dangerous Actions",
    release_date: "2023-07-20",
    external_urls: { spotify: "#" },
    images: [
      {
        url: "https://picsum.photos/seed/album7/640/640",
        height: 640,
        width: 640,
      },
    ],
    uri: "spotify:album:demo7",
  },
  uri: "spotify:track:demo7",
};

export const MOCK_TRACKS_DAILY: Track[] = [
  TRACK_1,
  TRACK_2,
  TRACK_3,
  TRACK_4,
  TRACK_5,
];
export const MOCK_TRACKS_MONTHLY: Track[] = [
  TRACK_3,
  TRACK_6,
  TRACK_1,
  TRACK_2,
  TRACK_5,
];
export const MOCK_TRACKS_YEARLY: Track[] = [
  TRACK_2,
  TRACK_7,
  TRACK_3,
  TRACK_6,
  TRACK_1,
];

export const MOCK_TRACKS = MOCK_TRACKS_DAILY;

// --- Trends ---

export const MOCK_TREND_LABELS_DAILY = [
  "2025-11-24",
  "2025-11-25",
  "2025-11-26",
  "2025-11-27",
  "2025-11-28",
];
export const MOCK_TREND_LABELS_MONTHLY = [
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
];
export const MOCK_TREND_LABELS_YEARLY = [
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

// Fallback
export const MOCK_TREND_LABELS = MOCK_TREND_LABELS_DAILY;

export const MOCK_ARTIST_TRENDS_DAILY = [
  { id: "demo-artist-1", name: "The Demo Band", data: [5, 5, 1, 3, 1] },
  { id: "demo-artist-2", name: "Mock Star", data: [2, 1, 2, 1, 2] },
  { id: "demo-artist-3", name: "Lorem Ipsum", data: [3, 3, 4, 2, 3] },
  { id: "demo-artist-4", name: "Pixel Perfect", data: [4, 2, 3, 5, 4] },
  { id: "demo-artist-5", name: "The Placeholders", data: [1, 4, 5, 4, 5] },
];

export const MOCK_ARTIST_TRENDS_MONTHLY = [
  { id: "demo-artist-2", name: "Mock Star", data: [1, 1, 2, 1, 1] },
  { id: "demo-artist-6", name: "Neon Dreams", data: [5, 4, 3, 2, 2] },
  { id: "demo-artist-1", name: "The Demo Band", data: [2, 3, 1, 3, 3] },
  { id: "demo-artist-5", name: "The Placeholders", data: [3, 2, 5, 4, 4] },
  { id: "demo-artist-3", name: "Lorem Ipsum", data: [4, 5, 4, 5, 5] },
];

export const MOCK_ARTIST_TRENDS_YEARLY = [
  { id: "demo-artist-3", name: "Lorem Ipsum", data: [5, 4, 3, 2, 1] },
  { id: "demo-artist-1", name: "The Demo Band", data: [1, 2, 1, 1, 2] },
  { id: "demo-artist-7", name: "Acoustic Soul", data: [3, 3, 2, 4, 5] },
  { id: "demo-artist-2", name: "Mock Star", data: [2, 1, 5, 5, 4] },
  { id: "demo-artist-6", name: "Neon Dreams", data: [4, 5, 4, 3, 3] },
];

export const MOCK_ARTIST_TRENDS = MOCK_ARTIST_TRENDS_DAILY;

export const MOCK_TRACK_TRENDS_DAILY = [
  { id: "demo-track-1", name: "Hello World", data: [1, 1, 2, 1, 1] },
  { id: "demo-track-2", name: "Debugging Blues", data: [2, 3, 1, 2, 2] },
  { id: "demo-track-3", name: "Infinite Loop", data: [3, 2, 3, 3, 4] },
  { id: "demo-track-4", name: "Null Pointer", data: [5, 4, 5, 5, 3] },
  { id: "demo-track-5", name: "Refactor Me", data: [4, 5, 4, 4, 5] },
];

export const MOCK_TRACK_TRENDS_MONTHLY = [
  { id: "demo-track-3", name: "Infinite Loop", data: [1, 2, 1, 2, 1] },
  { id: "demo-track-6", name: "Syntax Sugar", data: [5, 4, 3, 3, 2] },
  { id: "demo-track-1", name: "Hello World", data: [2, 1, 2, 1, 3] },
  { id: "demo-track-2", name: "Debugging Blues", data: [3, 3, 4, 4, 4] },
  { id: "demo-track-5", name: "Refactor Me", data: [4, 5, 5, 5, 5] },
];

export const MOCK_TRACK_TRENDS_YEARLY = [
  { id: "demo-track-2", name: "Debugging Blues", data: [1, 1, 2, 2, 1] },
  { id: "demo-track-7", name: "Git Push Force", data: [null, 4, 5, 4, 2] },
  { id: "demo-track-3", name: "Infinite Loop", data: [2, 3, 1, 1, 3] },
  { id: "demo-track-6", name: "Syntax Sugar", data: [5, 5, 4, 3, 4] },
  { id: "demo-track-1", name: "Hello World", data: [3, 2, 3, 5, 5] },
];

export const MOCK_TRACK_TRENDS = MOCK_TRACK_TRENDS_DAILY;

export const MOCK_GENRE_TRENDS_DAILY = [
  { id: "indie rock", name: "indie rock", data: [1, 1, 1, 2, 1] },
  { id: "pop", name: "pop", data: [2, 2, 2, 1, 2] },
  { id: "electronic", name: "electronic", data: [3, 4, 3, 3, 3] },
  { id: "rock", name: "rock", data: [4, 3, 4, 4, 4] },
  { id: "alternative", name: "alternative", data: [5, 5, 5, 5, 5] },
];

export const MOCK_GENRE_TRENDS_MONTHLY = [
  { id: "pop", name: "pop", data: [1, 1, 2, 1, 1] },
  { id: "synthwave", name: "synthwave", data: [5, 4, 3, 2, 2] },
  { id: "indie rock", name: "indie rock", data: [2, 3, 1, 3, 3] },
  { id: "rock", name: "rock", data: [3, 2, 5, 4, 4] },
  { id: "classical", name: "classical", data: [4, 5, 4, 5, 5] },
];

export const MOCK_GENRE_TRENDS_YEARLY = [
  { id: "classical", name: "classical", data: [5, 4, 4, 2, 2] },
  { id: "indie rock", name: "indie rock", data: [1, 2, 1, 1, 1] },
  { id: "acoustic", name: "acoustic", data: [null, null, 5, 4, 3] },
  { id: "pop", name: "pop", data: [2, 1, 2, 3, 4] },
  { id: "synthwave", name: "synthwave", data: [null, 5, 3, 5, 5] },
];

export const MOCK_GENRE_TRENDS = MOCK_GENRE_TRENDS_DAILY;
