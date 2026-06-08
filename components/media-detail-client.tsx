"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { TMDBMedia } from "@/lib/tmdb";
import { streamingProviderList } from "@/lib/streamingProviderList";
import {
  Star,
  Clock,
  Loader2,
  TrendingUp,
  Users,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";
import Carousel from "./carousel";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "./quick-view-modal";
import PersonQuickViewModal from "./person-quick-view-modal";
import CommentsSection from "@/components/comments-section";
import LogWatchModal from "./log-watch-modal";
import { getCollectionDetails, getSeasonDetails } from "@/lib/tmdb-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import moment from "moment";

// Import types and subcomponents
import {
  CastItem,
  CrewItem,
  VideoItem,
  ProviderItem,
  MediaDetails,
  RegionalRelease,
  RegionalContentRating,
  SeasonDetails,
  CollectionPart,
} from "./media-detail/types";

import MediaHero from "./media-detail/media-hero";
import ActionsSection from "./media-detail/actions-section";
import RatingSection from "./media-detail/rating-section";
import VideoPlayer from "./media-detail/video-player";
import CastSlider from "./media-detail/cast-slider";
import CollectionGrid from "./media-detail/collection-grid";
import SeasonsAccordion from "./media-detail/seasons-accordion";
import InfoSidebar from "./media-detail/info-sidebar";
import { Button } from "./ui/button";

interface MediaDetailClientProps {
  mediaType: "movie" | "tv";
  initialData: {
    details: MediaDetails;
    credits?: { cast?: CastItem[]; crew?: CrewItem[] };
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
  Indonesia: "ID",
  Japan: "JP",
  "South Korea": "KR",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  Singapore: "SG",
  India: "IN",
  Brazil: "BR",
  Mexico: "MX",
};

export default function MediaDetailClient({
  mediaType,
  initialData,
}: MediaDetailClientProps) {
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
  const [now] = useState(() => Date.now());

  // Player tabs & selections
  const [activeTab, setActiveTab] = useState<"trailer" | "watch">("trailer");
  const [selectedServer, setSelectedServer] = useState<number>(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [quickViewPersonId, setQuickViewPersonId] = useState<number | null>(null);

  const [selectedRegion, setSelectedRegion] = useState("US");

  // Query current user profile to read country preference
  const convexProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  // Automatic region detection
  useEffect(() => {
    // 1. Prioritize user profile country preference if set
    if (convexProfile?.country) {
      const mappedCode =
        countryNameToCode[convexProfile.country] || convexProfile.country;
      Promise.resolve().then(() => {
        setSelectedRegion(mappedCode);
      });
      return;
    }

    // 2. Fall back to browser locales detection
    if (typeof window !== "undefined") {
      const locale =
        navigator.language || (navigator.languages && navigator.languages[0]);
      if (locale) {
        const parts = locale.split("-");
        const detectedRegion = parts[1]
          ? parts[1].toUpperCase()
          : parts[0].toUpperCase();
        const supported = ["US", "ID", "JP", "KR", "GB"];
        if (supported.includes(detectedRegion)) {
          Promise.resolve().then(() => {
            setSelectedRegion(detectedRegion);
          });
        } else if (
          initialData.watchProviders &&
          detectedRegion in initialData.watchProviders
        ) {
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
            const dateA = a.release_date
              ? new Date(a.release_date).getTime()
              : 0;
            const dateB = b.release_date
              ? new Date(b.release_date).getTime()
              : 0;
            return dateA - dateB;
          });
          setCollectionParts(sortedParts);
        }
      });
    }
  }, [mediaType, details?.belongs_to_collection?.id]);

  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [seasonDetailsLoading, setSeasonDetailsLoading] = useState(false);
  const [activeSeasonData, setActiveSeasonData] =
    useState<SeasonDetails | null>(null);

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
        seasonDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      getSeasonDetails(details.id, seasonNumber).then((data) => {
        if (data) {
          setActiveSeasonData(data as SeasonDetails);
          // Re-scroll once actual episodes list loads and changes heights
          setTimeout(() => {
            seasonDetailsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
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
      : "skip",
  );
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);

  // Convex favorites mutations/queries
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const isFavorited = useQuery(
    api.favorites.checkFavoriteItem,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip",
  );
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  // Convex rating mutations/queries
  const userRating = useQuery(
    api.ratings.getUserRating,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip",
  );
  const communityStats = useQuery(
    api.ratings.getCommunityRatingStats,
    initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip",
  );
  const rateMedia = useMutation(api.ratings.rateMedia);
  const deleteRating = useMutation(api.ratings.deleteRating);

  // Convex diary history queries/mutations
  const watchHistory = useQuery(
    api.diary.getMediaWatchHistory,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip",
  );
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logWatchEpisode, setLogWatchEpisode] = useState<{
    season: number;
    episode: number;
  } | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isAddToCustomOpen, setIsAddToCustomOpen] = useState(false);

  const customLists = useQuery(
    api.customLists.getListsWithMediaStatus,
    isLoggedIn && details ? { mediaId: String(details.id), mediaType } : "skip",
  );
  const addCustomItem = useMutation(api.customLists.addItem);
  const removeCustomItem = useMutation(api.customLists.removeItem);

  const chatsList = useQuery(api.chats.getChatsList, isLoggedIn ? {} : "skip");
  const sendChatMessage = useMutation(api.chats.sendMessage);

  // Convex watch progress query & mutation
  const watchProgress = useQuery(
    api.continueWatching.getProgressForMedia,
    isLoggedIn && initialData.details
      ? { mediaId: String(initialData.details.id), mediaType }
      : "skip",
  );
  const upsertWatchProgress = useMutation(api.continueWatching.upsertProgress);

  const hasResumed = useRef(false);

  // Auto-resume watch progress
  useEffect(() => {
    if (watchProgress && !hasResumed.current) {
      hasResumed.current = true;
      const targetSeason = watchProgress.season;
      const targetEpisode = watchProgress.episode;
      Promise.resolve().then(() => {
        if (targetSeason !== undefined) {
          setSeason(targetSeason);
        }
        if (targetEpisode !== undefined) {
          setEpisode(targetEpisode);
        }
      });
    }
  }, [watchProgress]);

  // Track and save watch progress
  useEffect(() => {
    if (isLoggedIn && activeTab === "watch" && details) {
      upsertWatchProgress({
        mediaId: String(details.id),
        mediaType,
        title: details.title || details.name || "",
        posterPath: details.poster_path || "",
        season: mediaType === "tv" ? season : undefined,
        episode: mediaType === "tv" ? episode : undefined,
      }).catch((err) => console.error("Failed to save watch progress:", err));
    }
  }, [
    activeTab,
    season,
    episode,
    isLoggedIn,
    mediaType,
    details,
    upsertWatchProgress,
  ]);

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
      toast.success(
        `Shared "${details.title || details.name}" to ${chatTitle}!`,
      );
    } catch {
      toast.error("Failed to share title");
    }
  };

  const cast = initialData.credits?.cast?.slice(0, 15) || [];
  const directors =
    initialData.credits?.crew?.filter((c) => c.job === "Director") || [];
  const creators = details.created_by || [];
  const recommendations = initialData.recommendations || [];
  const providers =
    initialData.watchProviders?.[selectedRegion]?.flatrate || [];

  // YouTube trailer resolution
  const trailerVideo = initialData.videos?.find(
    (v: VideoItem) => v.type === "Trailer" && v.site === "YouTube",
  );
  const trailerKey =
    trailerVideo?.key ||
    (initialData.videos?.[0]?.site === "YouTube"
      ? initialData.videos[0].key
      : null);

  // Streaming server sources
  const servers = streamingProviderList({
    media_type: mediaType,
    id: String(details?.id),
    season,
    episode,
  });

  const rating = details?.vote_average
    ? details.vote_average.toFixed(details.vote_average < 10 ? 1 : 0)
    : "0.0";

  // Find regional release date and content certification
  const regionalReleaseInfo = (() => {
    if (mediaType !== "movie" || !initialData.regionalData) return null;
    const movieReleaseData = initialData.regionalData as RegionalRelease[];
    const regionRelease = movieReleaseData.find(
      (r) => r.iso_3166_1 === selectedRegion,
    );
    if (
      !regionRelease ||
      !regionRelease.release_dates ||
      regionRelease.release_dates.length === 0
    ) {
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
        (r) => r.iso_3166_1 === selectedRegion,
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
  const runtime = details?.runtime || details?.episode_run_time?.[0] || null;

  const isUnreleased = (() => {
    if (!details) return false;
    const status = details.status;
    if (status) {
      const unreleasedStatuses = [
        "Rumored",
        "Planned",
        "In Production",
        "Post Production",
      ];
      if (unreleasedStatuses.includes(status)) {
        return true;
      }
    }
    const releaseDateStr =
      mediaType === "movie" ? details.release_date : details.first_air_date;
    if (releaseDateStr) {
      const releaseTime = new Date(releaseDateStr).getTime();
      if (!isNaN(releaseTime) && releaseTime > now) {
        return true;
      }
    }
    return false;
  })();

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
      playerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleQuickView = (media: TMDBMedia) => {
    setQuickViewMedia(media);
  };

  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : "/logo/popcorn.png";

  const posterUrl = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/logo/popcorn.png";

  const mobileBackdropUrl = initialData.textlessPosterPath
    ? `https://image.tmdb.org/t/p/w780${initialData.textlessPosterPath}`
    : posterUrl;

  const duration = moment.duration(runtime, "minutes");

  return (
    <div className="bg-background text-foreground min-h-svh transition-colors duration-300 select-none">
      {/* Hero Header Section - Stacked Backdrop */}
      <MediaHero
        backdropRef={backdropRef}
        backdropUrl={backdropUrl}
        mobileBackdropUrl={mobileBackdropUrl}
      />

      {/* Content Container - Shifted Upwards to Overlap Backdrop */}
      <div className="relative z-20 mx-auto -mt-24 flex max-w-7xl flex-col items-start gap-8 px-6 sm:-mt-36 sm:px-12 md:-mt-44 md:flex-row md:gap-12 md:px-20">
        {/* Large Poster Sidebar */}
        <div className="border-zinc-850 hidden w-64 shrink-0 transform overflow-hidden rounded-2xl border bg-zinc-900/60 shadow-2xl shadow-black/85 backdrop-blur-md transition-all duration-300 hover:scale-102 md:block">
          <img
            src={posterUrl}
            alt={details?.title || details?.name}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Details Header Details */}
        <div className="flex flex-1 flex-col items-start gap-4 text-left">
          {/* Genre Badges */}
          {details?.genres && details.genres.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {details.genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Logo or Title */}
          {initialData.logoPath && !logoError ? (
            <div className="relative mb-2 flex h-16 max-w-[85%] items-center sm:h-24 md:h-28">
              <img
                src={`https://image.tmdb.org/t/p/w500${initialData.logoPath}`}
                alt={details?.title || details?.name}
                className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <h1 className="line-clamp-2 text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
              {details?.title || details?.name}
            </h1>
          )}

          {details?.tagline && (
            <p className="-mt-1 text-sm text-zinc-400 italic sm:text-base">
              &ldquo;{details.tagline}&rdquo;
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="border-primary/30 bg-primary rounded-full border px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
              {mediaType === "tv" ? "TV Series" : "Movie"}
            </span>
            {certification && (
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-black text-zinc-300 uppercase">
                Rated: {certification}
              </span>
            )}
            {(() => {
              const hasCommunity =
                communityStats && communityStats.totalRatings > 0;
              const displayRating = hasCommunity
                ? communityStats.averageRating.toFixed(
                    communityStats.averageRating < 10 ? 1 : 0,
                  )
                : rating;
              const sourceLabel = hasCommunity ? "Community" : "TMDB";
              return (
                <>
                  <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{displayRating}</span>
                    <span className="ml-1 text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                      ({sourceLabel})
                    </span>
                  </div>
                  {hasCommunity && (
                    <span className="border-zinc-850 rounded-full border bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-500">
                      TMDB: {rating}
                    </span>
                  )}
                </>
              );
            })()}
            <span className="text-sm font-medium text-zinc-400">
              {releaseYear}
            </span>
            {runtime && (
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>
                  {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
                  {duration.minutes() > 0 ? `${duration.minutes()}m` : ""}
                </span>
              </div>
            )}
          </div>

          {mediaType === "movie" && directors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm">
              <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Directed By:
              </span>
              <span className="flex flex-wrap items-center gap-1 font-bold text-zinc-200">
                {directors.map((d, index) => (
                  <span key={d.id}>
                    <span
                      onClick={() => setQuickViewPersonId(d.id)}
                      role="button"
                      className="hover:text-primary cursor-pointer underline decoration-dotted transition-colors"
                    >
                      {d.name}
                    </span>
                    {index < directors.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </div>
          )}
          {mediaType === "tv" && creators.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm">
              <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Created By:
              </span>
              <span className="flex flex-wrap items-center gap-1 font-bold text-zinc-200">
                {creators.map((c, index) => (
                  <span key={c.id}>
                    <span
                      onClick={() => setQuickViewPersonId(c.id)}
                      role="button"
                      className="hover:text-primary cursor-pointer underline decoration-dotted transition-colors"
                    >
                      {c.name}
                    </span>
                    {index < creators.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </div>
          )}

          <p className="mt-2 line-clamp-3 max-w-3xl text-sm leading-relaxed text-zinc-300 drop-shadow md:text-base">
            {details?.overview || "No overview available."}
          </p>

          <ActionsSection
            trailerKey={trailerKey}
            watchlistLoading={watchlistLoading}
            isWatchlisted={isWatchlisted}
            handleWatchlistToggle={handleWatchlistToggle}
            favoriteLoading={favoriteLoading}
            isFavorited={isFavorited}
            handleFavoriteToggle={handleFavoriteToggle}
            isLoggedIn={isLoggedIn}
            openAuth={openAuth}
            setIsLogModalOpen={setIsLogModalOpen}
            setIsShareDialogOpen={setIsShareDialogOpen}
            onClickCustomList={() => {
              if (!isLoggedIn) openAuth();
              else setIsAddToCustomOpen(true);
            }}
            watchHistory={watchHistory}
            scrollToPlayer={scrollToPlayer}
            mediaType={mediaType}
            watchProgress={watchProgress}
            isUnreleased={isUnreleased}
          />

          <RatingSection
            details={details}
            mediaType={mediaType}
            releaseYear={releaseYear.toString()}
            isLoggedIn={isLoggedIn}
            openAuth={openAuth}
            userRating={userRating}
            rateMedia={rateMedia}
            deleteRating={deleteRating}
            isUnreleased={isUnreleased}
          />
        </div>
      </div>

      {/* Main Details Body */}
      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12 sm:px-12">
        <VideoPlayer
          playerSectionRef={playerSectionRef}
          mediaType={mediaType}
          details={details}
          trailerKey={trailerKey}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedServer={selectedServer}
          setSelectedServer={setSelectedServer}
          season={season}
          setSeason={setSeason}
          episode={episode}
          setEpisode={setEpisode}
          servers={servers}
          isUnreleased={isUnreleased}
        />

        <CastSlider cast={cast} onPersonClick={(id) => setQuickViewPersonId(id)} />

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Info Column */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h3 className="mb-2 text-lg font-bold text-white">Overview</h3>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {details?.overview || "No overview details available."}
              </p>
            </div>

            {details?.production_companies &&
              details.production_companies.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Production Companies
                  </h3>
                  <p className="text-sm text-zinc-300">
                    {details.production_companies.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}

            <CollectionGrid
              collectionParts={collectionParts}
              onPartClick={(partId) => router.push(`/movie/${partId}`)}
            />

            <SeasonsAccordion
              details={details}
              expandedSeason={expandedSeason}
              seasonDetailsLoading={seasonDetailsLoading}
              activeSeasonData={activeSeasonData}
              handleSeasonClick={handleSeasonClick}
              seasonDetailsRef={seasonDetailsRef}
              setSeason={setSeason}
              setEpisode={setEpisode}
              scrollToPlayer={scrollToPlayer}
              watchHistory={watchHistory}
              upsertWatchProgress={upsertWatchProgress}
              onLogEpisode={(s, e) =>
                setLogWatchEpisode({ season: s, episode: e })
              }
            />
          </div>

          {/* Quick Stats Sidebar */}
          <InfoSidebar
            mediaType={mediaType}
            details={details}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            releaseDate={releaseDate}
            formatCurrency={formatCurrency}
            providers={providers}
          />
        </div>

        {/* Dedicated Comments Section */}
        <CommentsSection
          mediaId={details.id.toString()}
          mediaType={mediaType}
        />

        {/* Recommendations Carousel */}
        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <TrendingUp className="text-primary h-5 w-5" />
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

      {/* Person Quick View Modal */}
      {quickViewPersonId && (
        <PersonQuickViewModal
          personId={quickViewPersonId}
          isOpen={!!quickViewPersonId}
          onClose={() => setQuickViewPersonId(null)}
        />
      )}

      {/* Log Watch Modal */}
      {(isLogModalOpen || logWatchEpisode) && (
        <LogWatchModal
          isOpen={isLogModalOpen || !!logWatchEpisode}
          onClose={() => {
            setIsLogModalOpen(false);
            setLogWatchEpisode(null);
          }}
          mediaId={details.id.toString()}
          mediaType={mediaType}
          title={details.title || details.name || ""}
          posterPath={details.poster_path || ""}
          releaseYear={releaseYear.toString()}
          season={logWatchEpisode?.season}
          episode={logWatchEpisode?.episode}
        />
      )}

      {/* Share to Chat Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Share with Friends
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-left">
            <h3 className="text-zinc-550 text-xs font-black tracking-wider uppercase">
              Select Chat
            </h3>
            <div className="max-h-60 scrollbar-thin space-y-1.5 overflow-y-auto pr-1">
              {!chatsList ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                </div>
              ) : chatsList.length === 0 ? (
                <p className="py-4 text-center text-xs text-zinc-500 italic">
                  No active chats found. Open the chat tab to start
                  conversations with friends!
                </p>
              ) : (
                chatsList.map((c) => {
                  const isGroup = c.type === "group";
                  const chatTitle = isGroup
                    ? c.name
                    : c.friend?.name || "Friend";
                  return (
                    <div
                      key={c.chatId}
                      onClick={() => handleShareToChat(c.chatId, chatTitle)}
                      className="hover:border-zinc-850 flex cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3 text-xs transition-all hover:bg-zinc-900/60"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-zinc-800">
                          {isGroup ? (
                            c.image ? (
                              <AvatarImage
                                src={c.image}
                                alt={c.name}
                                className="object-cover"
                              />
                            ) : null
                          ) : c.friend?.image ? (
                            <AvatarImage
                              src={c.friend.image}
                              alt={c.friend.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-300">
                            {isGroup ? (
                              <Users className="h-4 w-4 text-zinc-400" />
                            ) : (
                              chatTitle.charAt(0).toUpperCase()
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="block font-bold text-white">
                            {chatTitle}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-zinc-500">
                            {isGroup ? "Group Chat" : `@${c.friend?.username}`}
                          </span>
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

      {/* Add to Custom List Dialog */}
      <Dialog open={isAddToCustomOpen} onOpenChange={setIsAddToCustomOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add to Custom List
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[350px] space-y-4 overflow-y-auto py-4 pr-1">
            {customLists === undefined ? (
              <div className="flex justify-center py-6">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              </div>
            ) : customLists.length === 0 ? (
              <div className="py-6 text-center">
                <p className="mb-4 text-sm text-zinc-500">
                  You have not created or joined any custom lists yet.
                </p>
                <Button
                  onClick={() => {
                    setIsAddToCustomOpen(false);
                    router.push("/lists");
                  }}
                  className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200"
                >
                  Create Custom List
                </Button>
              </div>
            ) : (
              customLists.map((list) => (
                <div
                  key={list._id}
                  onClick={async () => {
                    try {
                      if (list.hasMedia) {
                        await removeCustomItem({
                          listId: list._id as Id<"customLists">,
                          mediaId: String(details.id),
                          mediaType,
                        });
                        toast.success(`Removed from ${list.name}!`);
                      } else {
                        await addCustomItem({
                          listId: list._id as Id<"customLists">,
                          mediaId: String(details.id),
                          mediaType,
                          title: details.title || details.name || "",
                          posterPath: details.poster_path || "",
                          releaseYear: releaseYear.toString(),
                        });
                        toast.success(`Added to ${list.name}!`);
                      }
                    } catch {
                      toast.error("Failed to update custom list");
                    }
                  }}
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-3 transition-all hover:border-zinc-800 hover:bg-zinc-900/60"
                >
                  <div>
                    <p className="group-hover:text-primary text-sm font-bold text-white transition-colors">
                      {list.name}
                    </p>
                    {list.isCollaborative && (
                      <span className="text-primary border-primary/30 bg-primary/10 mt-1 inline-block rounded border px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                        Collaborative
                      </span>
                    )}
                  </div>
                  {list.hasMedia ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
