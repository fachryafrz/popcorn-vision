import { STORAGE_KEYS, GUEST_WATCH_UPDATED_EVENT } from "./constants";

export interface GuestContinueWatchingItem {
  _id: string;
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  backdropPath?: string;
  episodeStillPath?: string;
  season?: number;
  episode?: number;
  updatedAt: number;
}

export type SaveGuestProgressInput = Omit<GuestContinueWatchingItem, "_id" | "updatedAt">;

/**
 * Dispatches a custom event to notify listeners (such as React hooks) in the current window.
 */
function notifyGuestWatchUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GUEST_WATCH_UPDATED_EVENT));
  }
}

/**
 * Retrieve all guest continue watching items from localStorage.
 */
export function getGuestContinueWatching(): GuestContinueWatchingItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUEST_CONTINUE_WATCHING);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is GuestContinueWatchingItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.mediaId === "string" &&
        (item.mediaType === "movie" || item.mediaType === "tv") &&
        typeof item.title === "string" &&
        typeof item.posterPath === "string" &&
        typeof item.updatedAt === "number"
      );
    });
  } catch (err) {
    console.error("Failed to read guest continue watching from localStorage:", err);
    return [];
  }
}

/**
 * Retrieve progress for a single media item from guest localStorage.
 */
export function getGuestWatchProgressForMedia(
  mediaId: string,
  mediaType: string,
): GuestContinueWatchingItem | null {
  const items = getGuestContinueWatching();
  return items.find((item) => item.mediaId === mediaId && item.mediaType === mediaType) || null;
}

/**
 * Save or update progress for a guest continue watching item.
 */
export function saveGuestWatchProgress(input: SaveGuestProgressInput): void {
  if (typeof window === "undefined") return;

  try {
    const items = getGuestContinueWatching();
    const existingIndex = items.findIndex(
      (item) => item.mediaId === input.mediaId && item.mediaType === input.mediaType,
    );

    const now = Date.now();
    const updatedItem: GuestContinueWatchingItem = {
      ...input,
      _id: `guest_${input.mediaType}_${input.mediaId}`,
      updatedAt: now,
    };

    let updatedList: GuestContinueWatchingItem[];
    if (existingIndex >= 0) {
      updatedList = [...items];
      updatedList[existingIndex] = updatedItem;
    } else {
      // Prepend newest item
      updatedList = [updatedItem, ...items];
    }

    // Limit guest items to maximum 20 items to prevent storage bloat
    const cappedList = updatedList
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 20);

    localStorage.setItem(
      STORAGE_KEYS.GUEST_CONTINUE_WATCHING,
      JSON.stringify(cappedList),
    );

    notifyGuestWatchUpdated();
  } catch (err) {
    console.error("Failed to save guest continue watching to localStorage:", err);
  }
}

/**
 * Remove a specific item from guest continue watching storage.
 */
export function removeGuestWatchProgress(mediaId: string, mediaType: string): void {
  if (typeof window === "undefined") return;

  try {
    const items = getGuestContinueWatching();
    const filtered = items.filter(
      (item) => !(item.mediaId === mediaId && item.mediaType === mediaType),
    );

    localStorage.setItem(
      STORAGE_KEYS.GUEST_CONTINUE_WATCHING,
      JSON.stringify(filtered),
    );

    notifyGuestWatchUpdated();
  } catch (err) {
    console.error("Failed to remove guest continue watching from localStorage:", err);
  }
}

/**
 * Clear all guest continue watching items (e.g. after sync to Convex).
 */
export function clearGuestContinueWatching(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.GUEST_CONTINUE_WATCHING);
    notifyGuestWatchUpdated();
  } catch (err) {
    console.error("Failed to clear guest continue watching from localStorage:", err);
  }
}
