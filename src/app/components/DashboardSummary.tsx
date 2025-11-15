import MagicBento, { BentoCardProps } from "@/components/MagicBento";
import { Artist, Track } from "@/types";

interface DashboardSummaryProps {
  topArtist: Artist;
  topTracks?: Track[];
  totalMinutes: number;
  recentlyPlayed?: Track[];
}

const generateCardData = (
  topArtist: Artist,
  topTracks: Track[] = [],
  totalMinutes: number,
  recentlyPlayed?: Track[]
): BentoCardProps[] => [
  {
    color: "#060010",
    title: topTracks[0]?.name || "No tracks yet",
    description: `Artist: ${topTracks[0]?.artists[0]?.name || "Unknown"}`,
    label: "Top Track",
  },
  {
    color: "#060010",
    title: topArtist.name,
    description: "Your most played artist",
    label: "Top Artist",
  },
  {
    color: "#060010",
    title:
      topTracks
        .slice(1, 3)
        .map(
          (track, index) =>
            `${index + 2}. ${track.name} by ${track.artists[0]?.name}`
        )
        .join("\n") || "No tracks yet",
    description: "Your favorite songs",
    label: "Top Tracks",
  },
  {
    color: "#060010",
    title:
      recentlyPlayed
        ?.slice(0, 3)
        .map(
          (track, index) =>
            `${index + 1}. ${track.name} by ${track.artists[0]?.name}`
        )
        .join("\n") || "No recently played tracks",
    description: "Recently played",
    label: "History",
  },
  {
    color: "#060010",
    title: `${totalMinutes.toLocaleString()} minutes`,
    description: "Listening Time Today",
    label: "Stats",
  },
  {
    color: "#060010",
    title: "Top Genres",
    description: "Explore your music taste",
    label: "Genres",
  },
];

export default function DashboardSummary({
  topArtist,
  totalMinutes,
  topTracks,
  recentlyPlayed,
}: DashboardSummaryProps) {
  return (
    <MagicBento
      textAutoHide={false}
      enableStars={false}
      enableSpotlight={true}
      enableBorderGlow={true}
      enableTilt={false}
      enableMagnetism={true}
      clickEffect={true}
      spotlightRadius={300}
      particleCount={12}
      glowColor='var(--color-primary-rgb)'
      cardData={generateCardData(
        topArtist,
        topTracks,
        totalMinutes,
        recentlyPlayed
      )}
    />
  );
}
