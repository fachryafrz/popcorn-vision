"use client";

import React from "react";
import { Loader2, Star, Heart, Bookmark, Check } from "lucide-react";
import Card from "@/components/card";
import { TMDBMedia } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export interface GridMediaItem {
  _id?: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  releaseYear: string;
  rating?: number;
  isWatchlist?: boolean;
  isFavorite?: boolean;
  addedAt?: number;
}

interface MediaGridTabProps {
  activeTab: "all" | "watchlist" | "favorites" | "ratings";
  items: GridMediaItem[] | undefined;
  isEditMode: boolean;
  selectedItems: Set<string>;
  handleToggleSelectItem: (mediaType: string, mediaId: string) => void;
  setQuickViewMedia: (media: TMDBMedia) => void;
  openAuth: () => void;
  fallbackIcon: React.ReactNode;
  emptyMessage: string;
}

export function MediaGridTab({
  activeTab,
  items,
  isEditMode,
  selectedItems,
  handleToggleSelectItem,
  setQuickViewMedia,
  openAuth,
  fallbackIcon,
  emptyMessage,
}: MediaGridTabProps) {
  if (!items) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-8 py-20 text-center">
        {fallbackIcon}
        <p className="text-sm font-medium text-zinc-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => {
        const mediaItem: TMDBMedia = {
          id: Number(item.mediaId),
          media_type: item.mediaType as "movie" | "tv",
          title: item.title,
          name: item.title,
          poster_path: item.posterPath,
          vote_average: item.rating || 0,
          release_date: item.releaseYear,
          backdrop_path: "",
          genre_ids: [],
          overview: "",
          popularity: 0,
        };

        const itemKey = `${item.mediaType}-${item.mediaId}`;

        return (
          <div
            key={item._id || itemKey}
            className="group/card-wrapper relative cursor-pointer"
          >
            <Card
              media={mediaItem}
              onQuickView={setQuickViewMedia}
              onAuthRequired={openAuth}
            />

            {/* Badge Overlay */}
            <div className="pointer-events-none absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5">
              {(activeTab === "ratings" ||
                (activeTab === "all" && item.rating)) &&
              item.rating ? (
                <div className="flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-600/90 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase shadow-lg">
                  <Star className="h-3 w-3 fill-current text-yellow-300" />
                  <span>{Number(item.rating).toFixed(0)}/10</span>
                </div>
              ) : activeTab === "all" && item.isFavorite ? (
                <div className="flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-600/90 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase shadow-lg">
                  <Heart className="h-3 w-3 fill-current text-white" />
                  <span>Favorite</span>
                </div>
              ) : activeTab === "all" && item.isWatchlist ? (
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-600/90 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase shadow-lg">
                  <Bookmark className="h-3 w-3 fill-current text-white" />
                  <span>Watchlist</span>
                </div>
              ) : null}
            </div>

            {/* Edit Selection Checkbox */}
            {isEditMode && activeTab !== "all" && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSelectItem(item.mediaType, item.mediaId);
                }}
                className="absolute inset-0 z-35 flex items-center justify-center rounded-2xl bg-black/45 backdrop-blur-[1px] transition-all"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl border shadow-md transition-all",
                    selectedItems.has(itemKey)
                      ? "scale-110 border-blue-500 bg-blue-600 text-white"
                      : "border-zinc-700 bg-black/60 text-transparent hover:border-zinc-500",
                  )}
                >
                  <Check className="h-5 w-5 stroke-3" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
