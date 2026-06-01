import SearchClient from "@/components/search-client";
import { siteConfig } from "@/config/site";
import { searchMedia } from "@/lib/tmdb-actions";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  return {
    title: query ? `Search: "${query}" — ${siteConfig.name}` : `Search — ${siteConfig.name}`,
    description: `Search results for "${query}" on ${siteConfig.name}.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const type = (params.type as "all" | "movie" | "tv" | "users") || "all";

  const results = (query && type !== "users") ? await searchMedia(query, type) : [];

  return <SearchClient initialResults={results} initialQuery={query} initialType={type} />;
}
