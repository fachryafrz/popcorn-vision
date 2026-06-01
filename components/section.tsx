"use client";

import { useEffect, useState } from "react";
import { TMDBMedia, PROVIDERS, GENRE_MAP } from "@/lib/tmdb";
import Carousel from "./carousel";
import { CarouselSkeleton } from "./skeletons";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SectionProps {
  titleType: "text" | "dropdown-streaming" | "dropdown-genre";
  defaultFetch: () => Promise<TMDBMedia[]>;
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
  // Specific handlers
  onTrendingChange?: (type: "all" | "movie" | "tv") => Promise<TMDBMedia[]>;
  onStreamingChange?: (
    providerKey: keyof typeof PROVIDERS,
  ) => Promise<TMDBMedia[]>;
  onGenreChange?: (genreName: string) => Promise<TMDBMedia[]>;
}

const PROVIDER_COLORS: Record<keyof typeof PROVIDERS, { textClass: string }> = {
  netflix: { textClass: "text-[#E50914]" },
  hbo: { textClass: "text-[#9c3af3]" },
  prime: { textClass: "text-[#00A8E1]" },
  disney: { textClass: "text-[#00b2ff]" },
  apple: { textClass: "text-zinc-100" },
};

export default function Section({
  titleType,
  defaultFetch,
  onQuickView,
  onAuthRequired,
  onTrendingChange,
  onStreamingChange,
  onGenreChange,
}: SectionProps) {
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  // States for interactive controls
  const [trendingTab, setTrendingTab] = useState<"all" | "movie" | "tv">("all");
  const [streamingProv, setStreamingProv] =
    useState<keyof typeof PROVIDERS>("netflix");
  const [genreName, setGenreName] = useState<string>("Action");

  // Fetch initial data
  useEffect(() => {
    defaultFetch().then((data) => {
      setItems(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch on controls update
  const handleTrendingChange = async (type: "all" | "movie" | "tv") => {
    if (!onTrendingChange) return;
    setTrendingTab(type);
    setLoading(true);
    const data = await onTrendingChange(type);
    setItems(data);
    setLoading(false);
  };

  const handleStreamingChange = async (prov: keyof typeof PROVIDERS) => {
    if (!onStreamingChange) return;
    setStreamingProv(prov);
    setLoading(true);
    const data = await onStreamingChange(prov);
    setItems(data);
    setLoading(false);
  };

  const handleGenreChange = async (name: string) => {
    if (!onGenreChange) return;
    setGenreName(name);
    setLoading(true);
    const data = await onGenreChange(name);
    setItems(data);
    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-6 sm:px-16 md:px-20">
      {/* Header controls section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {/* Title / Interactive Dropdown */}
        {titleType === "text" && onTrendingChange && (
          <div className="flex grow flex-wrap items-center justify-between gap-4 sm:gap-6">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Trending Now
            </h2>

            {/* Segmented Controls / Tabs */}
            <div className="flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
              {(["all", "movie", "tv"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTrendingChange(tab)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all",
                    trendingTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white",
                  )}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "movie"
                      ? "Movies"
                      : "TV Series"}
                </button>
              ))}
            </div>
          </div>
        )}

        {titleType === "dropdown-streaming" && onStreamingChange && (
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex cursor-pointer items-center gap-2 text-xl font-bold tracking-tight text-white transition-colors outline-none sm:text-2xl">
              <span className="flex items-center gap-1.5 select-none">
                <span
                  className={cn(
                    "transition-colors",
                    PROVIDER_COLORS[streamingProv].textClass,
                  )}
                >
                  {PROVIDERS[streamingProv].name.replace(" Originals", "")}
                </span>
                <span className="text-white">Originals</span>
              </span>
              <ChevronDown className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-40 w-64 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
              {(Object.keys(PROVIDERS) as Array<keyof typeof PROVIDERS>).map(
                (key) => {
                  const isActive = streamingProv === key;
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleStreamingChange(key)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all hover:bg-zinc-900/60 focus:outline-none",
                        isActive
                          ? "bg-zinc-900"
                          : "text-zinc-300 hover:text-white",
                      )}
                    >
                      <span className="flex items-center gap-1.5 select-none">
                        <span className={PROVIDER_COLORS[key].textClass}>
                          {PROVIDERS[key].name.replace(" Originals", "")}
                        </span>
                        <span
                          className={
                            isActive ? "text-zinc-300" : "text-zinc-400"
                          }
                        >
                          Originals
                        </span>
                      </span>
                    </DropdownMenuItem>
                  );
                },
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {titleType === "dropdown-genre" && onGenreChange && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 text-xl font-bold tracking-tight text-white transition-colors outline-none hover:text-blue-400 sm:text-2xl">
              <span>{genreName}</span>
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-40 max-h-80 w-56 scrollbar-thin overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
              {Object.keys(GENRE_MAP).map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handleGenreChange(name)}
                  className={cn(
                    "w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all hover:bg-zinc-900/60 focus:outline-none",
                    genreName === name
                      ? "bg-blue-500/10 text-blue-400 focus:bg-blue-500/10 focus:text-blue-400"
                      : "text-zinc-300 hover:text-white",
                  )}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Render carousel content or skeleton */}
      {loading ? (
        <CarouselSkeleton />
      ) : (
        <Carousel
          items={items}
          onQuickView={onQuickView}
          onAuthRequired={onAuthRequired}
        />
      )}
    </div>
  );
}
