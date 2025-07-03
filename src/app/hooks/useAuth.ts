"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/authenticate", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated === true);
          setAuthError(null);
        } else {
          setIsAuthenticated(false);
          if (response.status === 401) {
            setAuthError("Please log in to access your Spotify data");
          }
        }
      } catch {
        setIsAuthenticated(false);
        setAuthError("Unable to verify authentication status");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = async () => {
    try {
      // Call the logout API to revoke tokens and clear cookies
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear any browser cache/storage
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      localStorage.clear();
      sessionStorage.clear();

      setIsAuthenticated(false);

      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);

      if ("caches" in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        } catch (cacheError) {
          console.error("Cache clear error:", cacheError);
        }
      }

      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      window.location.replace("/");
    }
  };

  return {
    isAuthenticated,
    isLoading,
    authError,
    login,
    logout,
  };
}
