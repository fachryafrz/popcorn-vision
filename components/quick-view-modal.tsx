"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { TMDBMedia } from "@/lib/tmdb";
import { getMediaDetails } from "@/lib/tmdb-actions";
import {
  Star,
  Clock,
  Calendar,
  Film,
  Loader2,
  Plus,
  Check,
  Heart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import moment from "moment";

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
    flatrate?: {
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }[];
  };
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: TMDBMedia | null;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  media,
}: QuickViewModalProps) {
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
      : "skip",
  );
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  // Favorites status
  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip",
  );
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  // Community rating stats query
  const communityStats = useQuery(
    api.ratings.getCommunityRatingStats,
    media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip",
  );

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

    getMediaDetails(media.media_type || "movie", String(media.id)).then(
      (data) => {
        if (data) {
          setDetails(data.details);
          setVideos(data.videos || []);
          setCast(data.credits?.cast?.slice(0, 5) || []);
          setProviders(data.watchProviders || {});
          setLogoPath(data.logoPath || null);
        }
        setLoading(false);
      },
    );
  }, [media]);

  if (!media) return null;

  const releaseYear = media.release_date
    ? new Date(media.release_date).getFullYear()
    : "N/A";
  const voteRating = media.vote_average
    ? media.vote_average.toFixed(media.vote_average < 10 ? 1 : 0)
    : "0.0";
  const backdropUrl = media.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
    : "/logo/popcorn.png";

  // YouTube trailer resolution
  const trailerVideo = videos?.find(
    (v: VideoItem) => v.type === "Trailer" && v.site === "YouTube",
  );
  const trailerKey =
    trailerVideo?.key ||
    (videos?.[0]?.site === "YouTube" ? videos[0].key : null);

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

  const duration = moment.duration(details?.runtime, "minutes");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[85svh] w-[calc(100%-2rem)] max-w-7xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-0 text-white shadow-2xl backdrop-blur-xl sm:h-[80svh] sm:max-w-7xl md:h-[85svh]">
        <DialogTitle className="sr-only">
          Quick View: {media.title || media.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Official trailer and details overview
        </DialogDescription>

        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
            <p className="text-sm text-zinc-400">Loading details...</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left section: Trailer or Backdrop */}
            <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden border-b border-zinc-900 bg-black md:aspect-auto md:h-full md:w-3/5 md:border-r md:border-b-0">
              {trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  title="Official Trailer"
                  className="h-full w-full border-none"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 scale-105 bg-cover bg-center transition-all duration-500"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-black/20" />
                  <div className="relative z-20 px-4 text-center">
                    <Film className="mx-auto mb-2 h-12 w-12 text-zinc-500" />
                    <p className="text-sm font-semibold text-zinc-400">
                      No trailer video available
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right section: Detailed metadata */}
            <div className="flex grow scrollbar-thin flex-col space-y-6 overflow-y-auto p-6 sm:p-8 md:h-full">
              {/* Title Logo / Text */}
              <div>
                <span className="mb-3 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  {media.media_type === "tv" ? "TV Series" : "Movie"}
                </span>
                {logoPath && !logoError ? (
                  <div className="relative mb-2 flex h-16 max-w-[85%] items-center sm:h-20 md:h-24 lg:h-28">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${logoPath}`}
                      alt={media.title || media.name}
                      className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {media.title || media.name}
                  </h2>
                )}
                {details?.tagline && (
                  <p className="mt-1.5 text-sm text-zinc-500 italic">
                    &ldquo;{details.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Watchlist & Favorite Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  className={cn(
                    "h-9 cursor-pointer rounded-full border px-4 py-4 text-xs font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50",
                    isWatchlisted
                      ? "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-500"
                      : "border-zinc-700 bg-black/40 text-zinc-300 hover:bg-zinc-900 hover:text-white",
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
                    "h-9 cursor-pointer rounded-full border px-4 py-4 text-xs font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50",
                    isFavorited
                      ? "border-rose-500 bg-rose-600 text-white hover:bg-rose-500"
                      : "border-zinc-700 bg-black/40 text-zinc-300 hover:bg-zinc-900 hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {favoriteLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Heart
                        className={cn(
                          "h-3.5 w-3.5",
                          isFavorited && "fill-current",
                        )}
                      />
                    )}
                    {isFavorited ? "Favorited" : "Favorite"}
                  </span>
                </Button>
              </div>

              {/* Metadata Indicators */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-900 pb-4 text-sm text-zinc-300">
                {(() => {
                  const hasCommunity =
                    communityStats && communityStats.totalRatings > 0;
                  const displayRating = hasCommunity
                    ? communityStats.averageRating.toFixed(
                        communityStats.averageRating < 10 ? 1 : 0,
                      )
                    : voteRating;
                  const sourceLabel = hasCommunity ? "Community" : "TMDB";
                  const ratingCount = hasCommunity
                    ? communityStats.totalRatings
                    : details?.vote_count || 0;
                  return (
                    <>
                      <div
                        className="flex items-center gap-1.5"
                        title={`${sourceLabel} Rating`}
                      >
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="font-semibold text-white">
                          {displayRating}
                        </span>
                        <span className="text-xs font-semibold text-zinc-500">
                          ({ratingCount}{" "}
                          {hasCommunity
                            ? `rating${communityStats.totalRatings !== 1 ? "s" : ""}`
                            : "votes"}
                          )
                        </span>
                        <span className="border-zinc-850 ml-1 rounded-full border bg-zinc-900 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-zinc-400 uppercase">
                          {sourceLabel}
                        </span>
                      </div>
                      {hasCommunity && (
                        <div
                          className="border-zinc-850 rounded-full border bg-zinc-900/40 px-2.5 py-0.5 text-xs font-medium text-zinc-500"
                          title="TMDB reference rating"
                        >
                          TMDB Ref: {voteRating}
                        </div>
                      )}
                    </>
                  );
                })()}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>{releaseYear}</span>
                </div>
                {details?.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span>
                      {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
                      {duration.minutes() > 0 ? `${duration.minutes()}m` : ""}
                    </span>
                  </div>
                )}
                {details?.number_of_seasons && (
                  <div className="flex items-center gap-1">
                    <Film className="h-4 w-4 text-zinc-400" />
                    <span>
                      {details.number_of_seasons} Season
                      {details.number_of_seasons > 1 ? "s" : ""}
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
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Overview
                </h4>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {media.overview || "No overview available."}
                </p>
              </div>

              {/* Cast Grid */}
              {cast.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                    Key Cast
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {cast.map((actor) => {
                      const actorPic = actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/logo/popcorn.png";
                      return (
                        <div
                          key={actor.id}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className="mb-1.5 h-10 w-10 rounded-full border border-zinc-800 bg-cover bg-center shadow-md sm:h-12 sm:w-12"
                            style={{ backgroundImage: `url(${actorPic})` }}
                          />
                          <span className="w-full truncate text-[10px] font-semibold text-white">
                            {actor.name}
                          </span>
                          <span className="w-full truncate text-[9px] text-zinc-500">
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
                  <h4 className="mb-2.5 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                    Streaming on (US)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {providers.US.flatrate.map((prov) => (
                      <div
                        key={prov.provider_id}
                        className="group border-zinc-850 relative flex h-9 w-9 overflow-hidden rounded-xl border bg-zinc-900"
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
