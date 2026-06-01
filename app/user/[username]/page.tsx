"use client";

import { useState, use, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
  UserX,
  Calendar,
  History,
  Edit2,
  Trash2,
  Check
} from "lucide-react";
import Card from "@/components/card";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "@/components/quick-view-modal";
import { TMDBMedia } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import LogWatchModal from "@/components/log-watch-modal";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "watchlist" | "favorites" | "ratings" | "diary">("all");

  interface DiaryItem {
    _id: string;
    mediaId: string;
    mediaType: string;
    title: string;
    posterPath: string;
    releaseYear: string;
    watchedDate: number;
    rewatch: boolean;
    rating?: number;
    review?: string;
  }

  const [editingEntry, setEditingEntry] = useState<DiaryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteDiaryEntry = useMutation(api.diary.deleteDiaryEntry);

  const handleDeleteDiary = async (diaryId: string) => {
    if (!confirm("Are you sure you want to delete this watch log entry?")) return;
    setDeletingId(diaryId);
    try {
      await deleteDiaryEntry({ diaryId: diaryId as Id<"diary"> });
      toast.success("Watch entry deleted from your diary.");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to delete watch entry.");
    } finally {
      setDeletingId(null);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Mutations for deletion
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);
  const deleteRating = useMutation(api.ratings.deleteRating);

  // Clear edit mode on tab change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditMode(false);
      setSelectedItems(new Set());
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleToggleSelectItem = (mediaType: string, mediaId: string) => {
    const key = `${mediaType}-${mediaId}`;
    const updated = new Set(selectedItems);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setSelectedItems(updated);
  };

  const handleSelectAll = (items: { mediaId: string; mediaType: string }[]) => {
    const updated = new Set<string>();
    if (selectedItems.size < items.length) {
      items.forEach((item) => updated.add(`${item.mediaType}-${item.mediaId}`));
    }
    setSelectedItems(updated);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedItems.size} selected items?`)) return;

    setIsBulkDeleting(true);
    const itemsToDelete = Array.from(selectedItems).map((key) => {
      const [mediaType, mediaId] = key.split("-");
      return { mediaType, mediaId };
    });

    try {
      for (const item of itemsToDelete) {
        if (activeTab === "watchlist") {
          await removeFromWatchlist({ mediaId: item.mediaId, mediaType: item.mediaType });
        } else if (activeTab === "favorites") {
          await removeFromFavorites({ mediaId: item.mediaId, mediaType: item.mediaType });
        } else if (activeTab === "ratings") {
          await deleteRating({ mediaId: item.mediaId, mediaType: item.mediaType });
        }
      }
      toast.success(`Successfully removed ${itemsToDelete.length} items!`);
      setSelectedItems(new Set());
      setIsEditMode(false);
    } catch {
      toast.error("Failed to delete some selected items.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const renderEditToolbar = (items: { mediaId: string; mediaType: string }[] | undefined) => {
    if (!isOwner || !items || items.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950/20 mb-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "rounded-xl text-xs font-semibold cursor-pointer h-9 border-zinc-800",
              isEditMode && "bg-zinc-900 border-zinc-700 text-white"
            )}
          >
            {isEditMode ? "Exit Edit Mode" : "Edit List"}
          </Button>
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectAll(items)}
              className="rounded-xl text-xs font-semibold h-9 text-zinc-400 hover:text-white cursor-pointer"
            >
              {selectedItems.size === items.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>

        {isEditMode && selectedItems.size > 0 && (
          <Button
            size="sm"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="rounded-xl text-xs font-bold h-9 bg-red-600 hover:bg-red-500 text-white border-red-500 cursor-pointer shadow-md flex items-center gap-1.5"
          >
            {isBulkDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Remove Selected ({selectedItems.size})
          </Button>
        )}
      </div>
    );
  };

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
  const diary = useQuery(
    api.diary.getUserDiary,
    targetUserId && !showLockScreen ? { userId: targetUserId } : "skip"
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
    { id: "diary" as const, label: "Diary", count: diary ? diary.length : 0, visible: true },
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

          {activeTab === "diary" && (
            <>
              {!diary ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : diary.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
                  <Calendar className="h-10 w-10 text-zinc-700 mb-1" />
                  <p className="text-zinc-400 text-sm font-medium">No watch entries logged yet.</p>
                </div>
              ) : (
                <div className="relative border-l border-zinc-800 ml-4 pl-6 sm:pl-8 space-y-8 py-4">
                  {(() => {
                    const groups: { [key: string]: typeof diary } = {};
                    diary.forEach((entry) => {
                      const dateKey = new Date(entry.watchedDate).toISOString().split("T")[0];
                      if (!groups[dateKey]) {
                        groups[dateKey] = [];
                      }
                      groups[dateKey].push(entry);
                    });

                    const sortedDateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

                    return sortedDateKeys.map((dateKey) => {
                      const entries = groups[dateKey];
                      const dateObj = new Date(entries[0].watchedDate);
                      const dateStr = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div key={dateKey} className="space-y-3.5 relative">
                          {/* Day Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full shadow-inner leading-none select-none">
                              {dateStr}
                            </span>
                            <div className="flex-1 h-px bg-zinc-900/50" />
                          </div>

                          {/* Watches on same day grouped closely */}
                          <div className="space-y-3">
                            {entries.map((entry) => (
                              <div
                                key={entry._id}
                                className="relative group flex items-start gap-4 bg-zinc-900/10 hover:bg-zinc-900/30 p-4 border border-zinc-900/50 hover:border-zinc-800 rounded-2xl transition-all duration-300 shadow-md"
                              >
                                {/* Timeline dot */}
                                <div className="absolute left-[-31px] sm:left-[-39px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-zinc-950 border-2 border-primary ring-4 ring-background" />

                                {/* Thumbnail poster */}
                                <div className="relative h-20 w-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 shadow-md">
                                  {entry.posterPath ? (
                                    <img
                                      src={`https://image.tmdb.org/t/p/w92${entry.posterPath}`}
                                      alt={entry.title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : null}
                                  {entry.rewatch && (
                                    <div
                                      className="absolute top-1 right-1 bg-emerald-600/90 text-white rounded-full p-0.5 shadow border border-emerald-500/30 flex items-center justify-center"
                                      title="Rewatch"
                                    >
                                      <History className="h-2.5 w-2.5 stroke-[2.5]" />
                                    </div>
                                  )}
                                </div>

                                {/* Watch Details */}
                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                                    <Link href={`/${entry.mediaType}/${entry.mediaId}`}>
                                      <h3 className="font-bold text-white text-sm hover:underline cursor-pointer">
                                        {entry.title}
                                      </h3>
                                    </Link>
                                    {isOwner && (
                                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                          onClick={() => setEditingEntry(entry)}
                                          className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                                          title="Edit Watch Log"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteDiary(entry._id)}
                                          disabled={deletingId === entry._id}
                                          className="p-1 rounded-lg hover:bg-red-950/20 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors disabled:opacity-50 animate-in fade-in duration-100"
                                          title="Delete Watch Log"
                                        >
                                          {deletingId === entry._id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Trash2 className="h-3.5 w-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg text-zinc-400 font-bold uppercase tracking-wide">
                                      {entry.mediaType} • {entry.releaseYear}
                                    </span>
                                    {entry.rating && (
                                      <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span>{entry.rating}/10</span>
                                      </div>
                                    )}
                                  </div>

                                  {entry.review && (
                                    <p className="text-xs text-zinc-400 italic bg-zinc-950/40 border border-zinc-900/80 p-2.5 rounded-xl mt-2 leading-relaxed whitespace-pre-wrap max-w-2xl relative">
                                      &ldquo;{entry.review}&rdquo;
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
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
                <>
                  {renderEditToolbar(watchlist)}
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
                        <div key={item._id} className="relative group/card-wrapper cursor-pointer">
                          <Card
                            media={mediaItem}
                            onQuickView={setQuickViewMedia}
                            onAuthRequired={openAuth}
                          />
                          {isEditMode && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectItem(item.mediaType, item.mediaId);
                              }}
                              className="absolute inset-0 bg-black/45 backdrop-blur-[1px] rounded-2xl z-35 flex items-center justify-center transition-all"
                            >
                              <div className={cn(
                                "h-8 w-8 rounded-xl border flex items-center justify-center transition-all shadow-md",
                                selectedItems.has(`${item.mediaType}-${item.mediaId}`)
                                  ? "bg-blue-600 border-blue-500 text-white scale-110"
                                  : "bg-black/60 border-zinc-700 text-transparent hover:border-zinc-500"
                              )}>
                                <Check className="h-5 w-5 stroke-3" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
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
                <>
                  {renderEditToolbar(favorites)}
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
                        <div key={item._id} className="relative group/card-wrapper cursor-pointer">
                          <Card
                            media={mediaItem}
                            onQuickView={setQuickViewMedia}
                            onAuthRequired={openAuth}
                          />
                          {isEditMode && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectItem(item.mediaType, item.mediaId);
                              }}
                              className="absolute inset-0 bg-black/45 backdrop-blur-[1px] rounded-2xl z-35 flex items-center justify-center transition-all"
                            >
                              <div className={cn(
                                "h-8 w-8 rounded-xl border flex items-center justify-center transition-all shadow-md",
                                selectedItems.has(`${item.mediaType}-${item.mediaId}`)
                                  ? "bg-blue-600 border-blue-500 text-white scale-110"
                                  : "bg-black/60 border-zinc-700 text-transparent hover:border-zinc-500"
                              )}>
                                <Check className="h-5 w-5 stroke-3" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
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
                <>
                  {renderEditToolbar(ratings)}
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
                        <div key={item._id} className="relative group/card-wrapper cursor-pointer">
                          <Card
                            media={mediaItem}
                            onQuickView={setQuickViewMedia}
                            onAuthRequired={openAuth}
                          />
                          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-blue-600/90 border border-blue-400/30 text-white shadow-lg pointer-events-none">
                            <Star className="h-3 w-3 fill-current text-yellow-300" />
                            <span>{item.rating}/10</span>
                          </div>
                          {isEditMode && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectItem(item.mediaType, item.mediaId);
                              }}
                              className="absolute inset-0 bg-black/45 backdrop-blur-[1px] rounded-2xl z-35 flex items-center justify-center transition-all"
                            >
                              <div className={cn(
                                "h-8 w-8 rounded-xl border flex items-center justify-center transition-all shadow-md",
                                selectedItems.has(`${item.mediaType}-${item.mediaId}`)
                                  ? "bg-blue-600 border-blue-500 text-white scale-110"
                                  : "bg-black/60 border-zinc-700 text-transparent hover:border-zinc-500"
                              )}>
                                <Check className="h-5 w-5 stroke-3" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
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

      {/* Edit Watch Log Modal */}
      {editingEntry && (
        <LogWatchModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          mediaId={editingEntry.mediaId}
          mediaType={editingEntry.mediaType}
          title={editingEntry.title}
          posterPath={editingEntry.posterPath}
          releaseYear={editingEntry.releaseYear}
          diaryId={editingEntry._id}
          initialWatchedDate={editingEntry.watchedDate}
          initialRewatch={editingEntry.rewatch}
          initialRating={editingEntry.rating}
          initialReview={editingEntry.review}
        />
      )}
    </div>
  );
}
