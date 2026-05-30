"use client";

import { useEffect, useState, useRef } from "react";
import { TMDBMedia, PROVIDERS, GENRE_MAP } from "@/lib/tmdb";
import Carousel from "./carousel";
import { CarouselSkeleton } from "./skeletons";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Dropdown UI state
  const [isDropOpen, setIsDropOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial data
  useEffect(() => {
    defaultFetch().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [defaultFetch]);

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
    setIsDropOpen(false);
    setLoading(true);
    const data = await onStreamingChange(prov);
    setItems(data);
    setLoading(false);
  };

  const handleGenreChange = async (name: string) => {
    if (!onGenreChange) return;
    setGenreName(name);
    setIsDropOpen(false);
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
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Trending Now</h2>
            
            {/* Segmented Controls / Tabs */}
            <div className="flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
              {(["all", "movie", "tv"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTrendingChange(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropOpen(!isDropOpen)}
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
            >
              <span>{PROVIDERS[streamingProv].name}</span>
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            </button>

            {isDropOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl z-40 animate-in fade-in slide-in-from-top-1 duration-200">
                {(Object.keys(PROVIDERS) as Array<keyof typeof PROVIDERS>).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleStreamingChange(key)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-zinc-900/60",
                      streamingProv === key ? "text-blue-400 bg-blue-500/10" : "text-zinc-300 hover:text-white"
                    )}
                  >
                    {PROVIDERS[key].name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {titleType === "dropdown-genre" && onGenreChange && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropOpen(!isDropOpen)}
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
            >
              <span>{genreName}</span>
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            </button>

            {isDropOpen && (
              <div className="absolute left-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl z-40 animate-in fade-in slide-in-from-top-1 duration-200 scrollbar-thin">
                {Object.keys(GENRE_MAP).map((name) => (
                  <button
                    key={name}
                    onClick={() => handleGenreChange(name)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-zinc-900/60",
                      genreName === name ? "text-blue-400 bg-blue-500/10" : "text-zinc-300 hover:text-white"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
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
