import { useEffect, useState } from "react";

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useFetchSpotifyData<T>(
  url: string,
  cacheKey: string,
  cacheDuration: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed: CachedData<T> = JSON.parse(cachedData);
          const isExpired = Date.now() - parsed.timestamp > cacheDuration;

          if (!isExpired) {
            console.log(`Using cached data for ${cacheKey}`);
            setData(parsed.data);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        }

        const res = await fetch(url, { credentials: "include" });

        if (res.status === 401) {
          throw new Error("Please login with Spotify");
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`
          );
        }

        const responseData = await res.json();

        const cacheData: CachedData<T> = {
          data: responseData,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));

        setData(responseData);
      } catch (error) {
        console.error(`Error fetching ${cacheKey}:`, error);
        setError(
          error instanceof Error ? error : new Error("Failed to fetch data")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheKey, cacheDuration]);

  return { data, loading, error };
}
