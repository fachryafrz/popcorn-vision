"use server";

import { axios } from "./axios";
import { TMDBMedia, cleanMediaData, PROVIDERS, GENRE_MAP } from "./tmdb";

// Hero Items: Trending + Popular + New Releases (returns 10-15 best items)
export async function getHeroItems(): Promise<TMDBMedia[]> {
  try {
    const [trendingRes, popMoviesRes, popTvRes, discoverMoviesRes, discoverTvRes] = await Promise.all([
      axios.get("/trending/all/day"),
      axios.get("/movie/popular"),
      axios.get("/tv/popular"),
      axios.get("/discover/movie", {
        params: {
          "primary_release_date.gte": "2025-01-01",
          sort_by: "popularity.desc",
        },
      }),
      axios.get("/discover/tv", {
        params: {
          "first_air_date.gte": "2025-01-01",
          sort_by: "popularity.desc",
        },
      }),
    ]);

    const trending = cleanMediaData(trendingRes.data.results || []);
    const popMovies = cleanMediaData(popMoviesRes.data.results || [], "movie");
    const popTv = cleanMediaData(popTvRes.data.results || [], "tv");
    const newMovies = cleanMediaData(discoverMoviesRes.data.results || [], "movie");
    const newTv = cleanMediaData(discoverTvRes.data.results || [], "tv");

    // Merge and remove duplicates
    const allItems = [...trending, ...popMovies, ...popTv, ...newMovies, ...newTv];
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
    return uniqueItems.sort((a, b) => b.popularity - a.popularity).slice(0, 15);
  } catch (error) {
    console.error("Error fetching hero items:", error);
    return [];
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

// Get specific details for Quick View (including videos/trailer and watch providers)
export async function getMediaDetails(mediaType: "movie" | "tv", id: string) {
  try {
    const [detailsRes, creditsRes, videosRes, watchRes] = await Promise.all([
      axios.get(`/${mediaType}/${id}`),
      axios.get(`/${mediaType}/${id}/credits`),
      axios.get(`/${mediaType}/${id}/videos`),
      axios.get(`/${mediaType}/${id}/watch/providers`),
    ]);

    return {
      details: detailsRes.data,
      credits: creditsRes.data,
      videos: videosRes.data.results || [],
      watchProviders: watchRes.data.results || {},
    };
  } catch (error) {
    console.error(`Error fetching details for ${mediaType} ${id}:`, error);
    return null;
  }
}
