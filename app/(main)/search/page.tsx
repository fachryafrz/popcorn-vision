import SearchClient from "@/components/search-client";
import { siteConfig } from "@/config/site";
import { TMDBMedia } from "@/lib/tmdb";
import {
  searchMedia,
  discoverMedia,
  getTMDBGenres,
  getTMDBProviders,
} from "@/lib/tmdb-actions";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import isoCountries from "@/data/iso-3166.json";

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
    actor?: string;
    crew?: string;
    company?: string;
    ratingMin?: string;
    ratingMax?: string;
    language?: string;
    keywords?: string;
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
  const user = await fetchAuthQuery(api.users.getCurrentUser).catch(() => null);

  let countryCode = "US";
  if (user?.country) {
    const countryKey = user.country.toLowerCase();
    const countryObj = isoCountries.find(
      (c) =>
        c.name?.toLowerCase() === countryKey ||
        c["alpha-2"]?.toLowerCase() === countryKey
    );
    if (countryObj && countryObj["alpha-2"]) {
      countryCode = countryObj["alpha-2"].toUpperCase();
    } else {
      countryCode = user.country.toUpperCase();
    }
  }

  const [genres, providers] = await Promise.all([
    getTMDBGenres(),
    getTMDBProviders(countryCode),
  ]);

  const params = await searchParams;
  const query = params.q || "";
  const type = (params.type as "movie" | "tv" | "users") || "movie";
  const genre = params.genre || "";
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";
  const providerId = params.providerId || "";
  const minRuntime = params.minRuntime || "";
  const maxRuntime = params.maxRuntime || "";
  const actor = params.actor || "";
  const crew = params.crew || "";
  const company = params.company || "";
  const ratingMin = params.ratingMin || "";
  const ratingMax = params.ratingMax || "";
  const language = params.language || "";
  const keywords = params.keywords || "";

  let results: TMDBMedia[] = [];
  if (query && type !== "users") {
    results = await searchMedia(query, type);
  } else if (type !== "users") {
    results = await discoverMedia(
      {
        genre,
        startDate,
        endDate,
        providerId,
        minRuntime,
        maxRuntime,
        actor,
        crew,
        company,
        ratingMin,
        ratingMax,
        language,
        keywords,
      },
      type,
      1,
      countryCode
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
      initialActor={actor}
      initialCrew={crew}
      initialCompany={company}
      initialRatingMin={ratingMin}
      initialRatingMax={ratingMax}
      initialLanguage={language}
      initialKeywords={keywords}
      genres={genres}
      providers={providers}
      userCountryCode={countryCode}
    />
  );
}
