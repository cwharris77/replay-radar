"use client";

import Loading from "../../components/Loading";
import LoginPrompt from "../../components/LoginPrompt";
import TopArtists from "../../components/TopArtists";
import { useNextAuth } from "../../hooks/useNextAuth";

export default function TopArtistsPage() {
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
        <h1 className='text-3xl font-bold mb-6'>Your Top Artists</h1>
        <LoginPrompt
          title='Login to View Your Top Artists'
          message='Connect your Spotify account to see your most listened to artists.'
        />
      </main>
    );
  }

  return (
    <main className='min-h-screen text-white p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Artists</h1>
      <TopArtists />
    </main>
  );
}
