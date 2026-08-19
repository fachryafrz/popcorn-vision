"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useTransition,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchOverlayStore } from "@/hooks/use-search-overlay-store";
import { useDebounce } from "@/hooks/use-debounce";
import { searchMedia, getTrending } from "@/lib/tmdb-actions";
import { TMDBMedia, ALL_GENRES } from "@/lib/tmdb";
import { SearchType, SearchUserResult } from "@/components/search/types";
import {
  Search,
  Film,
  Tv,
  User as UserIcon,
  Star,
  ArrowRight,
  X,
  TrendingUp,
  Loader2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const FILTER_TABS: {
  label: string;
  value: SearchType;
  icon?: React.ReactNode;
}[] = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie", icon: <Film className="h-3.5 w-3.5" /> },
  { label: "TV Shows", value: "tv", icon: <Tv className="h-3.5 w-3.5" /> },
  {
    label: "Users",
    value: "users",
    icon: <UserIcon className="h-3.5 w-3.5" />,
  },
];

export function SearchOverlay() {
  const router = useRouter();
  const { isOpen, close, setIsOpen } = useSearchOverlayStore();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 280);
  const [activeTab, setActiveTab] = useState<SearchType>("all");
  const [mediaResults, setMediaResults] = useState<TMDBMedia[]>([]);
  const [trendingItems, setTrendingItems] = useState<TMDBMedia[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    setMediaResults([]);
    close();
  }, [close]);

  // Fetch trending items for empty state
  useEffect(() => {
    let isMounted = true;
    getTrending("all").then((items) => {
      if (isMounted) {
        setTrendingItems(items.slice(0, 6));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, handleClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Convex Query for Users Search
  const userResults = useQuery(
    api.social.searchUsers,
    (activeTab === "users" || activeTab === "all") && debouncedQuery.length > 0
      ? { query: debouncedQuery }
      : "skip",
  ) as SearchUserResult[] | undefined;

  const isUserSearching =
    (activeTab === "users" || activeTab === "all") &&
    debouncedQuery.length > 0 &&
    userResults === undefined;

  // Search Media fetcher
  useEffect(() => {
    if (!debouncedQuery || activeTab === "users") {
      return;
    }

    let isCancelled = false;
    startTransition(async () => {
      const mediaType = activeTab === "all" ? "all" : activeTab;
      const res = await searchMedia(debouncedQuery, mediaType, 1);
      if (!isCancelled) {
        setMediaResults(res.slice(0, 10));
        setSelectedIndex(0);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, activeTab]);

  const isDebouncing = query.trim() !== debouncedQuery;
  const isSearching =
    Boolean(query.trim()) && (isDebouncing || isPending || isUserSearching);

  // Combined Results list for keyboard navigation and rendering
  const displayedItems = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return trendingItems.map((item) => ({
        kind: "media" as const,
        data: item,
      }));
    }

    const items: Array<
      | { kind: "media"; data: TMDBMedia }
      | { kind: "user"; data: SearchUserResult }
    > = [];

    if (activeTab === "all" || activeTab === "movie" || activeTab === "tv") {
      mediaResults.forEach((m) => items.push({ kind: "media", data: m }));
    }

    if ((activeTab === "all" || activeTab === "users") && userResults) {
      userResults
        .slice(0, 6)
        .forEach((u) => items.push({ kind: "user", data: u }));
    }

    return items;
  }, [query, trendingItems, mediaResults, userResults, activeTab]);

  const handleSelectMedia = (item: TMDBMedia) => {
    handleClose();
    const type = item.media_type || (activeTab === "tv" ? "tv" : "movie");
    router.push(`/${type}/${item.id}`);
  };

  const handleSelectUser = (user: SearchUserResult) => {
    handleClose();
    router.push(`/@${user.username}`);
  };

  const handleGoToFullSearch = () => {
    handleClose();
    const trimmed = query.trim();
    if (trimmed) {
      const typeParam = activeTab === "all" ? "" : `&type=${activeTab}`;
      router.push(`/search?q=${encodeURIComponent(trimmed)}${typeParam}`);
    } else {
      router.push("/search");
    }
  };

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < displayedItems.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : displayedItems.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayedItems.length > 0 && selectedIndex < displayedItems.length) {
        const item = displayedItems[selectedIndex];
        if (item.kind === "media") handleSelectMedia(item.data);
        else handleSelectUser(item.data);
      } else {
        handleGoToFullSearch();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listContainerRef.current;
    if (!listEl) return;
    const selectedEl = listEl.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Overlay"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:pt-[15vh]"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="animate-in fade-in fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Custom Dialog Box */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/95 p-0 shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-200">
        {/* Input Bar */}
        <div className="relative flex items-center border-b border-zinc-800/80 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, TV shows, people..."
            className="ml-3 w-full bg-transparent text-base font-medium text-white placeholder-zinc-500 outline-none"
          />
          {isSearching && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-400" />
          )}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="mr-2 cursor-pointer rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <div className="flex items-center gap-1">
            <kbd className="hidden rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 sm:inline-block">
              ESC
            </kbd>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-zinc-800/60 bg-zinc-900/40 px-4 py-2">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                type="button"
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setSelectedIndex(0);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                  isActive
                    ? "bg-white text-black shadow-xs"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200",
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Container */}
        <div
          ref={listContainerRef}
          className="max-h-[60vh] min-h-55 overflow-y-auto p-2 sm:max-h-95"
        >
          {/* Empty Query -> Trending Items */}
          {!query.trim() && (
            <div className="p-2">
              <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold text-zinc-400">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                <span>Trending Today</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {trendingItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const title = item.title || item.name;
                  const year = (
                    item.release_date ||
                    item.first_air_date ||
                    ""
                  ).split("-")[0];
                  const mediaType =
                    item.media_type === "tv" ? "TV Show" : "Movie";

                  return (
                    <div
                      key={`trending-${item.id}-${idx}`}
                      data-index={idx}
                      onClick={() => handleSelectMedia(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-all",
                        isSelected
                          ? "bg-zinc-800/90 text-white"
                          : "text-zinc-300 hover:bg-zinc-900/60",
                      )}
                    >
                      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {item.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                            alt={title || "Poster"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600">
                            <Film className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {title}
                          </p>
                          <Badge
                            variant="outline"
                            className="h-4 border-zinc-700/80 px-1 text-[10px] text-zinc-400"
                          >
                            {mediaType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          {year && <span>{year}</span>}
                          {item.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="h-3 w-3 fill-amber-400" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Has Query Results */}
          {query.trim() && displayedItems.length > 0 && (
            <div className="grid grid-cols-1 gap-1">
              {displayedItems.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                if (item.kind === "user") {
                  const u = item.data;
                  return (
                    <div
                      key={`user-${u._id || u.userId}-${idx}`}
                      data-index={idx}
                      onClick={() => handleSelectUser(u)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 transition-all",
                        isSelected
                          ? "bg-zinc-800/90 text-white"
                          : "text-zinc-300 hover:bg-zinc-900/60",
                      )}
                    >
                      <Avatar className="h-10 w-10 shrink-0 border border-zinc-700/60">
                        {u.image && <AvatarImage src={u.image} alt={u.name} />}
                        <AvatarFallback className="bg-zinc-800 text-xs font-bold text-white">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {u.name}
                          </p>
                          <Badge
                            variant="outline"
                            className="h-4 border-indigo-500/30 bg-indigo-500/10 px-1 text-[10px] text-indigo-400"
                          >
                            User
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-zinc-400">
                          @{u.username}
                        </p>
                      </div>
                      <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  );
                }

                const m = item.data;
                const title = m.title || m.name;
                const year = (m.release_date || m.first_air_date || "").split(
                  "-",
                )[0];
                const typeLabel =
                  m.media_type === "tv" || activeTab === "tv"
                    ? "TV Show"
                    : "Movie";
                const firstGenre = m.genre_ids?.[0]
                  ? ALL_GENRES[m.genre_ids[0]]
                  : null;

                return (
                  <div
                    key={`media-${m.id}-${idx}`}
                    data-index={idx}
                    onClick={() => handleSelectMedia(m)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition-all",
                      isSelected
                        ? "bg-zinc-800/90 text-white"
                        : "text-zinc-300 hover:bg-zinc-900/60",
                    )}
                  >
                    <div className="relative h-13 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      {m.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                          alt={title || "Poster"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-600">
                          <Film className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {title}
                        </p>
                        <Badge
                          variant="outline"
                          className="h-4 border-zinc-700/80 px-1 text-[10px] text-zinc-400"
                        >
                          {typeLabel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        {year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {year}
                          </span>
                        )}
                        {firstGenre && <span>{firstGenre}</span>}
                        {m.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {m.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Loading Skeletons */}
          {isSearching && displayedItems.length === 0 && (
            <div className="flex flex-col gap-1 p-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex animate-pulse items-center gap-3 rounded-2xl p-2"
                >
                  <div className="h-13 w-9 shrink-0 rounded-lg bg-zinc-800/80" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 rounded-sm bg-zinc-800/80" />
                    <div className="h-3 w-1/4 rounded-sm bg-zinc-800/50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Found */}
          {!isSearching && query.trim() && displayedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-zinc-900 p-3 text-zinc-500">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Try searching for other movies, series, or keywords.
              </p>
            </div>
          )}
        </div>

        {/* Footer info & full search CTA */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5 text-xs text-zinc-400">
          <div className="hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-700/60 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-700/60 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-700/60 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              to select
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoToFullSearch}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 font-semibold text-zinc-200 transition-colors hover:text-white md:w-auto"
          >
            <span>View all results on Search Page</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
