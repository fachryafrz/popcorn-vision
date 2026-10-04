"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Search,
  Film,
  Tv,
} from "lucide-react";
import { FranchiseTimeline, TimelineFilterState } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimelineHeaderProps {
  timeline: FranchiseTimeline;
  filters: TimelineFilterState;
  onFilterChange: (newFilters: Partial<TimelineFilterState>) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onResetZoom: () => void;
  totalFilteredCount: number;
}

export function TimelineHeader({
  timeline,
  filters,
  onFilterChange,
  zoom,
  onZoomChange,
  onResetZoom,
  totalFilteredCount,
}: TimelineHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-b from-zinc-950 via-zinc-900/95 to-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-xl sticky top-14 z-30 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
        {/* Top Row: Navigation Breadcrumb, Title & Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/timelines">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl"
              >
                <ChevronLeft className="size-4 mr-1" />
                All Timelines
              </Button>
            </Link>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{timeline.title}</span>
                  <span
                    className="size-2 rounded-full inline-block animate-pulse"
                    style={{ backgroundColor: timeline.themeColor }}
                  />
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {totalFilteredCount} Items
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden md:block mt-0.5 max-w-2xl line-clamp-1">
                {timeline.tagline}
              </p>
            </div>
          </div>

          {/* Zoom and Display Canvas Controls */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800/90 rounded-xl p-1 shadow-sm ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => onZoomChange(Math.max(0.65, zoom - 0.1))}
              title="Zoom Out"
              disabled={zoom <= 0.65}
            >
              <ZoomOut className="size-4" />
            </Button>

            <span className="text-xs font-mono font-bold px-1.5 text-zinc-300 min-w-[3rem] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
              title="Zoom In"
              disabled={zoom >= 1.4}
            >
              <ZoomIn className="size-4" />
            </Button>

            <div className="h-4 w-px bg-zinc-800 mx-0.5" />

            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={onResetZoom}
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Bottom Controls Row: Eras Pills, Canon/Legends Toggle, Type Filter, Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/40">
          {/* Era Quick Jump / Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              type="button"
              onClick={() => onFilterChange({ selectedEra: "all" })}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 shrink-0",
                filters.selectedEra === "all"
                  ? "bg-zinc-100 text-zinc-950 shadow-md font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
              )}
            >
              All Eras
            </button>
            {timeline.eras.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => onFilterChange({ selectedEra: era.id })}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 shrink-0 flex items-center gap-1.5",
                  filters.selectedEra === era.id
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                )}
              >
                <span>{era.name}</span>
                <span className="text-[10px] opacity-70 hidden sm:inline">({era.timeSpan})</span>
              </button>
            ))}
          </div>

          {/* Right Filters Group */}
          <div className="flex items-center gap-3 flex-wrap ml-auto">
            {/* Search Input */}
            <div className="relative min-w-[140px] sm:min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
              <Input
                type="text"
                placeholder="Find in timeline..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                className="h-8 pl-8 pr-3 text-xs bg-zinc-900/80 border-zinc-800 rounded-lg text-zinc-200 focus-visible:ring-amber-500/50"
              />
            </div>

            {/* Media Type Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onFilterChange({ mediaType: "all" })}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md transition-colors",
                  filters.mediaType === "all" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ mediaType: "movie" })}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors",
                  filters.mediaType === "movie" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
                title="Movies only"
              >
                <Film className="size-3 text-red-400" />
                <span className="hidden sm:inline">Movies</span>
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ mediaType: "tv" })}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors",
                  filters.mediaType === "tv" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
                title="Series only"
              >
                <Tv className="size-3 text-sky-400" />
                <span className="hidden sm:inline">Series</span>
              </button>
            </div>

            {/* Legends Toggle */}
            {timeline.supportsLegendsToggle && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800/90 rounded-lg px-2.5 py-1">
                <Switch
                  id="legends-switch"
                  checked={filters.showLegends}
                  onCheckedChange={(checked) => onFilterChange({ showLegends: checked })}
                  className="data-[state=checked]:bg-amber-500 scale-90"
                />
                <Label
                  htmlFor="legends-switch"
                  className="text-xs font-bold text-zinc-300 cursor-pointer select-none flex items-center gap-1"
                >
                  <Sparkles className="size-3 text-amber-400" />
                  <span>Legends</span>
                </Label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
