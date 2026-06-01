"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Search, Film, Tv, LayoutGrid, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import { Input } from "@/components/ui/input";
import { SearchType, SearchUserResult } from "./search/types";
import { ResultsSection } from "./search/results-section";

interface SearchClientProps {
  initialResults: TMDBMedia[];
  initialQuery: string;
  initialType: SearchType;
}

const TYPE_FILTERS: {
  label: string;
  value: SearchType;
  icon: React.ReactNode;
}[] = [
  { label: "All", value: "all", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { label: "Movies", value: "movie", icon: <Film className="h-3.5 w-3.5" /> },
  { label: "TV Series", value: "tv", icon: <Tv className="h-3.5 w-3.5" /> },
  { label: "Users", value: "users", icon: <User className="h-3.5 w-3.5" /> },
];

export default function SearchClient({
  initialResults,
  initialQuery,
  initialType,
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    open: openAuth,
    isOpen: isAuthOpen,
    close: closeAuth,
  } = useAuthModalStore();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeType, setActiveType] = useState<SearchType>(initialType);
  const [results, setResults] = useState<TMDBMedia[]>(initialResults);
  const [isPending, startTransition] = useTransition();
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Convex Query for Users
  const userResults = useQuery(
    api.social.searchUsers,
    (activeType === "users" || activeType === "all") && query.trim().length > 0
      ? { query }
      : "skip",
  ) as SearchUserResult[] | undefined;
  const isUsersLoading =
    (activeType === "users" || activeType === "all") &&
    query.trim().length > 0 &&
    userResults === undefined;

  // Push URL update and fetch results
  const performSearch = useCallback(
    (q: string, type: SearchType) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      if (type !== "all") params.set("type", type);
      else params.delete("type");
      router.push(`/search?${params.toString()}`, { scroll: false });

      if (type !== "users") {
        startTransition(async () => {
          const data = await searchMedia(q, type);
          setResults(data);
        });
      }
    },
    [router, searchParams],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      performSearch(val, activeType);
    }, 400);
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setResults([]);
    router.push("/search", { scroll: false });
  };

  const handleTypeChange = (type: SearchType) => {
    setActiveType(type);
    performSearch(query, type);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <main className="bg-background text-foreground min-h-svh pt-28 pb-16 transition-colors duration-300">
      {/* Page header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
        <div className="mb-10 text-left">
          <h1 className="mb-2 bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
            Search
          </h1>
          <p className="text-sm text-zinc-400">
            Find movies, TV series, or other film enthusiasts
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8 max-w-2xl">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <Input
            id="search-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              activeType === "users"
                ? "Search users by display name or username…"
                : "Search movies, TV shows…"
            }
            autoFocus
            className="h-14 w-full rounded-2xl border-zinc-700/60 bg-zinc-900 pr-12 pl-12 text-base text-white transition-all placeholder:text-zinc-500 focus-visible:border-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-500"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type filter tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeChange(f.value)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
                activeType === f.value
                  ? "border-white bg-white text-black shadow-lg"
                  : "border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Results area */}
        <ResultsSection
          activeType={activeType}
          query={query}
          hasQuery={hasQuery}
          isUsersLoading={isUsersLoading}
          isPending={isPending}
          userResults={userResults}
          results={results}
          isLoggedIn={isLoggedIn}
          openAuth={openAuth}
          setQuickViewMedia={setQuickViewMedia}
          handleTypeChange={handleTypeChange}
        />
      </div>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </main>
  );
}
