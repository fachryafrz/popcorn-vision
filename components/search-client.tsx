"use client";

import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMedia, discoverMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  Film,
  Tv,
  LayoutGrid,
  X,
  User,
  SlidersHorizontal,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchType, SearchUserResult } from "./search/types";
import { ResultsSection } from "./search/results-section";

interface SearchClientProps {
  initialResults: TMDBMedia[];
  initialQuery: string;
  initialType: SearchType;
  initialGenre?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  initialProviderId?: string;
  initialMinRuntime?: string;
  initialMaxRuntime?: string;
  genres: { id: number; name: string }[];
  providers: {
    provider_id: number;
    provider_name: string;
    logo_path: string;
  }[];
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
  initialGenre = "",
  initialStartDate = "",
  initialEndDate = "",
  initialProviderId = "",
  initialMinRuntime = "",
  initialMaxRuntime = "",
  genres = [],
  providers = [],
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

  // Advanced Filters State
  const [genre, setGenre] = useState(initialGenre); // holds genre ID string
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [providerId, setProviderId] = useState(initialProviderId); // holds provider ID string
  const [minRuntime, setMinRuntime] = useState(initialMinRuntime);
  const [maxRuntime, setMaxRuntime] = useState(initialMaxRuntime);

  // Infinite Scroll State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialResults.length >= 20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const runtimeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Helpers to resolve IDs to names and vice versa
  const getGenreName = (idStr: string) => {
    if (!idStr) return "";
    const id = parseInt(idStr);
    const found = genres.find((g) => g.id === id);
    return found ? found.name : "";
  };

  const getGenreIdByName = (nameStr: string) => {
    if (!nameStr) return "";
    const found = genres.find((g) => g.name === nameStr);
    return found ? String(found.id) : "";
  };

  const getProviderName = (idStr: string) => {
    if (!idStr) return "";
    const id = parseInt(idStr);
    const found = providers.find((p) => p.provider_id === id);
    return found ? found.provider_name : "";
  };

  const getProviderIdByName = (nameStr: string) => {
    if (!nameStr) return "";
    const found = providers.find((p) => p.provider_name === nameStr);
    return found ? String(found.provider_id) : "";
  };

