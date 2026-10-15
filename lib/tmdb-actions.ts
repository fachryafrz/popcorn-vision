import {
  TMDBMedia,
  TMDBRawItem,
  cleanMediaData,
  PROVIDERS,
  GENRE_MAP,
  TMDBReviewsResponse,
} from "./tmdb";
import {
  getFromCache,
  setToCache,
  fetchWithCacheDedupe,
  CACHE_TTL_SHORT,
  CACHE_TTL_MEDIUM,
  CACHE_TTL_LONG,
} from "./tmdb-cache";
import type { MediaDetailResponse, SeasonDetails } from "@/components/media-detail/types";
import type { TMDBPerson, PersonCredits } from "@/components/person-detail-client";

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

function getTMDBConfig(): { baseUrl: string; apiKey?: string } {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
  const apiKeyRaw = process.env.NEXT_PUBLIC_API_KEY ?? process.env.API_KEY;
  const apiKey = apiKeyRaw ? apiKeyRaw.trim() : undefined;

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_URL environment variable. Please make sure the value is defined in .env.local"
    );
  }

  const isDirectTMDB = baseUrl.includes("api.themoviedb.org");
  if (isDirectTMDB && !apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_KEY environment variable for direct TMDB connection. Please make sure the value is defined in .env.local"
    );
  }

  return { baseUrl, apiKey };
}

export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const { baseUrl, apiKey } = getTMDBConfig();
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${cleanBase}${cleanEndpoint}`);
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(key, String(val));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error [${res.status}]: ${res.statusText} at ${endpoint}`);
  }

  return (await res.json()) as T;
}

// Helper to fetch logo and textless poster paths for a media item
async function fetchMediaImages(mediaType: "movie" | "tv", id: number): Promise<MediaImages> {
  try {
    const data = await tmdbFetch<{ logos?: TMDBLogo[]; posters?: TMDBPoster[] }>(`/${mediaType}/${id}/images`, {
      include_image_language: "en,null",
    });
    const logos = data.logos ?? [];
    const posters = data.posters ?? [];

    let logoPath: string | null = null;
    if (logos.length > 0) {
      const englishLogo = logos.find((l) => l.iso_639_1 === "en");
      logoPath = (englishLogo ?? logos[0]).file_path ?? null;
    }

    let textlessPosterPath: string | null = null;
    if (posters.length > 0) {
      const textlessPoster = posters.find((p) => p.iso_639_1 === null);
      textlessPosterPath = (textlessPoster ?? posters[0]).file_path ?? null;
    }

    return { logoPath, textlessPosterPath };
  } catch (error) {
    console.error(`Error fetching images for ${mediaType} ${id}:`, error);
    return { logoPath: null, textlessPosterPath: null };
  }
}

// ==========================================
// Synchronous Cache Getters (Instant UI)
// ==========================================

export function getCachedMediaDetails(mediaType: string, id: string): MediaDetailResponse | null {
  return getFromCache<MediaDetailResponse>(`media-details-${mediaType}-${id}`);
}

export function getCachedPersonDetails(personId: string): TMDBPerson | null {
  return getFromCache<TMDBPerson>(`person-details-${personId}`);
}

export function getCachedPersonCredits(personId: string): PersonCredits | null {
  return getFromCache<PersonCredits>(`person-credits-${personId}`);
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

// ==========================================
// Media Discovery & Catalog Queries
// ==========================================

// Hero Items
export async function getHeroItems(): Promise<TMDBMedia[]> {
  const cacheKey = "hero-items";
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/trending/all/week");
      const clean = cleanMediaData(res.results ?? []);

      // Deduplicate
      const seen = new Set<string>();
      const uniqueItems: TMDBMedia[] = [];
      for (const item of clean) {
        const key = `${item.media_type ?? "movie"}-${item.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueItems.push(item);
        }
      }

      // Sort by popularity and select top 15
      const topItems = uniqueItems.sort((a, b) => b.popularity - a.popularity).slice(0, 15);

      // Fetch logos and textless posters in parallel
      return await Promise.all(
        topItems.map(async (item) => {
          const { logoPath, textlessPosterPath } = await fetchMediaImages(item.media_type ?? "movie", item.id);
          return {
            ...item,
            logo_path: logoPath,
            textless_poster_path: textlessPosterPath,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching hero items:", error);
      return [];
    }
  });
}

// Trending Now
export async function getTrending(type: "all" | "movie" | "tv"): Promise<TMDBMedia[]> {
  const cacheKey = `trending-${type}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>(`/trending/${type}/day`);
      return cleanMediaData(res.results ?? [], type === "all" ? undefined : type);
    } catch (error) {
      console.error(`Error fetching trending ${type}:`, error);
      return [];
    }
  });
}

