"use client";

import { memo } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { TimelineMediaItem } from "@/types/timeline";
import { Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineNodeType = Node<
  TimelineMediaItem & {
    isSeen?: boolean;
    onToggleSeen?: (item: TimelineMediaItem) => void;
    onOpenQuickView?: (item: TimelineMediaItem) => void;
  },
  "mediaNode"
>;

function TimelineMediaNodeComponent({ data, id }: NodeProps<TimelineNodeType>) {
  const {
    title,
    releaseYear,
    chronologicalYear,
    posterPath,
    isAnchor,
    isUnreleased,
    isSeen,
    onToggleSeen,
    onOpenQuickView,
  } = data;

  // Harmonious Proportions:
  // - Regular: width 60px container, poster 52px x 78px, rounded-md
  // - Anchor: width 90px container, poster 76px x 114px, rounded-lg
  const containerWidth = isAnchor ? 90 : 60;
  const cardWidth = isAnchor ? 76 : 52;
  const cardHeight = isAnchor ? 114 : 78;

  // TMDB Poster URL resolution
  const posterUrl = posterPath
    ? posterPath.startsWith("http")
      ? posterPath
      : `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder-poster.png";

  // Check branch indicators for specific landmark anchors
  const isBranchFork =
    id === "mcu-avengers-1" ||
    id === "mcu-loki" ||
    id === "sw-ep3";

  const isBranchJoin =
    id === "mcu-avengers-doomsday" ||
    id === "sw-rogue-one";

  return (
    <div
      style={{ width: `${containerWidth}px` }}
      className="group/node relative flex flex-col items-center select-none"
    >
      {/* Invisible Handles for React Flow Edge Connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        className="!w-0 !h-0 !border-0 !bg-transparent opacity-0 pointer-events-none"
      />

      {/* Branch Fork Icon Indicator (Queuebrick SVG indicator above anchor) */}
      {isAnchor && isBranchFork && (
        <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 cursor-default text-zinc-400 transition-colors hover:text-purple-400">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-3.5">
            <path
              d="M1 7 H6 M6 7 C9.5 7 9.5 3.5 13 3.5 M6 7 C9.5 7 9.5 10.5 13 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* Branch Join Icon Indicator */}
      {isAnchor && isBranchJoin && (
        <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 cursor-default text-zinc-400 transition-colors hover:text-purple-400">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="size-3.5">
            <path
              d="M1 3.5 C4.5 3.5 4.5 7 8 7 M1 10.5 C4.5 10.5 4.5 7 8 7 M8 7 H13"
              stroke="currentColor"
              strokeWidth="1.5"
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
        aria-label={`Mark seen: ${title}`}
        onClick={() => onOpenQuickView?.(data)}
        className={cn(
          "relative mx-auto block overflow-hidden bg-zinc-900 transition-transform shadow-md",
          isAnchor
            ? "rounded-lg group-hover/node:scale-105 border border-zinc-800"
            : "rounded-[5px] group-hover/node:scale-110",
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

        {/* Hover Eye Icon for Anchor Cards (Queuebrick Style) */}
        {isAnchor && !isUnreleased && (
          <span className="absolute inset-0 hidden place-items-center bg-black/45 opacity-0 transition-opacity duration-150 group-hover/node:opacity-100 group-has-[:focus-visible]/node:opacity-100 sm:grid pointer-events-none">
            <Eye className="size-5 text-white" />
          </span>
        )}

        {/* Seen checkmark indicator on corner if watched */}
        {isSeen && (
          <span className="absolute bottom-1 right-1 flex items-center justify-center rounded-full bg-emerald-500 text-black shadow-md h-3.5 w-3.5">
            <Check className="h-2 w-2 stroke-[3]" />
          </span>
        )}
      </button>

      {/* Title & Chronological Year */}
      <div
        className={cn(
          "mt-2 text-center pointer-events-none w-full",
          isAnchor ? "px-1 max-w-[90px]" : "max-w-[60px] px-0.5",
        )}
      >
        <span
          className="block truncate font-semibold text-zinc-100 hover:underline leading-tight"
          style={{ fontSize: isAnchor ? "9.5px" : "8.5px" }}
        >
          {title}
        </span>
        <div
          className="mt-0.5 truncate text-zinc-400 leading-tight"
          style={{ fontSize: isAnchor ? "8px" : "7.5px" }}
        >
          {chronologicalYear ?? releaseYear}
        </div>
      </div>
    </div>
  );
}

export const TimelineMediaNode = memo(TimelineMediaNodeComponent);