  // Push URL update and fetch results
  const performSearch = useCallback(
    (paramsObj: {
      q?: string;
      type?: SearchType;
      genre?: string;
      startDate?: string;
      endDate?: string;
      providerId?: string;
      minRuntime?: string;
      maxRuntime?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const newQuery = paramsObj.q !== undefined ? paramsObj.q : query;
      const newType =
        paramsObj.type !== undefined ? paramsObj.type : activeType;
      const newGenre = paramsObj.genre !== undefined ? paramsObj.genre : genre;
      const newStartDate =
        paramsObj.startDate !== undefined ? paramsObj.startDate : startDate;
      const newEndDate =
        paramsObj.endDate !== undefined ? paramsObj.endDate : endDate;
      const newProviderId =
        paramsObj.providerId !== undefined ? paramsObj.providerId : providerId;
      const newMinRuntime =
        paramsObj.minRuntime !== undefined ? paramsObj.minRuntime : minRuntime;
      const newMaxRuntime =
        paramsObj.maxRuntime !== undefined ? paramsObj.maxRuntime : maxRuntime;

      if (newQuery) params.set("q", newQuery);
      else params.delete("q");

      if (newType !== "all") params.set("type", newType);
      else params.delete("type");

      if (newGenre) params.set("genre", newGenre);
      else params.delete("genre");

      if (newStartDate) params.set("startDate", newStartDate);
      else params.delete("startDate");

      if (newEndDate) params.set("endDate", newEndDate);
      else params.delete("endDate");

      if (newProviderId) params.set("providerId", newProviderId);
      else params.delete("providerId");

      if (newMinRuntime) params.set("minRuntime", newMinRuntime);
      else params.delete("minRuntime");

      if (newMaxRuntime) params.set("maxRuntime", newMaxRuntime);
      else params.delete("maxRuntime");

      router.push(`/search?${params.toString()}`, { scroll: false });

      if (newType !== "users") {
        startTransition(async () => {
          setPage(1);
          setHasMore(true);
          let data: TMDBMedia[] = [];
          if (newQuery) {
            data = await searchMedia(newQuery, newType, 1);
          } else if (
            newGenre ||
            newStartDate ||
            newEndDate ||
            newProviderId ||
            newMinRuntime ||
            newMaxRuntime
          ) {
            data = await discoverMedia(
              {
                genre: newGenre,
                startDate: newStartDate,
                endDate: newEndDate,
                providerId: newProviderId,
                minRuntime: newMinRuntime,
                maxRuntime: newMaxRuntime,
              },
              newType,
              1,
            );
          } else {
            data = [];
            setHasMore(false);
          }
          setResults(data);
          if (data.length < 20) {
            setHasMore(false);
          }
        });
      }
    },
    [
      router,
      searchParams,
      query,
      activeType,
      genre,
      startDate,
      endDate,
      providerId,
      minRuntime,
      maxRuntime,
    ],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      performSearch({ q: val });
    }, 400);
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setGenre("");
    setStartDate("");
    setEndDate("");
    setProviderId("");
    setMinRuntime("");
    setMaxRuntime("");
    setPage(1);
    setHasMore(false);
    setResults([]);
    router.push("/search", { scroll: false });
  };

  const handleTypeChange = (type: SearchType) => {
    setActiveType(type);
    performSearch({ type });
  };

  const hasQuery = query.trim().length > 0;
  const hasFilters = !!(
    genre ||
    startDate ||
    endDate ||
    providerId ||
    minRuntime ||
    maxRuntime
  );

  // Client-side filtering when text query is active (best effort)
  const filteredResults = results.filter((item) => {
    if (activeType === "users") return true;

    // Genre filter
    if (genre) {
      const genreId = parseInt(genre);
      if (!item.genre_ids?.includes(genreId)) return false;
    }

    // Date filters
    const releaseDate = item.release_date || item.first_air_date || "";
    if (startDate && releaseDate && releaseDate < startDate) {
      return false;
    }
    if (endDate && releaseDate && releaseDate > endDate) {
      return false;
    }

    return true;
  });

  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) {
      setStartDate("");
      performSearch({ startDate: "" });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    setStartDate(formatted);
    performSearch({ startDate: formatted });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      setEndDate("");
      performSearch({ endDate: "" });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    setEndDate(formatted);
    performSearch({ endDate: formatted });
  };

  const handleRuntimeChange = (values: number | readonly number[]) => {
    if (Array.isArray(values)) {
      const minVal = values[0];
      const maxVal = values[1];
      setMinRuntime(String(minVal));
      setMaxRuntime(String(maxVal));

      if (runtimeDebounceRef.current) clearTimeout(runtimeDebounceRef.current);
      runtimeDebounceRef.current = setTimeout(() => {
        performSearch({
          minRuntime: String(minVal),
          maxRuntime: String(maxVal),
        });
      }, 400);
    }
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setGenre("");
    setStartDate("");
    setEndDate("");
    setProviderId("");
    setMinRuntime("");
    setMaxRuntime("");
    setPage(1);
    setHasMore(true);
    performSearch({
      genre: "",
      startDate: "",
      endDate: "",
      providerId: "",
      minRuntime: "",
      maxRuntime: "",
    });
  };

  // Helper to format date display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Pick a date";
    const date = parseLocalDate(dateStr);
    if (!date) return "Pick a date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Infinite Scroll Load More Action
  const loadMore = useCallback(async () => {
    if (isPending || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      let nextResults: TMDBMedia[] = [];
      const typeParam = activeType !== "users" ? activeType : "all";
      if (query) {
        nextResults = await searchMedia(query, typeParam, nextPage);
      } else if (hasFilters) {
        nextResults = await discoverMedia(
          {
            genre,
            startDate,
            endDate,
            providerId,
            minRuntime,
            maxRuntime,
          },
          typeParam,
          nextPage,
        );
      }

      if (nextResults.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNext = nextResults.filter(
            (item) => !existingIds.has(item.id),
          );
          if (filteredNext.length === 0) {
            setHasMore(false);
          }
          return [...prev, ...filteredNext];
        });
        setPage(nextPage);
      }
    } catch (e) {
      console.error("Error loading more search items:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isPending,
    isLoadingMore,
    hasMore,
    page,
    query,
    activeType,
    genre,
    startDate,
    endDate,
    providerId,
    minRuntime,
    maxRuntime,
  ]);

  // Observer sentinel element ref callback
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isPending || isLoadingMore || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isPending, isLoadingMore, hasMore, loadMore],
  );

  // DRY reusable filters content
  const renderFiltersContent = () => (
    <div className="flex flex-col gap-5">
      {/* Genre Combobox */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black tracking-wider text-zinc-500 uppercase">
          Genre
        </span>
        <Combobox
          value={getGenreName(genre)}
          onValueChange={(val) => {
            const name = (val as string) || "";
            const id = getGenreIdByName(name);
            setGenre(id);
            performSearch({ genre: id });
          }}
          items={genres.map((g) => g.name)}
        >
          <ComboboxInput
            placeholder="Search genre..."
            showClear
            className="focus:border-zinc-750 h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs text-white"
          />
          <ComboboxContent className="max-h-60 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-xl">
            <ComboboxEmpty className="py-2 text-center text-xs text-zinc-500">
              No genre found.
            </ComboboxEmpty>
            <ComboboxList>
              {(name) => (
                <ComboboxItem
                  key={name}
                  value={name}
                  className="cursor-pointer rounded-xl px-3 py-2 text-xs hover:bg-zinc-900"
                >
                  {name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Streaming Services Combobox */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black tracking-wider text-zinc-500 uppercase">
          Streaming Service (US)
        </span>
        <Combobox
          value={getProviderName(providerId)}
          onValueChange={(val) => {
            const name = (val as string) || "";
            const id = getProviderIdByName(name);
            setProviderId(id);
            performSearch({ providerId: id });
          }}
          items={providers.map((p) => p.provider_name)}
        >
          <ComboboxInput
            placeholder="Search provider..."
            showClear
            className="focus:border-zinc-750 h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs text-white"
          />
          <ComboboxContent className="max-h-60 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-xl">
            <ComboboxEmpty className="py-2 text-center text-xs text-zinc-500">
              No provider found.
            </ComboboxEmpty>
            <ComboboxList>
              {(name) => {
                const p = providers.find((prov) => prov.provider_name === name);
                return (
                  <ComboboxItem
                    key={name}
                    value={name}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-zinc-900"
                  >
                    {p && (
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={name}
                        className="h-4 w-4 rounded-md object-cover"
                      />
                    )}
                    {name}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Start Date Picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black tracking-wider text-zinc-500 uppercase">
          Start Date
        </span>
        <Popover>
          <PopoverTrigger className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-400 hover:text-white focus:border-zinc-700 focus:outline-none">
            <span>{formatDateDisplay(startDate)}</span>
            <CalendarIcon className="h-4 w-4 text-zinc-500" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto border border-zinc-800 bg-zinc-950 p-0"
          >
            <Calendar
              mode="single"
              selected={parseLocalDate(startDate)}
              onSelect={handleStartDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date Picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black tracking-wider text-zinc-500 uppercase">
          End Date
        </span>
        <Popover>
          <PopoverTrigger className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-400 hover:text-white focus:border-zinc-700 focus:outline-none">
            <span>{formatDateDisplay(endDate)}</span>
            <CalendarIcon className="h-4 w-4 text-zinc-500" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto border border-zinc-800 bg-zinc-950 p-0"
          >
            <Calendar
              mode="single"
              selected={parseLocalDate(endDate)}
              onSelect={handleEndDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Runtime Slider (2-Point) */}
      <div className="mt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-wider text-zinc-500 uppercase">
            Runtime (Minutes)
          </span>
          <span className="text-xs font-bold text-zinc-400">
            {minRuntime || "0"}m - {maxRuntime || "360"}m
          </span>
        </div>
        <div className="px-2">
          <Slider
            min={0}
            max={360}
            step={5}
            value={[
              minRuntime ? parseInt(minRuntime) : 0,
              maxRuntime ? parseInt(maxRuntime) : 360,
            ]}
            onValueChange={handleRuntimeChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

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

        {/* Sidebar + Content Flex Container */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Left Sticky Sidebar (Desktop only, always visible when activeType !== "users") */}
          {activeType !== "users" && (
            <aside className="no-scrollbar sticky top-22 hidden h-fit max-h-[calc(100vh-160px)] w-72 shrink-0 flex-col gap-6 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md lg:flex">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
                  Filters
                </span>
                {hasFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="cursor-pointer text-xs font-semibold text-zinc-500 transition-colors hover:text-white"
                  >
                    Reset
                  </button>
                )}
              </div>
              {renderFiltersContent()}
            </aside>
          )}

          {/* Right Main Content */}
          <div className="@container w-full min-w-0 flex-1">
            {/* Sticky Search Header */}
            <div
              className={cn(
                "sticky top-22 z-50 mb-6 backdrop-blur-md transition-all duration-500 lg:top-22",
                isScrolled
                  ? "mx-2 rounded-4xl border border-zinc-800/80 bg-zinc-900/95 p-4 shadow-xl"
                  : "bg-background/95 rounded-none border border-transparent px-0",
              )}
            >
              {/* Search input and mobile trigger flex container */}
              <div className="flex w-full max-w-2xl items-center gap-3 lg:max-w-none">
                {/* Search Input */}
                <div
                  className={cn(
                    "relative flex-1 transition-all duration-300",
                    isScrolled ? "mb-0" : "mb-0", // simplified since container handles layout
                  )}
                >
                  <Search
                    className={cn(
                      "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500 transition-all duration-300",
                      isScrolled ? "h-4 w-4" : "h-5 w-5",
                    )}
                  />
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
                    autoFocus={!hasQuery && !hasFilters}
                    className={cn(
                      "w-full rounded-2xl border-zinc-700/60 bg-zinc-900 pr-12 pl-12 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-500",
                      isScrolled ? "h-10 text-sm" : "h-14 text-base",
                    )}
                  />
                  {inputValue && (
                    <button
                      onClick={handleClear}
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-white"
                      aria-label="Clear search"
                    >
                      <X
                        className={cn(
                          "transition-all duration-300",
                          isScrolled ? "h-3.5 w-3.5" : "h-4 w-4",
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Slide-out Sheet Trigger */}
                {activeType !== "users" && (
                  <div className="shrink-0 lg:hidden">
                    <Sheet>
                      <SheetTrigger
                        className={cn(
                          "relative flex cursor-pointer items-center justify-center rounded-2xl border border-zinc-700/60 bg-zinc-900 text-zinc-400 transition-all duration-300 hover:border-zinc-500 hover:text-zinc-200",
                          isScrolled ? "h-10 w-10" : "h-14 w-14",
                        )}
                      >
                        <SlidersHorizontal
                          className={cn(
                            "transition-all duration-300",
                            isScrolled ? "h-4 w-4" : "h-5 w-5",
                          )}
                        />
                        {hasFilters && (
                          <span className="absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                        )}
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="no-scrollbar w-[300px] overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-6"
                      >
                        <SheetHeader className="mb-6 border-b border-zinc-800/80 p-0 pb-3">
                          <SheetTitle className="flex items-center gap-2 text-sm font-bold text-white">
                            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
                            Filters
                          </SheetTitle>
                        </SheetHeader>
                        {renderFiltersContent()}
                        {hasFilters && (
                          <div className="mt-6 border-t border-zinc-800/80 pt-4">
                            <button
                              onClick={handleResetFilters}
                              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2 text-xs font-bold text-zinc-400 transition-colors hover:text-white"
                            >
                              Reset Filters
                            </button>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
              </div>

              {/* Type filter tabs */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
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
            </div>

            {/* Results area */}
            <ResultsSection
              activeType={activeType}
              query={query}
              hasQuery={hasQuery || hasFilters}
              isUsersLoading={isUsersLoading}
              isPending={isPending}
              userResults={userResults}
              results={filteredResults}
              isLoggedIn={isLoggedIn}
              openAuth={openAuth}
              setQuickViewMedia={setQuickViewMedia}
              handleTypeChange={handleTypeChange}
            />

            {/* Infinite Scroll Sentinel element */}
            {hasMore && (hasQuery || hasFilters) && activeType !== "users" && (
              <div
                ref={sentinelRef}
                className="mt-8 flex justify-center py-6 text-xs font-bold text-zinc-500"
              >
                {isLoadingMore
                  ? "Loading more titles..."
                  : "Scroll down to load more"}
              </div>
            )}
          </div>
        </div>
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
      <Suspense>
        <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      </Suspense>
    </main>
  );
}
