"use client";

import { Artist } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";

const TIME_RANGES = [
  { label: "1 Year", value: "long_term" },
  { label: "6 Months", value: "medium_term" },
  { label: "1 Week", value: "short_term" },
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
  // todo move to its own component and reuse for tracks
  return (
    <div>
      <div className='flex gap-2 mb-4 justify-center'>
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition border border-gray-700 ${
              selectedRange === range.value
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-green-700"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {artists.map((artist) => (
          <a
            key={artist.id}
            href={artist.external_urls.spotify}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-gray-800 rounded-lg p-3 hover:bg-green-700 transition'
          >
            {artist.images[0]?.url ? (
              <Image
                src={artist.images[0].url}
                alt={artist.name}
                width={200}
                height={200}
                className='rounded w-full aspect-square object-cover'
              />
            ) : (
              <div className='rounded w-full aspect-square bg-gray-700 flex items-center justify-center'>
                <span className='text-gray-500'>No Image</span>
              </div>
            )}
            <p className='mt-2 text-center'>{artist.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
