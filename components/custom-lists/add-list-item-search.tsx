"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TMDBMedia } from "@/lib/tmdb";
import { searchMedia } from "@/lib/tmdb-actions";
import { CustomListItem } from "./types";

interface AddListItemSearchProps {
  items: CustomListItem[];
  onAddItem: (media: TMDBMedia) => void;
}

export default function AddListItemSearch({
  items,
  onAddItem,
}: AddListItemSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMedia[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchMedia(searchQuery.trim());
        const valid = (Array.isArray(res) ? res : []).filter(
          (m: TMDBMedia) =>
            m.media_type === "movie" || m.media_type === "tv",
        );
        setSearchResults(valid.slice(0, 5));
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-zinc-500" />
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) {
              setSearchResults([]);
            }
          }}
          placeholder="Search movies or TV shows to add..."
          className="w-full rounded-2xl border-zinc-800 bg-zinc-900/40 py-6 pr-10 pl-12 text-base text-white transition-all placeholder:text-zinc-500 hover:bg-zinc-900/60 focus:bg-zinc-900"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="absolute right-4 cursor-pointer text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute right-0 left-0 z-35 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          {searchResults.map((media) => {
            const alreadyAdded = items.some(
              (item) => String(item.mediaId) === String(media.id),
            );
            return (
              <div
                key={media.id}
                className="flex items-center justify-between gap-4 rounded-xl p-2.5 transition-colors hover:bg-zinc-900"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {media.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                      alt={media.title || media.name}
                      className="border-zinc-850 h-14 w-10 rounded-lg border bg-zinc-900 object-cover"
                    />
                  ) : (
                    <div className="border-zinc-850 flex h-14 w-10 items-center justify-center rounded-lg border bg-zinc-900">
                      <Film className="text-zinc-650 h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {media.title || media.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {media.release_date
                        ? new Date(media.release_date).getFullYear()
                        : "N/A"}{" "}
                      • {media.media_type === "tv" ? "TV Series" : "Movie"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={alreadyAdded}
                  onClick={() => onAddItem(media)}
                  className={`h-9 rounded-xl px-4 font-bold ${
                    alreadyAdded
                      ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {alreadyAdded ? "Added" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      {searchLoading && (
        <div className="absolute top-3.5 right-12 z-35">
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
        </div>
      )}
    </div>
  );
}
