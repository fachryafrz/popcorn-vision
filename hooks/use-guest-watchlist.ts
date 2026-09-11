"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getGuestWatchlist,
  isGuestWatchlisted,
  addToGuestWatchlist,
  removeFromGuestWatchlist,
  clearGuestWatchlist,
  GuestWatchlistItem,
  SaveGuestWatchlistInput,
} from "@/lib/guest-watchlist";
import { GUEST_WATCHLIST_UPDATED_EVENT, STORAGE_KEYS } from "@/lib/constants";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(GUEST_WATCHLIST_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(GUEST_WATCHLIST_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const emptySnapshot: GuestWatchlistItem[] = [];
let cachedRaw: string | null = null;
let cachedSnapshot: GuestWatchlistItem[] = emptySnapshot;

function getSnapshot(): GuestWatchlistItem[] {
  if (typeof window === "undefined") return emptySnapshot;
  const raw = localStorage.getItem(STORAGE_KEYS.GUEST_WATCHLIST);
  if (raw === cachedRaw) {
    return cachedSnapshot;
  }
  cachedRaw = raw;
  cachedSnapshot = getGuestWatchlist();
  return cachedSnapshot;
}

function getServerSnapshot(): GuestWatchlistItem[] {
  return emptySnapshot;
}

export function useGuestWatchlist() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addWatchlist = useCallback((input: SaveGuestWatchlistInput) => {
    addToGuestWatchlist(input);
  }, []);

  const removeWatchlist = useCallback((mediaId: string | number, mediaType: string) => {
    removeFromGuestWatchlist(mediaId, mediaType);
  }, []);

  const checkWatchlisted = useCallback(
    (mediaId: string | number, mediaType: string) => {
      return isGuestWatchlisted(mediaId, mediaType);
    },
    [],
  );

  const clearAll = useCallback(() => {
    clearGuestWatchlist();
  }, []);

  return {
    items,
    isLoaded: true,
    isWatchlisted: checkWatchlisted,
    addWatchlist,
    removeWatchlist,
    clearAll,
  };
}

