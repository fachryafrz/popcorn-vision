
export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
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

export const ALL_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

export const PROVIDERS = {
  netflix: { id: 8, name: "Netflix Originals" },
  hbo: { id: 1899, name: "HBO Originals" },
  prime: { id: 9, name: "Prime Video Originals" },
  disney: { id: 337, name: "Disney+ Originals" },
  apple: { id: 350, name: "Apple TV+ Originals" },
};

export const GENRE_MAP: Record<string, { movie: number; tv: number }> = {
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

export function getGenreNames(genreIds: number[]): string[] {
  if (!genreIds) return [];
  return genreIds.map((id) => ALL_GENRES[id] || "").filter(Boolean);
}

export interface TMDBRawItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
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

export function cleanMediaData(items: TMDBRawItem[], defaultType?: "movie" | "tv"): TMDBMedia[] {
  return items
    .filter((item) => item && (item.poster_path || item.backdrop_path))
    .map((item) => ({
      id: item.id,
      title: item.title || item.name || item.original_title || item.original_name,
      name: item.name || item.title,
      poster_path: item.poster_path ?? null,
      backdrop_path: item.backdrop_path ?? null,
      media_type: item.media_type || defaultType || (item.title ? "movie" : "tv"),
      vote_average: item.vote_average || 0,
      release_date: item.release_date || item.first_air_date || "",
      first_air_date: item.first_air_date || item.release_date || "",
      genre_ids: item.genre_ids || [],
      overview: item.overview || "",
      popularity: item.popularity || 0,
    }));
}

// Fetching functions are migrated to lib/tmdb-actions.ts for Next.js Server Actions execution.

