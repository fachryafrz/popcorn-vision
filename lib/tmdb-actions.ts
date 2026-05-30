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
