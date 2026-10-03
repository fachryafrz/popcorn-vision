"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TimelineCategory, TimelineSummaryItem } from "@/types/timeline";
import { TimelinesHubHeader, TimelineSort } from "./timelines-hub-header";
import { TimelineCardFanned } from "./timeline-card-fanned";
import { TimelineRowItem } from "./timeline-row-item";
import { Compass } from "lucide-react";

export function TimelinesHubClient() {
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory>("all");
  const [selectedSort, setSelectedSort] = useState<TimelineSort>("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Query timelines from Convex
  const timelines = useQuery(api.timelines.listTimelines, {
    category: selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery: searchQuery.trim() || undefined,
  });

  // Auto seed official timelines on mount
  const seedMutation = useMutation(api.timelines.seedOfficialTimelines);
  useEffect(() => {
    seedMutation({ forceUpdate: false }).catch(() => {
      // Ignore background seeding errors
    });
  }, [seedMutation]);

  // Sort timelines locally based on active sort pill
  const sortedTimelines = useMemo<TimelineSummaryItem[]>(() => {
    if (!timelines) return [];
    const list = [...(timelines as TimelineSummaryItem[])];

    if (selectedSort === "trending") {
      return list.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }
    if (selectedSort === "popular") {
      return list.sort((a, b) => b.nodeCount - a.nodeCount);
    }
    if (selectedSort === "new") {
      return list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }
    return list;
  }, [timelines, selectedSort]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
      {/* Page Header Bar */}
      <TimelinesHubHeader
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* Main Content Area */}
      <div className="mt-8">
        {!timelines ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-72 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse p-4 flex flex-col justify-end gap-2"
              >
                <div className="h-4 w-3/4 rounded-full bg-zinc-800" />
                <div className="h-3 w-1/2 rounded-full bg-zinc-800/60" />
              </div>
            ))}
          </div>
        ) : sortedTimelines.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 border border-zinc-700">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No timelines found</h3>
            <p className="text-xs text-zinc-300 max-w-md">
              {searchQuery
                ? `No franchises matched "${searchQuery}". Try searching for another universe or create your own.`
                : "No timelines in this category yet. Be the first to create one!"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View: 3D Fanned Poster Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedTimelines.map((timeline) => (
              <TimelineCardFanned key={timeline.id} timeline={timeline} />
            ))}
          </div>
        ) : (
          /* List View: Row Cards */
          <div className="flex flex-col gap-2.5">
            {sortedTimelines.map((timeline) => (
              <TimelineRowItem key={timeline.id} timeline={timeline} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
