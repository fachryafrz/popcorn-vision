import { convexClient } from "./convex-client";
import { api } from "@/convex/_generated/api";
import {
  TMDBMedia,
  TMDBRawItem,
  PROVIDERS,
  TMDBReviewsResponse,
} from "./tmdb";

export type { TMDBMedia, TMDBRawItem, TMDBReviewsResponse };

export interface TMDBLogo {
  file_path: string;
  iso_639_1: string | null;
}

export interface TMDBPoster {
  file_path: string;
  iso_639_1: string | null;
}

export interface MediaImages {
  logoPath: string | null;
  textlessPosterPath: string | null;
}

export interface ImportItem {
  title: string;
  year?: string;
  rating?: number;
  imdbId?: string;
  type: "movie" | "tv";
  sourceTable: "watchlist" | "favorites" | "ratings" | "diary";
  watchedDate?: number;
  rewatch?: boolean;
  review?: string;
  season?: number;
  episode?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  diaryType?: string;
}

export interface MatchedImportItem {
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  releaseYear: string;
  rating?: number;
  sourceTable: "watchlist" | "favorites" | "ratings" | "diary";
  matched: boolean;
  watchedDate?: number;
  rewatch?: boolean;
  review?: string;
  season?: number;
  episode?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  diaryType?: string;
}

