import SearchClient from "@/components/search-client";
import { siteConfig } from "@/config/site";
import { SearchType } from "@/components/search/types";

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
  const params = await searchParams;
  const query = params.q || "";
  const type = (params.type as SearchType) || "all";
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

  return (
    <SearchClient
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
    />
  );
}
