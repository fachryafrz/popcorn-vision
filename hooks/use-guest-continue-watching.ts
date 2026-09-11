"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getGuestContinueWatching,
  saveGuestWatchProgress,
  removeGuestWatchProgress,
  clearGuestContinueWatching,
  GuestContinueWatchingItem,
  SaveGuestProgressInput,
} from "@/lib/guest-watch";
import { GUEST_WATCH_UPDATED_EVENT, STORAGE_KEYS } from "@/lib/constants";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(GUEST_WATCH_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(GUEST_WATCH_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const emptySnapshot: GuestContinueWatchingItem[] = [];
let cachedRaw: string | null = null;
let cachedSnapshot: GuestContinueWatchingItem[] = emptySnapshot;

function getSnapshot(): GuestContinueWatchingItem[] {
  if (typeof window === "undefined") return emptySnapshot;
  const raw = localStorage.getItem(STORAGE_KEYS.GUEST_CONTINUE_WATCHING);
  if (raw === cachedRaw) {
    return cachedSnapshot;
  }
  cachedRaw = raw;
  cachedSnapshot = getGuestContinueWatching();
  return cachedSnapshot;
}

function getServerSnapshot(): GuestContinueWatchingItem[] {
  return emptySnapshot;
}

export function useGuestContinueWatching() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveProgress = useCallback((input: SaveGuestProgressInput) => {
    saveGuestWatchProgress(input);
  }, []);

  const removeProgress = useCallback((mediaId: string, mediaType: string) => {
    removeGuestWatchProgress(mediaId, mediaType);
  }, []);

  const clearAll = useCallback(() => {
    clearGuestContinueWatching();
  }, []);

  return {
    items,
    isLoaded: true,
    saveProgress,
    removeProgress,
    clearAll,
  };
}

