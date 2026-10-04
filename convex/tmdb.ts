import { action, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TTL_7_DAYS = 7 * 24 * 60 * 60 * 1000;
const TTL_3_DAYS = 3 * 24 * 60 * 60 * 1000;
const TTL_24_HOURS = 24 * 60 * 60 * 1000;
const TTL_12_HOURS = 12 * 60 * 60 * 1000;

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY || process.env.API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY or API_KEY is not configured in Convex environment variables");
  }
  return key;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
  const apiKey = getApiKey();
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);

  for (const [k, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(k, String(val));
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

async function getCachedOrFetch<T>(
  ctx: ActionCtx,
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await ctx.runQuery(internal.tmdbCache.get, { key });
    if (cached && cached.expiresAt > Date.now()) {
      return JSON.parse(cached.data) as T;
    }
  } catch (err) {
    console.warn(`Cache read error for key ${key}:`, err);
  }

  const freshData = await fetcher();

  if (freshData !== null && freshData !== undefined) {
    try {
      await ctx.runMutation(internal.tmdbCache.set, {
        key,
        data: JSON.stringify(freshData),
        ttlMs,
      });
    } catch (err) {
      console.warn(`Cache write error for key ${key}:`, err);
    }
  }

  return freshData;
}

export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  original_language?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  overview: string;
  popularity: number;
  logo_path?: string | null;
  textless_poster_path?: string | null;
}

interface RawTMDBItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  original_language?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  media_type?: "movie" | "tv";
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  overview?: string;
  popularity?: number;
  [key: string]: unknown;
}

function cleanMediaData(items: RawTMDBItem[], defaultType?: "movie" | "tv"): TMDBMedia[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    name: item.name,
    original_title: item.original_title,
    original_name: item.original_name,
    original_language: item.original_language,
    poster_path: item.poster_path ?? null,
    backdrop_path: item.backdrop_path ?? null,
    media_type: item.media_type || defaultType || (item.title ? "movie" : "tv"),
    vote_average: item.vote_average ?? 0,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    genre_ids: item.genre_ids || [],
    overview: item.overview || "",
    popularity: item.popularity ?? 0,
  }));
}

const PROVIDERS = {
  netflix: { id: 8, name: "Netflix Originals" },
  hbo: { id: 1899, name: "HBO Originals" },
  prime: { id: 9, name: "Prime Video Originals" },
  disney: { id: 337, name: "Disney+ Originals" },
  apple: { id: 350, name: "Apple TV+ Originals" },
};

const GENRE_MAP: Record<string, { movie: number; tv: number }> = {
  Action: { movie: 28, tv: 10759 },
  Adventure: { movie: 12, tv: 10759 },
  Animation: { movie: 16, tv: 16 },
  Comedy: { movie: 35, tv: 35 },
  Crime: { movie: 80, tv: 80 },
  Documentary: { movie: 99, tv: 99 },
  Drama: { movie: 18, tv: 18 },
  Fantasy: { movie: 14, tv: 10765 },
  Horror: { movie: 27, tv: 10765 },
  Mystery: { movie: 9648, tv: 9648 },
  Romance: { movie: 10749, tv: 18 },
  "Science Fiction": { movie: 878, tv: 10765 },
  Thriller: { movie: 53, tv: 9648 },
  War: { movie: 10752, tv: 10768 },
  Western: { movie: 37, tv: 37 },
};

interface TMDBLogo {
  file_path: string;
  iso_639_1: string | null;
}

interface TMDBPoster {
  file_path: string;
  iso_639_1: string | null;
}

interface MediaImages {
  logoPath: string | null;
  textlessPosterPath: string | null;
}

async function fetchMediaImages(mediaType: "movie" | "tv", id: number): Promise<MediaImages> {
  try {
    const data = await tmdbFetch<{ logos?: TMDBLogo[]; posters?: TMDBPoster[] }>(`/${mediaType}/${id}/images`, {
      include_image_language: "en,null",
    });
    const logos = data.logos || [];
    const posters = data.posters || [];

    let logoPath: string | null = null;
    if (logos.length > 0) {
      const englishLogo = logos.find((l) => l.iso_639_1 === "en");
      logoPath = (englishLogo || logos[0]).file_path || null;
    }

    let textlessPosterPath: string | null = null;
    if (posters.length > 0) {
      const textlessPoster = posters.find((p) => p.iso_639_1 === null);
      textlessPosterPath = (textlessPoster || posters[0]).file_path || null;
    }

    return { logoPath, textlessPosterPath };
  } catch (error) {
    console.error(`Error fetching images for ${mediaType} ${id}:`, error);
    return { logoPath: null, textlessPosterPath: null };
  }
}

