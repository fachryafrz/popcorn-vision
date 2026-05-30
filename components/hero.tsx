"use client";

import { useState } from "react";
import { TMDBMedia, getGenreNames } from "@/lib/tmdb";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Plus, Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "N/A";
  const genres = getGenreNames(media.genre_ids).slice(0, 3);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const mediaLabel = media.media_type === "tv" ? "TV Series" : "Movie";

  return (
    <div className="relative w-full h-full flex items-end pb-16 px-6 sm:pb-24 sm:px-16 md:px-20">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      />
      {/* Black-out Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-black/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent hidden md:block z-10" />

      {/* Slide Content */}
      <div className="relative z-20 w-full max-w-5xl flex flex-col md:flex-row items-end gap-8 md:gap-10">
        <div
          onClick={() => onQuickView(media)}
          className="hidden md:block w-52 h-76 rounded-2xl overflow-hidden shadow-2xl shadow-black/85 cursor-pointer border border-zinc-700/30 transform hover:scale-102 transition-all duration-300 flex-shrink-0"
        >
          <img
            src={posterUrl}
            alt={media.title || media.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col items-start gap-4 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 border border-blue-400/40 text-white">
              {mediaLabel}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{rating} Rating</span>
            </div>
            <span className="text-zinc-400 text-sm font-medium">{releaseYear}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight line-clamp-2">
            {media.title || media.name}
          </h1>

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

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl drop-shadow line-clamp-3">
            {media.overview}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => onQuickView(media)}
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-6 py-6 sm:px-8 shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-98 flex items-center gap-2"
            >
              <Play className="h-5 w-5 fill-current" />
              View Details
            </Button>

            <Button
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className={cn(
                "rounded-full border font-semibold text-sm sm:text-base px-6 py-6 sm:px-8 transition-all hover:scale-105 active:scale-98 disabled:opacity-50",
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
    <div className="relative w-full h-[85vh] sm:h-screen bg-zinc-950 overflow-hidden select-none">
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
