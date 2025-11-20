"use server";
import { Loading } from "@/components";
import { Suspense } from "react";

export default async function About() {
  return (
    <Suspense fallback={<Loading size='2xl' />}>
      <div className='flex flex-col items-center justify-center min-h-screen bg-secondary text-white px-4 rounded-lg shadow-lg'>
        {/* Hero Section */}
        <section className='text-center max-w-2xl my-12'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4'>
            See your Spotify listening habits like never before
          </h1>
          <p className='text-lg text-gray-400 mb-6'>
            Replay Radar helps you visualize your top artists, tracks, and
            trends from Spotify. Discover your musical identity across time.
          </p>
        </section>

        {/* Features Section */}
        <section className='grid grid-cols-1 sm:grid-cols-3 gap-6 my-12 max-w-4xl w-full'>
          <div className='bg-gray-900 rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>🎨</div>
            <h2 className='text-xl font-semibold mb-1'>Top Artists</h2>
            <p className='text-gray-400 text-sm'>
              Explore your most listened to artists across different timeframes.
            </p>
          </div>
          <div className='bg-gray-900 rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>📈</div>
            <h2 className='text-xl font-semibold mb-1'>Trends</h2>
            <p className='text-gray-400 text-sm'>
              Visualize your listening patterns over time with interactive
              charts.
            </p>
          </div>
          <div className='bg-gray-900 rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>🎶</div>
            <h2 className='text-xl font-semibold mb-1'>Top Tracks</h2>
            <p className='text-gray-400 text-sm'>
              See your favorite songs and rediscover old favorites.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className='max-w-2xl text-center my-12'>
          <h2 className='text-2xl font-bold mb-4'>How it works</h2>
          <ol className='list-decimal list-inside text-gray-400 space-y-2'>
            <li>Log in securely with your Spotify account</li>
            <li>We pull your top artists, tracks, and trends</li>
            <li>
              Explore your Replay Radar — no posts, no changes to your account
            </li>
          </ol>
        </section>

        {/* Footer */}
        <footer className='text-gray-600 text-sm mt-12 mb-4'>
          © {new Date().getFullYear()} Replay Radar
        </footer>
      </div>
    </Suspense>
  );
}
