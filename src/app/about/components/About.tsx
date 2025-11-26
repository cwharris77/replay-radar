"use server";
import { Loading } from "@/components";
import DemoModeButton from "@/components/DemoModeButton";
import { getServerAuthData } from "@/lib/serverAuth";
import { Suspense } from "react";

export default async function About() {
  const { isAuthenticated } = await getServerAuthData();
  return (
    <Suspense fallback={<Loading size='2xl' />}>
      <div className='flex flex-col items-center justify-center min-h-screen bg-secondary text-foreground px-4 rounded-lg shadow-lg'>
        {/* Hero Section */}
        <section className='text-center max-w-2xl my-12'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4'>
            See your Spotify listening habits like never before
          </h1>
          <p className='text-lg text-muted-foreground mb-6'>
            Replay Radar helps you visualize your top artists, tracks, and
            trends from Spotify. Discover your musical identity across time.
          </p>
        </section>

        {!isAuthenticated && (
          <DemoModeButton className='h-18 w-3/4 md:w-1/2 md:text-2xl' />
        )}

        {/* Features Section */}
        <section className='grid grid-cols-1 sm:grid-cols-3 gap-6 my-12 max-w-4xl w-full'>
          <div className='bg-card rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>🎨</div>
            <h2 className='text-xl font-semibold mb-1'>Top Artists</h2>
            <p className='text-muted-foreground text-sm'>
              Explore your most listened to artists across different timeframes.
            </p>
          </div>
          <div className='bg-card rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>📈</div>
            <h2 className='text-xl font-semibold mb-1'>Trends</h2>
            <p className='text-muted-foreground text-sm'>
              Visualize your listening patterns over time with interactive
              charts.
            </p>
          </div>
          <div className='bg-card rounded-2xl p-6 text-center shadow-lg'>
            <div className='text-4xl mb-2'>🎶</div>
            <h2 className='text-xl font-semibold mb-1'>Top Tracks</h2>
            <p className='text-muted-foreground text-sm'>
              See your favorite songs and rediscover old favorites.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className='max-w-2xl text-center my-12'>
          <h2 className='text-2xl font-bold mb-4'>How it works</h2>
          <ol className='list-decimal list-inside text-muted-foreground space-y-2'>
            <li>Log in securely with your Spotify account</li>
            <li>We pull your top artists, tracks, and trends</li>
            <li>
              Explore your Replay Radar — no posts, no changes to your account
            </li>
          </ol>
        </section>

        {/* Footer */}
        <footer className='text-muted-foreground text-sm mt-12 mb-4'>
          © {new Date().getFullYear()} Replay Radar
        </footer>
      </div>
    </Suspense>
  );
}