// Streaming Services Originals
export async function getStreamingOriginals(providerKey: keyof typeof PROVIDERS): Promise<TMDBMedia[]> {
  const cacheKey = `streaming-${providerKey}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const provider = PROVIDERS[providerKey];
      if (!provider) return [];

      const [movieRes, tvRes] = await Promise.all([
        tmdbFetch<{ results: TMDBRawItem[] }>("/discover/movie", {
          with_watch_providers: provider.id,
          watch_region: "US",
          sort_by: "popularity.desc",
        }),
        tmdbFetch<{ results: TMDBRawItem[] }>("/discover/tv", {
          with_watch_providers: provider.id,
          watch_region: "US",
          sort_by: "popularity.desc",
        }),
      ]);

      const movies = cleanMediaData(movieRes.results ?? [], "movie");
      const tv = cleanMediaData(tvRes.results ?? [], "tv");

      return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
    } catch (error) {
      console.error(`Error fetching streaming originals for ${providerKey}:`, error);
      return [];
    }
  });
}

// Browse by Category (Genre)
export async function getByCategory(genreName: string): Promise<TMDBMedia[]> {
  const cacheKey = `category-${genreName}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const genre = GENRE_MAP[genreName];
      if (!genre) return [];

      const [movieRes, tvRes] = await Promise.all([
        tmdbFetch<{ results: TMDBRawItem[] }>("/discover/movie", {
          with_genres: genre.movie,
          sort_by: "popularity.desc",
        }),
        tmdbFetch<{ results: TMDBRawItem[] }>("/discover/tv", {
          with_genres: genre.tv,
          sort_by: "popularity.desc",
        }),
      ]);

      const movies = cleanMediaData(movieRes.results ?? [], "movie");
      const tv = cleanMediaData(tvRes.results ?? [], "tv");

      return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
    } catch (error) {
      console.error(`Error fetching category ${genreName}:`, error);
      return [];
    }
  });
}

// Media Details for Quick View / Detail Page
export async function getMediaDetails(
  mediaType: "movie" | "tv",
  id: string
): Promise<MediaDetailResponse | null> {
  const cacheKey = `media-details-${mediaType}-${id}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_MEDIUM, async () => {
    try {
      const regionAppend = mediaType === "movie" ? "release_dates" : "content_ratings";

      const data = await tmdbFetch<Record<string, unknown>>(`/${mediaType}/${id}`, {
        append_to_response: `credits,videos,watch/providers,recommendations,images,${regionAppend}`,
        include_image_language: "en,null",
      });

      const imagesObj =
        (data.images as {
          logos?: TMDBLogo[];
          posters?: TMDBPoster[];
          backdrops?: unknown[];
        }) ?? {};
      const logos = imagesObj.logos ?? [];
      const posters = imagesObj.posters ?? [];

      const englishLogo = logos.find((l) => l.iso_639_1 === "en");
      const logoPath: string | null = logos.length > 0 ? (englishLogo ?? logos[0]).file_path ?? null : null;

      const textlessPoster = posters.find((p) => p.iso_639_1 === null);
      const textlessPosterPath: string | null =
        posters.length > 0 ? (textlessPoster ?? posters[0]).file_path ?? null : null;

      const recsObj = (data.recommendations as { results?: TMDBRawItem[] }) ?? {};
      const recommendations = cleanMediaData(recsObj.results ?? [], mediaType);

      const creditsObj =
        (data.credits as {
          cast?: MediaDetailResponse["credits"]["cast"];
          crew?: MediaDetailResponse["credits"]["crew"];
        }) ?? { cast: [], crew: [] };
      const videosObj = (data.videos as { results?: MediaDetailResponse["videos"] }) ?? { results: [] };
      const providersObj = (data["watch/providers"] as {
        results?: MediaDetailResponse["watchProviders"];
      }) ?? { results: {} };
      const regionalObj = (data[regionAppend] as {
        results?: MediaDetailResponse["regionalData"];
      }) ?? { results: [] };

      return {
        details: data as unknown as MediaDetailResponse["details"],
        credits: creditsObj,
        videos: videosObj.results ?? [],
        watchProviders: providersObj.results ?? {},
        logoPath,
        textlessPosterPath,
        recommendations,
        regionalData: regionalObj.results ?? [],
        images: {
          backdrops: (imagesObj.backdrops ?? []) as MediaDetailResponse["images"]["backdrops"],
          posters: (imagesObj.posters ?? []) as MediaDetailResponse["images"]["posters"],
          logos: (imagesObj.logos ?? []) as MediaDetailResponse["images"]["logos"],
        },
      };
    } catch (error) {
      console.error(`Error fetching details for ${mediaType} ${id}:`, error);
      return null;
    }
  });
}

// Collection Details
export async function getCollectionDetails(collectionId: number): Promise<Record<string, unknown> | null> {
  const cacheKey = `collection-${collectionId}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      return await tmdbFetch<Record<string, unknown>>(`/collection/${collectionId}`);
    } catch (error) {
      console.error(`Error fetching collection ${collectionId}:`, error);
      return null;
    }
  });
}

