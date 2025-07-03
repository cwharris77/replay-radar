"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/authenticate", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated === true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = () => {
    // Clear cookies
    document.cookie =
      "spotify_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "spotify_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsAuthenticated(false);

    window.location.href = "/";
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
