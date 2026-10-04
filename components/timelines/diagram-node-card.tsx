"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye } from "lucide-react";
import { DiagramNode } from "./star-wars-diagram-data";
import { cn } from "@/lib/utils";

interface DiagramNodeCardProps {
  node: DiagramNode;
  isZoomedIn: boolean;
  isSeen: boolean;
  onToggleSeen: (node: DiagramNode, e: React.MouseEvent) => void;
  onQuickView: (node: DiagramNode) => void;
}

export const DiagramNodeCard = memo(function DiagramNodeCard({
  node,
  isZoomedIn,
  isSeen,
  onToggleSeen,
  onQuickView,
}: DiagramNodeCardProps) {
  // Construct poster image URL
  const posterUrl = node.customPosterPath
    ? node.customPosterPath.startsWith("http")
      ? node.customPosterPath
      : `https://image.tmdb.org/t/p/w500${node.customPosterPath}`
    : `/logo/popcorn.png`;

  // Layout coordinates and dimensions based on mode
  const currentLeft = isZoomedIn ? node.zoomedIn.left : node.zoomedOut.left;
  const currentTop = isZoomedIn ? node.zoomedIn.top : node.zoomedOut.top;
  const currentWidth = isZoomedIn ? node.zoomedIn.width : node.zoomedOut.width;

  const isMini = !isZoomedIn && node.zoomedOut.isMini;
  const posterWidth = isZoomedIn ? 104 : isMini ? 26 : 72;
  const posterHeight = isZoomedIn ? 156 : isMini ? 39 : 108;
  const borderRadius = isZoomedIn ? "8px" : isMini ? "5px" : "8px";

  // Media link href
  const mediaHref = node.mediaType === "movie" ? `/movie/${node.mediaId}` : `/tv/${node.mediaId}`;

  return (
    <div
      className="group/node absolute select-none"
      style={{
        left: `${currentLeft}px`,
        top: `${currentTop}px`,
        width: `${currentWidth}px`,
      }}
      title={`${node.title} (${node.inUniverseTime})`}
    >
      <button
        type="button"
        aria-pressed={isSeen}
        aria-label={`Mark seen: ${node.title}`}
        onClick={(e) => onToggleSeen(node, e)}
        className={cn(
          "relative mx-auto block overflow-hidden transition-transform group-hover/node:scale-105",
          "bg-zinc-900 border border-zinc-700/60 shadow-lg",
          isSeen && "ring-2 ring-emerald-500 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
        )}
        style={{
          width: `${posterWidth}px`,
          height: `${posterHeight}px`,
          borderRadius,
        }}
      >
        <Image
          src={posterUrl}
          alt={node.title}
          fill
          sizes={`${posterWidth}px`}
          className={cn(
            "object-cover transition duration-300",
            isSeen ? "opacity-100" : "opacity-90 group-hover/node:opacity-100"
          )}
          unoptimized
        />

        {/* Quick View Button on Hover (visible when card is not mini) */}
        {!isMini && (
          <span className="absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition-opacity duration-150 group-hover/node:opacity-100 sm:grid">
            <button
              type="button"
              className="p-1.5 rounded-full bg-black/70 text-white hover:bg-black shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(node);
              }}
              title="Preview Details"
            >
              <Eye className="size-4 text-white" />
            </button>
          </span>
        )}

        {/* Seen checkmark badge */}
        {isSeen && (
          <div
            className={cn(
              "absolute rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg",
              isMini ? "inset-0 bg-emerald-950/40" : "top-1 left-1 size-4"
            )}
          >
            <Check className={cn(isMini ? "size-2.5 stroke-[3] text-emerald-400" : "size-2.5 stroke-[3]")} />
          </div>
        )}
      </button>

      {/* Junction marker if present */}
      {node.markerType && (
        <span
          className="absolute -top-[24px] left-1/2 -translate-x-1/2 cursor-default text-zinc-500 hover:text-purple-400 transition-colors"
          style={{ transform: `translateX(-50%) scale(${isZoomedIn ? 1 : 0.85})` }}
        >
          <svg viewBox="0 0 14 14" fill="none" className="size-3.5">
            {node.markerType === "split" ? (
              <path
                d="M1 7 H6 M6 7 C9.5 7 9.5 3.5 13 3.5 M6 7 C9.5 7 9.5 10.5 13 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M1 3.5 C4.5 3.5 4.5 7 8 7 M1 10.5 C4.5 10.5 4.5 7 8 7 M8 7 H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
      )}

      {/* Title & Era (visible on all cards in Detailed mode, or non-mini cards in Overview) */}
      {(!isMini || isZoomedIn) && (
        <div className="mt-2 px-1 text-center">
          <Link
            href={mediaHref}
            className="block truncate font-medium hover:underline text-zinc-100 hover:text-white"
            style={{ fontSize: isZoomedIn ? "12.5px" : "9px" }}
          >
            {node.title}
          </Link>
          <div
            className="mt-0.5 truncate text-zinc-400"
            style={{ fontSize: isZoomedIn ? "11px" : "7.5px" }}
          >
            {node.inUniverseTime}
          </div>
        </div>
      )}
    </div>
  );
});