// Season Details
export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails | null> {
  const cacheKey = `season-${tvId}-${seasonNumber}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      return await tmdbFetch<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
    } catch (error) {
      console.error(`Error fetching season ${seasonNumber} for tv ${tvId}:`, error);
      return null;
    }
  });
}

// Search Movies & TV Shows
export async function searchMedia(
  query: string,
  type: "all" | "movie" | "tv" = "all",
  page: number = 1
): Promise<TMDBMedia[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];
  const cacheKey = `search-${type}-${page}-${cleanQuery.toLowerCase()}`;

  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      if (type === "movie") {
        const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/search/movie", {
          query: cleanQuery,
          page,
          include_adult: false,
        });
        return cleanMediaData(res.results ?? [], "movie");
      }
      if (type === "tv") {
        const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/search/tv", {
          query: cleanQuery,
          page,
          include_adult: false,
        });
        return cleanMediaData(res.results ?? [], "tv");
      }

      const [movieRes, tvRes] = await Promise.all([
        tmdbFetch<{ results: TMDBRawItem[] }>("/search/movie", {
          query: cleanQuery,
          page,
          include_adult: false,
        }),
        tmdbFetch<{ results: TMDBRawItem[] }>("/search/tv", {
          query: cleanQuery,
          page,
          include_adult: false,
        }),
      ]);

      const movies = cleanMediaData(movieRes.results ?? [], "movie");
      const tv = cleanMediaData(tvRes.results ?? [], "tv");

      return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
    } catch (error) {
      console.error("Error searching media:", error);
      return [];
    }
  });
}

// Match CSV Import Items (Letterboxd / IMDb)
export async function matchImportItemsAction(items: ImportItem[]): Promise<MatchedImportItem[]> {
  const results: MatchedImportItem[] = [];

  for (const item of items) {
    let matchedId: string | null = null;
    let matchedTitle: string | null = null;
    let matchedPoster: string | null = null;
    let matchedYear: string | null = null;
    let matchedType: "movie" | "tv" = item.type;

    try {
      if (item.imdbId && item.imdbId.trim().startsWith("tt")) {
        const findRes = await tmdbFetch<{
          movie_results?: { id: number; title: string; poster_path?: string; release_date?: string }[];
          tv_results?: { id: number; name: string; poster_path?: string; first_air_date?: string }[];
        }>(`/find/${item.imdbId.trim()}`, { external_source: "imdb_id" });

        const movieResults = findRes.movie_results ?? [];
        const tvResults = findRes.tv_results ?? [];

        if (movieResults.length > 0) {
          const matched = movieResults[0];
          matchedId = String(matched.id);
          matchedTitle = matched.title;
          matchedPoster = matched.poster_path ?? "";
          matchedYear = matched.release_date ? String(new Date(matched.release_date).getFullYear()) : "";
          matchedType = "movie";
        } else if (tvResults.length > 0) {
          const matched = tvResults[0];
          matchedId = String(matched.id);
          matchedTitle = matched.name;
          matchedPoster = matched.poster_path ?? "";
          matchedYear = matched.first_air_date ? String(new Date(matched.first_air_date).getFullYear()) : "";
          matchedType = "tv";
        }
      }

      if (!matchedId) {
        const queryType = item.type === "tv" ? "tv" : "movie";
        const searchRes = await tmdbFetch<{
          results?: {
            id: number;
            title?: string;
            name?: string;
            poster_path?: string;
            release_date?: string;
            first_air_date?: string;
          }[];
        }>(`/search/${queryType}`, { query: item.title, include_adult: false });

        const searchResults = searchRes.results ?? [];
        if (searchResults.length > 0) {
          let bestMatch = searchResults[0];
          if (item.year) {
            const targetYear = parseInt(item.year, 10);
            for (const candidate of searchResults) {
              const dateStr = queryType === "movie" ? candidate.release_date : candidate.first_air_date;
              if (dateStr) {
                const candidateYear = new Date(dateStr).getFullYear();
                if (Math.abs(candidateYear - targetYear) <= 1) {
                  bestMatch = candidate;
                  break;
                }
              }
            }
          }

          matchedId = String(bestMatch.id);
          matchedTitle = queryType === "movie" ? (bestMatch.title ?? "") : (bestMatch.name ?? "");
          matchedPoster = bestMatch.poster_path ?? "";
          const dateStr = queryType === "movie" ? bestMatch.release_date : bestMatch.first_air_date;
          matchedYear = dateStr ? String(new Date(dateStr).getFullYear()) : (item.year ?? "");
          matchedType = queryType;
        }
      }
    } catch (err) {
      console.error(`Error matching import item ${item.title}:`, err);
    }

    if (matchedId && matchedTitle) {
      results.push({
        mediaId: matchedId,
        mediaType: matchedType,
        title: matchedTitle,
        posterPath: matchedPoster ?? "",
        releaseYear: matchedYear ?? "",
        rating: item.rating,
        sourceTable: item.sourceTable,
        matched: true,
        watchedDate: item.watchedDate,
        rewatch: item.rewatch,
        review: item.review,
        season: item.season,
        episode: item.episode,
        numberOfSeasons: item.numberOfSeasons,
        numberOfEpisodes: item.numberOfEpisodes,
        diaryType: item.diaryType,
      });
    } else {
      results.push({
        mediaId: "",
        mediaType: item.type,
        title: item.title,
        posterPath: "",
        releaseYear: item.year ?? "",
        rating: item.rating,
        sourceTable: item.sourceTable,
        matched: false,
        watchedDate: item.watchedDate,
        rewatch: item.rewatch,
        review: item.review,
        season: item.season,
        episode: item.episode,
        numberOfSeasons: item.numberOfSeasons,
        numberOfEpisodes: item.numberOfEpisodes,
        diaryType: item.diaryType,
      });
    }
  }

  return results;
}

// Batch Fetch Metadata for Insights / Stats
export async function batchFetchMediaMetadata(
  items: { mediaId: string; mediaType: "movie" | "tv"; season?: number; episode?: number }[],
  countryCode: string = "US"
): Promise<Record<string, StatsMetadata>> {
  const uniqueItemsMap = new Map<
    string,
    { mediaId: string; mediaType: "movie" | "tv"; season?: number; episode?: number }
  >();

  for (const item of items) {
    const key =
      item.season !== undefined && item.episode !== undefined
        ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
        : item.season !== undefined
          ? `${item.mediaType}-${item.mediaId}-S${item.season}`
          : `${item.mediaType}-${item.mediaId}`;
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  }

  const uniqueItems = Array.from(uniqueItemsMap.values());
  const resultsMap: Record<string, StatsMetadata> = {};

  const batchSize = 10;
  for (let i = 0; i < uniqueItems.length; i += batchSize) {
    const batch = uniqueItems.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (item) => {
        const key =
          item.season !== undefined && item.episode !== undefined
            ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
            : item.season !== undefined
              ? `${item.mediaType}-${item.mediaId}-S${item.season}`
              : `${item.mediaType}-${item.mediaId}`;

        const cached = getFromCache<StatsMetadata>(`stats-meta-${key}`);
        if (cached) {
          resultsMap[key] = cached;
          return;
        }

        try {
          const data = await tmdbFetch<Record<string, unknown>>(`/${item.mediaType}/${item.mediaId}`, {
            append_to_response: "credits,watch/providers",
          });

          const genresArr = (data.genres as { id: number; name: string }[]) ?? [];
          const genres = genresArr.map((g) => g.name);

          let runtime = 0;
          let seasonEpisodesCount = 10;
          if (item.mediaType === "tv" && item.season !== undefined) {
            const seasons = (data.seasons as { season_number: number; episode_count: number }[]) ?? [];
            const seasonObj = seasons.find((s) => s.season_number === item.season);
            if (seasonObj) {
              seasonEpisodesCount = seasonObj.episode_count ?? 10;
            }
          }

          const epRunTimes = (data.episode_run_time as number[]) ?? [];

          if (item.mediaType === "movie") {
            runtime = (data.runtime as number) ?? 0;
          } else if (item.season !== undefined && item.episode !== undefined) {
            try {
              const epData = await tmdbFetch<{ runtime?: number }>(
                `/tv/${item.mediaId}/season/${item.season}/episode/${item.episode}`
              );
              runtime = epData.runtime ?? (epRunTimes.length > 0 ? epRunTimes[0] : 45);
            } catch {
              runtime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
            }
          } else if (item.season !== undefined) {
            try {
              const seasonData = await tmdbFetch<{ episodes?: { runtime?: number }[] }>(
                `/tv/${item.mediaId}/season/${item.season}`
              );
              const episodes = seasonData.episodes ?? [];
              let totalSeasonRuntime = 0;
              let validEpisodesCount = 0;
              for (const ep of episodes) {
                if (ep.runtime) {
                  totalSeasonRuntime += ep.runtime;
                  validEpisodesCount++;
                }
              }
              const remainingEpisodes = episodes.length - validEpisodesCount;
              if (remainingEpisodes > 0) {
                const defaultEpRuntime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
                totalSeasonRuntime += remainingEpisodes * defaultEpRuntime;
              }
              runtime =
                totalSeasonRuntime ||
                (epRunTimes.length > 0 ? epRunTimes[0] * seasonEpisodesCount : 45 * seasonEpisodesCount);
            } catch {
              const episodeRuntime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
              runtime = episodeRuntime * seasonEpisodesCount;
            }
          } else {
            const episodeRuntime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
            const numberOfEpisodes = (data.number_of_episodes as number) ?? 10;
            runtime = episodeRuntime * numberOfEpisodes;
          }

          const credits =
            (data.credits as { cast?: { name: string }[]; crew?: { job: string; name: string }[] }) ?? {};
          const cast = (credits.cast ?? []).slice(0, 5).map((c) => c.name);

          const directors =
            item.mediaType === "tv"
              ? ((data.created_by as { name: string }[]) ?? []).map((c) => c.name)
              : (credits.crew ?? []).filter((c) => c.job === "Director").map((c) => c.name);

          const watchProvidersObj =
            (data["watch/providers"] as {
              results?: Record<string, { flatrate?: { provider_name: string }[] }>;
            }) ?? {};
          const providerData = watchProvidersObj.results?.[countryCode] ?? watchProvidersObj.results?.US;
          const watchProviders = (providerData?.flatrate ?? []).map((p) => p.provider_name);

          const meta: StatsMetadata = {
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            runtime,
            genres,
            cast,
            directors,
            watchProviders,
            numberOfSeasons:
              item.season !== undefined ? 1 : item.mediaType === "tv" ? (data.number_of_seasons as number) : undefined,
            numberOfEpisodes:
              item.season !== undefined
                ? seasonEpisodesCount
                : item.mediaType === "tv"
                  ? (data.number_of_episodes as number)
                  : undefined,
          };

          setToCache(`stats-meta-${key}`, meta, CACHE_TTL_LONG);
          resultsMap[key] = meta;
        } catch (error) {
          console.error(`Error fetching stats metadata for ${item.mediaType} ${item.mediaId}:`, error);
        }
      })
    );
  }

  return resultsMap;
}

// Person Details
export async function getPersonDetails(personId: string): Promise<TMDBPerson | null> {
  const cacheKey = `person-details-${personId}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      return await tmdbFetch<TMDBPerson>(`/person/${personId}`);
    } catch (error) {
      console.error(`Error fetching person details for ${personId}:`, error);
      return null;
    }
  });
}

