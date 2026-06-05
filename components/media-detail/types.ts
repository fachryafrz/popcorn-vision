export interface CastItem {
  id: number;
  profile_path: string | null;
  name: string;
  character: string;
}

export interface CrewItem {
  id: number;
  profile_path: string | null;
  name: string;
  job: string;
  department: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  profile_path: string | null;
}

export interface VideoItem {
  type: string;
  site: string;
  key: string;
}

export interface ProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface ProductionCompany {
  name: string;
}

export interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  name: string;
  poster_path: string | null;
  air_date: string | null;
}

export interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  production_companies?: ProductionCompany[];
  belongs_to_collection?: { id: number; name: string; poster_path: string; backdrop_path: string } | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  created_by?: Creator[];
}


export interface RegionalRelease {
  iso_3166_1: string;
  release_dates: { certification: string; release_date: string }[];
}

export interface RegionalContentRating {
  iso_3166_1: string;
  rating: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
}

export interface SeasonDetails {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface CollectionPart {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
}
