"use client";

import { TimeRange, timeRange, topDataTypes } from "@/app/constants";
import {
  ErrorCard,
  Loading,
  TiltedCard,
  TimeRangeSelector,
} from "@/components";
import { useNextAuth } from "@/hooks/useNextAuth";
import { Track } from "@/types";
import { useEffect, useState } from "react";

export default function TopTracks() {
  const { topTracks, isLoading, authError, fetchSpotifyData, isAuthenticated } =
    useNextAuth();
  const [selectedRange, setSelectedRange] = useState<TimeRange>(
    timeRange.short
  );

  // Fetch tracks data once on page load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSpotifyData(topDataTypes.tracks, selectedRange);
    }
  }, [isAuthenticated]);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    fetchSpotifyData(topDataTypes.tracks, range);
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
      <TimeRangeSelector
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
      />
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
