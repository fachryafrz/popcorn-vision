"use server";

import { axios } from "./axios";
import { TMDBMedia, cleanMediaData, PROVIDERS, GENRE_MAP } from "./tmdb";

// Hero Items: Trending + Popular + New Releases (returns 10-15 best items)
export async function getHeroItems(): Promise<TMDBMedia[]> {
  try {
    const [trendingRes] = await Promise.all([
      axios.get("/trending/all/week"),
    ]);

    const trending = cleanMediaData(trendingRes.data.results || []);

    // Merge and remove duplicates
    const allItems = [...trending];
    const seen = new Set<string>();
    const uniqueItems: TMDBMedia[] = [];

    for (const item of allItems) {
      const key = `${item.media_type}-${item.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    }

    // Sort by popularity and select top 15
    const topItems = uniqueItems.sort((a, b) => b.popularity - a.popularity).slice(0, 15);

    // Fetch images for top items in parallel
    const itemsWithImages = await Promise.all(
      topItems.map(async (item) => {
        const { logoPath, textlessPosterPath } = await getMediaImages(item.media_type || "movie", item.id);
        return {
          ...item,
          logo_path: logoPath,
          textless_poster_path: textlessPosterPath,
        };
      })
    );

    return itemsWithImages;
  } catch (error) {
    console.error("Error fetching hero items:", error);
    return [];
  }
}

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

// Helper to fetch logo and textless poster paths for a media item
async function getMediaImages(mediaType: "movie" | "tv", id: number): Promise<MediaImages> {
  try {
    const res = await axios.get(`/${mediaType}/${id}/images`, {
      params: {
        include_image_language: "en,null",
      },
    });
    const logos = (res.data.logos || []) as TMDBLogo[];
    const posters = (res.data.posters || []) as TMDBPoster[];

    let logoPath: string | null = null;
    if (logos.length > 0) {
      const englishLogo = logos.find((l) => l.iso_639_1 === "en");
      logoPath = (englishLogo || logos[0]).file_path || null;
    }

    let textlessPosterPath: string | null = null;
    if (posters.length > 0) {
      // Find a textless poster (iso_639_1 is null)
      const textlessPoster = posters.find((p) => p.iso_639_1 === null);
      textlessPosterPath = (textlessPoster || posters[0]).file_path || null;
    }

    return { logoPath, textlessPosterPath };
  } catch (error) {
    console.error(`Error fetching images for ${mediaType} ${id}:`, error);
    return { logoPath: null, textlessPosterPath: null };
  }
}

// Trending Now
export async function getTrending(type: "all" | "movie" | "tv"): Promise<TMDBMedia[]> {
  try {
    const endpoint = `/trending/${type}/day`;
    const res = await axios.get(endpoint);
    return cleanMediaData(res.data.results || [], type === "all" ? undefined : type);
  } catch (error) {
    console.error(`Error fetching trending ${type}:`, error);
    return [];
  }
}

// Streaming Services Originals (via Watch Providers)
export async function getStreamingOriginals(providerKey: keyof typeof PROVIDERS): Promise<TMDBMedia[]> {
  try {
    const provider = PROVIDERS[providerKey];
    if (!provider) return [];

    const [moviesRes, tvRes] = await Promise.all([
      axios.get("/discover/movie", {
        params: {
          with_watch_providers: provider.id,
          watch_region: "US",
          sort_by: "popularity.desc",
        },
      }),
      axios.get("/discover/tv", {
        params: {
          with_watch_providers: provider.id,
          watch_region: "US",
          sort_by: "popularity.desc",
        },
      }),
    ]);

    const movies = cleanMediaData(moviesRes.data.results || [], "movie");
    const tv = cleanMediaData(tvRes.data.results || [], "tv");

    // Combine and sort by popularity
    return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
  } catch (error) {
    console.error(`Error fetching streaming originals for ${providerKey}:`, error);
    return [];
  }
}

// Browse by Category (Genre)
export async function getByCategory(genreName: string): Promise<TMDBMedia[]> {
  try {
    const genre = GENRE_MAP[genreName];
    if (!genre) return [];

    const [moviesRes, tvRes] = await Promise.all([
      axios.get("/discover/movie", {
        params: {
          with_genres: genre.movie,
          sort_by: "popularity.desc",
        },
      }),
      axios.get("/discover/tv", {
        params: {
          with_genres: genre.tv,
          sort_by: "popularity.desc",
        },
      }),
    ]);

    const movies = cleanMediaData(moviesRes.data.results || [], "movie");
    const tv = cleanMediaData(tvRes.data.results || [], "tv");

    // Combine and sort by popularity
    return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
  } catch (error) {
    console.error(`Error fetching category ${genreName}:`, error);
    return [];
  }
}

// Get specific details for Quick View / Detail Page (including videos/trailer, watch providers, logo, and recommendations)
export async function getMediaDetails(mediaType: "movie" | "tv", id: string) {
  try {
    const regionDataPromise = (
      mediaType === "movie"
        ? axios.get(`/movie/${id}/release_dates`)
        : axios.get(`/tv/${id}/content_ratings`)
    ).catch(() => ({ data: { results: [] } }));

    const [detailsRes, creditsRes, videosRes, watchRes, recommendationsRes, regionDataRes] = await Promise.all([
      axios.get(`/${mediaType}/${id}`),
      axios.get(`/${mediaType}/${id}/credits`),
      axios.get(`/${mediaType}/${id}/videos`),
      axios.get(`/${mediaType}/${id}/watch/providers`),
      axios.get(`/${mediaType}/${id}/recommendations`),
      regionDataPromise,
    ]);

    const { logoPath, textlessPosterPath } = await getMediaImages(mediaType, Number(id));
    const recommendations = cleanMediaData(recommendationsRes.data.results || [], mediaType);

    return {
      details: detailsRes.data,
      credits: creditsRes.data,
      videos: videosRes.data.results || [],
      watchProviders: watchRes.data.results || {},
      logoPath,
      textlessPosterPath,
      recommendations,
      regionalData: regionDataRes.data.results || [],
    };
  } catch (error) {
    console.error(`Error fetching details for ${mediaType} ${id}:`, error);
    return null;
  }
}

// Fetch movie collection details by collection ID
export async function getCollectionDetails(collectionId: number) {
  try {
    const res = await axios.get(`/collection/${collectionId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionId}:`, error);
    return null;
  }
}

// Fetch TV show season details (episodes overview, stills, etc.) by season number
export async function getSeasonDetails(tvId: number, seasonNumber: number) {
  try {
    const res = await axios.get(`/tv/${tvId}/season/${seasonNumber}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} for tv ${tvId}:`, error);
    return null;
  }
}

// Search movies and TV shows by query string
export async function searchMedia(query: string, type: "all" | "movie" | "tv" = "all"): Promise<TMDBMedia[]> {
  if (!query.trim()) return [];
  try {
    if (type === "movie") {
      const res = await axios.get("/search/movie", { params: { query, include_adult: false } });
      return cleanMediaData(res.data.results || [], "movie");
    }
    if (type === "tv") {
      const res = await axios.get("/search/tv", { params: { query, include_adult: false } });
      return cleanMediaData(res.data.results || [], "tv");
    }
    // all: search both and merge
    const [movieRes, tvRes] = await Promise.all([
      axios.get("/search/movie", { params: { query, include_adult: false } }),
      axios.get("/search/tv", { params: { query, include_adult: false } }),
    ]);
    const movies = cleanMediaData(movieRes.data.results || [], "movie");
    const tv = cleanMediaData(tvRes.data.results || [], "tv");
    // Interleave and sort by popularity
    return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
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
}

export async function matchImportItemsAction(items: ImportItem[]): Promise<MatchedImportItem[]> {
  const results: MatchedImportItem[] = [];

  for (const item of items) {
    let matchedId: string | null = null;
    let matchedTitle: string | null = null;
    let matchedPoster: string | null = null;
    let matchedYear: string | null = null;
    let matchedType: "movie" | "tv" = item.type;

    try {
      // Pass 1: IMDb ID Match
      if (item.imdbId && item.imdbId.trim().startsWith("tt")) {
        const findRes = await axios.get(`/find/${item.imdbId.trim()}`, {
          params: { external_source: "imdb_id" },
        });
        const movieResults = findRes.data.movie_results || [];
        const tvResults = findRes.data.tv_results || [];

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

      // Pass 2: Search Match (if IMDb match failed or not provided)
      if (!matchedId) {
        const queryType = item.type === "tv" ? "tv" : "movie";
        const searchRes = await axios.get(`/search/${queryType}`, {
          params: { query: item.title, include_adult: false },
        });
        const searchResults = searchRes.data.results || [];

        if (searchResults.length > 0) {
          // Find the best match by comparing years
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
          matchedTitle = queryType === "movie" ? bestMatch.title : bestMatch.name;
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
      });
    }
  }

  return results;
}

export interface StatsMetadata {
  mediaId: string;
  mediaType: "movie" | "tv";
  runtime: number; // total runtime in minutes
  genres: string[];
  cast: string[];
  directors: string[];
  watchProviders: string[];
}

export async function batchFetchMediaMetadata(
  items: { mediaId: string; mediaType: "movie" | "tv" }[],
  countryCode: string = "US"
): Promise<Record<string, StatsMetadata>> {
  const uniqueItemsMap = new Map<string, { mediaId: string; mediaType: "movie" | "tv" }>();
  for (const item of items) {
    const key = `${item.mediaType}-${item.mediaId}`;
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  }

  const uniqueItems = Array.from(uniqueItemsMap.values());
  const resultsMap: Record<string, StatsMetadata> = {};

  // Batch process requests (e.g., 5 at a time) to prevent rate limits
  const batchSize = 10;
  for (let i = 0; i < uniqueItems.length; i += batchSize) {
    const batch = uniqueItems.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (item) => {
        const key = `${item.mediaType}-${item.mediaId}`;
        try {
          // Single call using append_to_response to retrieve details, credits, and watch providers
          const res = await axios.get(`/${item.mediaType}/${item.mediaId}`, {
            params: {
              append_to_response: "credits,watch/providers",
            },
          });
          const data = res.data;

          // Parse genres
          const genres: string[] = (data.genres || []).map((g: { id: number; name: string }) => g.name);

          // Parse runtime
          let runtime = 0;
          if (item.mediaType === "movie") {
            runtime = data.runtime || 0;
          } else {
            // TV show runtime: average episode runtime * number of episodes
            const episodeRuntime = (data.episode_run_time && data.episode_run_time.length > 0)
              ? data.episode_run_time[0]
              : 45; // Default fallback to 45 mins
            const numberOfEpisodes = data.number_of_episodes || 10; // Default fallback to 10 episodes
            runtime = episodeRuntime * numberOfEpisodes;
          }

          // Parse credits (top 5 cast)
          const cast: string[] = (data.credits?.cast || [])
            .slice(0, 5)
            .map((c: { name: string }) => c.name);

          // Parse directors (crew with job === "Director")
          const directors: string[] = (data.credits?.crew || [])
            .filter((c: { job: string; name: string }) => c.job === "Director")
            .map((c: { name: string }) => c.name);

          // Parse watch providers (flatrate providers in countryCode)
          const providerData = data["watch/providers"]?.results?.[countryCode] || data["watch/providers"]?.results?.US;
          const watchProviders: string[] = (providerData?.flatrate || [])
            .map((p: { provider_name: string }) => p.provider_name);

          resultsMap[key] = {
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            runtime,
            genres,
            cast,
            directors,
            watchProviders,
          };
        } catch (error) {
          console.error(`Error fetching stats metadata for ${item.mediaType} ${item.mediaId}:`, error);
        }
      })
    );
  }

  return resultsMap;
}


