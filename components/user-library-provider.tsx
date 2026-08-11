"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

interface UserLibraryContextType {
  isWatchlisted: (mediaId: string | number, mediaType: string) => boolean;
  isFavorited: (mediaId: string | number, mediaType: string) => boolean;
  watchlistLoading: boolean;
  favoritesLoading: boolean;
}

const UserLibraryContext = createContext<UserLibraryContextType | null>(null);

export function UserLibraryProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const watchlist = useQuery(
    api.watchlist.getWatchlist,
    isLoggedIn ? {} : "skip"
  );

  const favorites = useQuery(
    api.favorites.getFavorites,
    isLoggedIn ? {} : "skip"
  );

  const watchlistedKeysSet = useMemo(() => {
    if (!watchlist) return new Set<string>();
    return new Set(watchlist.map((item) => `${item.mediaType}-${item.mediaId}`));
  }, [watchlist]);

  const favoritedKeysSet = useMemo(() => {
    if (!favorites) return new Set<string>();
    return new Set(favorites.map((item) => `${item.mediaType}-${item.mediaId}`));
  }, [favorites]);

  const isWatchlisted = (mediaId: string | number, mediaType: string) => {
    const type = mediaType || "movie";
    return watchlistedKeysSet.has(`${type}-${mediaId}`);
  };

  const isFavorited = (mediaId: string | number, mediaType: string) => {
    const type = mediaType || "movie";
    return favoritedKeysSet.has(`${type}-${mediaId}`);
  };

  return (
    <UserLibraryContext.Provider
      value={{
        isWatchlisted,
        isFavorited,
        watchlistLoading: isLoggedIn && watchlist === undefined,
        favoritesLoading: isLoggedIn && favorites === undefined,
      }}
    >
      {children}
    </UserLibraryContext.Provider>
  );
}

export function useUserLibrary() {
  const context = useContext(UserLibraryContext);
  if (!context) {
    throw new Error("useUserLibrary must be used within a UserLibraryProvider");
  }
  return context;
}
