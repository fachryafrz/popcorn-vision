"use client";

import React from "react";
import Link from "next/link";
import { Globe, Lock, Users, Calendar, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomList, ListCreator } from "./types";

interface ListHeaderProps {
  list: CustomList;
  creator: ListCreator | null;
  collaborators: ListCreator[];
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  onToggleLike: () => void;
  onToggleFavorite: () => void;
  onOpenMembers: () => void;
  actionSlot?: React.ReactNode;
}

export default function ListHeader({
  list,
  creator,
  collaborators,
  likeCount,
  isLiked,
  isFavorited,
  onToggleLike,
  onToggleFavorite,
  onOpenMembers,
  actionSlot,
}: ListHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {list.name}
            </h1>
            <div className="flex gap-1.5">
              {list.privacy === "public" ? (
                <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                  <Globe className="h-3 w-3" /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                  <Lock className="h-3 w-3" /> Private
                </span>
              )}
              {list.isCollaborative && (
                <span className="text-primary border-primary/30 bg-primary/10 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold">
                  <Users className="h-3 w-3" /> Collaborative
                </span>
              )}
              {list.isWatchlist && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
                  Watchlist
                </span>
              )}
            </div>
          </div>
          {list.description && (
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
              {list.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created {new Date(list.createdAt).toLocaleDateString()}
            </span>
            {creator && (
              <span>
                by{" "}
                <Link
                  href={`/@${creator.username}`}
                  className="font-bold text-zinc-400 hover:text-white"
                >
                  @{creator.username}
                </Link>
              </span>
            )}
            {list.isCollaborative && (
              <button
                onClick={onOpenMembers}
                className="flex cursor-pointer items-center gap-1.5 font-semibold text-zinc-400 transition-colors hover:text-white"
              >
                <Users className="h-3.5 w-3.5" />
                {collaborators.length}{" "}
                {collaborators.length === 1 ? "collaborator" : "collaborators"}
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {/* Like list */}
          <Button
            variant="outline"
            onClick={onToggleLike}
            className={`cursor-pointer rounded-xl border-zinc-800 transition-all ${
              isLiked
                ? "text-rose-450 border-rose-900/40 bg-rose-950/25 hover:bg-rose-950/40"
                : "text-zinc-300 hover:bg-zinc-900"
            }`}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isLiked ? "fill-rose-450" : ""}`}
            />
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </Button>

          {/* Favorite list */}
          <Button
            variant="outline"
            onClick={onToggleFavorite}
            className={`cursor-pointer rounded-xl border-zinc-800 transition-all ${
              isFavorited
                ? "text-yellow-455 border-yellow-900/40 bg-yellow-950/25 hover:bg-yellow-950/40"
                : "text-zinc-300 hover:bg-zinc-900"
            }`}
          >
            <Star
              className={`mr-2 h-4 w-4 ${isFavorited ? "fill-yellow-455" : ""}`}
            />
            {isFavorited ? "Favorited" : "Favorite"}
          </Button>

          {actionSlot}
        </div>
      </div>
    </div>
  );
}
