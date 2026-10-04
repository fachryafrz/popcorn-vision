"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Check, Eye, Film, Tv, BookOpen } from "lucide-react";
import { TimelineNode } from "@/types/timeline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimelineNodeCardProps {
  node: TimelineNode;
  isSeen: boolean;
  isWatchlisted: boolean;
  onToggleSeen: (node: TimelineNode, e: React.MouseEvent) => void;
  onQuickView: (node: TimelineNode) => void;
  onLogWatch: (node: TimelineNode) => void;
  onToggleWatchlist: (node: TimelineNode, e: React.MouseEvent) => void;
}

export const TimelineNodeCard = memo(function TimelineNodeCard({
  node,
  isSeen,
  onToggleSeen,
  onQuickView,
  onLogWatch,
}: TimelineNodeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col w-[200px] shrink-0 rounded-2xl p-2.5 transition-all duration-300 select-none",
        "bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60",
        isSeen && "border-emerald-500/50 bg-emerald-950/15 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/30",
        node.canon === "legends" && !isSeen && "border-amber-500/30 bg-amber-950/10"
      )}
    >
      {/* Card Header Tag / Chronological Pill */}
      <div className="flex items-center justify-between gap-1 mb-2 px-0.5">
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase backdrop-blur-md",
            isSeen
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-zinc-800 text-zinc-300 border border-zinc-700/60"
          )}
        >
          {node.inUniverseTime}
        </span>

        {node.canon === "legends" ? (
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-tight">
            Legends
          </span>
        ) : node.tag ? (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            {node.tag}
          </span>
        ) : null}
      </div>

      {/* Poster Media Box */}
      <div
        className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950/80 cursor-pointer shadow-inner group/poster"
        onClick={() => onQuickView(node)}
      >
        <Image
          src={
            node.customPosterPath ||
            `https://image.tmdb.org/t/p/w500${node.customPosterPath || ""}`
          }
          alt={node.title}
          fill
          sizes="200px"
          className={cn(
            "object-cover transition-transform duration-500 group-hover/poster:scale-105",
            isSeen && "brightness-95 contrast-105"
          )}
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/logo/popcorn.png";
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Watched Ring Overlay on the corner */}
        <button
          type="button"
          onClick={(e) => onToggleSeen(node, e)}
          title={isSeen ? "Mark as unseen" : "Mark as watched"}
          className={cn(
            "absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition-all duration-300 z-10",
            isSeen
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-100 ring-2 ring-white/30"
              : "bg-black/60 backdrop-blur-md text-zinc-300 border border-white/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:scale-110 opacity-80 group-hover:opacity-100"
          )}
        >
          <Check className={cn("size-4 stroke-[2.5]", isSeen ? "scale-100" : "scale-90")} />
        </button>

        {/* Media Type Badge */}
        <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 text-[10px] font-medium flex items-center gap-1">
          {node.mediaType === "movie" ? (
            <Film className="size-3 text-red-400" />
          ) : (
            <Tv className="size-3 text-sky-400" />
          )}
          <span>{node.mediaType === "movie" ? "Movie" : "Series"}</span>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-white/10 px-2 grow shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(node);
            }}
          >
            <Eye className="size-3.5 mr-1" />
            Preview
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="size-7 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-white/10 shrink-0 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onLogWatch(node);
            }}
            title="Log in Diary with Review & Rating"
          >
            <BookOpen className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Title & Metadata Details */}
      <div className="mt-2.5 px-0.5 flex flex-col grow justify-between">
        <div>
          {node.branch && (
            <span className="text-[10px] font-medium text-amber-400/90 truncate block mb-0.5 tracking-tight">
              {node.branch}
            </span>
          )}
          <h4
            className="text-xs font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors cursor-pointer"
            onClick={() => onQuickView(node)}
            title={node.title}
          >
            {node.title}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 pt-1 border-t border-zinc-800/60 font-medium">
          <span>{node.releaseYear}</span>
          <span>{node.duration || (node.mediaType === "movie" ? "Movie" : "TV Series")}</span>
        </div>
      </div>
    </div>
  );
});
