"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TMDBMedia } from "@/lib/tmdb";
import { authClient } from "@/lib/auth-client";
import { Star, Plus, Check, Heart, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CardProps {
  media: TMDBMedia;
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
}

export default function Card({ media, onQuickView, onAuthRequired }: CardProps) {
  const router = useRouter();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Read favorite status from Convex
  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip"
  );

  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setFavoriteLoading(true);
    try {
      const mId = String(media.id);
      const mType = media.media_type || "movie";
      
      if (isFavorited) {
        await removeFromFavorites({ mediaId: mId, mediaType: mType });
      } else {
        await addToFavorites({
          mediaId: mId,
          mediaType: mType,
          title: media.title || media.name || "",
          posterPath: media.poster_path || "",
          rating: media.vote_average,
          releaseYear: media.release_date ? new Date(media.release_date).getFullYear().toString() : "N/A",
        });
      }
    } catch (error) {
      console.error("Favorite modification failed:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Read watchlist status from Convex
  const isWatchlisted = useQuery(
    api.watchlist.checkWatchlistItem,
    isLoggedIn
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip"
  );

  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setWatchlistLoading(true);
    try {
      const mId = String(media.id);
      const mType = media.media_type || "movie";
      
      if (isWatchlisted) {
        await removeFromWatchlist({ mediaId: mId, mediaType: mType });
      } else {
        await addToWatchlist({
          mediaId: mId,
          mediaType: mType,
          title: media.title || media.name || "",
          posterPath: media.poster_path || "",
          rating: media.vote_average,
          releaseYear: media.release_date ? new Date(media.release_date).getFullYear().toString() : "N/A",
        });
      }
    } catch (error) {
      console.error("Watchlist modification failed:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const posterPath = media.poster_path
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_300 || "https://image.tmdb.org/t/p/w300"}${media.poster_path}`
    : "/logo/popcorn.png";

  const rating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "N/A";
  const mediaLabel = media.media_type === "tv" ? "TV Series" : "Movie";

  return (
    <div
      onClick={() => router.push(`/${media.media_type || "movie"}/${media.id}`)}
      className="group relative w-full shrink-0 flex flex-col gap-3 cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-xl md:hover:shadow-black/40"
    >
      {/* Poster area */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900">
        
        {/* Poster image */}
        <img
          src={posterPath}
          alt={media.title || media.name}
          className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
          loading="lazy"
        />

        {/* Backdrop overlay */}
        <div className="absolute hidden md:block inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Content badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/30">
            {mediaLabel}
          </span>
        </div>

        {/* Floating action buttons on Hover */}
        <div className="absolute hidden inset-x-0 bottom-4 z-20 md:flex justify-center gap-2 px-3 opacity-0 transform translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {/* Watchlist Button */}
          <Button
            onClick={handleWatchlistClick}
            disabled={watchlistLoading}
            size="icon-sm"
            className={cn(
              "rounded-full border shadow-lg transition-all hover:scale-105 active:translate-y-px disabled:pointer-events-none cursor-pointer",
              isWatchlisted
                ? "bg-emerald-600/90 border-emerald-500 hover:bg-emerald-500 text-white"
                : "bg-black/60 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            )}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {watchlistLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : isWatchlisted ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>

          {/* Quick View Button */}
          <Button
            onClick={(e) => { e.stopPropagation(); onQuickView(media); }}
            size="icon-sm"
            className="rounded-full border shadow-lg transition-all hover:scale-105 active:translate-y-px disabled:pointer-events-none cursor-pointer bg-black/60 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Favorite Toggle Button */}
          <Button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            size="icon-sm"
            className={cn(
              "rounded-full border shadow-lg transition-all hover:scale-105 active:translate-y-px disabled:pointer-events-none cursor-pointer",
              isFavorited
                ? "bg-rose-600/90 border-rose-500 hover:bg-rose-500 text-white"
                : "bg-black/60 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            )}
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            {favoriteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
            )}
          </Button>
        </div>
      </div>

      {/* Metadata section */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-semibold text-sm line-clamp-1 text-white group-hover:text-blue-400 transition-colors">
          {media.title || media.name}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{releaseYear}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
            <span className="font-semibold text-zinc-200">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
