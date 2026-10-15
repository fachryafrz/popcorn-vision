// Client-side Two-Tier Cache (L1: In-Memory Map, L2: IndexedDB) with Stale-While-Revalidate (SWR)
// Zero server compute, zero Vercel/Convex usage, instant 0ms cached page transitions.

export const CACHE_TTL_SHORT = 2 * 60 * 60 * 1000; // 2 hours (Trending, Discover, Search, Upcoming)
export const CACHE_TTL_MEDIUM = 24 * 60 * 60 * 1000; // 24 hours (Media Details, Reviews)
export const CACHE_TTL_LONG = 7 * 24 * 60 * 60 * 1000; // 7 days (Genres, Providers, Person, Company)

interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
}

// L1: In-Memory Map (Instant synchronous access for 0ms transitions within session)
const memoryCache = new Map<string, CacheEntry<unknown>>();

// Request Deduplication: In-flight network promises
const inFlightRequests = new Map<string, Promise<unknown>>();

// ==========================================
// L2: Native IndexedDB Storage Engine
// ==========================================
const DB_NAME = "popcorn_vision_db";
const DB_VERSION = 1;
const STORE_NAME = "tmdb_cache";

let dbPromise: Promise<IDBDatabase | null> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function getIDB(): Promise<IDBDatabase | null> {
  if (!isBrowser()) {
    return Promise.resolve(null);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn("IndexedDB failed to open, falling back to in-memory cache.");
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });

  return dbPromise;
}

async function getFromIndexedDB<T>(key: string): Promise<CacheEntry<T> | null> {
  const db = await getIDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const entry = req.result as CacheEntry<T> | undefined;
        resolve(entry ?? null);
      };

      req.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

async function saveToIndexedDB<T>(entry: CacheEntry<T>): Promise<void> {
  const db = await getIDB();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(entry);
  } catch {
    // Ignore storage quota or transaction errors gracefully
  }
}

// ==========================================
// Cache Access & Stale-While-Revalidate Engine
// ==========================================

export function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  return entry.data as T;
}

export function setToCache<T>(key: string, data: T, ttl: number = CACHE_TTL_SHORT): void {
  const entry: CacheEntry<T> = {
    key,
    data,
    timestamp: Date.now(),
    ttl,
  };

  // Update L1 In-Memory
  memoryCache.set(key, entry as CacheEntry<unknown>);

  // Update L2 IndexedDB asynchronously
  void saveToIndexedDB(entry);
}

// Background revalidation without blocking caller
function triggerBackgroundRevalidation<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): void {
  if (inFlightRequests.has(key)) return;

  const revalidatePromise = (async () => {
    try {
      const freshData = await fetcher();
      if (freshData !== null && freshData !== undefined) {
        setToCache(key, freshData, ttl);
      }
    } catch (err) {
      // Background revalidation failure silently keeps existing cached data
      console.warn(`[TMDB Cache] Background revalidation failed for ${key}:`, err);
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, revalidatePromise);
}

/**
 * Fetch data with L1 Map + L2 IndexedDB and Stale-While-Revalidate (SWR) logic.
 * 1. If fresh in L1/L2 -> Return immediately (0ms).
 * 2. If stale in L1/L2 -> Return stale data immediately (0ms) & revalidate in background.
 * 3. If cold (no cache) -> Await fetcher, cache result, and return.
 */
export async function fetchWithCacheDedupe<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();

  // 1. Check L1 In-Memory Cache
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memoryEntry) {
    const isFresh = now - memoryEntry.timestamp <= memoryEntry.ttl;
    if (isFresh) {
      return memoryEntry.data;
    }
    // Stale in memory -> return instantly, revalidate in background (SWR)
    triggerBackgroundRevalidation(key, ttl, fetcher);
    return memoryEntry.data;
  }

  // 2. Check L2 IndexedDB Cache
  const idbEntry = await getFromIndexedDB<T>(key);
  if (idbEntry) {
    // Populate L1 memory cache
    memoryCache.set(key, idbEntry as CacheEntry<unknown>);

    const isFresh = now - idbEntry.timestamp <= idbEntry.ttl;
    if (isFresh) {
      return idbEntry.data;
    }
    // Stale in IndexedDB -> return instantly, revalidate in background (SWR)
    triggerBackgroundRevalidation(key, ttl, fetcher);
    return idbEntry.data;
  }

  // 3. Cold Cache: Check if request is already in-flight from another component
  if (inFlightRequests.has(key)) {
    return (await inFlightRequests.get(key)) as T;
  }

  // 4. Perform direct network fetch
  const networkPromise = (async () => {
    try {
      const data = await fetcher();
      if (data !== null && data !== undefined) {
        setToCache(key, data, ttl);
      }
      return data;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, networkPromise);
  return networkPromise;
}