export const getHeroItems = action({
  args: {},
  handler: async (ctx) => {
    return await getCachedOrFetch(ctx, "hero:items", TTL_12_HOURS, async () => {
      try {
        const trendingRes = await tmdbFetch<{ results: RawTMDBItem[] }>("/trending/all/week");
        const trending = cleanMediaData(trendingRes.results || []);

        const seen = new Set<string>();
        const uniqueItems: TMDBMedia[] = [];

        for (const item of trending) {
          const key = `${item.media_type}-${item.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueItems.push(item);
          }
        }

        const topItems = uniqueItems.sort((a, b) => b.popularity - a.popularity).slice(0, 15);

        const itemsWithImages = await Promise.all(
          topItems.map(async (item) => {
            const { logoPath, textlessPosterPath } = await fetchMediaImages(item.media_type || "movie", item.id);
            return {
              ...item,
              logo_path: logoPath,
              textless_poster_path: textlessPosterPath,
            };
          })
        );

        return itemsWithImages;
      } catch (error) {
        console.error("Error fetching hero items in Convex:", error);
        return [];
      }
    });
  },
});

export const getTrending = action({
  args: {
    type: v.union(v.literal("all"), v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `trending:${args.type}`, TTL_12_HOURS, async () => {
      try {
        const res = await tmdbFetch<{ results: RawTMDBItem[] }>(`/trending/${args.type}/day`);
        return cleanMediaData(res.results || [], args.type === "all" ? undefined : args.type);
      } catch (error) {
        console.error(`Error fetching trending ${args.type}:`, error);
        return [];
      }
    });
  },
});

export const getStreamingOriginals = action({
  args: {
    providerKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `streaming:${args.providerKey}`, TTL_24_HOURS, async () => {
      try {
        const provider = PROVIDERS[args.providerKey as keyof typeof PROVIDERS];
        if (!provider) return [];

        const [moviesRes, tvRes] = await Promise.all([
          tmdbFetch<{ results: RawTMDBItem[] }>("/discover/movie", {
            with_watch_providers: provider.id,
            watch_region: "US",
            sort_by: "popularity.desc",
          }),
          tmdbFetch<{ results: RawTMDBItem[] }>("/discover/tv", {
            with_watch_providers: provider.id,
            watch_region: "US",
            sort_by: "popularity.desc",
          }),
        ]);

        const movies = cleanMediaData(moviesRes.results || [], "movie");
        const tv = cleanMediaData(tvRes.results || [], "tv");

        return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
      } catch (error) {
        console.error(`Error fetching streaming originals for ${args.providerKey}:`, error);
        return [];
      }
    });
  },
});

export const getByCategory = action({
  args: {
    genreName: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `category:${args.genreName}`, TTL_24_HOURS, async () => {
      try {
        const genre = GENRE_MAP[args.genreName];
        if (!genre) return [];

        const [moviesRes, tvRes] = await Promise.all([
          tmdbFetch<{ results: RawTMDBItem[] }>("/discover/movie", {
            with_genres: genre.movie,
            sort_by: "popularity.desc",
          }),
          tmdbFetch<{ results: RawTMDBItem[] }>("/discover/tv", {
            with_genres: genre.tv,
            sort_by: "popularity.desc",
          }),
        ]);

        const movies = cleanMediaData(moviesRes.results || [], "movie");
        const tv = cleanMediaData(tvRes.results || [], "tv");

        return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
      } catch (error) {
        console.error(`Error fetching category ${args.genreName}:`, error);
        return [];
      }
    });
  },
});

export const getMediaDetails = action({
  args: {
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `${args.mediaType}:${args.id}`, TTL_7_DAYS, async () => {
      try {
        const regionAppend = args.mediaType === "movie" ? "release_dates" : "content_ratings";

        const data = await tmdbFetch<Record<string, unknown>>(`/${args.mediaType}/${args.id}`, {
          append_to_response: `credits,videos,watch/providers,recommendations,images,${regionAppend}`,
          include_image_language: "en,null",
        });

        const imagesObj = (data.images as { logos?: TMDBLogo[]; posters?: TMDBPoster[]; backdrops?: unknown[] }) || {};
        const logos = imagesObj.logos || [];
        const posters = imagesObj.posters || [];

        const englishLogo = logos.find((l) => l.iso_639_1 === "en");
        const logoPath: string | null = logos.length > 0 ? ((englishLogo || logos[0]).file_path ?? null) : null;

        const textlessPoster = posters.find((p) => p.iso_639_1 === null);
        const textlessPosterPath: string | null = posters.length > 0 ? ((textlessPoster || posters[0]).file_path ?? null) : null;

        const recsObj = (data.recommendations as { results?: RawTMDBItem[] }) || {};
        const recommendations = cleanMediaData(recsObj.results || [], args.mediaType);

        const creditsObj = (data.credits as { cast?: unknown[]; crew?: unknown[] }) || { cast: [], crew: [] };
        const videosObj = (data.videos as { results?: unknown[] }) || { results: [] };
        const providersObj = (data["watch/providers"] as { results?: Record<string, unknown> }) || { results: {} };
        const regionalObj = (data[regionAppend] as { results?: unknown[] }) || { results: [] };

        return {
          details: data,
          credits: creditsObj,
          videos: videosObj.results || [],
          watchProviders: providersObj.results || {},
          logoPath,
          textlessPosterPath,
          recommendations,
          regionalData: regionalObj.results || [],
          images: {
            backdrops: imagesObj.backdrops || [],
            posters: imagesObj.posters || [],
            logos: imagesObj.logos || [],
          },
        };
      } catch (error) {
        console.error(`Error fetching details for ${args.mediaType} ${args.id}:`, error);
        return null;
      }
    });
  },
});

export const getCollectionDetails = action({
  args: {
    collectionId: v.number(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `collection:${args.collectionId}`, TTL_7_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/collection/${args.collectionId}`);
      } catch (error) {
        console.error(`Error fetching collection ${args.collectionId}:`, error);
        return null;
      }
    });
  },
});

