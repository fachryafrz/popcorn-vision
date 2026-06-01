"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import Carousel from "./carousel";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "./quick-view-modal";
import CommentsSection from "@/components/comments-section";
import LogWatchModal from "./log-watch-modal";
import { getCollectionDetails, getSeasonDetails } from "@/lib/tmdb-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import moment from "moment";

// Import types and subcomponents
import {
  CastItem,
  VideoItem,
  ProviderItem,
  Season,
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
      <MediaHero
        backdropRef={backdropRef}
        backdropUrl={backdropUrl}
        mobileBackdropUrl={mobileBackdropUrl}
      />

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
              {details.genres.map((g) => (
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
            watchHistory={watchHistory}
            scrollToPlayer={scrollToPlayer}
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
          />
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-16">
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
        />

        <CastSlider cast={cast} />

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
