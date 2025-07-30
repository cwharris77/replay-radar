"use client";

import { Track } from "@/types";
import Image from "next/image";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";

export default function TopTracks() {
  const { topTracks, isLoading, authError } = useNextAuth();

  if (isLoading) {
    return <Loading size='md' text='Loading your top tracks...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const tracks: Track[] = topTracks || [];

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
      {tracks.map((track) => (
        <a
          key={track.id}
          href={track.external_urls.spotify}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-gray-800 rounded-lg p-3 hover:bg-green-700 transition'
        >
          {track.album.images[0]?.url ? (
            <Image
              src={track.preview_url || track.album.images[0].url}
              alt={track.name}
              width={200}
              height={200}
              className='rounded w-full aspect-square object-cover'
            />
          ) : (
            <div className='rounded w-full aspect-square bg-gray-700 flex items-center justify-center'>
              <span className='text-gray-500'>No Image</span>
            </div>
          )}
          <p className='mt-2 text-center'>{track.name}</p>
        </a>
      ))}
    </div>
  );
}
