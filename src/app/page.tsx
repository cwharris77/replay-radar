"use client";
import { Artist } from "@/types";
import { Suspense } from "react";
import About from "./components/About";
import DashboardSummary from "./components/DashboardSummary";
import ErrorDisplay from "./components/ErrorDisplay";
import Loading from "./components/Loading";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const topArtist = { name: "Taylor Swift" } as Artist;
  const totalMinutes = 12345;
  const trendData = [5, 10, 8, 15, 12, 20, 18, 25, 22];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen p-4 bg-black text-white'>
        <Loading size='2xl' />
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 min-h-screen p-4 bg-black text-white'>
      <Suspense fallback={null}>
        <ErrorDisplay />
      </Suspense>
      {!isAuthenticated ? (
        <About />
      ) : (
        <DashboardSummary
          topArtist={topArtist}
          totalMinutes={totalMinutes}
          trendData={trendData}
        />
      )}
    </div>
  );
}
