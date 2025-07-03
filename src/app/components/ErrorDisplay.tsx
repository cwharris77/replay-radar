"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ErrorDisplay() {
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

      // Clear the error from URL after showing it
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  if (!errorMessage) return null;

  return (
    <div className='bg-red-600 text-white p-4 rounded-lg max-w-md'>
      <p className='font-semibold'>Login Error</p>
      <p className='text-sm mt-1'>{errorMessage}</p>
    </div>
  );
}
