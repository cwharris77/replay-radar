"use client";
import { Suspense } from "react";
import About from "./components/About";
import ErrorDisplay from "./components/ErrorDisplay";
import Loading from "./components/Loading";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
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
      {!isAuthenticated && <About />}
    </div>
  );
}