// Person Credits
export async function getPersonCredits(personId: string): Promise<PersonCredits | null> {
  const cacheKey = `person-credits-${personId}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      return await tmdbFetch<PersonCredits>(`/person/${personId}/combined_credits`);
    } catch (error) {
      console.error(`Error fetching person credits for ${personId}:`, error);
      return null;
    }
  });
}

// Search Person by Name
export async function searchPersonByName(name: string): Promise<number | null> {
  const cleanName = name.toLowerCase().trim();
  if (!cleanName) return null;
  const cacheKey = `search-person-${cleanName}`;

  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", {
        query: cleanName,
        include_adult: false,
      });
      if (res.results && res.results.length > 0) {
        return res.results[0].id;
      }
      return null;
    } catch (error) {
      console.error(`Error searching person by name ${name}:`, error);
      return null;
    }
  });
}

// Search Company by Name
export async function searchCompanyByName(name: string): Promise<number | null> {
  const cleanName = name.toLowerCase().trim();
  if (!cleanName) return null;
  const cacheKey = `search-company-${cleanName}`;

  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const res = await tmdbFetch<{ results: { id: number }[] }>("/search/company", { query: cleanName });
      if (res.results && res.results.length > 0) {
        return res.results[0].id;
      }
      return null;
    } catch (error) {
      console.error(`Error searching company by name ${name}:`, error);
      return null;
    }
  });
}

// Search Keyword by Name
export async function searchKeywordByName(name: string): Promise<number | null> {
  const cleanName = name.toLowerCase().trim();
  if (!cleanName) return null;
  const cacheKey = `search-keyword-${cleanName}`;

  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const res = await tmdbFetch<{ results: { id: number }[] }>("/search/keyword", { query: cleanName });
      if (res.results && res.results.length > 0) {
        return res.results[0].id;
      }
      return null;
    } catch (error) {
      console.error(`Error searching keyword by name ${name}:`, error);
      return null;
    }
  });
}

// Discover Media
export async function discoverMedia(
  filters: DiscoverFilters,
  type: "all" | "movie" | "tv" = "all",
  page: number = 1,
  watchRegion: string = "US"
): Promise<TMDBMedia[]> {
  const cacheKey = `discover-${type}-${page}-${watchRegion}-${JSON.stringify(filters)}`;

  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const movieParams: Record<string, string | number | boolean | undefined> = {
        sort_by: "popularity.desc",
        page,
        include_adult: false,
      };
      const tvParams: Record<string, string | number | boolean | undefined> = {
        sort_by: "popularity.desc",
        page,
        include_adult: false,
      };

      if (filters.genre) {
        movieParams.with_genres = filters.genre;
        tvParams.with_genres = filters.genre;
      }
      if (filters.startDate) {
        movieParams["primary_release_date.gte"] = filters.startDate;
        tvParams["first_air_date.gte"] = filters.startDate;
      }
      if (filters.endDate) {
        movieParams["primary_release_date.lte"] = filters.endDate;
        tvParams["first_air_date.lte"] = filters.endDate;
      }
      if (filters.providerId) {
        movieParams.with_watch_providers = filters.providerId;
        tvParams.with_watch_providers = filters.providerId;
        movieParams.watch_region = watchRegion;
        tvParams.watch_region = watchRegion;
      }
      if (filters.minRuntime) {
        movieParams["with_runtime.gte"] = filters.minRuntime;
        tvParams["with_runtime.gte"] = filters.minRuntime;
      }
      if (filters.maxRuntime) {
        movieParams["with_runtime.lte"] = filters.maxRuntime;
        tvParams["with_runtime.lte"] = filters.maxRuntime;
      }

      let actorNotFound = false;
      let crewNotFound = false;
      let companyNotFound = false;
      let keywordsNotFound = false;
      let personIdForActor: number | null = null;
      let personIdForCrew: number | null = null;

      const lookups: Promise<void>[] = [];
      if (filters.actor) {
        lookups.push(
          (async () => {
            const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", {
              query: filters.actor,
              include_adult: false,
            });
            if (res.results && res.results.length > 0) {
              const id = res.results[0].id;
              movieParams.with_cast = id;
              tvParams.with_people = id;
              personIdForActor = id;
            } else {
              actorNotFound = true;
            }
          })()
        );
      }
      if (filters.crew) {
        lookups.push(
          (async () => {
            const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", {
              query: filters.crew,
              include_adult: false,
            });
            if (res.results && res.results.length > 0) {
              const id = res.results[0].id;
              movieParams.with_crew = id;
              tvParams.with_people = id;
              personIdForCrew = id;
            } else {
              crewNotFound = true;
            }
          })()
        );
      }
      if (filters.company) {
        lookups.push(
          (async () => {
            const res = await tmdbFetch<{ results: { id: number }[] }>("/search/company", {
              query: filters.company,
            });
            if (res.results && res.results.length > 0) {
              const id = res.results[0].id;
              movieParams.with_companies = id;
              tvParams.with_companies = id;
            } else {
              companyNotFound = true;
            }
          })()
        );
      }
      if (filters.keywords) {
        lookups.push(
          (async () => {
            const res = await tmdbFetch<{ results: { id: number }[] }>("/search/keyword", {
              query: filters.keywords,
            });
            if (res.results && res.results.length > 0) {
              const id = res.results[0].id;
              movieParams.with_keywords = id;
              tvParams.with_keywords = id;
            } else {
              keywordsNotFound = true;
            }
          })()
        );
      }

      if (lookups.length > 0) {
        await Promise.all(lookups);
      }

      if (actorNotFound || crewNotFound || companyNotFound || keywordsNotFound) {
        return [];
      }

      if (filters.ratingMin) {
        movieParams["vote_average.gte"] = filters.ratingMin;
        tvParams["vote_average.gte"] = filters.ratingMin;
        movieParams["vote_count.gte"] = 5;
        tvParams["vote_count.gte"] = 5;
      }
      if (filters.ratingMax) {
        movieParams["vote_average.lte"] = filters.ratingMax;
        tvParams["vote_average.lte"] = filters.ratingMax;
      }
      if (filters.language) {
        movieParams.with_original_language = filters.language;
        tvParams.with_original_language = filters.language;
      }

      const fetchTVMedia = async (): Promise<TMDBMedia[]> => {
        const personId = personIdForActor ?? personIdForCrew;
        if (personId) {
          try {
            const res = await tmdbFetch<{ cast?: TMDBRawItem[]; crew?: TMDBRawItem[] }>(
              `/person/${personId}/tv_credits`
            );
            const rawItems = (filters.actor ? res.cast ?? [] : res.crew ?? []) as TMDBRawItem[];

            let filtered = cleanMediaData(rawItems, "tv");

            if (filters.genre) {
              const genreId = parseInt(filters.genre, 10);
              filtered = filtered.filter((item) => item.genre_ids?.includes(genreId));
            }
            if (filters.startDate) {
              filtered = filtered.filter(
                (item) => item.first_air_date && item.first_air_date >= (filters.startDate as string)
              );
            }
            if (filters.endDate) {
              filtered = filtered.filter(
                (item) => item.first_air_date && item.first_air_date <= (filters.endDate as string)
              );
            }
            if (filters.ratingMin) {
              const min = parseFloat(filters.ratingMin);
              filtered = filtered.filter((item) => (item.vote_average ?? 0) >= min);
            }
            if (filters.ratingMax) {
              const max = parseFloat(filters.ratingMax);
              filtered = filtered.filter((item) => (item.vote_average ?? 0) <= max);
            }
            if (filters.language) {
              filtered = filtered.filter((item) => item.original_language === filters.language);
            }

            filtered.sort((a, b) => b.popularity - a.popularity);
            const startIndex = (page - 1) * 20;
            return filtered.slice(startIndex, startIndex + 20);
          } catch (error) {
            console.error(`Error fetching TV credits for person ${personId}:`, error);
            return [];
          }
        }

        const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/discover/tv", tvParams);
        return cleanMediaData(res.results ?? [], "tv");
      };

      if (type === "movie") {
        const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/discover/movie", movieParams);
        return cleanMediaData(res.results ?? [], "movie");
      }

      if (type === "tv") {
        return await fetchTVMedia();
      }

      const [movieRes, tvItems] = await Promise.allSettled([
        tmdbFetch<{ results: TMDBRawItem[] }>("/discover/movie", movieParams),
        fetchTVMedia(),
      ]);

      const movies = movieRes.status === "fulfilled" ? cleanMediaData(movieRes.value.results ?? [], "movie") : [];
      const tv = tvItems.status === "fulfilled" ? tvItems.value : [];

      return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
    } catch (error) {
      console.error("Error discovering media:", error);
      return [];
    }
  });
}

// Genres List
export async function getTMDBGenres(): Promise<{ id: number; name: string; types: ("movie" | "tv")[] }[]> {
  const cacheKey = "genres-all";
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const [movieGenresRes, tvGenresRes] = await Promise.all([
        tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
        tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),
      ]);
      const movieGenres = movieGenresRes.genres ?? [];
      const tvGenres = tvGenresRes.genres ?? [];

      const genresMap = new Map<number, { id: number; name: string; types: ("movie" | "tv")[] }>();

      movieGenres.forEach((g) => {
        genresMap.set(g.id, { id: g.id, name: g.name, types: ["movie"] });
      });

      tvGenres.forEach((g) => {
        const existing = genresMap.get(g.id);
        if (existing) {
          if (!existing.types.includes("tv")) {
            existing.types.push("tv");
          }
        } else {
          genresMap.set(g.id, { id: g.id, name: g.name, types: ["tv"] });
        }
      });

      return Array.from(genresMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  });
}

// Watch Providers
export async function getTMDBProviders(watchRegion: string = "US"): Promise<TMDBProvider[]> {
  const cacheKey = `providers-${watchRegion}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const [movieProvidersRes, tvProvidersRes] = await Promise.all([
        tmdbFetch<{ results: TMDBProvider[] }>("/watch/providers/movie", { watch_region: watchRegion }),
        tmdbFetch<{ results: TMDBProvider[] }>("/watch/providers/tv", { watch_region: watchRegion }),
      ]);
      const movieProviders = movieProvidersRes.results ?? [];
      const tvProviders = tvProvidersRes.results ?? [];

      const allProvidersMap = new Map<number, TMDBProvider>();
      movieProviders.forEach((p) => {
        allProvidersMap.set(p.provider_id, {
          provider_id: p.provider_id,
          provider_name: p.provider_name,
          logo_path: p.logo_path,
        });
      });
      tvProviders.forEach((p) => {
        allProvidersMap.set(p.provider_id, {
          provider_id: p.provider_id,
          provider_name: p.provider_name,
          logo_path: p.logo_path,
        });
      });

      return Array.from(allProvidersMap.values()).sort((a, b) => a.provider_name.localeCompare(b.provider_name));
    } catch (error) {
      console.error("Error fetching watch providers:", error);
      return [];
    }
  });
}

