"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      if (error === "access_denied") {
        setErrorMessage(
          "You need to authorize the app to use Replay Radar. Please try logging in again."
        );
      } else {
        setErrorMessage(
          message || "An error occurred during login. Please try again."
        );
      }

      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 text-white'>
      <main className='flex flex-col gap-8 items-center text-center'>
        <h1 className='text-4xl font-bold'>Replay Radar</h1>
        <p className='text-lg text-gray-300'>
          Discover your top Spotify artists and tracks
        </p>

        {errorMessage && (
          <div className='bg-red-600 text-white p-4 rounded-lg max-w-md'>
            <p className='font-semibold'>Login Error</p>
            <p className='text-sm mt-1'>{errorMessage}</p>
          </div>
        )}
      </main>
    </div>
  );
}
