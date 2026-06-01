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

const TYPE_FILTERS: { label: string; value: SearchType; icon: React.ReactNode }[] = [
  { label: "All", value: "all", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { label: "Movies", value: "movie", icon: <Film className="h-3.5 w-3.5" /> },
  { label: "TV Series", value: "tv", icon: <Tv className="h-3.5 w-3.5" /> },
  { label: "Users", value: "users", icon: <User className="h-3.5 w-3.5" /> },
];

export default function SearchClient({ initialResults, initialQuery, initialType }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openAuth, isOpen: isAuthOpen, close: closeAuth } = useAuthModalStore();
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
    (activeType === "users" || activeType === "all") && query.trim().length > 0 ? { query } : "skip"
  ) as SearchUserResult[] | undefined;
  const isUsersLoading = (activeType === "users" || activeType === "all") && query.trim().length > 0 && userResults === undefined;

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
    [router, searchParams]
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
    <main className="min-h-svh bg-background text-foreground pt-28 pb-16 transition-colors duration-300">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Search
          </h1>
          <p className="text-zinc-400 text-sm">Find movies, TV series, or other film enthusiasts</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none" />
          <Input
            id="search-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={activeType === "users" ? "Search users by display name or username…" : "Search movies, TV shows…"}
            autoFocus
            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-zinc-900 border-zinc-700/60 text-white placeholder:text-zinc-500 text-base focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-600 transition-all"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center flex-wrap gap-2 mb-8">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeChange(f.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer",
                activeType === f.value
                  ? "bg-white text-black border-white shadow-lg"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200"
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
