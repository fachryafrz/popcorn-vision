import SearchClient from "@/components/search-client";
import { siteConfig } from "@/config/site";
import { TMDBMedia } from "@/lib/tmdb";
import {
  searchMedia,
  discoverMedia,
  getTMDBGenres,
  getTMDBProviders,
} from "@/lib/tmdb-actions";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    genre?: string;
    startDate?: string;
    endDate?: string;
    providerId?: string;
    minRuntime?: string;
    maxRuntime?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  return {
    title: query
      ? `Search: "${query}" — ${siteConfig.name}`
      : `Search — ${siteConfig.name}`,
    description: `Search results for "${query}" on ${siteConfig.name}.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [genres, providers] = await Promise.all([
    getTMDBGenres(),
    getTMDBProviders(),
  ]);

  const params = await searchParams;
  const query = params.q || "";
  const type = (params.type as "all" | "movie" | "tv" | "users") || "all";
  const genre = params.genre || "";
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";
  const providerId = params.providerId || "";
  const minRuntime = params.minRuntime || "";
  const maxRuntime = params.maxRuntime || "";

  let results: TMDBMedia[] = [];
  if (query && type !== "users") {
    results = await searchMedia(query, type);
  } else if (
    (genre || startDate || endDate || providerId || minRuntime || maxRuntime) &&
    type !== "users"
  ) {
    results = await discoverMedia(
      {
        genre,
        startDate,
        endDate,
        providerId,
        minRuntime,
        maxRuntime,
      },
      type
    );
  }

  return (
    <SearchClient
      initialResults={results}
      initialQuery={query}
      initialType={type}
      initialGenre={genre}
      initialStartDate={startDate}
      initialEndDate={endDate}
      initialProviderId={providerId}
      initialMinRuntime={minRuntime}
      initialMaxRuntime={maxRuntime}
      genres={genres}
      providers={providers}
    />
  );
}
