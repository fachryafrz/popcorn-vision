export type PlatformSource = "imdb" | "letterboxd" | "tmdb" | "popcorn" | "unknown";
export type ImportStep = "upload" | "resolving" | "preview" | "importing" | "summary";
export type TargetTable = "watchlist" | "favorites" | "ratings" | "diary";

export interface LocalDuplicatesState {
  watchlist: Set<string>;
  favorites: Set<string>;
  ratings: Set<string>;
  diary: Set<string>;
}

export interface SummaryStats {
  watchlist: number;
  favorites: number;
  ratings: number;
  diary: number;
  duplicates: number;
  skipped: number;
}
