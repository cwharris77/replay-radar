"use client";

import { TimeRange, timeRange, topDataTypes } from "@/app/constants";
import {
  ErrorCard,
  Loading,
  TiltedCard,
  TimeRangeSelector,
} from "@/components";
import { useNextAuth } from "@/hooks/useNextAuth";
import { cn } from "@/lib/utils";
import { Track } from "@/types";
import { useEffect, useState } from "react";
import Filters from "./Filters";

export default function TopTracks() {
  const { topTracks, isLoading, authError, fetchSpotifyData, isAuthenticated } =
    useNextAuth();
  const [selectedRange, setSelectedRange] = useState<TimeRange>(
    timeRange.short
  );
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
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

  function decadeToRange(decade: string): [number, number] {
    const start = parseInt(decade.slice(0, 4));
    return [start, start + 9];
  }

  const decadeRanges = selectedDecades.map(decadeToRange);

  if (isLoading) {
    return <Loading size='md' text='Loading your top tracks...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const tracks: Track[] = topTracks || [];

  const filteredTracks = tracks.filter((track) => {
    const year = parseInt(track.album.release_date.slice(0, 4));
    if (decadeRanges.length === 0) {
      return track;
    }
    return decadeRanges.some(([start, end]) => year >= start && year <= end);
  });

  return (
    <div className='max-w-full mx-auto flex flex-col gap-24'>
      <div className='flex flex-row justify-between items-center'>
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
        />
        <Filters
          onChange={setSelectedDecades}
          selectedDecades={selectedDecades}
        />
      </div>

      <div
        className={cn("default-card-grid", {
          "flex flex-col items-center justify-center":
            filteredTracks.length === 0,
        })}
        data-testid='top-tracks'
      >
        {filteredTracks.length === 0 && (
          <h1 className='text-2xl font-bold text-center'>
            No tracks found for the selected filters.
          </h1>
        )}
        {filteredTracks.map((track) => (
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
