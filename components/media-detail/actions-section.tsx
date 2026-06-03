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
  Users,
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
  onClickSharedWatchlist: () => void;
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
  onClickSharedWatchlist,
  watchHistory,
  scrollToPlayer,
}: ActionsSectionProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Button
        onClick={() => scrollToPlayer("watch")}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-6 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 active:scale-98 sm:px-8 sm:text-base"
      >
        <Play className="h-5 w-5 fill-current" />
        Play
      </Button>

      {trailerKey && (
        <Button
          onClick={() => scrollToPlayer("trailer")}
          className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-6 py-6 text-sm font-semibold text-zinc-300 transition-all hover:scale-105 hover:bg-zinc-800 hover:text-white active:scale-98 sm:px-8 sm:text-base"
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
          "rounded-full border px-5 py-6 text-sm font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50 sm:px-6 sm:text-base",
          isWatchlisted
            ? "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500"
            : "border-zinc-700 bg-black/40 text-zinc-300 hover:bg-zinc-900 hover:text-white",
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

      {/* Shared Watchlist Button */}
      <Button
        onClick={onClickSharedWatchlist}
        className="cursor-pointer rounded-full border border-zinc-700 bg-black/40 px-5 py-6 text-sm font-semibold text-zinc-300 transition-all hover:scale-105 hover:bg-zinc-900 hover:text-white active:scale-98 sm:px-6 sm:text-base"
      >
        <span className="flex items-center gap-1.5">
          <Users className="h-5 w-5" />
          Shared Watchlist
        </span>
      </Button>

      {/* Favorite Toggle */}
      <Button
        onClick={handleFavoriteToggle}
        disabled={favoriteLoading}
        className={cn(
          "rounded-full border px-5 py-6 text-sm font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50 sm:px-6 sm:text-base",
          isFavorited
            ? "border-rose-500 bg-rose-600 text-white hover:bg-rose-500"
            : "border-zinc-700 bg-black/40 text-zinc-300 hover:bg-zinc-900 hover:text-white",
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
        className="cursor-pointer rounded-full border border-zinc-700 bg-black/40 px-5 py-6 text-sm font-semibold text-zinc-300 transition-all hover:scale-105 hover:bg-zinc-900 hover:text-white active:scale-98 sm:px-6 sm:text-base"
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
        className="cursor-pointer rounded-full border border-zinc-700 bg-black/40 px-5 py-6 text-sm font-semibold text-zinc-300 transition-all hover:scale-105 hover:bg-zinc-900 hover:text-white active:scale-98 sm:px-6 sm:text-base"
      >
        <span className="flex items-center gap-1.5">
          <Send className="h-5 w-5" />
          Share
        </span>
      </Button>

      {/* Watch count capsule */}
      {watchHistory && watchHistory.watchCount > 0 && (
        <span className="flex h-fit items-center gap-1.5 rounded-full border border-emerald-900/30 bg-emerald-950/20 px-4 py-2.5 text-xs font-bold text-emerald-400 uppercase select-none">
          <Check className="h-4 w-4 stroke-3" />
          Watched {watchHistory.watchCount}{" "}
          {watchHistory.watchCount === 1 ? "time" : "times"}
        </span>
      )}
    </div>
  );
}
