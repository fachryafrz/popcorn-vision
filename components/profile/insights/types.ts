export type Period = "week" | "month" | "all" | number;

export interface RatingCount {
  rating: number;
  count: number;
}

export interface GenreItem {
  name: string;
  value: number;
}

export interface PersonItem {
  name: string;
  count: number;
}

export interface ProviderItem {
  name: string;
  count: number;
}

export interface StatsData {
  moviesCount: number;
  tvCount: number;
  tvSeriesCount: number;
  tvSeasonsCount: number;
  tvEpisodesCount: number;
  hoursWatched: number;
  averageRating: string;
  ratingsDistribution: RatingCount[];
  topGenres: GenreItem[];
  topActors: PersonItem[];
  topDirectors: PersonItem[];
  topProviders: ProviderItem[];
}

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
