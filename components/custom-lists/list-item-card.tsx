"use client";

import React from "react";
import { Film, CheckCircle2, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBMedia } from "@/lib/tmdb";
import { CustomListItem } from "./types";

interface ListItemCardProps {
  item: CustomListItem;
  isWatchlist?: boolean;
  canModify: boolean;
  onSelectMedia: (media: TMDBMedia) => void;
  onToggleVote: (mediaId: string, mediaType: string) => void;
  onToggleWatched: (mediaId: string, mediaType: string) => void;
  onRemoveItem: (mediaId: string, mediaType: string, title: string) => void;
}

export default function ListItemCard({
  item,
  isWatchlist,
  canModify,
  onSelectMedia,
  onToggleVote,
  onToggleWatched,
  onRemoveItem,
}: ListItemCardProps) {
  const tmdbMedia = {
    id: Number(item.mediaId),
    title: item.mediaType === "movie" ? item.title : undefined,
    name: item.mediaType === "tv" ? item.title : undefined,
    media_type: item.mediaType as "movie" | "tv",
    poster_path: item.posterPath,
    release_date: `${item.releaseYear}-01-01`,
    popularity: 0,
  } as TMDBMedia;

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/10 p-4 transition-all hover:bg-zinc-900/30">
      <div className="flex min-w-0 items-center gap-4">
        <div
          onClick={() => onSelectMedia(tmdbMedia)}
          className="shrink-0 cursor-pointer hover:opacity-85"
        >
          {item.posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w154${item.posterPath}`}
              alt={item.title}
              className="border-zinc-850 h-20 w-14 rounded-2xl border bg-zinc-900 object-cover"
            />
          ) : (
            <div className="border-zinc-850 flex h-20 w-14 items-center justify-center rounded-2xl border bg-zinc-900">
              <Film className="text-zinc-650 h-6 w-6" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onSelectMedia(tmdbMedia)}
              className="group-hover:text-primary cursor-pointer truncate text-base font-extrabold text-white transition-colors"
            >
              {item.title}
            </h4>
            <span className="text-zinc-550 shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase">
              {item.mediaType}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {item.releaseYear} • Added by{" "}
            <span className="font-bold text-zinc-400">
              {item.addedByUser ? `@${item.addedByUser.username}` : "member"}
            </span>
          </p>
          {isWatchlist && item.watched && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Watched by{" "}
              {item.watchedByUser ? `@${item.watchedByUser.username}` : "member"}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isWatchlist && (
          <>
            {/* Vote Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleVote(item.mediaId, item.mediaType)}
              className={`h-9 gap-1.5 rounded-xl border-zinc-800 px-3 text-xs font-bold transition-all ${
                item.userVote === 1
                  ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${item.userVote === 1 ? "fill-current" : ""}`}
              />
              <span>{item.voteCount}</span>
            </Button>

            {/* Watched Toggle (Collaborators/Owner only) */}
            {canModify && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleWatched(item.mediaId, item.mediaType)}
                className={`h-9 gap-1.5 rounded-xl border-zinc-800 px-3 text-xs font-bold transition-all ${
                  item.watched
                    ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{item.watched ? "Watched" : "Watch"}</span>
              </Button>
            )}
          </>
        )}

        {canModify && (
          <button
            onClick={() => onRemoveItem(item.mediaId, item.mediaType, item.title)}
            className="text-zinc-450 shrink-0 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition-all hover:scale-105 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 active:scale-95"
            title="Remove title"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}
