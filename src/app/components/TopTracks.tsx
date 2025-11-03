"use client";

import { TIME_RANGES, timeRange } from "@/app/constants";
import TiltedCard from "@/components/TiltedCard";
import { Track } from "@/types";
import { useEffect, useState } from "react";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";

export default function TopTracks() {
  const { topTracks, isLoading, authError, fetchSpotifyData, isAuthenticated } =
    useNextAuth();
  const [selectedRange, setSelectedRange] = useState<string>(timeRange.short);

  // Fetch tracks data once on page load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSpotifyData("tracks", selectedRange);
    }
  }, [isAuthenticated]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    fetchSpotifyData("tracks", range);
  };

  if (isLoading) {
    return <Loading size='md' text='Loading your top tracks...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const tracks: Track[] = topTracks || [];

  return (
    <div className='max-w-full mx-auto'>
      <div className='flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center px-2 sm:px-4'>
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`min-w-[90px] px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium sm:font-semibold transition-all duration-200 border border-gray-700 text-sm sm:text-base ${
              selectedRange === range.value
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 active:bg-green-700 hover:bg-green-700 active:scale-95"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className='default-card-grid' data-testid='top-tracks'>
        {tracks.map((track) => (
          <TiltedCard
            altText={track.name}
            displayOverlayContent={true}
            imageSrc={track.album.images[0].url}
            key={track.id}
            overlayContent={
              <a
                className='tilted-card-overlay'
                key={track.id}
                href={track.external_urls.spotify}
                target='_blank'
                rel='noopener noreferrer'
              >
                {track.name}
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