export const getSeasonDetails = action({
  args: {
    tvId: v.number(),
    seasonNumber: v.number(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `season:${args.tvId}:${args.seasonNumber}`, TTL_7_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/tv/${args.tvId}/season/${args.seasonNumber}`);
      } catch (error) {
        console.error(`Error fetching season ${args.seasonNumber} for tv ${args.tvId}:`, error);
        return null;
      }
    });
  },
});

export const searchMedia = action({
  args: {
    query: v.string(),
    type: v.optional(v.union(v.literal("all"), v.literal("movie"), v.literal("tv"))),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = args.query.trim();
    if (!query) return [];
    const type = args.type || "all";
    const page = args.page || 1;
    const cacheKey = `search:${type}:${page}:${query.toLowerCase()}`;

    return await getCachedOrFetch(ctx, cacheKey, TTL_24_HOURS, async () => {
      try {
        if (type === "movie") {
          const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/search/movie", { query, page, include_adult: false });
          return cleanMediaData(res.results || [], "movie");
        }
        if (type === "tv") {
          const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/search/tv", { query, page, include_adult: false });
          return cleanMediaData(res.results || [], "tv");
        }

        const [movieRes, tvRes] = await Promise.all([
          tmdbFetch<{ results: RawTMDBItem[] }>("/search/movie", { query, page, include_adult: false }),
          tmdbFetch<{ results: RawTMDBItem[] }>("/search/tv", { query, page, include_adult: false }),
        ]);

        const movies = cleanMediaData(movieRes.results || [], "movie");
        const tv = cleanMediaData(tvRes.results || [], "tv");

        return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
      } catch (error) {
        console.error("Error searching media:", error);
        return [];
      }
    });
  },
});

export const getPersonDetails = action({
  args: {
    personId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `person:${args.personId}`, TTL_7_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/person/${args.personId}`);
      } catch (error) {
        console.error(`Error fetching person details for ${args.personId}:`, error);
        return null;
      }
    });
  },
});

