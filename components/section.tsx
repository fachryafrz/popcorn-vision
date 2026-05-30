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
  onStreamingChange?: (providerKey: keyof typeof PROVIDERS) => Promise<TMDBMedia[]>;
  onGenreChange?: (genreName: string) => Promise<TMDBMedia[]>;
}

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
  const [streamingProv, setStreamingProv] = useState<keyof typeof PROVIDERS>("netflix");
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
    <div className="w-full flex flex-col gap-6 py-6 px-6 sm:px-16 md:px-20">
      
      {/* Header controls section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Title / Interactive Dropdown */}
        {titleType === "text" && onTrendingChange && (
          <div className="flex flex-wrap justify-between grow items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Trending Now</h2>
            
            {/* Segmented Controls / Tabs */}
            <div className="flex p-1 rounded-full bg-zinc-900 border border-zinc-800">
              {(["all", "movie", "tv"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTrendingChange(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                    trendingTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {tab === "all" ? "All" : tab === "movie" ? "Movies" : "TV Series"}
                </button>
              ))}
            </div>
          </div>
        )}

        {titleType === "dropdown-streaming" && onStreamingChange && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors outline-none cursor-pointer">
              <span>{PROVIDERS[streamingProv].name}</span>
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl z-40">
              {(Object.keys(PROVIDERS) as Array<keyof typeof PROVIDERS>).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleStreamingChange(key)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-zinc-900/60 cursor-pointer focus:outline-none",
                    streamingProv === key ? "text-blue-400 bg-blue-500/10 focus:text-blue-400 focus:bg-blue-500/10" : "text-zinc-300 hover:text-white"
                  )}
                >
                  {PROVIDERS[key].name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {titleType === "dropdown-genre" && onGenreChange && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors outline-none cursor-pointer">
              <span>{genreName}</span>
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl z-40 scrollbar-thin">
              {Object.keys(GENRE_MAP).map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handleGenreChange(name)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-zinc-900/60 cursor-pointer focus:outline-none",
                    genreName === name ? "text-blue-400 bg-blue-500/10 focus:text-blue-400 focus:bg-blue-500/10" : "text-zinc-300 hover:text-white"
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
