"use client";

import TopTracks from "../../components/TopTracks";
import LoginPrompt from "../../components/LoginPrompt";
import Loading from "../../components/Loading";
import { useNextAuth } from "../../hooks/useNextAuth";

export default function TopTracksPage() {
  const { isAuthenticated, isLoading } = useNextAuth();

  if (isLoading) {
    return (
      <main className='min-h-screen text-white p-6'>
        <Loading size='md' text='Loading...' />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className='min-h-screen text-white p-6'>
        <h1 className='text-3xl font-bold mb-6'>Your Top Tracks</h1>
        <LoginPrompt
          title="Login to View Your Top Tracks"
          message="Connect your Spotify account to see your most listened to tracks."
        />
      </main>
    );
  }

  return (
    <main className='min-h-screen text-white p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Tracks</h1>
      <TopTracks />
    </main>
  );
}
