"use client";

import { useState, useEffect } from "react";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import { TimelineMediaItem, TimelineCanonType } from "@/types/timeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Plus, Film, Tv, Star, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMediaNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (mediaItem: TimelineMediaItem) => void;
}

const CANON_TYPES: { id: TimelineCanonType; label: string; desc: string }[] = [
  { id: "sacred", label: "Main Storyline / Sacred", desc: "Core in-universe canon events" },
  { id: "canon", label: "Canon Franchise", desc: "Official mainline entries" },
  { id: "spinoff", label: "Spin-Off & Side Stories", desc: "Related series and companion films" },
  { id: "multiverse", label: "Multiverse & Alternate", desc: "Parallel timeline / variant realities" },
  { id: "tva", label: "Outside Time / Special", desc: "Pocket dimensions & special realms" },
  { id: "legacy", label: "Legacy / Prequel Lore", desc: "Historical or non-canon legacy works" },
];

export function AddMediaNodeModal({ isOpen, onClose, onAddNode }: AddMediaNodeModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 350);
  const [searchResults, setSearchResults] = useState<TMDBMedia[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Selected media for configuration
  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [chronologicalYear, setChronologicalYear] = useState("");
  const [canonType, setCanonType] = useState<TimelineCanonType>("sacred");
  const [branchName, setBranchName] = useState("Main Timeline");
  const [phase, setPhase] = useState("");
  const [isAnchor, setIsAnchor] = useState(false);

  // Fetch search results from TMDB
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    searchMedia(debouncedQuery.trim(), "all", 1)
      .then((items) => {
        if (isMounted) {
          setSearchResults(items.slice(0, 10));
        }
      })
      .catch((err) => {
        console.error("Failed to search TMDB media:", err);
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // When a media item is selected, prefill configuration defaults
  const handleSelectMedia = (media: TMDBMedia) => {
    setSelectedMedia(media);
    const releaseYearStr = media.release_date
      ? media.release_date.substring(0, 4)
      : media.first_air_date
        ? media.first_air_date.substring(0, 4)
        : "TBA";
    setChronologicalYear(releaseYearStr);
  };

  const handleConfirmAdd = () => {
    if (!selectedMedia) return;

    const title = selectedMedia.title || selectedMedia.name || "Untitled";
    const releaseYear = selectedMedia.release_date
      ? selectedMedia.release_date.substring(0, 4)
      : selectedMedia.first_air_date
        ? selectedMedia.first_air_date.substring(0, 4)
        : "TBA";

    const mediaType = (selectedMedia.media_type === "tv" ? "tv" : "movie") as "movie" | "tv";
    const nodeItem: TimelineMediaItem = {
      id: `node-${mediaType}-${selectedMedia.id}-${Date.now()}`,
      tmdbId: selectedMedia.id,
      mediaType,
      title,
      releaseYear,
      chronologicalYear: chronologicalYear.trim() || releaseYear,
      posterPath: selectedMedia.poster_path || "",
      rating: selectedMedia.vote_average || 0,
      isAnchor,
      branchName: branchName.trim() || "Main Timeline",
      phase: phase.trim() || undefined,
      canonType,
      description: selectedMedia.overview || "",
    };

    onAddNode(nodeItem);
    onClose();
    // Reset state
    setSelectedMedia(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const imageBase = process.env.NEXT_PUBLIC_API_IMAGE_300 ?? "https://image.tmdb.org/t/p/w300";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100 rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Plus className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Canvas Editor</span>
          </div>
          <DialogTitle className="text-xl font-black text-white">
            Add Movie or Series to Timeline
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Search TMDB catalog to position a new media node on your interactive universe map.
          </DialogDescription>
        </DialogHeader>

        {!selectedMedia ? (
          /* Step 1: Search & Pick Media */
          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search TMDB for movies or TV series (e.g. Iron Man, Dune, Godzilla)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-10 bg-zinc-900 border-zinc-700 focus:border-primary text-white text-sm rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-primary"
              />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
              )}
            </div>

            {/* Results List */}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {searchResults.length > 0 ? (
                searchResults.map((media) => {
                  const mediaTitle = media.title || media.name || "Untitled";
                  const year = media.release_date
                    ? media.release_date.substring(0, 4)
                    : media.first_air_date
                      ? media.first_air_date.substring(0, 4)
                      : "TBA";
                  const posterUrl = media.poster_path
                    ? `${imageBase}${media.poster_path}`
                    : "/placeholder-poster.png";

                  return (
                    <div
                      key={`${media.media_type}-${media.id}`}
                      onClick={() => handleSelectMedia(media)}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={posterUrl}
                          alt={mediaTitle}
                          className="h-14 w-10 object-cover rounded-lg bg-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{mediaTitle}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-300 mt-0.5">
                            <span className="flex items-center gap-1">
                              {media.media_type === "tv" ? (
                                <Tv className="h-3.5 w-3.5 text-zinc-400" />
                              ) : (
                                <Film className="h-3.5 w-3.5 text-zinc-400" />
                              )}
                              <span>{year}</span>
                            </span>
                            {media.vote_average > 0 && (
                              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                <Star className="h-3 w-3 fill-amber-400" />
                                {media.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full text-xs h-9 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Select
                      </Button>
                    </div>
                  );
                })
              ) : searchQuery && !isSearching ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No media found matching &quot;{searchQuery}&quot;
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* Step 2: Configure Timeline Placement */
          <div className="mt-4 flex flex-col gap-4">
            {/* Selected Card Preview */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedMedia.poster_path
                      ? `${imageBase}${selectedMedia.poster_path}`
                      : "/placeholder-poster.png"
                  }
                  alt={selectedMedia.title || selectedMedia.name || "Poster"}
                  className="h-16 w-11 object-cover rounded-lg bg-zinc-800 shrink-0"
                />
                <div>
                  <h4 className="font-black text-sm text-white">
                    {selectedMedia.title || selectedMedia.name}
                  </h4>
                  <p className="text-xs text-zinc-300">
                    {selectedMedia.media_type === "tv" ? "TV Series" : "Movie"} · Release:{" "}
                    {selectedMedia.release_date || selectedMedia.first_air_date || "TBA"}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMedia(null)}
                className="text-xs text-zinc-300 hover:text-white"
              >
                Change
              </Button>
            </div>

            {/* In-Universe Configuration Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="node-chrono" className="text-xs font-bold text-zinc-200">
                  Chronological Year / Era <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="node-chrono"
                  placeholder="e.g. 1942–1945, 32 BBY, 2026"
                  value={chronologicalYear}
                  onChange={(e) => setChronologicalYear(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-xs rounded-xl h-10 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="node-branch" className="text-xs font-bold text-zinc-200">
                  Branch / Timeline Route Name
                </Label>
                <Input
                  id="node-branch"
                  placeholder="e.g. Sacred Timeline, Earth-838, Mandoverse"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-xs rounded-xl h-10 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Canon Type Picker */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-zinc-200">Canon Classification</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CANON_TYPES.map((type) => {
                  const isSelected = canonType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCanonType(type.id)}
                      className={cn(
                        "rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSelected
                          ? "bg-zinc-800 border-primary text-white font-bold"
                          : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:text-white",
                      )}
                    >
                      <p className="leading-tight font-bold">{type.label}</p>
                      <p className="text-[10px] text-zinc-400 font-normal mt-0.5 line-clamp-1">
                        {type.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phase & Anchor Controls */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex-1">
                <Label htmlFor="node-phase" className="text-xs font-bold text-zinc-200">
                  Phase / Saga Label (Optional)
                </Label>
                <Input
                  id="node-phase"
                  placeholder="e.g. Phase 1, Prequel Trilogy, Season 1"
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-xs rounded-xl h-10 mt-1 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="node-anchor"
                  checked={isAnchor}
                  onChange={(e) => setIsAnchor(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <label
                  htmlFor="node-anchor"
                  className="text-xs font-bold text-zinc-200 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-red-400" />
                  <span>Anchor / Key Event</span>
                </label>
              </div>
            </div>

            <DialogFooter className="mt-4 flex sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedMedia(null)}
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 rounded-full text-xs h-9 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Back to Search
              </Button>
              <Button
                type="button"
                onClick={handleConfirmAdd}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-xs h-9 px-5 cursor-pointer shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Add to Canvas
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
