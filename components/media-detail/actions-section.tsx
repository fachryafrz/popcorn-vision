import React from "react";
import {
  Play,
  Plus,
  Check,
  Heart,
  Loader2,
  Film,
  Calendar,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionsSectionProps {
  trailerKey: string | null;
  watchlistLoading: boolean;
  isWatchlisted: boolean | undefined;
  handleWatchlistToggle: (e: React.MouseEvent) => void;
  favoriteLoading: boolean;
  isFavorited: boolean | undefined;
  handleFavoriteToggle: (e: React.MouseEvent) => void;
  isLoggedIn: boolean;
  openAuth: () => void;
  setIsLogModalOpen: (open: boolean) => void;
  setIsShareDialogOpen: (open: boolean) => void;
  watchHistory: { watchCount: number } | null | undefined;
  scrollToPlayer: (tab: "trailer" | "watch") => void;
}

export default function ActionsSection({
  trailerKey,
  watchlistLoading,
  isWatchlisted,
  handleWatchlistToggle,
  favoriteLoading,
  isFavorited,
  handleFavoriteToggle,
  isLoggedIn,
  openAuth,
  setIsLogModalOpen,
  setIsShareDialogOpen,
  watchHistory,
  scrollToPlayer,
}: ActionsSectionProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <Button
        onClick={() => scrollToPlayer("watch")}
        className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-6 py-6 sm:px-8 transition-all hover:scale-105 active:scale-98 flex items-center gap-2"
      >
        <Play className="h-5 w-5 fill-current" />
        Play
      </Button>

      {trailerKey && (
        <Button
          onClick={() => scrollToPlayer("trailer")}
          className="rounded-full bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm sm:text-base px-6 py-6 sm:px-8 transition-all hover:scale-105 active:scale-98 flex items-center gap-2"
        >
          <Film className="h-5 w-5" />
          Trailer
        </Button>
      )}

      {/* Watchlist Toggle */}
      <Button
        onClick={handleWatchlistToggle}
        disabled={watchlistLoading}
        className={cn(
          "rounded-full border font-semibold text-sm sm:text-base px-5 py-6 sm:px-6 transition-all hover:scale-105 active:scale-98 disabled:opacity-50",
          isWatchlisted
            ? "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white"
            : "bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white"
        )}
      >
        <span className="flex items-center gap-1.5">
          {watchlistLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isWatchlisted ? (
            <Check className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          {isWatchlisted ? "In Watchlist" : "Watchlist"}
        </span>
      </Button>

      {/* Favorite Toggle */}
      <Button
        onClick={handleFavoriteToggle}
        disabled={favoriteLoading}
        className={cn(
          "rounded-full border font-semibold text-sm sm:text-base px-5 py-6 sm:px-6 transition-all hover:scale-105 active:scale-98 disabled:opacity-50",
          isFavorited
            ? "bg-rose-600 border-rose-500 hover:bg-rose-500 text-white"
            : "bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white"
        )}
      >
        <span className="flex items-center gap-1.5">
          {favoriteLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
          )}
          {isFavorited ? "Favorited" : "Favorite"}
        </span>
      </Button>

      {/* Log Watch Button */}
      <Button
        type="button"
        onClick={() => {
          if (!isLoggedIn) openAuth();
          else setIsLogModalOpen(true);
        }}
        className="rounded-full border font-semibold text-sm sm:text-base px-5 py-6 sm:px-6 transition-all hover:scale-105 active:scale-98 bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="h-5 w-5" />
          Log Watch
        </span>
      </Button>

      {/* Share Button */}
      <Button
        type="button"
        onClick={() => {
          if (!isLoggedIn) openAuth();
          else setIsShareDialogOpen(true);
        }}
        className="rounded-full border font-semibold text-sm sm:text-base px-5 py-6 sm:px-6 transition-all hover:scale-105 active:scale-98 bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Send className="h-5 w-5" />
          Share
        </span>
      </Button>

      {/* Watch count capsule */}
      {watchHistory && watchHistory.watchCount > 0 && (
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/20 px-4 py-2.5 rounded-full border border-emerald-900/30 uppercase select-none h-fit">
          <Check className="h-4 w-4 stroke-3" />
          Watched {watchHistory.watchCount} {watchHistory.watchCount === 1 ? "time" : "times"}
        </span>
      )}
    </div>
  );
}
