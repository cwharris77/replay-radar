"use client";

import { Loading } from "@/components";
import { useNextAuth } from "@/hooks/useNextAuth";
import { login } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const { session, status } = useNextAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  // Redirect authenticated users
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-card border border-border rounded-2xl p-8 shadow-2xl'>
          {/* Logo/Title */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Replay Radar
            </h1>
            <p className='text-muted-foreground'>
              Sign in to view your Spotify insights
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
              <p className='text-red-400 text-sm text-center'>
                {error === "OAuthSignin"
                  ? "Error connecting to Spotify. Please try again."
                  : "Authentication failed. Please try again."}
              </p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={() => login(callbackUrl)}
            className='w-full bg-green-600 hover:bg-green-700 text-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3'
          >
            <svg
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
            </svg>
            Continue with Spotify
          </button>

          {/* Demo Mode Button */}
          <button
            onClick={() =>
              signIn("demo-login", {
                callbackUrl,
                username: "demo",
              })
            }
            className='w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            Try Demo Mode
          </button>

          {/* Info Text */}
          <p className='text-muted-foreground text-xs text-center mt-6'>
            By signing in, you agree to connect your Spotify account
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginContent />
    </Suspense>
  );
}
