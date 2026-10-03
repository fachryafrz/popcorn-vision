"use client";

import { useState } from "react";
import { TimelineCategory } from "@/types/timeline";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateTimelineModal } from "./create-timeline-modal";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { cn } from "@/lib/utils";

export type TimelineSort = "trending" | "popular" | "new";

interface TimelinesHubHeaderProps {
  selectedCategory: TimelineCategory;
  onSelectCategory: (category: TimelineCategory) => void;
  selectedSort: TimelineSort;
  onSelectSort: (sort: TimelineSort) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: "grid" | "list";
  onToggleViewMode: (mode: "grid" | "list") => void;
}

const CATEGORIES: { id: TimelineCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "film_tv", label: "Film & TV" },
  { id: "scifi", label: "Sci-Fi & Fantasy" },
  { id: "horror", label: "Horror" },
  { id: "anime", label: "Anime" },
];

const SORTS: { id: TimelineSort; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
  { id: "new", label: "New" },
];

export function TimelinesHubHeader({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
}: TimelinesHubHeaderProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreate = () => {
    if (!isLoggedIn) {
      openAuth();
      return;
    }
    setCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-zinc-800 text-white shadow-md shadow-black/40 border border-zinc-700"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Action Bar: Sort Pills + Search + View Mode Switch + + New Timeline Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Sort Pills + Search Input */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Sort Pills Group */}
          <div className="flex items-center gap-1 rounded-full bg-zinc-900/90 p-1 border border-zinc-800">
            {SORTS.map((sort) => {
              const isActive = selectedSort === sort.id;
              return (
                <button
                  key={sort.id}
                  type="button"
                  onClick={() => onSelectSort(sort.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                      : "text-zinc-300 hover:text-white",
                  )}
                >
                  {sort.label}
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search timelines..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-zinc-900/90 border-zinc-700 text-white placeholder:text-zinc-400 text-xs rounded-full h-10 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Right: View Mode Toggle & + New Timeline Button */}
        <div className="flex items-center gap-2">
          {/* Grid vs List View Mode Switches */}
          <div className="flex items-center gap-1 rounded-full bg-zinc-900/90 p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => onToggleViewMode("grid")}
              aria-label="Grid View"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "grid"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode("list")}
              aria-label="List View"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewMode === "list"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* + New Timeline Button */}
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 cursor-pointer shadow-lg shadow-blue-600/25 transition-all active:scale-98 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            <span>New timeline</span>
          </Button>
        </div>
      </div>

      {/* Create Timeline Modal */}
      <CreateTimelineModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
