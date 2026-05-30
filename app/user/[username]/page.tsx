"use client";

import { useState, use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User as UserIcon, Bookmark, Heart, Star, Loader2 } from "lucide-react";
import Card from "@/components/card";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "@/components/quick-view-modal";
import { TMDBMedia } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites" | "ratings">("watchlist");

  // Query user profile by username
  const targetUser = useQuery(api.users.getUserByUsername, { username });

  // Query target user lists if profile exists
  const targetUserId = targetUser?.userId;
  const watchlist = useQuery(
    api.watchlist.getPublicWatchlist,
    targetUserId ? { userId: targetUserId } : "skip"
  );
  const favorites = useQuery(
    api.favorites.getPublicFavorites,
    targetUserId ? { userId: targetUserId } : "skip"
  );
  const ratings = useQuery(
    api.ratings.getUserRatings,
    targetUserId ? { userId: targetUserId } : "skip"
  );

  // Loading states
  const loadingProfile = targetUser === undefined;

  if (loadingProfile) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh] bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 text-white px-6 text-center">
        <UserIcon className="h-16 w-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">User Not Found</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          The user <span className="text-blue-400 font-semibold">@{username}</span> does not exist or has not created a profile yet.
        </p>
      </div>
    );
  }



  const getFallbackIcon = () => {
    if (activeTab === "watchlist") return <Bookmark className="h-12 w-12 text-zinc-800" />;
    if (activeTab === "favorites") return <Heart className="h-12 w-12 text-zinc-800" />;
    return <Star className="h-12 w-12 text-zinc-800" />;
  };

  const getEmptyMessage = () => {
    if (activeTab === "watchlist") return "This user's watchlist is currently empty.";
    if (activeTab === "favorites") return "This user's favorites list is currently empty.";
    return "This user hasn't rated any movies or TV shows yet.";
  };

  return (
    <div className="grow bg-zinc-950 text-white min-h-[85vh] py-24 px-6 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto w-full">
      {/* Header Profile Info card */}
      <div className="relative p-6 sm:p-8 rounded-3xl border border-zinc-900 bg-zinc-900/10 shadow-lg backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-zinc-800 shadow-xl">
          <AvatarFallback className="bg-blue-600 text-white font-black text-2xl">
            {targetUser.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grow min-w-0 w-full">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
            {targetUser.name}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 mt-1">
            <span className="text-blue-400 font-semibold text-sm">@{targetUser.username}</span>
            {targetUser.country && (
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {targetUser.country}
              </span>
            )}
          </div>
          {targetUser.bio && (
            <p className="text-zinc-300 text-sm mt-3 max-w-xl italic">
              &ldquo;{targetUser.bio}&rdquo;
            </p>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>{watchlist ? watchlist.length : 0} Watchlist</span>
            <span>{favorites ? favorites.length : 0} Favorites</span>
            <span>{ratings ? ratings.length : 0} Ratings</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 mb-8 gap-6 text-sm">
        {(["watchlist", "favorites", "ratings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "font-bold pb-4 border-b-2 uppercase tracking-wider text-xs transition-all cursor-pointer",
              activeTab === tab
                ? "text-blue-500 border-blue-500 font-extrabold"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            {tab} ({tab === "watchlist" ? (watchlist ? watchlist.length : 0) : tab === "favorites" ? (favorites ? favorites.length : 0) : (ratings ? ratings.length : 0)})
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "watchlist" && (
        <>
          {!watchlist ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
              {getFallbackIcon()}
              <p className="text-zinc-400 text-sm font-medium">{getEmptyMessage()}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {watchlist.map((item) => {
                const mediaItem: TMDBMedia = {
                  id: Number(item.mediaId),
                  media_type: item.mediaType as "movie" | "tv",
                  title: item.title,
                  name: item.title,
                  poster_path: item.posterPath,
                  vote_average: item.rating,
                  release_date: item.releaseYear,
                  backdrop_path: "",
                  genre_ids: [],
                  overview: "",
                  popularity: 0,
                };
                return (
                  <Card
                    key={item._id}
                    media={mediaItem}
                    onQuickView={setQuickViewMedia}
                    onAuthRequired={openAuth}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "favorites" && (
        <>
          {!favorites ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
              {getFallbackIcon()}
              <p className="text-zinc-400 text-sm font-medium">{getEmptyMessage()}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {favorites.map((item) => {
                const mediaItem: TMDBMedia = {
                  id: Number(item.mediaId),
                  media_type: item.mediaType as "movie" | "tv",
                  title: item.title,
                  name: item.title,
                  poster_path: item.posterPath,
                  vote_average: item.rating,
                  release_date: item.releaseYear,
                  backdrop_path: "",
                  genre_ids: [],
                  overview: "",
                  popularity: 0,
                };
                return (
                  <Card
                    key={item._id}
                    media={mediaItem}
                    onQuickView={setQuickViewMedia}
                    onAuthRequired={openAuth}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "ratings" && (
        <>
          {!ratings ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
              {getFallbackIcon()}
              <p className="text-zinc-400 text-sm font-medium">{getEmptyMessage()}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {ratings.map((item) => {
                const mediaItem: TMDBMedia = {
                  id: Number(item.mediaId),
                  media_type: item.mediaType as "movie" | "tv",
                  title: item.title,
                  name: item.title,
                  poster_path: item.posterPath,
                  vote_average: 0, // Zero so we don't duplicate ratings on card, we show given rating instead!
                  release_date: item.releaseYear,
                  backdrop_path: "",
                  genre_ids: [],
                  overview: "",
                  popularity: 0,
                };
                return (
                  <div key={item._id} className="relative group/card-wrapper">
                    <Card
                      media={mediaItem}
                      onQuickView={setQuickViewMedia}
                      onAuthRequired={openAuth}
                    />
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-blue-600/90 border border-blue-400/30 text-white shadow-lg pointer-events-none">
                      <Star className="h-3 w-3 fill-current text-yellow-300" />
                      <span>{item.rating}/10</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}
    </div>
  );
}