// Company Details
export async function getCompanyDetails(companyId: string): Promise<TMDBCompanyDetails | null> {
  const cacheKey = `company-details-${companyId}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      return await tmdbFetch<TMDBCompanyDetails>(`/company/${companyId}`);
    } catch (error) {
      console.error(`Error fetching company details for ${companyId}:`, error);
      return null;
    }
  });
}

// Company Movies
export async function getCompanyMovies(companyId: string, page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `company-movies-${companyId}-${page}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/discover/movie", {
        with_companies: companyId,
        sort_by: "popularity.desc",
        page,
      });
      return cleanMediaData(res.results ?? [], "movie");
    } catch (error) {
      console.error(`Error fetching movies for company ${companyId}:`, error);
      return [];
    }
  });
}

// Company TV Shows
export async function getCompanyTVShows(companyId: string, page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `company-tv-${companyId}-${page}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_LONG, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/discover/tv", {
        with_companies: companyId,
        sort_by: "popularity.desc",
        page,
      });
      return cleanMediaData(res.results ?? [], "tv");
    } catch (error) {
      console.error(`Error fetching company TV shows for ${companyId}:`, error);
      return [];
    }
  });
}

// Media Reviews
export async function getMediaReviews(
  mediaType: "movie" | "tv",
  id: string,
  page: number = 1
): Promise<TMDBReviewsResponse | null> {
  const cacheKey = `reviews-${mediaType}-${id}-${page}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_MEDIUM, async () => {
    try {
      return await tmdbFetch<TMDBReviewsResponse>(`/${mediaType}/${id}/reviews`, { page });
    } catch (error) {
      console.error(`Error fetching reviews for ${mediaType} ${id}:`, error);
      return null;
    }
  });
}