export const getPersonCredits = action({
  args: {
    personId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `person-credits:${args.personId}`, TTL_7_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/person/${args.personId}/combined_credits`);
      } catch (error) {
        console.error(`Error fetching person credits for ${args.personId}:`, error);
        return null;
      }
    });
  },
});

export const searchPersonByName = action({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const cacheKey = `search-person:${args.name.toLowerCase().trim()}`;
    return await getCachedOrFetch(ctx, cacheKey, TTL_7_DAYS, async () => {
      try {
        const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", {
          query: args.name,
          include_adult: false,
        });
        if (res.results && res.results.length > 0) {
          return res.results[0].id;
        }
        return null;
      } catch (error) {
        console.error(`Error searching person by name ${args.name}:`, error);
        return null;
      }
    });
  },
});

export const searchCompanyByName = action({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const cacheKey = `search-company:${args.name.toLowerCase().trim()}`;
    return await getCachedOrFetch(ctx, cacheKey, TTL_7_DAYS, async () => {
      try {
        const res = await tmdbFetch<{ results: { id: number }[] }>("/search/company", { query: args.name });
        if (res.results && res.results.length > 0) {
          return res.results[0].id;
        }
        return null;
      } catch (error) {
        console.error(`Error searching company by name ${args.name}:`, error);
        return null;
      }
    });
  },
});

export const searchKeywordByName = action({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const cacheKey = `search-keyword:${args.name.toLowerCase().trim()}`;
    return await getCachedOrFetch(ctx, cacheKey, TTL_7_DAYS, async () => {
      try {
        const res = await tmdbFetch<{ results: { id: number }[] }>("/search/keyword", { query: args.name });
        if (res.results && res.results.length > 0) {
          return res.results[0].id;
        }
        return null;
      } catch (error) {
        console.error(`Error searching keyword by name ${args.name}:`, error);
        return null;
      }
    });
  },
});

export const discoverMedia = action({
  args: {
    filters: v.object({
      genre: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      providerId: v.optional(v.string()),
      minRuntime: v.optional(v.string()),
      maxRuntime: v.optional(v.string()),
      actor: v.optional(v.string()),
      crew: v.optional(v.string()),
      company: v.optional(v.string()),
      ratingMin: v.optional(v.string()),
      ratingMax: v.optional(v.string()),
      language: v.optional(v.string()),
      keywords: v.optional(v.string()),
    }),
    type: v.optional(v.union(v.literal("all"), v.literal("movie"), v.literal("tv"))),
    page: v.optional(v.number()),
    watchRegion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const filters = args.filters;
    const type = args.type || "all";
    const page = args.page || 1;
    const watchRegion = args.watchRegion || "US";
    const cacheKey = `discover:${type}:${page}:${watchRegion}:${JSON.stringify(filters)}`;

    return await getCachedOrFetch(ctx, cacheKey, TTL_24_HOURS, async () => {
      try {
        const movieParams: Record<string, string | number | boolean | undefined> = {
          include_adult: false,
          sort_by: "popularity.desc",
          page,
        };
        const tvParams: Record<string, string | number | boolean | undefined> = {
          include_adult: false,
          sort_by: "popularity.desc",
          page,
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
          movieParams.watch_region = watchRegion;
          tvParams.with_watch_providers = filters.providerId;
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
              const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", { query: filters.actor, include_adult: false });
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
              const res = await tmdbFetch<{ results: { id: number }[] }>("/search/person", { query: filters.crew, include_adult: false });
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
              const res = await tmdbFetch<{ results: { id: number }[] }>("/search/company", { query: filters.company });
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
              const res = await tmdbFetch<{ results: { id: number }[] }>("/search/keyword", { query: filters.keywords });
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
          const personId = personIdForActor || personIdForCrew;
          if (personId) {
            try {
              const res = await tmdbFetch<{ cast?: RawTMDBItem[]; crew?: RawTMDBItem[] }>(`/person/${personId}/tv_credits`);
              const rawItems = (filters.actor ? res.cast || [] : res.crew || []) as RawTMDBItem[];

              let filtered = cleanMediaData(rawItems, "tv");

              if (filters.genre) {
                const genreId = parseInt(filters.genre);
                filtered = filtered.filter((item) => item.genre_ids?.includes(genreId));
              }
              if (filters.startDate) {
                filtered = filtered.filter((item) => item.first_air_date && item.first_air_date >= (filters.startDate as string));
              }
              if (filters.endDate) {
                filtered = filtered.filter((item) => item.first_air_date && item.first_air_date <= (filters.endDate as string));
              }
              if (filters.ratingMin) {
                const min = parseFloat(filters.ratingMin);
                filtered = filtered.filter((item) => (item.vote_average || 0) >= min);
              }
              if (filters.ratingMax) {
                const max = parseFloat(filters.ratingMax);
                filtered = filtered.filter((item) => (item.vote_average || 0) <= max);
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

          const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/discover/tv", tvParams);
          return cleanMediaData(res.results || [], "tv");
        };

        if (type === "movie") {
          const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/discover/movie", movieParams);
          return cleanMediaData(res.results || [], "movie");
        }

        if (type === "tv") {
          return await fetchTVMedia();
        }

        const [movieRes, tvItems] = await Promise.allSettled([
          tmdbFetch<{ results: RawTMDBItem[] }>("/discover/movie", movieParams),
          fetchTVMedia(),
        ]);

        const movies = movieRes.status === "fulfilled" ? cleanMediaData(movieRes.value.results || [], "movie") : [];
        const tv = tvItems.status === "fulfilled" ? tvItems.value : [];

        return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
      } catch (error) {
        console.error("Error discovering media:", error);
        return [];
      }
    });
  },
});

export const getTMDBGenres = action({
  args: {},
  handler: async (ctx) => {
    return await getCachedOrFetch(ctx, "genres:all", TTL_7_DAYS, async () => {
      try {
        const [movieGenresRes, tvGenresRes] = await Promise.all([
          tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
          tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),
        ]);
        const movieGenres = movieGenresRes.genres || [];
        const tvGenres = tvGenresRes.genres || [];

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
  },
});

export interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export const getTMDBProviders = action({
  args: {
    watchRegion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const watchRegion = args.watchRegion || "US";
    return await getCachedOrFetch(ctx, `providers:${watchRegion}`, TTL_7_DAYS, async () => {
      try {
        const [movieProvidersRes, tvProvidersRes] = await Promise.all([
          tmdbFetch<{ results: TMDBProvider[] }>("/watch/providers/movie", { watch_region: watchRegion }),
          tmdbFetch<{ results: TMDBProvider[] }>("/watch/providers/tv", { watch_region: watchRegion }),
        ]);
        const movieProviders = movieProvidersRes.results || [];
        const tvProviders = tvProvidersRes.results || [];

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

        return Array.from(allProvidersMap.values()).sort((a, b) =>
          a.provider_name.localeCompare(b.provider_name)
        );
      } catch (error) {
        console.error("Error fetching watch providers:", error);
        return [];
      }
    });
  },
});

export const getCompanyDetails = action({
  args: {
    companyId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCachedOrFetch(ctx, `company:${args.companyId}`, TTL_7_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/company/${args.companyId}`);
      } catch (error) {
        console.error(`Error fetching company details for ${args.companyId}:`, error);
        return null;
      }
    });
  },
});

