"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { TMDBMedia } from "@/lib/tmdb";
import { streamingProviderList } from "@/lib/streamingProviderList";
import {
  Play,
  Plus,
  Check,
  Heart,
  Star,
  Clock,
  Film,
  Server,
  Loader2,
  Tv,
  TrendingUp,
  Calendar,
  Send,
  Users,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Carousel from "./carousel";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "./quick-view-modal";
import CommentsSection from "@/components/comments-section";
import LogWatchModal from "./log-watch-modal";
import { getCollectionDetails, getSeasonDetails } from "@/lib/tmdb-actions";
import RegionSelect from "@/components/region-select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import moment from "moment";
import { FreeMode, Mousewheel } from "swiper/modules";

interface CastItem {
  id: number;
  profile_path: string | null;
  name: string;
  character: string;
}

interface VideoItem {
  type: string;
  site: string;
  key: string;
}

interface ProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface ProductionCompany {
  name: string;
}

interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  name: string;
  poster_path: string | null;
  air_date: string | null;
}

interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  production_companies?: ProductionCompany[];
  belongs_to_collection?: { id: number; name: string; poster_path: string; backdrop_path: string } | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

interface RegionalRelease {
  iso_3166_1: string;
  release_dates: { certification: string; release_date: string }[];
}

interface RegionalContentRating {
  iso_3166_1: string;
  rating: string;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
}

