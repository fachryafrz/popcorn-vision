"use client";

import { useState } from "react";
import { TMDBMedia, getGenreNames } from "@/lib/tmdb";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Plus, Check, Star, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useRouter } from "next/navigation";

interface HeroProps {
  items: TMDBMedia[];
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
}

interface HeroSlideProps {
  media: TMDBMedia;
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

// Subcomponent to optimize watchlist queries without re-rendering Swiper container
function HeroSlide({
  media,
  onQuickView,
  onAuthRequired,
  isLoggedIn,
}: HeroSlideProps) {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip",
  );

  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
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
          releaseYear: media.release_date
            ? new Date(media.release_date).getFullYear().toString()
            : "N/A",
        });
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const isWatchlisted = useQuery(
    api.watchlist.checkWatchlistItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip",
  );

  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
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
          releaseYear: media.release_date
            ? new Date(media.release_date).getFullYear().toString()
            : "N/A",
        });
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const backdropUrl = media.backdrop_path
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_ORIGINAL || "https://image.tmdb.org/t/p/original"}${media.backdrop_path}`
    : "/logo/popcorn.png";
  const posterUrl = media.poster_path
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_342 || "https://image.tmdb.org/t/p/w342"}${media.poster_path}`
    : "/logo/popcorn.png";
  const mobileBackdropUrl = media.textless_poster_path
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_780 || "https://image.tmdb.org/t/p/w780"}${media.textless_poster_path}`
    : posterUrl;
  const releaseYear = media.release_date
    ? new Date(media.release_date).getFullYear()
    : "N/A";
  const genres = getGenreNames(media.genre_ids).slice(0, 3);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const mediaLabel = media.media_type === "tv" ? "TV Series" : "Movie";

  const router = useRouter();

  return (
    <div className="relative flex h-full w-full items-end px-6 pb-16 sm:px-16 sm:pb-24 md:px-20">
      {/* Backdrop Image (Desktop) */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat transition-transform duration-700 sm:block"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      />
      {/* Poster Image as Backdrop (Mobile) */}
      <div
        className="absolute inset-0 block bg-cover bg-center bg-no-repeat transition-transform duration-700 sm:hidden"
        style={{
          backgroundImage: `url(${mobileBackdropUrl})`,
        }}
      />
      {/* Black-out Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-black/10" />
      <div className="absolute inset-0 z-10 hidden bg-linear-to-r from-zinc-950/80 via-transparent to-transparent md:block" />

      {/* Slide Content */}
      <div className="relative z-20 flex w-full max-w-5xl flex-col items-end gap-8 md:flex-row md:gap-10">
        <div
          onClick={() => onQuickView(media)}
          className="hidden h-76 w-52 shrink-0 transform cursor-pointer overflow-hidden rounded-2xl border border-zinc-700/30 shadow-2xl shadow-black/85 transition-all duration-300 hover:scale-102 lg:block"
        >
          <img
            src={posterUrl}
            alt={media.title || media.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-4 text-left">
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {media.logo_path && !logoError ? (
            <div className="relative mb-2 flex h-16 max-w-[85%] items-center sm:h-20 md:h-24 lg:h-28">
              <img
                src={`${process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500"}${media.logo_path}`}
                alt={media.title || media.name}
                className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <h1 className="line-clamp-2 text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
              {media.title || media.name}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-400/40 bg-blue-600/90 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
              {mediaLabel}
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span>{rating}</span>
            </div>
            <span className="text-sm font-medium text-zinc-400">
              {releaseYear}
            </span>
          </div>

          <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-zinc-300 drop-shadow md:text-base">
            {media.overview}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={() => router.push(`/${media.media_type}/${media.id}`)}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-6 py-6 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 active:scale-98 sm:px-8 sm:text-base"
            >
              <Play className="h-5 w-5 fill-current" />
              View Details
            </Button>

            <Button
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className={cn(
                "max-w-9 shrink-0 cursor-pointer rounded-full border p-3.5 text-sm font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50 sm:max-w-none sm:px-8 sm:py-6 sm:text-base",
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
                <span className="hidden sm:inline">
                  {isWatchlisted ? "In Watchlist" : "Watchlist"}
                </span>
              </span>
            </Button>

            <Button
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              className={cn(
                "max-w-9 shrink-0 cursor-pointer rounded-full border p-3.5 text-sm font-semibold transition-all hover:scale-105 active:scale-98 disabled:opacity-50 sm:max-w-none sm:px-8 sm:py-6 sm:text-base",
                isFavorited
                  ? "border-rose-500 bg-rose-600 text-white hover:bg-rose-500"
                  : "border-zinc-700 bg-black/40 text-zinc-300 hover:bg-zinc-900 hover:text-white",
              )}
            >
              <span className="flex items-center gap-1.5">
                {favoriteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={cn("h-5 w-5", isFavorited && "fill-current")}
                  />
                )}
                <span className="hidden sm:inline">
                  {isFavorited ? "Favorited" : "Favorite"}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({
  items,
  onQuickView,
  onAuthRequired,
}: HeroProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  if (!items || items.length === 0) return null;

  return (
    <div className="relative h-[90svh] w-full overflow-hidden bg-zinc-950 select-none sm:h-svh">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        loop
        className="swiper-hero h-full w-full"
      >
        {items.map((media) => (
          <SwiperSlide
            key={`${media.media_type}-${media.id}`}
            className="h-full w-full"
          >
            <HeroSlide
              media={media}
              onQuickView={onQuickView}
              onAuthRequired={onAuthRequired}
              isLoggedIn={isLoggedIn}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styles to match theme */}
      <style jsx global>{`
        .swiper-hero .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4) !important;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .swiper-hero .swiper-pagination-bullet-active {
          background: var(--primary) !important;
          width: 24px;
          border-radius: 4px;
        }
        .swiper-hero .swiper-pagination {
          bottom: 24px !important;
        }
      `}</style>
    </div>
  );
}
