"use client";

import { memo } from "react";
import { TimelineMediaItem, TimelineNodeData } from "@/types/timeline";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineCanvasNodeProps {
  node: TimelineNodeData;
  isSeen: boolean;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
}

function TimelineCanvasNodeComponent({
  node,
  isSeen,
  onToggleSeen,
  onOpenQuickView,
}: TimelineCanvasNodeProps) {
  const item = node.data;
  const isAnchor = !!item.isAnchor;

  // Dimensions: Anchors are prominent landmarks (176x264), Mini-nodes are compact (56x84)
  const cardWidth = isAnchor ? 176 : 56;
  const cardHeight = isAnchor ? 264 : 84;

  // Center vertically on node.position.y
  const topPos = node.position.y - cardHeight / 2;
  const leftPos = node.position.x;

  // TMDB Poster URL resolution (w500 for crisp visual quality at high zoom levels)
  const posterUrl = item.posterPath
    ? item.posterPath.startsWith("http")
      ? item.posterPath
      : `https://image.tmdb.org/t/p/w500${item.posterPath}`
    : "/placeholder-poster.png";

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPos}px`,
        top: `${topPos}px`,
        width: `${cardWidth}px`,
        transform: "translate3d(0, 0, 0)",
      }}
      className="group select-none flex flex-col items-center z-10"
    >
      {/* Poster Card (Queuebrick Style) */}
      <div
        onClick={() => onOpenQuickView?.(item)}
        style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
        className={cn(
          "relative rounded-md overflow-hidden cursor-pointer transition-all duration-200 border bg-zinc-950 shadow-md hover:scale-110 hover:shadow-2xl hover:z-30",
          isAnchor
            ? "border-zinc-700/80 hover:border-zinc-400 shadow-xl"
            : "border-zinc-800/80 hover:border-zinc-500",
          item.canonType === "tva" && "border-amber-500/80 hover:border-amber-400",
          item.canonType === "multiverse" && "border-purple-500/80 hover:border-purple-400",
        )}
      >
        {/* Poster Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200 pointer-events-none",
            isSeen ? "opacity-35 grayscale-40" : "opacity-100",
          )}
        />

        {/* Seen Toggle Checkmark Button */}
        <button
          type="button"
          aria-label={isSeen ? "Mark as unwatched" : "Mark as watched"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSeen?.(item);
          }}
          className={cn(
            "nodrag absolute bottom-1 right-1 flex items-center justify-center rounded-full border transition-all z-20 cursor-pointer",
            isAnchor ? "h-6 w-6" : "h-4 w-4",
            isSeen
              ? "bg-emerald-500 border-emerald-400 text-black scale-100 shadow-md"
              : "bg-black/80 border-zinc-600 text-zinc-400 opacity-0 group-hover:opacity-100 hover:border-white hover:text-white hover:scale-110",
          )}
        >
          <Check className={cn(isAnchor ? "h-3.5 w-3.5 stroke-[3]" : "h-2.5 w-2.5 stroke-[3]", isSeen && "text-black")} />
        </button>
      </div>

      {/* Title & Chronological Year (Queuebrick Typography: Prominent on Anchors) */}
      {isAnchor ? (
        <div className="mt-2 text-center w-full px-1 pointer-events-none">
          <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1 leading-snug">
            {item.title}
          </h4>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            {item.chronologicalYear ?? item.releaseYear}
          </p>
        </div>
      ) : (
        <div className="mt-1 text-center w-[76px] -mx-2.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <h4 className="text-[9px] font-medium text-zinc-300 tracking-tight line-clamp-1 leading-tight">
            {item.title}
          </h4>
          <p className="text-[8px] text-zinc-500 font-normal">
            {item.chronologicalYear ?? item.releaseYear}
          </p>
        </div>
      )}
    </div>
  );
}

export const TimelineCanvasNode = memo(TimelineCanvasNodeComponent);