export const getCompanyMovies = action({
  args: {
    companyId: v.string(),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    return await getCachedOrFetch(ctx, `company-movies:${args.companyId}:${page}`, TTL_7_DAYS, async () => {
      try {
        const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/discover/movie", {
          with_companies: args.companyId,
          sort_by: "popularity.desc",
          page,
        });
        return cleanMediaData(res.results || [], "movie");
      } catch (error) {
        console.error(`Error fetching movies for company ${args.companyId}:`, error);
        return [];
      }
    });
  },
});

export const getCompanyTVShows = action({
  args: {
    companyId: v.string(),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    return await getCachedOrFetch(ctx, `company-tv:${args.companyId}:${page}`, TTL_7_DAYS, async () => {
      try {
        const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/discover/tv", {
          with_companies: args.companyId,
          sort_by: "popularity.desc",
          page,
        });
        return cleanMediaData(res.results || [], "tv");
      } catch (error) {
        console.error(`Error fetching TV shows for company ${args.companyId}:`, error);
        return [];
      }
    });
  },
});

export const getMediaReviews = action({
  args: {
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    id: v.string(),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    return await getCachedOrFetch(ctx, `reviews:${args.mediaType}:${args.id}:${page}`, TTL_3_DAYS, async () => {
      try {
        return await tmdbFetch<Record<string, unknown>>(`/${args.mediaType}/${args.id}/reviews`, {
          page,
        });
      } catch (error) {
        console.error(`Error fetching reviews for ${args.mediaType} ${args.id}:`, error);
        return null;
      }
    });
  },
});

