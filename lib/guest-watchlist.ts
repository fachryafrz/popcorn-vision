import { STORAGE_KEYS, GUEST_WATCHLIST_UPDATED_EVENT } from "./constants";

export interface GuestWatchlistItem {
  _id: string;
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  rating?: number;
  releaseYear?: string;
  addedAt: number;
}

export type SaveGuestWatchlistInput = Omit<GuestWatchlistItem, "_id" | "addedAt">;

/**
 * Dispatches a custom event to notify all listeners in the current window.
 */
function notifyGuestWatchlistUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GUEST_WATCHLIST_UPDATED_EVENT));
  }
}

/**
 * Retrieve all guest watchlist items from localStorage.
 */
export function getGuestWatchlist(): GuestWatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUEST_WATCHLIST);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is GuestWatchlistItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.mediaId === "string" &&
        (item.mediaType === "movie" || item.mediaType === "tv") &&
        typeof item.title === "string" &&
        typeof item.posterPath === "string" &&
        typeof item.addedAt === "number"
      );
    });
  } catch (err) {
    console.error("Failed to read guest watchlist from localStorage:", err);
    return [];
  }
}

/**
 * Check if a specific media item is in the guest watchlist.
 */
export function isGuestWatchlisted(mediaId: string | number, mediaType: string): boolean {
  const strId = String(mediaId);
  const type = mediaType || "movie";
  const items = getGuestWatchlist();
  return items.some((item) => item.mediaId === strId && item.mediaType === type);
}

/**
 * Add an item to the guest watchlist.
 */
export function addToGuestWatchlist(input: SaveGuestWatchlistInput): void {
  if (typeof window === "undefined") return;

  try {
    const items = getGuestWatchlist();
    const existingIndex = items.findIndex(
      (item) => item.mediaId === input.mediaId && item.mediaType === input.mediaType,
    );

    const now = Date.now();
    const newItem: GuestWatchlistItem = {
      ...input,
      _id: `guest_wl_${input.mediaType}_${input.mediaId}`,
      addedAt: now,
    };

    let updatedList: GuestWatchlistItem[];
    if (existingIndex >= 0) {
      updatedList = [...items];
      updatedList[existingIndex] = newItem;
    } else {
      updatedList = [newItem, ...items];
    }

    localStorage.setItem(
      STORAGE_KEYS.GUEST_WATCHLIST,
      JSON.stringify(updatedList),
    );

    notifyGuestWatchlistUpdated();
  } catch (err) {
    console.error("Failed to add to guest watchlist:", err);
  }
}

/**
 * Remove an item from the guest watchlist.
 */
export function removeFromGuestWatchlist(mediaId: string | number, mediaType: string): void {
  if (typeof window === "undefined") return;

  try {
    const strId = String(mediaId);
    const type = mediaType || "movie";
    const items = getGuestWatchlist();
    const filtered = items.filter(
      (item) => !(item.mediaId === strId && item.mediaType === type),
    );

    localStorage.setItem(
      STORAGE_KEYS.GUEST_WATCHLIST,
      JSON.stringify(filtered),
    );

    notifyGuestWatchlistUpdated();
  } catch (err) {
    console.error("Failed to remove from guest watchlist:", err);
  }
}

/**
 * Clear all guest watchlist items (e.g. after sync to Convex).
 */
export function clearGuestWatchlist(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.GUEST_WATCHLIST);
    notifyGuestWatchlistUpdated();
  } catch (err) {
    console.error("Failed to clear guest watchlist:", err);
  }
}
