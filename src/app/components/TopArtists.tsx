"use client";

import { Artist } from "@/types";
import Image from "next/image";
import { useNextAuth } from "../hooks/useNextAuth";
import ErrorCard from "./ErrorCard";
import Loading from "./Loading";

export default function TopArtists() {
  const { topArtists, isLoading, authError } = useNextAuth();

  if (isLoading) {
    return <Loading size='md' text='Loading your top artists...' />;
  }

  if (authError) {
    return <ErrorCard message={authError} />;
  }

  const artists: Artist[] = topArtists || [];

  return (
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
  );
}