export interface StatsMetadata {
  mediaId: string;
  mediaType: "movie" | "tv";
  runtime: number;
  genres: string[];
  cast: string[];
  directors: string[];
  watchProviders: string[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}

export interface DiscoverFilters {
  genre?: string;
  startDate?: string;
  endDate?: string;
  providerId?: string;
  minRuntime?: string;
  maxRuntime?: string;
  actor?: string;
  crew?: string;
  company?: string;
  ratingMin?: string;
  ratingMax?: string;
  language?: string;
  keywords?: string;
}

export interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface TMDBCompanyDetails {
  id: number;
  name: string;
  description: string;
  headquarters: string;
  homepage: string;
  logo_path: string | null;
  origin_country: string;
  parent_company: {
    id: number;
    name: string;
    logo_path: string | null;
  } | null;
}

// ==========================================
// In-Memory Client-Side Cache & Deduplication
// ==========================================
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

// Synchronous cache getters for instant UI state initialization (Zero Skeleton on revisit)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCachedMediaDetails(mediaType: string, id: string): any {
  return getFromCache(`media-details-${mediaType}-${id}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCachedPersonDetails(personId: string): any {
  return getFromCache(`person-details-${personId}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCachedPersonCredits(personId: string): any {
  return getFromCache(`person-credits-${personId}`);
}

export function getCachedCompanyDetails(companyId: string): TMDBCompanyDetails | null {
  return getFromCache<TMDBCompanyDetails>(`company-details-${companyId}`);
}

export function getCachedCompanyMovies(companyId: string, page: number = 1): TMDBMedia[] | null {
  return getFromCache<TMDBMedia[]>(`company-movies-${companyId}-${page}`);
}

export function getCachedCompanyTVShows(companyId: string, page: number = 1): TMDBMedia[] | null {
  return getFromCache<TMDBMedia[]>(`company-tv-${companyId}-${page}`);
}

// Hero Items
export async function getHeroItems(): Promise<TMDBMedia[]> {
  const cacheKey = "hero-items";
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getHeroItems, {})) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error("Error fetching hero items via Convex action:", error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Trending Now
export async function getTrending(type: "all" | "movie" | "tv"): Promise<TMDBMedia[]> {
  const cacheKey = `trending-${type}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getTrending, { type })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching trending ${type} via Convex action:`, error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Streaming Services Originals
export async function getStreamingOriginals(providerKey: keyof typeof PROVIDERS): Promise<TMDBMedia[]> {
  const cacheKey = `streaming-${providerKey}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getStreamingOriginals, { providerKey })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching streaming originals for ${providerKey} via Convex action:`, error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Browse by Category (Genre)
export async function getByCategory(genreName: string): Promise<TMDBMedia[]> {
  const cacheKey = `category-${genreName}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getByCategory, { genreName })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching category ${genreName} via Convex action:`, error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Get specific details for Quick View / Detail Page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMediaDetails(mediaType: "movie" | "tv", id: string): Promise<any> {
  const cacheKey = `media-details-${mediaType}-${id}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return await inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await convexClient.action(api.tmdb.getMediaDetails, { mediaType, id });
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching details for ${mediaType} ${id} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Fetch movie collection details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCollectionDetails(collectionId: number): Promise<any> {
  const cacheKey = `collection-${collectionId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return await inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await convexClient.action(api.tmdb.getCollectionDetails, { collectionId });
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching collection ${collectionId} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Fetch TV show season details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<any> {
  const cacheKey = `season-${tvId}-${seasonNumber}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return await inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await convexClient.action(api.tmdb.getSeasonDetails, { tvId, seasonNumber });
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching season ${seasonNumber} for tv ${tvId} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Search movies and TV shows
export async function searchMedia(query: string, type: "all" | "movie" | "tv" = "all", page: number = 1): Promise<TMDBMedia[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];
  const cacheKey = `search-${type}-${page}-${cleanQuery.toLowerCase()}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.searchMedia, { query: cleanQuery, type, page })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error("Error searching media via Convex action:", error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Match CSV import items
export async function matchImportItemsAction(items: ImportItem[]): Promise<MatchedImportItem[]> {
  try {
    return (await convexClient.action(api.tmdb.matchImportItemsAction, { items })) as MatchedImportItem[];
  } catch (error) {
    console.error("Error matching import items via Convex action:", error);
    return [];
  }
}

// Batch fetch metadata for insights/stats
export async function batchFetchMediaMetadata(
  items: { mediaId: string; mediaType: "movie" | "tv"; season?: number; episode?: number }[],
  countryCode: string = "US"
): Promise<Record<string, StatsMetadata>> {
  try {
    return (await convexClient.action(api.tmdb.batchFetchMediaMetadata, { items, countryCode })) as Record<string, StatsMetadata>;
  } catch (error) {
    console.error("Error batch fetching media metadata via Convex action:", error);
    return {};
  }
}

// Person details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPersonDetails(personId: string): Promise<any> {
  const cacheKey = `person-details-${personId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return await inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await convexClient.action(api.tmdb.getPersonDetails, { personId });
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching person details for ${personId} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Person credits
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPersonCredits(personId: string): Promise<any> {
  const cacheKey = `person-credits-${personId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return await inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await convexClient.action(api.tmdb.getPersonCredits, { personId });
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching person credits for ${personId} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Search person by name
export async function searchPersonByName(name: string): Promise<number | null> {
  const cacheKey = `search-person-${name.toLowerCase().trim()}`;
  const cached = getFromCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const id = await convexClient.action(api.tmdb.searchPersonByName, { name });
    if (id !== null) {
      setToCache(cacheKey, id);
    }
    return id;
  } catch (error) {
    console.error(`Error searching person ${name} via Convex action:`, error);
    return null;
  }
}

// Search company by name
export async function searchCompanyByName(name: string): Promise<number | null> {
  const cacheKey = `search-company-${name.toLowerCase().trim()}`;
  const cached = getFromCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const id = await convexClient.action(api.tmdb.searchCompanyByName, { name });
    if (id !== null) {
      setToCache(cacheKey, id);
    }
    return id;
  } catch (error) {
    console.error(`Error searching company ${name} via Convex action:`, error);
    return null;
  }
}

// Search keyword by name
export async function searchKeywordByName(name: string): Promise<number | null> {
  const cacheKey = `search-keyword-${name.toLowerCase().trim()}`;
  const cached = getFromCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const id = await convexClient.action(api.tmdb.searchKeywordByName, { name });
    if (id !== null) {
      setToCache(cacheKey, id);
    }
    return id;
  } catch (error) {
    console.error(`Error searching keyword ${name} via Convex action:`, error);
    return null;
  }
}

// Discover media
export async function discoverMedia(
  filters: DiscoverFilters,
  type: "all" | "movie" | "tv" = "all",
  page: number = 1,
  watchRegion: string = "US"
): Promise<TMDBMedia[]> {
  const cacheKey = `discover-${type}-${page}-${watchRegion}-${JSON.stringify(filters)}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.discoverMedia, {
        filters,
        type,
        page,
        watchRegion,
      })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error("Error discovering media via Convex action:", error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Genres
export async function getTMDBGenres(): Promise<{ id: number; name: string; types: ("movie" | "tv")[] }[]> {
  const cacheKey = "genres-all";
  const cached = getFromCache<{ id: number; name: string; types: ("movie" | "tv")[] }[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await convexClient.action(api.tmdb.getTMDBGenres, {});
    if (data && data.length > 0) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching genres via Convex action:", error);
    return [];
  }
}

// Providers
export async function getTMDBProviders(watchRegion: string = "US"): Promise<TMDBProvider[]> {
  const cacheKey = `providers-${watchRegion}`;
  const cached = getFromCache<TMDBProvider[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = (await convexClient.action(api.tmdb.getTMDBProviders, { watchRegion })) as TMDBProvider[];
    if (data && data.length > 0) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching providers via Convex action:", error);
    return [];
  }
}

// Company details
export async function getCompanyDetails(companyId: string): Promise<TMDBCompanyDetails | null> {
  const cacheKey = `company-details-${companyId}`;
  const cached = getFromCache<TMDBCompanyDetails>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBCompanyDetails | null;
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getCompanyDetails, { companyId })) as TMDBCompanyDetails | null;
      if (data) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching company details for ${companyId} via Convex action:`, error);
      return null;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Company movies
export async function getCompanyMovies(companyId: string, page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `company-movies-${companyId}-${page}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getCompanyMovies, { companyId, page })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching company movies for ${companyId} via Convex action:`, error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Company TV Shows
export async function getCompanyTVShows(companyId: string, page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `company-tv-${companyId}-${page}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  if (inFlightRequests.has(cacheKey)) {
    return (await inFlightRequests.get(cacheKey)) as TMDBMedia[];
  }

  const promise = (async () => {
    try {
      const data = (await convexClient.action(api.tmdb.getCompanyTVShows, { companyId, page })) as TMDBMedia[];
      if (data && data.length > 0) {
        setToCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching company TV shows for ${companyId} via Convex action:`, error);
      return [];
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

// Media reviews
export async function getMediaReviews(
  mediaType: "movie" | "tv",
  id: string,
  page: number = 1
): Promise<TMDBReviewsResponse | null> {
  const cacheKey = `reviews-${mediaType}-${id}-${page}`;
  const cached = getFromCache<TMDBReviewsResponse>(cacheKey);
  if (cached) return cached;

  try {
    const data = (await convexClient.action(api.tmdb.getMediaReviews, { mediaType, id, page })) as TMDBReviewsResponse | null;
    if (data) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching reviews for ${mediaType} ${id} via Convex action:`, error);
    return null;
  }
}

// Upcoming movies
export async function getUpcomingMovies(page: number = 1, region: string = "US"): Promise<TMDBMedia[]> {
  const cacheKey = `upcoming-movies-${region}-${page}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = (await convexClient.action(api.tmdb.getUpcomingMovies, { page, region })) as TMDBMedia[];
    if (data && data.length > 0) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching upcoming movies via Convex action:", error);
    return [];
  }
}

// Upcoming TV shows
export async function getUpcomingTVShows(page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `upcoming-tv-${page}`;
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = (await convexClient.action(api.tmdb.getUpcomingTVShows, { page })) as TMDBMedia[];
    if (data && data.length > 0) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching upcoming TV shows via Convex action:", error);
    return [];
  }
}

// Upcoming media (movies + tv)
export async function getUpcomingMedia(): Promise<TMDBMedia[]> {
  const cacheKey = "upcoming-media-all";
  const cached = getFromCache<TMDBMedia[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = (await convexClient.action(api.tmdb.getUpcomingMedia, {})) as TMDBMedia[];
    if (data && data.length > 0) {
      setToCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching upcoming media via Convex action:", error);
    return [];
  }
}
