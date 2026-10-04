"use client";

import { memo } from "react";
import { TimelineMediaItem, TimelineNodeData } from "@/types/timeline";
import { Eye, Check } from "lucide-react";
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
  const isUnreleased = !!item.isUnreleased;

  // Full Card Proportions:
  // - Regular: width 92px container, poster 76px x 114px, rounded-lg
  // - Anchor: width 112px container, poster 96px x 144px, rounded-xl
  const containerWidth = isAnchor ? 112 : 92;
  const cardWidth = isAnchor ? 96 : 76;
  const cardHeight = isAnchor ? 144 : 114;
  const topPos = node.position.y - cardHeight / 2;

  // TMDB Poster URL resolution
  const posterUrl = item.posterPath
    ? item.posterPath.startsWith("http")
      ? item.posterPath
      : `https://image.tmdb.org/t/p/w500${item.posterPath}`
    : "/placeholder-poster.png";

  // Check branch indicators for specific landmark anchors
  const isBranchFork =
    node.id === "mcu-avengers-1" ||
    node.id === "mcu-loki" ||
    node.id === "sw-ep3";

  const isBranchJoin =
    node.id === "mcu-avengers-doomsday" ||
    node.id === "sw-rogue-one";

  return (
    <div
      style={{
        position: "absolute",
        left: `${node.position.x}px`,
        top: `${topPos}px`,
        width: `${containerWidth}px`,
      }}
      className="group/node absolute select-none z-10"
    >
      {/* Branch Fork Icon Indicator */}
      {isAnchor && isBranchFork && (
        <span className="absolute -top-[28px] left-1/2 -translate-x-1/2 cursor-default text-amber-400 transition-colors">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-4">
            <path
              d="M1 7 H6 M6 7 C9.5 7 9.5 3.5 13 3.5 M6 7 C9.5 7 9.5 10.5 13 10.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* Branch Join Icon Indicator */}
      {isAnchor && isBranchJoin && (
        <span className="absolute -top-[28px] left-1/2 -translate-x-1/2 cursor-default text-purple-400 transition-colors">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-4">
            <path
              d="M1 3.5 C4.5 3.5 4.5 7 8 7 M1 10.5 C4.5 10.5 4.5 7 8 7 M8 7 H13"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* Poster Button */}
      <button
        type="button"
        disabled={isUnreleased}
        aria-pressed={isSeen}
        aria-label={`Mark seen: ${item.title}`}
        onClick={() => onOpenQuickView?.(item)}
        className={cn(
          "relative mx-auto block overflow-hidden bg-zinc-900 transition-all duration-200",
          isAnchor
            ? "rounded-xl group-hover/node:scale-105 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10"
            : "rounded-lg group-hover/node:scale-105 border border-zinc-800 shadow-md",
          isUnreleased && "cursor-default",
          !isUnreleased && "cursor-pointer",
        )}
        style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          src={posterUrl}
          className={cn(
            "object-cover transition duration-300 w-full h-full pointer-events-none",
            isUnreleased && "opacity-40",
            isSeen && "opacity-30 grayscale-40",
          )}
        />

        {/* Hover Eye Icon for Cards */}
        {!isUnreleased && (
          <span className="absolute inset-0 hidden place-items-center bg-black/45 opacity-0 transition-opacity duration-150 group-hover/node:opacity-100 group-has-[:focus-visible]/node:opacity-100 sm:grid pointer-events-none">
            <Eye className="size-6 text-white drop-shadow-md" />
          </span>
        )}

        {/* Seen checkmark indicator on corner if watched */}
        {isSeen && (
          <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg h-4 w-4">
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </span>
        )}
      </button>

      {/* Title & Chronological Year for ALL cards */}
      <div className="mt-2 text-center pointer-events-none px-0.5 w-full">
        <span
          className={cn(
            "block truncate hover:underline leading-tight",
            isAnchor ? "font-bold text-amber-200" : "font-semibold text-zinc-200"
          )}
          style={{ fontSize: isAnchor ? "11px" : "10px" }}
        >
          {item.title}
        </span>
        <div
          className="mt-0.5 truncate text-zinc-400 leading-tight"
          style={{ fontSize: isAnchor ? "9px" : "8px" }}
        >
          {item.chronologicalYear ?? item.releaseYear}
        </div>
      </div>
    </div>
  );
}

export const TimelineCanvasNode = memo(TimelineCanvasNodeComponent);
