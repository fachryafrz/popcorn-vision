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
function HeroSlide({ media, onQuickView, onAuthRequired, isLoggedIn }: HeroSlideProps) {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && media
      ? { mediaId: String(media.id), mediaType: media.media_type || "movie" }
      : "skip"
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
          releaseYear: media.release_date ? new Date(media.release_date).getFullYear().toString() : "N/A",
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
      : "skip"
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
          releaseYear: media.release_date ? new Date(media.release_date).getFullYear().toString() : "N/A",
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
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_ORIGINAL || "https://image.tmdb.org/t/p/original"}${media.textless_poster_path}`
    : posterUrl;
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "N/A";
  const genres = getGenreNames(media.genre_ids).slice(0, 3);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const mediaLabel = media.media_type === "tv" ? "TV Series" : "Movie";

  const router = useRouter();

  return (
    <div className="relative w-full h-full flex items-end pb-16 px-6 sm:pb-24 sm:px-16 md:px-20">
      {/* Backdrop Image (Desktop) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hidden sm:block"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      />
      {/* Poster Image as Backdrop (Mobile) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 block sm:hidden"
        style={{
          backgroundImage: `url(${mobileBackdropUrl})`,
        }}
      />
      {/* Black-out Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-black/10 z-10" />
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-transparent to-transparent hidden md:block z-10" />

      {/* Slide Content */}
      <div className="relative z-20 w-full max-w-5xl flex flex-col md:flex-row items-end gap-8 md:gap-10">
        <div
          onClick={() => onQuickView(media)}
          className="hidden lg:block w-52 h-76 rounded-2xl overflow-hidden shadow-2xl shadow-black/85 cursor-pointer border border-zinc-700/30 transform hover:scale-102 transition-all duration-300 shrink-0"
        >
          <img
            src={posterUrl}
            alt={media.title || media.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col items-start gap-4 text-left">
        {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm text-zinc-300 text-xs font-semibold"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {media.logo_path && !logoError ? (
            <div className="h-16 sm:h-20 md:h-24 lg:h-28 max-w-[85%] relative mb-2 flex items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500"}${media.logo_path}`}
                alt={media.title || media.name}
                className="h-full w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight line-clamp-2">
              {media.title || media.name}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 border border-blue-400/40 text-white">
              {mediaLabel}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{rating}</span>
            </div>
            <span className="text-zinc-400 text-sm font-medium">{releaseYear}</span>
          </div>

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl drop-shadow line-clamp-3">
            {media.overview}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => router.push(`/${media.media_type}/${media.id}`)}
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-6 py-6 sm:px-8 transition-all hover:scale-105 active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <Play className="h-5 w-5 fill-current" />
              View Details
            </Button>

            <Button
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className={cn(
                "rounded-full border max-w-9 sm:max-w-none font-semibold text-sm sm:text-base p-3.5 sm:px-8 sm:py-6 transition-all hover:scale-105 active:scale-98 disabled:opacity-50 shrink-0 cursor-pointer",
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
                <span className="hidden sm:inline">{isWatchlisted ? "In Watchlist" : "Watchlist"}</span>
              </span>
            </Button>

            <Button
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              className={cn(
                "rounded-full border max-w-9 sm:max-w-none font-semibold text-sm sm:text-base p-3.5 sm:px-8 sm:py-6 transition-all hover:scale-105 active:scale-98 disabled:opacity-50 shrink-0 cursor-pointer",
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
                <span className="hidden sm:inline">{isFavorited ? "Favorited" : "Favorite"}</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ items, onQuickView, onAuthRequired }: HeroProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full h-[90svh] sm:h-svh bg-zinc-950 overflow-hidden select-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        loop
        className="w-full h-full swiper-hero"
      >
        {items.map((media) => (
          <SwiperSlide key={`${media.media_type}-${media.id}`} className="w-full h-full">
            <HeroSlide
              media={media}
              onQuickView={onQuickView}
              onAuthRequired={onAuthRequired}
              isLoggedIn={isLoggedIn}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom styles to match premium theme */}
      <style jsx global>{`
        .swiper-hero .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4) !important;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .swiper-hero .swiper-pagination-bullet-active {
          background: #3b82f6 !important;
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
