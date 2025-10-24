"use client";

import TiltedCard from "@/components/TiltedCard";
import { Artist } from "@/types";
import { useState } from "react";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";

const TIME_RANGES = [
  { label: "This Week", value: "short_term" },
  { label: "Last 6 Months", value: "medium_term" },
  { label: "All Time", value: "long_term" },
];

export default function TopArtists() {
  const { topArtists, isLoading, authError, fetchSpotifyData } = useNextAuth();
  const [selectedRange, setSelectedRange] = useState<string>("long_term");

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    fetchSpotifyData("artists", range);
  };

  if (isLoading) {
    return <Loading size='md' text='Loading your top artists...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const artists: Artist[] = topArtists || [];
  return (
    <div>
      <div className='flex flex-wrap gap-3 mb-6 justify-center px-4'>
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`px-6 py-3 rounded-lg font-semibold transition border border-gray-700 text-base sm:text-sm touch-target-auto ${
              selectedRange === range.value
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 active:bg-green-700 hover:bg-green-700"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-9 px-4 sm:px-6'>
        {artists.map((artist) => (
          <TiltedCard
            altText={artist.name}
            displayOverlayContent={true}
            imageSrc={artist.images[0].url}
            key={artist.id}
            overlayContent={
              <a
                className='tilted-card-overlay'
                key={artist.id}
                href={artist.external_urls.spotify}
                target='_blank'
                rel='noopener noreferrer'
              >
                {artist.name}
              </a>
            }
            rotateAmplitude={12}
            scaleOnHover={1.1}
            showTooltip={false}
            showMobileWarning={false}
          />
        ))}
      </div>
    </div>
  );
}