export const getUpcomingMovies = action({
  args: {
    page: v.optional(v.number()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    const region = args.region || "US";
    return await getCachedOrFetch(ctx, `upcoming-movies:${region}:${page}`, TTL_12_HOURS, async () => {
      try {
        const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/movie/upcoming", {
          page,
          region,
        });
        return cleanMediaData(res.results || [], "movie");
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        return [];
      }
    });
  },
});

export const getUpcomingTVShows = action({
  args: {
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    return await getCachedOrFetch(ctx, `upcoming-tv:${page}`, TTL_12_HOURS, async () => {
      try {
        const res = await tmdbFetch<{ results: RawTMDBItem[] }>("/tv/on_the_air", {
          page,
        });
        return cleanMediaData(res.results || [], "tv");
      } catch (error) {
        console.error("Error fetching upcoming TV shows:", error);
        return [];
      }
    });
  },
});

export const getUpcomingMedia = action({
  args: {},
  handler: async (ctx) => {
    return await getCachedOrFetch(ctx, "upcoming:media", TTL_12_HOURS, async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          tmdbFetch<{ results: RawTMDBItem[] }>("/movie/upcoming", { page: 1, region: "US" }),
          tmdbFetch<{ results: RawTMDBItem[] }>("/tv/on_the_air", { page: 1 }),
        ]);

        const movies = cleanMediaData(moviesRes.results || [], "movie");
        const tv = cleanMediaData(tvRes.results || [], "tv");
        const combined = [...movies, ...tv];
        const now = Date.now();

        const upcomingFiltered = combined.filter((item) => {
          const dateStr = item.release_date || item.first_air_date;
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
  },
});

export const matchImportItemsAction = action({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        year: v.optional(v.string()),
        rating: v.optional(v.number()),
        imdbId: v.optional(v.string()),
        type: v.union(v.literal("movie"), v.literal("tv")),
        sourceTable: v.union(v.literal("watchlist"), v.literal("favorites"), v.literal("ratings"), v.literal("diary")),
        watchedDate: v.optional(v.number()),
        rewatch: v.optional(v.boolean()),
        review: v.optional(v.string()),
        season: v.optional(v.number()),
        episode: v.optional(v.number()),
        numberOfSeasons: v.optional(v.number()),
        numberOfEpisodes: v.optional(v.number()),
        diaryType: v.optional(v.string()),
      })
    ),
  },
  handler: async (_, args) => {
    const results = [];

    for (const item of args.items) {
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

          const movieResults = findRes.movie_results || [];
          const tvResults = findRes.tv_results || [];

          if (movieResults.length > 0) {
            const matched = movieResults[0];
            matchedId = String(matched.id);
            matchedTitle = matched.title;
            matchedPoster = matched.poster_path || "";
            matchedYear = matched.release_date ? String(new Date(matched.release_date).getFullYear()) : "";
            matchedType = "movie";
          } else if (tvResults.length > 0) {
            const matched = tvResults[0];
            matchedId = String(matched.id);
            matchedTitle = matched.name;
            matchedPoster = matched.poster_path || "";
            matchedYear = matched.first_air_date ? String(new Date(matched.first_air_date).getFullYear()) : "";
            matchedType = "tv";
          }
        }

        if (!matchedId) {
          const queryType = item.type === "tv" ? "tv" : "movie";
          const searchRes = await tmdbFetch<{
            results?: { id: number; title?: string; name?: string; poster_path?: string; release_date?: string; first_air_date?: string }[];
          }>(`/search/${queryType}`, { query: item.title, include_adult: false });

          const searchResults = searchRes.results || [];
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
            matchedTitle = queryType === "movie" ? (bestMatch.title || "") : (bestMatch.name || "");
            matchedPoster = bestMatch.poster_path || "";
            const dateStr = queryType === "movie" ? bestMatch.release_date : bestMatch.first_air_date;
            matchedYear = dateStr ? String(new Date(dateStr).getFullYear()) : (item.year || "");
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
          posterPath: matchedPoster || "",
          releaseYear: matchedYear || "",
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
          releaseYear: item.year || "",
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
  },
});

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

