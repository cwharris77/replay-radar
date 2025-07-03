import { Suspense } from "react";
import ErrorDisplay from "./components/ErrorDisplay";

export default function Home() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 text-white'>
      <main className='flex flex-col gap-8 items-center text-center'>
        <h1 className='text-4xl font-bold'>Replay Radar</h1>
        <p className='text-lg text-gray-300'>
          Discover your top Spotify artists and tracks
        </p>

        <Suspense fallback={null}>
          <ErrorDisplay />
        </Suspense>
      </main>
    </div>
  );
}
