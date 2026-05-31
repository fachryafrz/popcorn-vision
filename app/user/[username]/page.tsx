"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { 
  User as UserIcon, 
  Bookmark, 
  Heart, 
  Star, 
  Loader2, 
  Grid, 
  Lock, 
  UserPlus, 
  UserCheck, 
  UserX 
} from "lucide-react";
import Card from "@/components/card";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "@/components/quick-view-modal";
import { TMDBMedia } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "watchlist" | "favorites" | "ratings">("all");

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUser = session.data?.user;
  const isOwner = currentUser && currentUser.username === username;

  interface UserDoc {
    _id: string;
    userId: string;
    username: string;
    name: string;
    email: string;
    bio?: string;
    image?: string;
    theme?: string;
    country?: string;
    profilePrivacy?: string;
    allowFriendRequests?: boolean;
    hideWatchlist?: boolean;
    hideFavorites?: boolean;
    hideRatings?: boolean;
  }

  // Query social profile detailed context
  const profileData = useQuery(api.social.getUserSocialProfile, { username });
  const targetUser = profileData && !profileData.isBlocked ? (profileData.user as UserDoc) : null;
  const targetUserId = targetUser?.userId;

  // Unblock mutation in case user is blocked
  const unblockMutation = useMutation(api.social.unblockUser);

  // Friendship mutations
  const sendFriendRequest = useMutation(api.social.sendFriendRequest);
  const cancelFriendRequest = useMutation(api.social.cancelFriendRequest);
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const removeFriend = useMutation(api.social.removeFriend);

  const [friendLoading, setFriendLoading] = useState(false);

  // Privacy lock derivation
  const isPrivate = targetUser?.profilePrivacy === "private";
  const isFriendsOnly = targetUser?.profilePrivacy === "friends";
  const isFriend = profileData?.friendshipStatus === "friends";
  const showLockScreen = !isOwner && (isPrivate || (isFriendsOnly && !isFriend));

  // Individual visibility flags
  const showWatchlistTab = isOwner || !targetUser?.hideWatchlist;
  const showFavoritesTab = isOwner || !targetUser?.hideFavorites;
  const showRatingsTab = isOwner || !targetUser?.hideRatings;

  // Query target user lists if profile exists and content is visible
  const watchlist = useQuery(
    api.watchlist.getPublicWatchlist,
    targetUserId && showWatchlistTab && !showLockScreen ? { userId: targetUserId } : "skip"
  );
  const favorites = useQuery(
    api.favorites.getPublicFavorites,
    targetUserId && showFavoritesTab && !showLockScreen ? { userId: targetUserId } : "skip"
  );
  const ratings = useQuery(
    api.ratings.getUserRatings,
    targetUserId && showRatingsTab && !showLockScreen ? { userId: targetUserId } : "skip"
  );

  const handleFriendAction = async () => {
    if (!isLoggedIn) {
      openAuth();
      return;
    }
    if (!targetUserId || !profileData || !targetUser) return;
    setFriendLoading(true);
    try {
      if (profileData.friendshipStatus === "none") {
        await sendFriendRequest({ targetUserId });
        toast.success("Friend request sent!");
      } else if (profileData.friendshipStatus === "request_sent") {
        await cancelFriendRequest({ targetUserId });
        toast.success("Friend request cancelled.");
      } else if (profileData.friendshipStatus === "request_received") {
        await acceptFriendRequest({ targetUserId });
        toast.success("Friend request accepted!");
      } else if (profileData.friendshipStatus === "friends") {
        if (confirm(`Are you sure you want to remove ${targetUser.name} from friends?`)) {
          await removeFriend({ targetUserId });
          toast.success("Friend removed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Friend action failed.");
    } finally {
      setFriendLoading(false);
    }
  };

  // Combine all items uniquely
  const allItemsMap = new Map<string, {
    mediaId: string;
    mediaType: string;
    title: string;
    posterPath: string;
    releaseYear: string;
    addedAt: number;
    rating?: number;
    isWatchlist?: boolean;
    isFavorite?: boolean;
  }>();

  if (watchlist) {
    watchlist.forEach(item => {
      const key = `${item.mediaType}-${item.mediaId}`;
      allItemsMap.set(key, {
        mediaId: item.mediaId,
        mediaType: item.mediaType,
        title: item.title,
        posterPath: item.posterPath,
        releaseYear: item.releaseYear,
        addedAt: item.addedAt,
        isWatchlist: true,
      });
    });
  }

  if (favorites) {
    favorites.forEach(item => {
      const key = `${item.mediaType}-${item.mediaId}`;
      const existing = allItemsMap.get(key);
      if (existing) {
        existing.isFavorite = true;
        if (item.addedAt > existing.addedAt) {
          existing.addedAt = item.addedAt;
        }
      } else {
        allItemsMap.set(key, {
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          releaseYear: item.releaseYear,
          addedAt: item.addedAt,
          isFavorite: true,
        });
      }
    });
  }

  if (ratings) {
    ratings.forEach(item => {
      const key = `${item.mediaType}-${item.mediaId}`;
      const existing = allItemsMap.get(key);
      if (existing) {
        existing.rating = item.rating;
        if (item.addedAt > existing.addedAt) {
          existing.addedAt = item.addedAt;
        }
      } else {
        allItemsMap.set(key, {
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          releaseYear: item.releaseYear,
          addedAt: item.addedAt,
          rating: item.rating,
        });
      }
    });
  }

  const allItems = Array.from(allItemsMap.values()).sort((a, b) => b.addedAt - a.addedAt);

  // Loading states
  const loadingProfile = profileData === undefined;

  if (loadingProfile) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh] bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!profileData) {
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

  // Handle Blocked State
  if (profileData.isBlocked) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-zinc-955 text-white px-6 text-center">
        <UserX className="h-16 w-16 text-red-500/80 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Profile Unavailable</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          {profileData.blockedByMe 
            ? "You have blocked this user. Unblock them to view their profile."
            : "This profile is not available to you."}
        </p>
        {profileData.blockedByMe && targetUserId && (
          <Button
            onClick={async () => {
              try {
                await unblockMutation({ targetUserId });
              } catch (e) {
                console.error(e);
              }
            }}
            className="rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-sm px-6 py-2.5 cursor-pointer"
          >
            Unblock User
          </Button>
        )}
      </div>
    );
  }

  const getFallbackIcon = () => {
    if (activeTab === "watchlist") return <Bookmark className="h-12 w-12 text-zinc-800" />;
    if (activeTab === "favorites") return <Heart className="h-12 w-12 text-zinc-800" />;
    if (activeTab === "ratings") return <Star className="h-12 w-12 text-zinc-800" />;
    return <Grid className="h-12 w-12 text-zinc-800" />;
  };

  const getEmptyMessage = () => {
    if (activeTab === "watchlist") return "This user's watchlist is currently empty.";
    if (activeTab === "favorites") return "This user's favorites list is currently empty.";
    if (activeTab === "ratings") return "This user hasn't rated any movies or TV shows yet.";
    return "This user hasn't added any titles to their lists or submitted any ratings yet.";
  };

  // Determine Friend Button style & content
  let friendLabel = "Add Friend";
  let FriendIcon = UserPlus;
  let friendVariant: "default" | "secondary" | "outline" | "destructive" = "outline";

  if (profileData.friendshipStatus === "request_sent") {
    friendLabel = "Cancel Request";
    FriendIcon = UserX;
    friendVariant = "secondary";
  } else if (profileData.friendshipStatus === "request_received") {
    friendLabel = "Accept Request";
    FriendIcon = UserCheck;
    friendVariant = "default";
  } else if (profileData.friendshipStatus === "friends") {
    friendLabel = "Friends";
    FriendIcon = UserCheck;
    friendVariant = "outline";
  }


  // Define tab navigation dynamically based on visitor visibility settings
  const tabsList = [
    { id: "all" as const, label: "All", count: allItems.length, visible: true },
    { id: "watchlist" as const, label: "Watchlist", count: watchlist ? watchlist.length : 0, visible: showWatchlistTab },
    { id: "favorites" as const, label: "Favorites", count: favorites ? favorites.length : 0, visible: showFavoritesTab },
    { id: "ratings" as const, label: "Ratings", count: ratings ? ratings.length : 0, visible: showRatingsTab }
  ].filter(t => t.visible);

  return (
    <div 
      className="grow bg-background text-foreground min-h-[85vh] py-24 px-6 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto w-full transition-colors duration-300 relative rounded-3xl"
      data-theme={targetUser?.theme || "dark"}
    >
      {/* Header Profile Info card */}
      <div className="relative rounded-3xl mb-8 flex flex-col items-stretch overflow-hidden border border-zinc-900 bg-zinc-900/10 backdrop-blur-md shadow-lg shadow-black/40 transition-all duration-350 z-10">
        {/* Profile Details Content Overlay */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 grow min-w-0 w-full">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-background bg-background shadow-xl shrink-0 z-10">
              {targetUser?.image && (
                <AvatarImage src={targetUser.image} alt={targetUser?.name} className="object-cover" />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center h-full w-full">
                {targetUser?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grow min-w-0 w-full pt-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate drop-shadow-sm">
                {targetUser?.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-primary font-semibold text-sm">@{targetUser?.username}</span>
                {targetUser?.country && (
                  <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {targetUser?.country}
                  </span>
                )}
              </div>
              {targetUser?.bio && (
                <p className="text-zinc-300 text-sm mt-3 max-w-xl italic">
                  &ldquo;{targetUser.bio}&rdquo;
                </p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span>{profileData.friendCount} Friends</span>
              </div>
            </div>
          </div>

          {/* Social Buttons */}
          {!isOwner && (
            <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              <Button
                variant={friendVariant}
                disabled={friendLoading}
                onClick={handleFriendAction}
                className="flex-1 sm:flex-initial rounded-xl px-5 h-10 text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                {friendLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <FriendIcon className="h-4 w-4 mr-1.5" />
                    {friendLabel}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {showLockScreen ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl text-center gap-4 backdrop-blur-md">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-300">This Profile is Private</h2>
            <p className="text-zinc-500 text-sm mt-1 max-w-md">
              {isFriendsOnly 
                ? "Send a friend request to see their favorite titles, watchlist, and ratings." 
                : "You must be approved to view this user's activities."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-zinc-900 mb-8 gap-6 text-sm">
            {tabsList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "font-bold pb-4 border-b-2 uppercase tracking-wider text-xs transition-all cursor-pointer",
                  activeTab === tab.id
                    ? "text-primary border-primary font-extrabold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === "all" && (
            <>
              {watchlist === undefined || favorites === undefined || ratings === undefined ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : allItems.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
                  {getFallbackIcon()}
                  <p className="text-zinc-400 text-sm font-medium">{getEmptyMessage()}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                  {allItems.map((item) => {
                    const mediaItem: TMDBMedia = {
                      id: Number(item.mediaId),
                      media_type: item.mediaType as "movie" | "tv",
                      title: item.title,
                      name: item.title,
                      poster_path: item.posterPath,
                      vote_average: item.rating || 0,
                      release_date: item.releaseYear,
                      backdrop_path: "",
                      genre_ids: [],
                      overview: "",
                      popularity: 0,
                    };
                    return (
                      <div key={`${item.mediaType}-${item.mediaId}`} className="relative group/card-wrapper">
                        <Card
                          media={mediaItem}
                          onQuickView={setQuickViewMedia}
                          onAuthRequired={openAuth}
                        />
                        {/* Badge Overlay */}
                        <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5 pointer-events-none">
                          {item.rating && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-blue-600/90 border border-blue-400/30 text-white shadow-lg">
                              <Star className="h-3 w-3 fill-current text-yellow-300" />
                              <span>{item.rating}/10</span>
                            </div>
                          )}
                          {!item.rating && item.isFavorite && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-rose-600/90 border border-rose-400/30 text-white shadow-lg">
                              <Heart className="h-3 w-3 fill-current text-white" />
                              <span>Favorite</span>
                            </div>
                          )}
                          {!item.rating && !item.isFavorite && item.isWatchlist && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-600/90 border border-emerald-400/30 text-white shadow-lg">
                              <Bookmark className="h-3 w-3 fill-current text-white" />
                              <span>Watchlist</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === "watchlist" && showWatchlistTab && (
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

          {activeTab === "favorites" && showFavoritesTab && (
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

          {activeTab === "ratings" && showRatingsTab && (
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
                      vote_average: item.rating,
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
