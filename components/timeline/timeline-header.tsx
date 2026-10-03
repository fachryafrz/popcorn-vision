"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TimelineUniverse } from "@/types/timeline";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import {
  ChevronDown,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SlidersHorizontal,
  Check,
  Layers,
  Plus,
  Pencil,
  Save,
  Trash2,
  Loader2,
  Users,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateTimelineModal } from "./create-timeline-modal";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const UNIVERSES_LIST = [
  { id: "x-men", label: "X-Men" },
  { id: "spider-man", label: "Spider-Man" },
  { id: "blade", label: "Blade" },
  { id: "defenders", label: "Defenders" },
  { id: "venom", label: "Venom" },
  { id: "fantastic-four", label: "Fantastic Four" },
  { id: "daredevil-2003", label: "Daredevil (2003)" },
];

interface TimelineHeaderProps {
  currentUniverse: TimelineUniverse;
  activeFilterId: string;
  onFilterChange: (filterId: string) => void;
  enabledUniverses: Record<string, boolean>;
  onToggleUniverse: (universeKey: string, enabled: boolean) => void;
  doomsdayCanonOnly: boolean;
  onToggleDoomsdayCanon: (enabled: boolean) => void;
  showLegends?: boolean;
  onToggleLegends?: (enabled: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isLoggedIn: boolean;
  isOwner?: boolean;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onOpenAddMedia?: () => void;
  onSaveCanvas?: () => Promise<void>;
  isSavingCanvas?: boolean;
  hasUnsavedChanges?: boolean;
  onDeleteTimeline?: () => void;
}

export function TimelineHeader({
  currentUniverse,
  activeFilterId,
  onFilterChange,
  enabledUniverses,
  onToggleUniverse,
  doomsdayCanonOnly,
  onToggleDoomsdayCanon,
  showLegends = false,
  onToggleLegends,
  onZoomIn,
  onZoomOut,
  onFitView,
  isLoggedIn,
  isOwner = false,
  isEditMode = false,
  onToggleEditMode,
  onOpenAddMedia,
  onSaveCanvas,
  isSavingCanvas = false,
  hasUnsavedChanges = false,
  onDeleteTimeline,
}: TimelineHeaderProps) {
  const router = useRouter();
  const openAuth = useAuthModalStore((state) => state.open);

  const [filterOpen, setFilterOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch all accessible timelines from database
  const timelinesList = useQuery(api.timelines.listTimelines, {});

  const officialTimelines = timelinesList?.filter((t) => t.isOfficial) ?? [];
  const communityTimelines = timelinesList?.filter((t) => !t.isOfficial) ?? [];

  const isStarWars = currentUniverse.id === "star-wars";
  const isMcu = currentUniverse.id === "mcu";

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Timeline link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleOpenCreate = () => {
    if (!isLoggedIn) {
      openAuth();
      return;
    }
    setCreateModalOpen(true);
  };

  return (
    <>
      <div className="relative flex flex-col bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md z-20">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          {/* Left: Universe Switcher & Filter Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Select Timeline Universe"
                className="flex h-9 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 text-xs font-bold text-zinc-100 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-xs">{currentUniverse.shortName} Timeline</span>
                <ChevronDown className="h-3 w-3 text-zinc-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 bg-zinc-900 border-zinc-800 text-zinc-200 max-h-96 overflow-y-auto"
              >
                <DropdownMenuItem
                  onClick={() => router.push("/timeline")}
                  className="cursor-pointer py-2 text-zinc-200 font-bold hover:bg-zinc-800 flex items-center gap-2 border-b border-zinc-800/80 mb-1"
                >
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Explore All Timelines</span>
                </DropdownMenuItem>

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-3 py-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Official Timelines</span>
                  </DropdownMenuLabel>
                  {officialTimelines.map((universe) => (
                    <DropdownMenuItem
                      key={universe.id}
                      onClick={() => router.push(`/timeline/${universe.id}`)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer py-2 text-xs",
                        universe.id === currentUniverse.id && "bg-zinc-800/80 text-white font-semibold",
                      )}
                    >
                      <span className="truncate">{universe.name}</span>
                      {universe.id === currentUniverse.id && (
                        <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                {communityTimelines.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-3 py-1.5">
                        <Users className="h-3.5 w-3.5 text-purple-400" />
                        <span>Community Universes</span>
                      </DropdownMenuLabel>
                      {communityTimelines.map((universe) => (
                        <DropdownMenuItem
                          key={universe.id}
                          onClick={() => router.push(`/timeline/${universe.id}`)}
                          className={cn(
                            "flex items-center justify-between cursor-pointer py-2",
                            universe.id === currentUniverse.id && "bg-zinc-800/80 text-white font-semibold",
                          )}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">{universe.name}</p>
                            {universe.creatorUsername && (
                              <p className="text-[10px] text-zinc-400 truncate">by @{universe.creatorUsername}</p>
                            )}
                          </div>
                          {universe.id === currentUniverse.id && (
                            <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </>
                )}

                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleOpenCreate}
                  className="cursor-pointer py-2 text-primary font-bold hover:bg-primary/10 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Universe</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Segmented Control */}
            <div className="hidden lg:flex items-center gap-1 rounded-full bg-zinc-900/80 p-1 border border-zinc-800">
              {currentUniverse.filters.map((filter) => {
                const isActive = filter.id === activeFilterId;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                        : "text-zinc-300 hover:text-white",
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Title & Contextual Toggles (Queuebrick 1:1 UI) */}
          <div className="flex flex-col items-center justify-center gap-1 py-1">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
              {currentUniverse.shortName || currentUniverse.name} Timeline
            </h1>

            <div className="flex items-center gap-2">
              {/* Star Wars: Legends Toggle */}
              {isStarWars && (
                <div className="flex h-7 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 text-[11px] font-bold text-zinc-200 select-none">
                  <span className={cn(showLegends ? "text-amber-400" : "text-zinc-300")}>
                    Legends
                  </span>
                  <Switch
                    checked={showLegends}
                    onCheckedChange={(c) => onToggleLegends?.(c)}
                    size="sm"
                  />
                </div>
              )}

              {/* MCU: Universes Dropdown & Doomsday Canon Switch */}
              {isMcu && (
                <>
                  <Popover>
                    <PopoverTrigger
                      className="flex h-7 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 text-[11px] font-bold text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span>Universes</span>
                      <ChevronDown className="h-3 w-3 text-zinc-400 shrink-0" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      className="w-56 bg-zinc-950/95 border-zinc-800 p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-2.5"
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-1">
                        Toggle Universes
                      </div>
                      <div className="flex flex-col gap-2">
                        {UNIVERSES_LIST.map((univ) => {
                          const isChecked = enabledUniverses[univ.id] ?? true;
                          return (
                            <div
                              key={univ.id}
                              className="flex items-center justify-between gap-2 px-1 py-0.5"
                            >
                              <span className="text-xs text-zinc-200 font-medium">{univ.label}</span>
                              <Switch
                                checked={isChecked}
                                onCheckedChange={(checked) => onToggleUniverse(univ.id, checked)}
                                size="sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="flex h-7 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 text-[11px] font-bold text-zinc-200 select-none">
                    <span className={cn(doomsdayCanonOnly ? "text-amber-400" : "text-zinc-300")}>
                      Doomsday canon
                    </span>
                    <Switch
                      checked={doomsdayCanonOnly}
                      onCheckedChange={onToggleDoomsdayCanon}
                      size="sm"
                    />
                  </div>
                </>
              )}
            </div>

            <p className="text-[10px] text-zinc-500 font-normal tracking-wide hidden sm:block">
              Scroll or pinch to zoom
            </p>
          </div>

          {/* Right: Creator Controls & Zoom Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Creator Edit Mode Controls */}
            {isOwner && (
              <div className="flex items-center gap-1.5 mr-1">
                {!isEditMode ? (
                  <Button
                    size="sm"
                    onClick={onToggleEditMode}
                    className="h-8 gap-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Pencil className="h-3 w-3 text-amber-400" />
                    <span className="hidden sm:inline">Edit Canvas</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={onOpenAddMedia}
                      className="h-8 gap-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Plus className="h-3 w-3 text-emerald-400" />
                      <span>Add Media</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={onSaveCanvas}
                      disabled={isSavingCanvas}
                      className={cn(
                        "h-8 gap-1.5 rounded-full text-xs font-bold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        hasUnsavedChanges
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 animate-pulse"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
                      )}
                    >
                      {isSavingCanvas ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      <span>{hasUnsavedChanges ? "Save" : "Saved"}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onToggleEditMode}
                      className="h-8 rounded-full text-xs text-zinc-300 hover:text-white"
                    >
                      Done
                    </Button>
                  </>
                )}

                {onDeleteTimeline && !currentUniverse.isOfficial && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onDeleteTimeline}
                    aria-label="Delete Timeline"
                    className="h-8 w-8 rounded-full text-zinc-300 hover:text-red-400 hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}

            {/* Mobile Filter Menu */}
            <div className="lg:hidden">
              <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                <DropdownMenuTrigger
                  aria-label="Open Filter Menu"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200"
                >
                  {currentUniverse.filters.map((filter) => (
                    <DropdownMenuItem
                      key={filter.id}
                      onClick={() => onFilterChange(filter.id)}
                      className={cn(
                        "cursor-pointer text-xs",
                        filter.id === activeFilterId && "bg-zinc-800 text-white font-bold",
                      )}
                    >
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Zoom Controls */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onZoomOut}
              aria-label="Zoom Out Canvas"
              className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={onZoomIn}
              aria-label="Zoom In Canvas"
              className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={onFitView}
              aria-label="Fit Canvas to Screen"
              className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleShare}
              aria-label="Share Timeline Link"
              className="h-8 w-8 rounded-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Create Timeline Modal */}
      <CreateTimelineModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