interface SeasonDetails {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

interface CollectionPart {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
}

interface MediaDetailClientProps {
  mediaType: "movie" | "tv";
  initialData: {
    details: MediaDetails;
    credits?: { cast?: CastItem[] };
    videos?: VideoItem[];
    watchProviders?: Record<string, { flatrate?: ProviderItem[] }>;
    logoPath?: string | null;
    textlessPosterPath?: string | null;
    recommendations?: TMDBMedia[];
    regionalData?: (RegionalRelease | RegionalContentRating)[];
  };
}

// Map full country name string from profile/settings to ISO 2-letter code for TMDB
const countryNameToCode: Record<string, string> = {
  "United States": "US",
  "Indonesia": "ID",
  "Japan": "JP",
  "South Korea": "KR",
  "United Kingdom": "GB",
  "Canada": "CA",
  "Australia": "AU",
  "Germany": "DE",
  "France": "FR",
  "Singapore": "SG",
  "India": "IN",
  "Brazil": "BR",
  "Mexico": "MX",
};

export default function MediaDetailClient({ mediaType, initialData }: MediaDetailClientProps) {
  const router = useRouter();
  const details = initialData.details;
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  // Global auth store & Scroll refs
  const openAuth = useAuthModalStore((state) => state.open);
  const playerSectionRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const seasonDetailsRef = useRef<HTMLDivElement>(null);

  // Logo render error state
  const [logoError, setLogoError] = useState(false);

  // Player tabs & selections
  const [activeTab, setActiveTab] = useState<"trailer" | "watch">("trailer");
  const [selectedServer, setSelectedServer] = useState<number>(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  const [selectedRegion, setSelectedRegion] = useState("US");

  // Query current user profile to read country preference
  const convexProfile = useQuery(api.users.getCurrentUser, isLoggedIn ? {} : "skip");

  // Automatic region detection
  useEffect(() => {
    // 1. Prioritize user profile country preference if set
    if (convexProfile?.country) {
      const mappedCode = countryNameToCode[convexProfile.country] || convexProfile.country;
      Promise.resolve().then(() => {
        setSelectedRegion(mappedCode);
      });
      return;
    }

    // 2. Fall back to browser locales detection
    if (typeof window !== "undefined") {
      const locale = navigator.language || (navigator.languages && navigator.languages[0]);
      if (locale) {
        const parts = locale.split("-");
        const detectedRegion = parts[1] ? parts[1].toUpperCase() : parts[0].toUpperCase();
        const supported = ["US", "ID", "JP", "KR", "GB"];
        if (supported.includes(detectedRegion)) {
          Promise.resolve().then(() => {
            setSelectedRegion(detectedRegion);
          });
        } else if (initialData.watchProviders && detectedRegion in initialData.watchProviders) {
          Promise.resolve().then(() => {
            setSelectedRegion(detectedRegion);
          });
        } else {
          Promise.resolve().then(() => {
            setSelectedRegion("US");
          });
        }
      }
    }
  }, [initialData.watchProviders, convexProfile]);

  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!backdropRef.current) return;
      const scrollOffset = window.scrollY;
      backdropRef.current.style.transform = `translate3d(0, ${scrollOffset * 0.35}px, 0) scale(1.02)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [collectionParts, setCollectionParts] = useState<CollectionPart[]>([]);

  // Fetch movie collection items if available
  useEffect(() => {
    if (mediaType === "movie" && details?.belongs_to_collection?.id) {
      getCollectionDetails(details.belongs_to_collection.id).then((data) => {
        if (data && data.parts) {
          const sortedParts = (data.parts as CollectionPart[]).sort((a, b) => {
            const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
            const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
            return dateA - dateB;
          });
          setCollectionParts(sortedParts);
        }
      });
    }
  }, [mediaType, details?.belongs_to_collection?.id]);

  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [seasonDetailsLoading, setSeasonDetailsLoading] = useState(false);
  const [activeSeasonData, setActiveSeasonData] = useState<SeasonDetails | null>(null);

  const handleSeasonClick = (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      setActiveSeasonData(null);
    } else {
      setExpandedSeason(seasonNumber);
      setSeasonDetailsLoading(true);
      setActiveSeasonData(null);
      
      // Initial scroll to the season section as soon as it begins loading
      setTimeout(() => {
        seasonDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      getSeasonDetails(details.id, seasonNumber).then((data) => {
        if (data) {
          setActiveSeasonData(data as SeasonDetails);
          // Re-scroll once actual episodes list loads and changes heights
          setTimeout(() => {
            seasonDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
        setSeasonDetailsLoading(false);
      });
    }
  };

  // Convex watchlist mutations/queries
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const isWatchlisted = useQuery(
    api.watchlist.checkWatchlistItem,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip"
  );
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  // Convex favorites mutations/queries
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip"
  );
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  // Convex rating mutations/queries
  const userRating = useQuery(
    api.ratings.getUserRating,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip"
  );
  const communityStats = useQuery(
    api.ratings.getCommunityRatingStats,
    initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip"
  );
  const rateMedia = useMutation(api.ratings.rateMedia);
  const deleteRating = useMutation(api.ratings.deleteRating);

  // Convex diary history queries/mutations
  const watchHistory = useQuery(
    api.diary.getMediaWatchHistory,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip"
  );
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const chatsList = useQuery(api.chats.getChatsList, isLoggedIn ? {} : "skip");
  const sendChatMessage = useMutation(api.chats.sendMessage);

  const handleShareToChat = async (chatId: string, chatTitle: string) => {
    try {
      await sendChatMessage({
        chatId: chatId as Id<"chats">,
        content: `Recommended ${mediaType === "movie" ? "movie" : "TV show"}: ${details.title || details.name}`,
        attachmentType: "media",
        sharedMediaId: String(details.id),
        sharedMediaType: mediaType,
        sharedMediaTitle: details.title || details.name || "",
        sharedMediaPoster: details.poster_path || "",
        sharedMediaRating: details.vote_average || 0,
        sharedMediaYear: releaseYear.toString(),
      });
      setIsShareDialogOpen(false);
      toast.success(`Shared "${details.title || details.name}" to ${chatTitle}!`);
    } catch {
      toast.error("Failed to share title");
    }
  };

  const cast = initialData.credits?.cast?.slice(0, 15) || [];
  const recommendations = initialData.recommendations || [];
  const providers = initialData.watchProviders?.[selectedRegion]?.flatrate || [];

  // YouTube trailer resolution
  const trailerVideo = initialData.videos?.find(
    (v: VideoItem) => v.type === "Trailer" && v.site === "YouTube"
  );
  const trailerKey = trailerVideo?.key || (initialData.videos?.[0]?.site === "YouTube" ? initialData.videos[0].key : null);

  // Streaming server sources
  const servers = streamingProviderList({
    media_type: mediaType,
    id: String(details?.id),
    season,
    episode,
  });

  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "0.0";

  // Find regional release date and content certification
  const regionalReleaseInfo = (() => {
    if (mediaType !== "movie" || !initialData.regionalData) return null;
    const movieReleaseData = initialData.regionalData as RegionalRelease[];
    const regionRelease = movieReleaseData.find(
      (r) => r.iso_3166_1 === selectedRegion
    );
    if (!regionRelease || !regionRelease.release_dates || regionRelease.release_dates.length === 0) {
      const usRelease = movieReleaseData.find((r) => r.iso_3166_1 === "US");
      return usRelease?.release_dates?.[0] || null;
    }
    return regionRelease.release_dates[0];
  })();

  const certification = (() => {
    if (mediaType === "movie") {
      return regionalReleaseInfo?.certification || null;
    } else {
      if (!initialData.regionalData) return null;
      const tvRatingsData = initialData.regionalData as RegionalContentRating[];
      const regionRating = tvRatingsData.find(
        (r) => r.iso_3166_1 === selectedRegion
      );
      if (!regionRating) {
        const usRating = tvRatingsData.find((r) => r.iso_3166_1 === "US");
        return usRating?.rating || null;
      }
      return regionRating.rating || null;
    }
  })();

  const regionalReleaseDate = (() => {
    if (mediaType === "movie") {
      return regionalReleaseInfo?.release_date || details?.release_date || "";
    } else {
      return details?.first_air_date || "";
    }
  })();

  const releaseDate = regionalReleaseDate;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const runtime = details?.runtime || (details?.episode_run_time?.[0]) || null;

  // Format currency helpers based on active region
  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";

    let currency = "USD";
    let exchangeRate = 1;
    let locale = "en-US";

    if (selectedRegion === "ID") {
      currency = "IDR";
      exchangeRate = 17800;
      locale = "id-ID";
    } else if (selectedRegion === "JP") {
      currency = "JPY";
      exchangeRate = 159;
      locale = "ja-JP";
    } else if (selectedRegion === "KR") {
      currency = "KRW";
      exchangeRate = 1507;
      locale = "ko-KR";
    } else if (selectedRegion === "GB") {
      currency = "GBP";
      exchangeRate = 0.74;
      locale = "en-GB";
    }

    const convertedAmount = amount * exchangeRate;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(convertedAmount);
  };

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuth();
      return;
    }
    setWatchlistLoading(true);
    try {
      const mId = String(details.id);
      if (isWatchlisted) {
        await removeFromWatchlist({ mediaId: mId, mediaType });
      } else {
        await addToWatchlist({
          mediaId: mId,
          mediaType,
          title: details.title || details.name || "",
          posterPath: details.poster_path || "",
          rating: details.vote_average || 0,
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
      const mId = String(details.id);
      if (isFavorited) {
        await removeFromFavorites({ mediaId: mId, mediaType });
      } else {
        await addToFavorites({
          mediaId: mId,
          mediaType,
          title: details.title || details.name || "",
          posterPath: details.poster_path || "",
          rating: details.vote_average || 0,
          releaseYear: releaseYear.toString(),
        });
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const scrollToPlayer = (tab: "trailer" | "watch") => {
    setActiveTab(tab);
    setTimeout(() => {
      playerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleQuickView = (media: TMDBMedia) => {
    setQuickViewMedia(media);
  };

  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : "/logo/popcorn.png";

  const posterUrl = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/logo/popcorn.png";

  const mobileBackdropUrl = initialData.textlessPosterPath
    ? `https://image.tmdb.org/t/p/w780${initialData.textlessPosterPath}`
    : posterUrl;

  const duration = moment.duration(runtime, "minutes");


  return (
    <div className="min-h-svh bg-background text-foreground select-none transition-colors duration-300">
      {/* Hero Header Section - Stacked Backdrop */}
      <div className="relative w-full h-[65svh] overflow-hidden">
        {/* Backdrop Background (Desktop) */}
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-cover bg-top bg-no-repeat scale-102 hidden sm:block"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        {/* Poster Background (Mobile) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-102 block sm:hidden"
          style={{ backgroundImage: `url(${mobileBackdropUrl})` }}
        />
        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent z-10" />
      </div>

      {/* Content Container - Shifted Upwards to Overlap Backdrop */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 md:px-20 -mt-24 sm:-mt-36 md:-mt-44 flex flex-col md:flex-row items-start gap-8 md:gap-12">
        {/* Large Poster Sidebar */}
        <div className="hidden md:block w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/85 border border-zinc-850 bg-zinc-900/60 backdrop-blur-md transform hover:scale-102 transition-all duration-300 shrink-0">
          <img
            src={posterUrl}
            alt={details?.title || details?.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details Header Details */}
        <div className="flex-1 flex flex-col items-start gap-4 text-left">          
          {/* Genre Badges */}
          {details?.genres && details.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {details.genres.map((g: { id: number; name: string }) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm text-zinc-300 text-xs font-semibold"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Logo or Title */}
          {initialData.logoPath && !logoError ? (
            <div className="h-16 sm:h-24 md:h-28 max-w-[85%] relative mb-2 flex items-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${initialData.logoPath}`}
                alt={details?.title || details?.name}
                className="h-full w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight line-clamp-2">
              {details?.title || details?.name}
            </h1>
          )}

          {details?.tagline && (
            <p className="text-zinc-400 italic text-sm sm:text-base -mt-1">
              &ldquo;{details.tagline}&rdquo;
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 border border-blue-400/30 text-white">
            {mediaType === "tv" ? "TV Series" : "Movie"}
            </span>
            {certification && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                Rating: {certification}
              </span>
            )}
            {(() => {
              const hasCommunity = communityStats && communityStats.totalRatings > 0;
              const displayRating = hasCommunity ? communityStats.averageRating.toFixed(1) : rating;
              const sourceLabel = hasCommunity ? "Community" : "TMDB";
              return (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{displayRating}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider ml-1">({sourceLabel})</span>
                  </div>
                  {hasCommunity && (
                    <span className="text-zinc-500 text-xs font-medium bg-zinc-900/40 border border-zinc-850 px-3 py-1 rounded-full">
                      TMDB: {rating}
                    </span>
                  )}
                </>
              );
            })()}
            <span className="text-zinc-400 text-sm font-medium">{releaseYear}</span>
            {runtime && (
              <div className="flex items-center gap-1 text-zinc-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
                  {duration.minutes() > 0 ? `${duration.minutes()}m` : ""}
                </span>
              </div>
            )}
          </div>

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-3xl drop-shadow line-clamp-3 mt-2">
            {details?.overview || "No overview available."}
          </p>

          {/* Action Buttons */}
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

          {/* Star Rating Picker Section */}
          <div className="mt-6 flex flex-col gap-2 bg-zinc-900/10 max-w-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <span>{userRating ? "Your Rating" : "Rate this title"}</span>
              {userRating && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await deleteRating({ mediaId: String(details.id), mediaType });
                      toast.success("Rating cleared successfully!");
                    } catch (err) {
                      console.error("Clear rating failed:", err);
                      toast.error("Failed to clear rating");
                    }
                  }}
                  className="text-red-400 hover:text-red-300 font-bold tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, starIndex) => {
                  const starPosition = starIndex + 1;
                  const leftValue = starPosition * 2 - 1;
                  const rightValue = starPosition * 2;
                  
                  const handleRate = async (starValue: number) => {
                    if (!isLoggedIn) {
                      openAuth();
                      return;
                    }
                    try {
                      await rateMedia({
                        mediaId: String(details.id),
                        mediaType,
                        title: details.title || details.name || "",
                        posterPath: details.poster_path || "",
                        rating: starValue,
                        releaseYear: releaseYear.toString(),
                      });
                      toast.success(`Rated ${starValue / 2} stars successfully!`);
                    } catch (err) {
                      console.error("Rating failed:", err);
                      toast.error("Failed to submit rating");
                    }
                  };

                  return (
                    <div className="relative hover:scale-110 transition-transform duration-100" key={starIndex}>
                      {/* Base Empty Star */}
                      <Star className="h-6 w-6 text-zinc-700" />
                      
                      {/* Half Filled Overlay */}
                      {userRating === leftValue && (
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden pointer-events-none">
                          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                      
                      {/* Fully Filled Overlay */}
                      {userRating! >= rightValue && (
                        <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
                          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                      
                      {/* Hover/Click Areas */}
                      <div className="absolute inset-0 flex">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRate(leftValue);
                          }}
                          className="w-1/2 h-full cursor-pointer"
                          title={`Rate ${leftValue / 2} stars`}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRate(rightValue);
                          }}
                          className="w-1/2 h-full cursor-pointer"
                          title={`Rate ${rightValue / 2} stars`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-sm font-black text-white ml-2 bg-zinc-900/60 px-2 py-0.5 rounded-md border border-zinc-800">
                {userRating ? `${userRating / 2} / 5` : "_ / 5"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-16">
        {/* Video Player Area */}
        <div
          ref={playerSectionRef}
          className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/20 backdrop-blur-md shadow-2xl animate-in fade-in duration-700 scroll-mt-28"
        >
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-zinc-900/60 border-b border-zinc-800/80 text-sm">
            {/* Tabs */}
            <div className="flex gap-4">
              {trailerKey && (
                <button
                  onClick={() => setActiveTab("trailer")}
                  className={`text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeTab === "trailer"
                      ? "text-blue-500 border-blue-500"
                      : "text-zinc-400 border-transparent hover:text-white"
                  }`}
                >
                  Trailer
                </button>
              )}
              <button
                onClick={() => setActiveTab("watch")}
                className={`text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === "watch"
                    ? "text-blue-500 border-blue-500"
                    : "text-zinc-400 border-transparent hover:text-white"
                }`}
              >
                Watch {mediaType === "tv" ? "TV Show" : "Movie"}
              </button>
            </div>
          </div>

          {/* Video Player Display Layout */}
          {activeTab === "trailer" ? (
            <div className="w-full aspect-video bg-black relative flex items-center justify-center">
              {trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                  title="Official Trailer"
                  className="w-full h-full border-none"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="text-center text-zinc-500 flex flex-col items-center gap-2">
                  <Film className="h-10 w-10 text-zinc-700" />
                  <p className="text-sm font-semibold">No trailer video found on YouTube.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row w-full bg-zinc-950 overflow-hidden">
              {/* Player Frame */}
              <div className="w-full lg:w-2/3 aspect-video lg:aspect-auto lg:h-[60svh] bg-black">
                <iframe
                  src={servers[selectedServer]?.source}
                  title="Streaming Player"
                  className="w-full h-full border-none"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>

              {/* Servers & Episode selectors (Right Sidebar) */}
              <div className="w-full lg:w-1/3 p-6 bg-zinc-900/40 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col gap-5 overflow-y-auto lg:max-h-[60svh] scrollbar-thin">
                {/* TV Episode Selector */}
                {mediaType === "tv" && details && (
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850/80 space-y-3 shadow-inner">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Tv className="h-3.5 w-3.5 text-blue-400" />
                      Episode Navigation
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Season</span>
                        <Select
                          value={String(season)}
                          onValueChange={(val) => {
                            setSeason(Number(val));
                            setEpisode(1);
                          }}
                        >
                          <SelectTrigger className="w-full bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white text-xs h-8 rounded-lg px-2.5 shadow-none focus:border-blue-500">
                            <SelectValue placeholder="Select Season" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg">
                            <SelectGroup>
                              {Array.from({ length: details?.number_of_seasons || 1 }).map((_, i) => (
                                <SelectItem key={i} value={String(i + 1)} className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white hover:text-white text-xs">
                                  Season {i + 1}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Episode</span>
                        <Select
                          value={String(episode)}
                          onValueChange={(val) => setEpisode(Number(val))}
                        >
                          <SelectTrigger className="w-full bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white text-xs h-8 rounded-lg px-2.5 shadow-none focus:border-blue-500">
                            <SelectValue placeholder="Select Episode" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg">
                            <SelectGroup>
                              {Array.from({
                                length:
                                  details?.seasons?.find((s: Season) => s.season_number === season)
                                    ?.episode_count || 10,
                              }).map((_, i) => (
                                <SelectItem key={i} value={String(i + 1)} className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white hover:text-white text-xs">
                                  Episode {i + 1}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Server Selection Buttons */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                    <Server className="h-3.5 w-3.5 text-blue-400" />
                    Select Streaming Server
                  </h4>

                  <div className="flex flex-col gap-2">
                    {servers.map((serv: { title: string; source: string; recommended?: boolean; fast?: boolean; ads?: boolean }, index: number) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedServer(index)}
                        variant="ghost"
                        className={cn(
                          "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group/btn cursor-pointer hover:bg-zinc-800/40 h-auto font-normal",
                          selectedServer === index
                            ? "bg-blue-600/10 border-blue-500 text-white hover:bg-blue-600/20"
                            : "bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Play className={cn(
                            "h-3.5 w-3.5 transition-transform group-hover/btn:scale-110",
                            selectedServer === index ? "text-blue-400 fill-blue-500/20" : "text-zinc-500"
                          )} />
                          <div>
                            <p className="font-semibold text-[11px] leading-tight text-left">{serv.title}</p>
                            <p className="text-[9px] text-zinc-500 mt-0.5 text-left">
                              {serv.fast ? "Fast Server • " : ""}
                              {serv.ads ? "Contains Ads" : "No Ads"}
                            </p>
                          </div>
                        </div>
                        {serv.recommended && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner underneath */}
          <div className="p-4 bg-zinc-900/40 text-center text-xs text-zinc-400 border-t border-zinc-800/80">
            {activeTab === "watch"
              ? "Tip: Enable an ad-blocker extension in your browser to prevent popup ads from third-party streaming providers."
              : "Now displaying the official trailer. Click 'Watch Movie/Show' to stream."}
          </div>
        </div>

        {/* Cast List Slider */}
        {cast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Tv className="h-5 w-5 text-blue-500" />
              Key Cast & Characters
            </h2>
            <div className="w-full relative swiper-cast-container">
              <Swiper
                freeMode={true}
                modules={[Mousewheel, FreeMode]}
                spaceBetween={16}
                slidesPerView={3}
                breakpoints={{
                  480: { slidesPerView: 4, spaceBetween: 16 },
                  640: { slidesPerView: 5, spaceBetween: 20 },
                  768: { slidesPerView: 6, spaceBetween: 20 },
                  1024: { slidesPerView: 8, spaceBetween: 24 },
                  1280: { slidesPerView: 10, spaceBetween: 24 },
                }}
                mousewheel={{
                  forceToAxis: true,
                }}
                className="w-full pb-4"
              >
                {cast.map((actor) => {
                  const actorPic = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "/logo/popcorn.png";
                  return (
                    <SwiperSlide key={actor.id} className="py-1">
                      <div className="flex flex-col items-center text-center w-full">
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cover bg-center border-2 border-zinc-800 shadow-md mb-2 bg-zinc-900"
                          style={{ backgroundImage: `url(${actorPic})` }}
                        />
                        <span className="text-xs font-semibold text-white truncate w-full">
                          {actor.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate w-full mt-0.5">
                          {actor.character}
                        </span>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Overview</h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {details?.overview || "No overview details available."}
              </p>
            </div>

            {details?.production_companies && details.production_companies.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Production Companies
                </h3>
                <p className="text-sm text-zinc-300">
                  {details.production_companies.map((c: ProductionCompany) => c.name).join(", ")}
                </p>
              </div>
            )}

            {mediaType === "movie" && collectionParts.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800/40">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Movies in this Collection
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {collectionParts.map((part) => {
                    const posterUrl = part.poster_path
                      ? `https://image.tmdb.org/t/p/w185${part.poster_path}`
                      : "/logo/popcorn.png";
                    const year = part.release_date ? new Date(part.release_date).getFullYear() : "N/A";
                    return (
                      <div
                        key={part.id}
                        onClick={() => router.push(`/movie/${part.id}`)}
                        className="group flex flex-col gap-2 bg-zinc-900/45 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-800 rounded-2xl p-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="aspect-2/3 w-full rounded-xl overflow-hidden bg-zinc-950">
                          <img
                            src={posterUrl}
                            alt={part.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="px-1 text-left">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {part.title}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-semibold">{year}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {mediaType === "tv" && details?.seasons && details.seasons.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800/40">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Seasons
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {details.seasons.map((s) => {
                    const posterUrl = s.poster_path
                      ? `https://image.tmdb.org/t/p/w185${s.poster_path}`
                      : "/logo/popcorn.png";
                    const year = s.air_date ? new Date(s.air_date).getFullYear() : "N/A";
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSeasonClick(s.season_number)}
                        className={cn(
                          "group flex gap-3 border rounded-2xl p-2.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5",
                          expandedSeason === s.season_number
                            ? "bg-zinc-900 border-blue-500 shadow-lg shadow-blue-500/10"
                            : "bg-zinc-900/45 border-zinc-850 hover:border-zinc-800 hover:bg-zinc-900/80"
                        )}
                      >
                        <div className="aspect-2/3 w-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0">
                          <img
                            src={posterUrl}
                            alt={s.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left flex flex-col justify-center font-medium">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                            {s.name}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-semibold mt-1">
                            {s.episode_count || 0} Episode{s.episode_count !== 1 ? "s" : ""}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold mt-0.5">{year}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Season Details & Episode List */}
                {expandedSeason !== null && (
                  <div
                    ref={seasonDetailsRef}
                    className="mt-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-md space-y-6 scroll-mt-24"
                  >
                    {seasonDetailsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                        <p className="text-zinc-500 text-xs font-semibold">Loading season details...</p>
                      </div>
                    ) : activeSeasonData ? (
                      <div className="space-y-6">
                        {/* Season Header info */}
                        <div className="border-b border-zinc-800/80 pb-4">
                          <h4 className="text-sm font-extrabold text-white">{activeSeasonData.name}</h4>
                          {activeSeasonData.overview && (
                            <p className="text-zinc-400 text-xs mt-2 leading-relaxed italic">
                              &ldquo;{activeSeasonData.overview}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Episodes List */}
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                            Episodes ({activeSeasonData.episodes?.length || 0})
                          </h5>
                          <div className="flex flex-col gap-4">
                            {activeSeasonData.episodes?.map((ep) => {
                              const stillUrl = ep.still_path
                                ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                : "/logo/popcorn.png";
                              return (
                                <div
                                  key={ep.id}
                                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors"
                                >
                                  {/* Still image / thumbnail */}
                                  <div className="w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-zinc-950 shrink-0 relative group">
                                    <img
                                      src={stillUrl}
                                      alt={ep.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/45 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSeason(activeSeasonData.season_number);
                                          setEpisode(ep.episode_number);
                                          scrollToPlayer("watch");
                                        }}
                                        className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] h-7 px-3.5 cursor-pointer shadow-md"
                                      >
                                        Play S{activeSeasonData.season_number}E{ep.episode_number}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Episode Info */}
                                  <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-blue-400">
                                          Episode {ep.episode_number}
                                        </span>
                                        {ep.runtime && (
                                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                                            {ep.runtime}m
                                          </span>
                                        )}
                                      </div>
                                      <h6 className="text-xs font-extrabold text-white mt-1 truncate">
                                        {ep.name}
                                      </h6>
                                      <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-3">
                                        {ep.overview || "No overview available for this episode."}
                                      </p>
                                    </div>
                                    {ep.air_date && (
                                      <span className="text-[9px] text-zinc-500 font-semibold mt-3">
                                        Air Date: {moment(ep.air_date).format("MMM Do YYYY")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-xs">Failed to load episode details.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Sidebar */}
          <div className="rounded-2xl border sticky top-22 border-zinc-850 bg-zinc-900/10 p-6 space-y-6 h-fit">
            <h3 className="text-base font-bold text-white border-b border-zinc-805 pb-2">
              More Info
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 flex flex-col gap-1.5 pb-3 border-b border-zinc-800/80">
                <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                  Content Region
                </span>
                <RegionSelect
                  value={selectedRegion}
                  onValueChange={(val) => setSelectedRegion(val || "US")}
                  mode="code"
                  placeholder="Select Region"
                  className="bg-zinc-950 border-zinc-800 text-xs font-bold rounded-xl h-10 text-zinc-200"
                />
              </div>

              {mediaType === "tv" && details && (
                <div>
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                    Seasons
                  </span>
                  <span className="text-zinc-200">
                    {details?.number_of_seasons || 0}
                  </span>
                </div>
              )}
              {mediaType === "tv" && details && (
                <div>
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                    Episodes
                  </span>
                  <span className="text-zinc-200">
                    {details?.number_of_episodes || 0}
                  </span>
                </div>
              )}
              <div>
                <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                  Status
                </span>
                <span className="text-zinc-200">{details?.status || "N/A"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                  Release Date
                </span>
                <span className="text-zinc-200">{moment(releaseDate).format("MMM Do, YYYY (dddd)") || "N/A"}</span>
              </div>

              {details?.budget !== undefined && (
                <div>
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                    Budget
                  </span>
                  <span className="text-zinc-200">{formatCurrency(details.budget)}</span>
                </div>
              )}
              {details?.revenue !== undefined && (
                <div>
                  <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                    Revenue
                  </span>
                  <span className="text-zinc-200">{formatCurrency(details.revenue)}</span>
                </div>
              )}
              <div>
                <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
                  Original Language
                </span>
                <span className="text-zinc-200 uppercase">
                  {details?.original_language || "en"}
                </span>
              </div>
            </div>

            {/* Providers logos */}
            {providers.length > 0 && (
              <div className="pt-2 border-t border-zinc-850">
                <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold mb-2">
                  Streaming Services ({selectedRegion})
                </span>
                <div className="flex flex-wrap gap-2">
                  {providers.slice(0, 5).map((prov: ProviderItem) => (
                    <div
                      key={prov.provider_id}
                      className="h-9 w-9 rounded-lg overflow-hidden border border-zinc-800"
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

        {/* Dedicated Comments Section */}
        <CommentsSection mediaId={details.id.toString()} mediaType={mediaType} />

        {/* Recommendations Carousel */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              More Like This
            </h2>
            <Carousel
              items={recommendations}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}

      {/* Log Watch Modal */}
      <LogWatchModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        mediaId={details.id.toString()}
        mediaType={mediaType}
        title={details.title || details.name || ""}
        posterPath={details.poster_path || ""}
        releaseYear={releaseYear.toString()}
      />

      {/* Share to Chat Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Share with Friends</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550">Select Chat</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {!chatsList ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
              ) : chatsList.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-4 text-center">No active chats found. Open the chat tab to start conversations with friends!</p>
              ) : (
                chatsList.map((c) => {
                  const isGroup = c.type === "group";
                  const chatTitle = isGroup ? c.name : c.friend?.name || "Friend";
                  return (
                    <div
                      key={c.chatId}
                      onClick={() => handleShareToChat(c.chatId, chatTitle)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-900/60 cursor-pointer border border-transparent hover:border-zinc-850 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-zinc-800">
                          {isGroup ? (
                            c.image ? <AvatarImage src={c.image} alt={c.name} className="object-cover" /> : null
                          ) : c.friend?.image ? (
                            <AvatarImage src={c.friend.image} alt={c.friend.name} className="object-cover" />
                          ) : null}
                          <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-xs">
                            {isGroup ? <Users className="h-4 w-4 text-zinc-400" /> : chatTitle.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold text-white block">{chatTitle}</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block">{isGroup ? "Group Chat" : `@${c.friend?.username}`}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-500" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
