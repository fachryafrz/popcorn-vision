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
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
        {fallbackIcon}
        <p className="text-zinc-400 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
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
          <div key={item._id || itemKey} className="relative group/card-wrapper cursor-pointer">
            <Card
              media={mediaItem}
              onQuickView={setQuickViewMedia}
              onAuthRequired={openAuth}
            />

            {/* Badge Overlay */}
            <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5 pointer-events-none">
              {(activeTab === "ratings" || (activeTab === "all" && item.rating)) && item.rating ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-blue-600/90 border border-blue-400/30 text-white shadow-lg">
                  <Star className="h-3 w-3 fill-current text-yellow-300" />
                  <span>{item.rating}/10</span>
                </div>
              ) : activeTab === "all" && item.isFavorite ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-rose-600/90 border border-rose-400/30 text-white shadow-lg">
                  <Heart className="h-3 w-3 fill-current text-white" />
                  <span>Favorite</span>
                </div>
              ) : activeTab === "all" && item.isWatchlist ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-600/90 border border-emerald-400/30 text-white shadow-lg">
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
                className="absolute inset-0 bg-black/45 backdrop-blur-[1px] rounded-2xl z-35 flex items-center justify-center transition-all"
              >
                <div className={cn(
                  "h-8 w-8 rounded-xl border flex items-center justify-center transition-all shadow-md",
                  selectedItems.has(itemKey)
                    ? "bg-blue-600 border-blue-500 text-white scale-110"
                    : "bg-black/60 border-zinc-700 text-transparent hover:border-zinc-500"
                )}>
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