// Upcoming Movies
export async function getUpcomingMovies(page: number = 1, region: string = "US"): Promise<TMDBMedia[]> {
  const cacheKey = `upcoming-movies-${region}-${page}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/movie/upcoming", { page, region });
      return cleanMediaData(res.results ?? [], "movie");
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      return [];
    }
  });
}

// Upcoming TV Shows
export async function getUpcomingTVShows(page: number = 1): Promise<TMDBMedia[]> {
  const cacheKey = `upcoming-tv-${page}`;
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const res = await tmdbFetch<{ results: TMDBRawItem[] }>("/tv/on_the_air", { page });
      return cleanMediaData(res.results ?? [], "tv");
    } catch (error) {
      console.error("Error fetching upcoming TV shows:", error);
      return [];
    }
  });
}

// Upcoming Media (Movies + TV)
export async function getUpcomingMedia(): Promise<TMDBMedia[]> {
  const cacheKey = "upcoming-media-all";
  return await fetchWithCacheDedupe(cacheKey, CACHE_TTL_SHORT, async () => {
    try {
      const [movies, tv] = await Promise.all([getUpcomingMovies(1, "US"), getUpcomingTVShows(1)]);
      const combined = [...movies, ...tv];
      const now = Date.now();

      const upcomingFiltered = combined.filter((item) => {
        const dateStr = item.release_date ?? item.first_air_date;
        if (!dateStr) return true;
        const targetTime = new Date(dateStr).getTime();
        return isNaN(targetTime) || targetTime >= now - 24 * 60 * 60 * 1000;
      });

      return (upcomingFiltered.length > 0 ? upcomingFiltered : combined).slice(0, 20);
    } catch (error) {
      console.error("Error fetching upcoming media:", error);
      return [];
    }
  });
}
