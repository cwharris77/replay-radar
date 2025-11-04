"use client";

import { login } from "@/lib/actions/auth";

interface LoginPromptProps {
  title?: string;
  message?: string;
}

export default function LoginPrompt({
  title = "Login Required",
  message = "Please log in with your Spotify account to view this content.",
}: LoginPromptProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold text-white mb-3'>{title}</h2>
        <p className='text-gray-400 mb-6'>{message}</p>
        <button
          onClick={login}
          className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
        >
          Log in with Spotify
        </button>
      </div>
    </div>
  );
}
