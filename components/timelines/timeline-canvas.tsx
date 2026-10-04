"use client";

import React, { useRef, useState, useCallback } from "react";
import { FranchiseTimeline, TimelineNode } from "@/types/timeline";
import { TimelineNodeCard } from "./timeline-node-card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TimelineCanvasProps {
  timeline: FranchiseTimeline;
  filteredNodes: TimelineNode[];
  seenNodeIds: Set<string>;
  zoom: number;
  onToggleSeen: (node: TimelineNode, e: React.MouseEvent) => void;
  onQuickView: (node: TimelineNode) => void;
  onLogWatch: (node: TimelineNode) => void;
  onToggleWatchlist: (node: TimelineNode, e: React.MouseEvent) => void;
  isWatchlisted: (mediaId: number, mediaType: string) => boolean;
}

export function TimelineCanvas({
  timeline,
  filteredNodes,
  seenNodeIds,
  zoom,
  onToggleSeen,
  onQuickView,
  onLogWatch,
  onToggleWatchlist,
  isWatchlisted,
}: TimelineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Group filtered nodes by era
  const nodesByEra = timeline.eras.map((era) => {
    const eraNodes = filteredNodes.filter((n) => n.eraId === era.id);
    return {
      era,
      nodes: eraNodes,
    };
  }).filter((group) => group.nodes.length > 0);

  // Mouse drag handlers for smooth canvas pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest(".group\\/poster")
    ) {
      return;
    }

    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      className={cn(
        "relative w-full overflow-x-auto overflow-y-hidden select-none min-h-[calc(100vh-230px)] pb-32 pt-6 px-6 sm:px-12",
        "scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {/* Background Starfield Ambient Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main Scalable Timeline Content */}
      <div
        className="inline-flex items-start gap-8 transition-transform duration-200 ease-out origin-top-left"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {nodesByEra.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center px-12 py-20 text-zinc-400">
            <Sparkles className="size-10 text-amber-500 mb-3 animate-pulse" />
            <p className="text-lg font-bold text-white">No titles match the selected filters</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Try enabling Legends or switching the media filter to view more content.
            </p>
          </div>
        ) : (
          nodesByEra.map(({ era, nodes }) => (
            <div
              key={era.id}
              className={cn(
                "relative flex flex-col rounded-3xl p-5 border backdrop-blur-sm transition-all duration-300 shrink-0",
                era.color ? `bg-gradient-to-b ${era.color}` : "bg-zinc-900/40",
                era.accentBorder || "border-zinc-800"
              )}
            >
              {/* Era Header Column */}
              <div className="mb-5 pb-3 border-b border-zinc-800/80 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-100">
                      {era.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-mono font-medium text-amber-400/90 mt-0.5">
                    {era.timeSpan}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900/80 text-zinc-400 border border-zinc-800">
                  {nodes.length} {nodes.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Era Description */}
              {era.description && (
                <p className="text-[11px] text-zinc-400 mb-4 max-w-[420px] line-clamp-2">
                  {era.description}
                </p>
              )}

              {/* Grid / Row of Media Nodes within this Era */}
              <div className="flex items-start gap-4 flex-wrap max-w-none">
                {nodes.map((node) => (
                  <TimelineNodeCard
                    key={node.id}
                    node={node}
                    isSeen={seenNodeIds.has(node.id)}
                    isWatchlisted={isWatchlisted(node.mediaId, node.mediaType)}
                    onToggleSeen={onToggleSeen}
                    onQuickView={onQuickView}
                    onLogWatch={onLogWatch}
                    onToggleWatchlist={onToggleWatchlist}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
