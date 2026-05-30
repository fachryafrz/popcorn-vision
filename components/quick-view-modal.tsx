"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { TMDBMedia } from "@/lib/tmdb";
import { getMediaDetails } from "@/lib/tmdb-actions";
import { Star, Clock, Calendar, Film, Loader2, Plus, Check, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthModalStore } from "@/lib/auth-modal-store";

interface MediaDetails {
  tagline?: string;
  runtime?: number;
  number_of_seasons?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
}

interface VideoItem {
  type: string;
  site: string;
  key: string;
}

interface CastItem {
  id: number;
  profile_path: string | null;
  name: string;
  character: string;
}

interface WatchProviders {
  US?: {
    flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
  };
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: TMDBMedia | null;
}

export default function QuickViewModal({ isOpen, onClose, media }: QuickViewModalProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [cast, setCast] = useState<CastItem[]>([]);
  const [providers, setProviders] = useState<WatchProviders>({});
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Watchlist status
  const isWatchlisted = useQuery(
    api.watchlist.checkWatchlistItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip"
  );
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  // Favorites status
  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip"
  );
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  useEffect(() => {
    if (!media) return;
    
    // Reset state asynchronously to prevent React cascading renders warning
    Promise.resolve().then(() => {
      setLoading(true);
      setDetails(null);
      setVideos([]);
      setCast([]);
      setProviders({});
      setLogoPath(null);
      setLogoError(false);
    });

    getMediaDetails(media.media_type || "movie", String(media.id)).then((data) => {
      if (data) {
        setDetails(data.details);
        setVideos(data.videos || []);
        setCast(data.credits?.cast?.slice(0, 5) || []);
        setProviders(data.watchProviders || {});
        setLogoPath(data.logoPath || null);
      }
      setLoading(false);
    });
  }, [media]);

  if (!media) return null;

  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "N/A";
  const voteRating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const backdropUrl = media.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
    : "/logo/popcorn.png";

  // YouTube trailer resolution
  const trailerVideo = videos?.find(
    (v: VideoItem) => v.type === "Trailer" && v.site === "YouTube"
  );
  const trailerKey = trailerVideo?.key || (videos?.[0]?.site === "YouTube" ? videos[0].key : null);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuth();
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
          rating: media.vote_average || 0,
          releaseYear: releaseYear.toString(),
        });
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuth();
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
          rating: media.vote_average || 0,
          releaseYear: releaseYear.toString(),
        });
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-7xl sm:max-w-7xl h-[85svh] sm:h-[80svh] md:h-[85svh] p-0 overflow-hidden bg-zinc-950 border border-zinc-800 text-white rounded-3xl shadow-2xl backdrop-blur-xl">
        <DialogTitle className="sr-only">Quick View: {media.title || media.name}</DialogTitle>
        <DialogDescription className="sr-only">Official trailer and details overview</DialogDescription>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">Loading details...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Left section: Trailer or Backdrop */}
            <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:h-full bg-black shrink-0 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-zinc-900">
              {trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  title="Official Trailer"
                  className="w-full h-full border-none"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-black/20 z-10" />
                  <div className="relative z-20 text-center px-4">
                    <Film className="h-12 w-12 text-zinc-500 mx-auto mb-2" />
                    <p className="text-zinc-400 text-sm font-semibold">No trailer video available</p>
                  </div>
                </>
              )}
            </div>

            {/* Right section: Detailed metadata */}
            <div className="grow md:h-full overflow-y-auto flex flex-col p-6 sm:p-8 space-y-6 scrollbar-thin">
              {/* Title Logo / Text */}
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 mb-3">
                  {media.media_type === "tv" ? "TV Series" : "Movie"}
                </span>
                {logoPath && !logoError ? (
                  <div className="h-16 sm:h-20 md:h-24 lg:h-28 max-w-[85%] relative mb-2 flex items-center">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${logoPath}`}
                      alt={media.title || media.name}
                      className="h-full w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {media.title || media.name}
                  </h2>
                )}
                {details?.tagline && (
                  <p className="text-zinc-500 italic mt-1.5 text-sm">&ldquo;{details.tagline}&rdquo;</p>
                )}
              </div>

              {/* Watchlist & Favorite Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  className={cn(
                    "rounded-full border font-semibold text-xs px-4 py-4 transition-all hover:scale-105 active:scale-98 disabled:opacity-50 cursor-pointer h-9",
                    isWatchlisted
                      ? "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white"
                      : "bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {watchlistLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isWatchlisted ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    {isWatchlisted ? "In Watchlist" : "Watchlist"}
                  </span>
                </Button>

                <Button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  className={cn(
                    "rounded-full border font-semibold text-xs px-4 py-4 transition-all hover:scale-105 active:scale-98 disabled:opacity-50 cursor-pointer h-9",
                    isFavorited
                      ? "bg-rose-600 border-rose-500 hover:bg-rose-500 text-white"
                      : "bg-black/40 border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {favoriteLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Heart className={cn("h-3.5 w-3.5", isFavorited && "fill-current")} />
                    )}
                    {isFavorited ? "Favorited" : "Favorite"}
                  </span>
                </Button>
              </div>

              {/* Metadata Indicators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-zinc-300 border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-white">{voteRating}</span>
                  <span className="text-zinc-500">({details?.vote_count || 0})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>{releaseYear}</span>
                </div>
                {details?.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span>{details.runtime} mins</span>
                  </div>
                )}
                {details?.number_of_seasons && (
                  <div className="flex items-center gap-1">
                    <Film className="h-4 w-4 text-zinc-400" />
                    <span>
                      {details.number_of_seasons} Season{details.number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Overview
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {media.overview || "No overview available."}
                </p>
              </div>

              {/* Cast Grid */}
              {cast.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                    Key Cast
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {cast.map((actor) => {
                      const actorPic = actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/logo/popcorn.png";
                      return (
                        <div key={actor.id} className="text-center flex flex-col items-center">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center border border-zinc-800 shadow-md mb-1.5"
                            style={{ backgroundImage: `url(${actorPic})` }}
                          />
                          <span className="text-[10px] font-semibold text-white truncate w-full">
                            {actor.name}
                          </span>
                          <span className="text-[9px] text-zinc-500 truncate w-full">
                            {actor.character}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Watch Providers */}
              {providers.US?.flatrate && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                    Streaming on (US)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {providers.US.flatrate.map((prov) => (
                      <div
                        key={prov.provider_id}
                        className="group relative flex h-9 w-9 overflow-hidden rounded-xl border border-zinc-850 bg-zinc-900"
                        title={prov.provider_name}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
                          alt={prov.provider_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
