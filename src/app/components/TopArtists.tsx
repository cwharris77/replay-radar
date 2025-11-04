"use client";

import { TimeRange, timeRange, topDataTypes } from "@/app/constants";
import TiltedCard from "@/components/TiltedCard";
import { Artist } from "@/types";
import { useEffect, useState } from "react";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";
import TimeRangeSelector from "./TimeRangeSelector";

export default function TopArtists() {
  const {
    topArtists,
    isLoading,
    authError,
    fetchSpotifyData,
    isAuthenticated,
  } = useNextAuth();
  const [selectedRange, setSelectedRange] = useState<TimeRange>(
    timeRange.short
  );

  // Fetch artist data once on page load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSpotifyData(topDataTypes.artists, selectedRange);
    }
  }, [isAuthenticated, selectedRange, fetchSpotifyData]);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    fetchSpotifyData(topDataTypes.artists, range);
  };

  if (isLoading) {
    return <Loading size='md' text='Loading your top artists...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const artists: Artist[] = topArtists || [];

  return (
    <div className='max-w-full mx-auto'>
      <TimeRangeSelector
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
      />
      <div className='default-card-grid' data-testid='top-artists'>
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
