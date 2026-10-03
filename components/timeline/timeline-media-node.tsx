"use client";

import { memo } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { TimelineMediaItem } from "@/types/timeline";
import { Check, Star, Info, Sparkles } from "lucide-react";
import { TimelinePosterImage } from "./timeline-poster-image";
import { cn } from "@/lib/utils";

export type TimelineNodeType = Node<
  TimelineMediaItem & {
    isSeen?: boolean;
    onToggleSeen?: (item: TimelineMediaItem) => void;
    onOpenQuickView?: (item: TimelineMediaItem) => void;
  },
  "mediaNode"
>;

function TimelineMediaNodeComponent({ data, selected }: NodeProps<TimelineNodeType>) {
  const {
    title,
    releaseYear,
    chronologicalYear,
    posterPath,
    rating,
    isAnchor,
    canonType,
    isSeen,
    onToggleSeen,
    onOpenQuickView,
  } = data;

  const isTva = canonType === "tva";
  const isMultiverse = canonType === "multiverse";

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center select-none transition-all duration-300",
        isAnchor ? "w-36 md:w-44" : "w-24 md:w-28",
      )}
    >
      {/* Target & Source Handles for React Flow Edge connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-zinc-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!bg-yellow-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-purple-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="!bg-yellow-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        className="!bg-purple-500 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Special Branch Glow Effect */}
      {isTva && (
        <div className="absolute -inset-1 rounded-2xl bg-amber-500/20 blur-md pointer-events-none" />
      )}
      {isMultiverse && (
        <div className="absolute -inset-1 rounded-2xl bg-purple-500/20 blur-md pointer-events-none" />
      )}
      {isAnchor && !isTva && !isMultiverse && (
        <div className="absolute -inset-1 rounded-2xl bg-red-500/20 blur-md pointer-events-none" />
      )}

      {/* Media Card Container */}
      <div
        onClick={() => onOpenQuickView?.(data)}
        className={cn(
          "relative w-full cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border transition-all duration-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isAnchor
            ? "aspect-2/3 border-zinc-700 shadow-2xl hover:border-red-500 hover:shadow-red-500/20 hover:scale-105"
            : "aspect-2/3 border-zinc-800/90 hover:border-zinc-500 hover:scale-105",
          selected && "ring-2 ring-primary ring-offset-2 ring-offset-zinc-950",
          isTva && "border-amber-500/60 shadow-amber-500/20",
          isMultiverse && "border-purple-500/60 shadow-purple-500/20",
        )}
      >
        {/* Poster Image with fallback */}
        <TimelinePosterImage
          src={posterPath}
          alt={title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            isSeen && "contrast-105",
          )}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges: Rating & Anchor Sparkle */}
        <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none">
          {rating !== undefined && rating > 0 ? (
            <div className="flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-md border border-zinc-800/60">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {isAnchor && (
            <div className="flex items-center gap-1 rounded-md bg-red-950/90 border border-red-500/50 px-1.5 py-0.5 text-[9px] font-black uppercase text-red-200 backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5 text-red-400" />
              <span className="hidden sm:inline">Anchor</span>
            </div>
          )}
        </div>

        {/* Seen Action Button (Floating Check) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSeen?.(data);
          }}
          aria-label={isSeen ? `Mark ${title} as unseen` : `Mark ${title} as seen`}
          className={cn(
            "absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isSeen
              ? "bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-600"
              : "bg-black/70 border-zinc-500 text-zinc-300 hover:text-white hover:border-zinc-300 hover:bg-black/90",
          )}
        >
          <Check className={cn("h-4 w-4", isSeen ? "stroke-[3]" : "stroke-2")} />
        </button>

        {/* Quick View trigger icon on hover */}
        <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-zinc-600 text-zinc-200 hover:text-white">
            <Info className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Meta Text below card */}
      <div className="mt-2 text-center w-full px-1">
        <h4
          className={cn(
            "line-clamp-2 font-bold leading-tight transition-colors group-hover:text-primary",
            isAnchor ? "text-xs md:text-sm text-zinc-100" : "text-[11px] md:text-xs text-zinc-200",
          )}
          title={title}
        >
          {title}
        </h4>
        <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-zinc-400 font-semibold">
          <span>{chronologicalYear ?? releaseYear}</span>
          {chronologicalYear && chronologicalYear !== releaseYear && (
            <span className="text-zinc-400">({releaseYear})</span>
          )}
        </div>
      </div>
    </div>
  );
}

export const TimelineMediaNode = memo(TimelineMediaNodeComponent);