export const batchFetchMediaMetadata = action({
  args: {
    items: v.array(
      v.object({
        mediaId: v.string(),
        mediaType: v.union(v.literal("movie"), v.literal("tv")),
        season: v.optional(v.number()),
        episode: v.optional(v.number()),
      })
    ),
    countryCode: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const countryCode = args.countryCode || "US";
    const uniqueItemsMap = new Map<
      string,
      { mediaId: string; mediaType: "movie" | "tv"; season?: number; episode?: number }
    >();

    for (const item of args.items) {
      const key = item.season !== undefined && item.episode !== undefined
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
          const key = item.season !== undefined && item.episode !== undefined
            ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
            : item.season !== undefined
              ? `${item.mediaType}-${item.mediaId}-S${item.season}`
              : `${item.mediaType}-${item.mediaId}`;
          try {
            const data = await tmdbFetch<Record<string, unknown>>(`/${item.mediaType}/${item.mediaId}`, {
              append_to_response: "credits,watch/providers",
            });

            const genresArr = (data.genres as { id: number; name: string }[]) || [];
            const genres = genresArr.map((g) => g.name);

            let runtime = 0;
            let seasonEpisodesCount = 10;
            if (item.mediaType === "tv" && item.season !== undefined) {
              const seasons = (data.seasons as { season_number: number; episode_count: number }[]) || [];
              const seasonObj = seasons.find((s) => s.season_number === item.season);
              if (seasonObj) {
                seasonEpisodesCount = seasonObj.episode_count || 10;
              }
            }

            const epRunTimes = (data.episode_run_time as number[]) || [];

            if (item.mediaType === "movie") {
              runtime = (data.runtime as number) || 0;
            } else if (item.season !== undefined && item.episode !== undefined) {
              try {
                const epData = await tmdbFetch<{ runtime?: number }>(`/tv/${item.mediaId}/season/${item.season}/episode/${item.episode}`);
                runtime = epData.runtime || (epRunTimes.length > 0 ? epRunTimes[0] : 45);
              } catch {
                runtime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
              }
            } else if (item.season !== undefined) {
              try {
                const seasonData = await tmdbFetch<{ episodes?: { runtime?: number }[] }>(`/tv/${item.mediaId}/season/${item.season}`);
                const episodes = seasonData.episodes || [];
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
                runtime = totalSeasonRuntime || (epRunTimes.length > 0 ? epRunTimes[0] * seasonEpisodesCount : 45 * seasonEpisodesCount);
              } catch {
                const episodeRuntime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
                runtime = episodeRuntime * seasonEpisodesCount;
              }
            } else {
              const episodeRuntime = epRunTimes.length > 0 ? epRunTimes[0] : 45;
              const numberOfEpisodes = (data.number_of_episodes as number) || 10;
              runtime = episodeRuntime * numberOfEpisodes;
            }

            const credits = (data.credits as { cast?: { name: string }[]; crew?: { job: string; name: string }[] }) || {};
            const cast = (credits.cast || []).slice(0, 5).map((c) => c.name);

            const directors = item.mediaType === "tv"
              ? ((data.created_by as { name: string }[]) || []).map((c) => c.name)
              : (credits.crew || []).filter((c) => c.job === "Director").map((c) => c.name);

            const watchProvidersObj = (data["watch/providers"] as { results?: Record<string, { flatrate?: { provider_name: string }[] }> }) || {};
            const providerData = watchProvidersObj.results?.[countryCode] || watchProvidersObj.results?.US;
            const watchProviders = (providerData?.flatrate || []).map((p) => p.provider_name);

            resultsMap[key] = {
              mediaId: item.mediaId,
              mediaType: item.mediaType,
              runtime,
              genres,
              cast,
              directors,
              watchProviders,
              numberOfSeasons: item.season !== undefined ? 1 : item.mediaType === "tv" ? (data.number_of_seasons as number) : undefined,
              numberOfEpisodes: item.season !== undefined ? seasonEpisodesCount : item.mediaType === "tv" ? (data.number_of_episodes as number) : undefined,
            };
          } catch (error) {
            console.error(`Error fetching stats metadata for ${item.mediaType} ${item.mediaId}:`, error);
          }
        })
      );
    }

    return resultsMap;
  },
});
