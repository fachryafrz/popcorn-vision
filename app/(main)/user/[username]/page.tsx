"use client";

import { useState, use, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import {
  User as UserIcon,
  Loader2,
  Grid,
  Bookmark,
  Heart,
  Star,
  UserX,
} from "lucide-react";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "@/components/quick-view-modal";
import { TMDBMedia } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LogWatchModal from "@/components/log-watch-modal";
import ContinueWatchingCard from "@/components/continue-watching-card";
import { Play } from "lucide-react";

// Modular Subcomponents
import { UserDoc, DiaryItem } from "@/components/profile/types";
import { ProfileHeader } from "@/components/profile/profile-header";
import { LockScreen } from "@/components/profile/lock-screen";
import { FriendsDialog } from "@/components/profile/friends-dialog";
import { EditToolbar } from "@/components/profile/edit-toolbar";
import { DiaryTab } from "@/components/profile/diary-tab";
import {
  MediaGridTab,
  GridMediaItem,
} from "@/components/profile/media-grid-tab";
import { InsightsTab } from "@/components/profile/insights-tab";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "watchlist"
    | "favorites"
    | "ratings"
    | "diary"
    | "continueWatching"
    | "insights"
  >("all");
  const [showFriendsDialog, setShowFriendsDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteDiaryEntry = useMutation(api.diary.deleteDiaryEntry);

  const handleDeleteDiary = async (diaryId: string) => {
    if (!confirm("Are you sure you want to delete this watch log entry?"))
      return;
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
    if (
      !confirm(
        `Are you sure you want to delete the ${selectedItems.size} selected items?`,
      )
    )
      return;

    setIsBulkDeleting(true);
    const itemsToDelete = Array.from(selectedItems).map((key) => {
      const [mediaType, mediaId] = key.split("-");
      return { mediaType, mediaId };
    });

    try {
      for (const item of itemsToDelete) {
        if (activeTab === "watchlist") {
          await removeFromWatchlist({
            mediaId: item.mediaId,
            mediaType: item.mediaType,
          });
        } else if (activeTab === "favorites") {
          await removeFromFavorites({
            mediaId: item.mediaId,
            mediaType: item.mediaType,
          });
        } else if (activeTab === "ratings") {
          await deleteRating({
            mediaId: item.mediaId,
            mediaType: item.mediaType,
          });
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

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUser = session.data?.user;
  const isOwner = currentUser && currentUser.username === username;

  // Query social profile detailed context
  const profileData = useQuery(api.social.getUserSocialProfile, { username });
  const targetUser =
    profileData && !profileData.isBlocked
      ? (profileData.user as UserDoc)
      : null;
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
  const showLockScreen =
    !isOwner && (isPrivate || (isFriendsOnly && !isFriend));

  // Individual visibility flags
  const showWatchlistTab = isOwner || !targetUser?.hideWatchlist;
  const showFavoritesTab = isOwner || !targetUser?.hideFavorites;
  const showRatingsTab = isOwner || !targetUser?.hideRatings;

  // Query target user lists if profile exists and content is visible
  const watchlist = useQuery(
    api.watchlist.getPublicWatchlist,
    targetUserId && showWatchlistTab && !showLockScreen
      ? { userId: targetUserId }
      : "skip",
  ) as GridMediaItem[] | undefined;
  const favorites = useQuery(
    api.favorites.getPublicFavorites,
    targetUserId && showFavoritesTab && !showLockScreen
      ? { userId: targetUserId }
      : "skip",
  ) as GridMediaItem[] | undefined;
  const ratings = useQuery(
    api.ratings.getUserRatings,
    targetUserId && showRatingsTab && !showLockScreen
      ? { userId: targetUserId }
      : "skip",
  ) as GridMediaItem[] | undefined;
  const diary = useQuery(
    api.diary.getUserDiary,
    targetUserId && !showLockScreen ? { userId: targetUserId } : "skip",
  ) as DiaryItem[] | undefined;

  const continueWatching = useQuery(
    api.continueWatching.getProgress,
    isOwner && isLoggedIn ? {} : "skip",
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
        if (
          confirm(
            `Are you sure you want to remove ${targetUser.name} from friends?`,
          )
        ) {
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
  const allItemsMap = new Map<string, GridMediaItem>();

  if (watchlist) {
    watchlist.forEach((item) => {
      const key = `${item.mediaType}-${item.mediaId}`;
      allItemsMap.set(key, {
        mediaId: item.mediaId,
        mediaType: item.mediaType,
        title: item.title,
        posterPath: item.posterPath,
        releaseYear: item.releaseYear,
        rating: item.rating,
        addedAt: item.addedAt,
        isWatchlist: true,
      });
    });
  }

  if (favorites) {
    favorites.forEach((item) => {
      const key = `${item.mediaType}-${item.mediaId}`;
      const existing = allItemsMap.get(key);
      if (existing) {
        existing.isFavorite = true;
        if (
          item.addedAt &&
          existing.addedAt &&
          item.addedAt > existing.addedAt
        ) {
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
    ratings.forEach((item) => {
      const key = `${item.mediaType}-${item.mediaId}`;
      const existing = allItemsMap.get(key);
      if (existing) {
        existing.rating = item.rating;
        if (
          item.addedAt &&
          existing.addedAt &&
          item.addedAt > existing.addedAt
        ) {
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

  const allItems = Array.from(allItemsMap.values()).sort((a, b) => {
    const aTime = a.addedAt || 0;
    const bTime = b.addedAt || 0;
    return bTime - aTime;
  });

  // Loading states
  const loadingProfile = profileData === undefined;

  if (loadingProfile) {
    return (
      <div className="flex min-h-[50vh] grow items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <UserIcon className="mb-4 h-16 w-16 text-zinc-700" />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          User Not Found
        </h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          The user{" "}
          <span className="font-semibold text-blue-400">@{username}</span> does
          not exist or has not created a profile yet.
        </p>
      </div>
    );
  }

  // Handle Deactivated State
  if ("isDeactivated" in profileData && profileData.isDeactivated) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <UserX className="text-zinc-650 mb-4 h-16 w-16 animate-pulse" />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Account Deactivated
        </h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          The user{" "}
          <span className="font-semibold text-blue-400">@{username}</span> has
          temporarily deactivated their account.
        </p>
      </div>
    );
  }

  // Handle Blocked State
  if (profileData.isBlocked) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <UserX className="mb-4 h-16 w-16 text-red-500/80" />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Profile Unavailable
        </h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          {profileData.blockedByMe
            ? "You have blocked this user. Unblock them to view their profile."
            : "This profile is not available to you."}
        </p>
        {profileData.blockedByMe && targetUserId && (
          <Button
            type="button"
            onClick={async () => {
              try {
                await unblockMutation({ targetUserId });
              } catch (e) {
                console.error(e);
              }
            }}
            className="cursor-pointer rounded-2xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200"
          >
            Unblock User
          </Button>
        )}
      </div>
    );
  }

  const getFallbackIcon = () => {
    if (activeTab === "watchlist")
      return <Bookmark className="h-12 w-12 text-zinc-800" />;
    if (activeTab === "favorites")
      return <Heart className="h-12 w-12 text-zinc-800" />;
    if (activeTab === "ratings")
      return <Star className="h-12 w-12 text-zinc-800" />;
    return <Grid className="h-12 w-12 text-zinc-800" />;
  };

  const getEmptyMessage = () => {
    if (activeTab === "watchlist")
      return "This user's watchlist is currently empty.";
    if (activeTab === "favorites")
      return "This user's favorites list is currently empty.";
    if (activeTab === "ratings")
      return "This user hasn't rated any movies or TV shows yet.";
    return "This user hasn't added any titles to their lists or submitted any ratings yet.";
  };

  // Define tab navigation dynamically based on visitor visibility settings
  const tabsList = [
    { id: "all" as const, label: "All", count: allItems.length, visible: true },
    {
      id: "continueWatching" as const,
      label: "Continue Watching",
      count: continueWatching ? continueWatching.length : 0,
      visible: isOwner,
    },
    {
      id: "diary" as const,
      label: "Diary",
      count: diary ? diary.length : 0,
      visible: true,
    },
    {
      id: "insights" as const,
      label: "Insights",
      count: diary ? diary.length : 0,
      visible: true,
    },
    {
      id: "watchlist" as const,
      label: "Watchlist",
      count: watchlist ? watchlist.length : 0,
      visible: showWatchlistTab,
    },
    {
      id: "favorites" as const,
      label: "Favorites",
      count: favorites ? favorites.length : 0,
      visible: showFavoritesTab,
    },
    {
      id: "ratings" as const,
      label: "Ratings",
      count: ratings ? ratings.length : 0,
      visible: showRatingsTab,
    },
  ].filter((t) => t.visible);

  return (
    <div
      className="bg-background text-foreground relative mx-auto min-h-[85vh] w-full max-w-7xl grow rounded-3xl px-6 py-24 transition-colors duration-300 sm:px-12 md:px-16 lg:px-20"
      data-theme={targetUser?.theme || "dark"}
    >
      {/* Header Profile Info card */}
      <ProfileHeader
        targetUser={targetUser}
        friendCount={profileData.friendCount ?? 0}
        friendshipStatus={profileData.friendshipStatus ?? "none"}
        isOwner={isOwner || false}
        friendLoading={friendLoading}
        handleFriendAction={handleFriendAction}
        setShowFriendsDialog={setShowFriendsDialog}
      />

      {showLockScreen ? (
        <LockScreen isFriendsOnly={isFriendsOnly} />
      ) : (
        <>
          {/* Tabs */}
          <div className="mb-8 flex scrollbar-none gap-6 overflow-x-auto border-b border-zinc-900 text-sm">
            {tabsList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "cursor-pointer border-b-2 pb-4 text-xs font-bold tracking-wider uppercase transition-all",
                  activeTab === tab.id
                    ? "text-primary border-primary font-extrabold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === "diary" ? (
            <DiaryTab
              diary={diary}
              isOwner={isOwner || false}
              deletingId={deletingId}
              handleDeleteDiary={handleDeleteDiary}
              setEditingEntry={setEditingEntry}
            />
          ) : activeTab === "insights" ? (
            <InsightsTab diary={diary} user={targetUser} />
          ) : activeTab === "continueWatching" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {continueWatching && continueWatching.length > 0 ? (
                continueWatching.map((item) => (
                  <ContinueWatchingCard key={item._id} item={item} />
                ))
              ) : (
                <div className="col-span-full flex min-h-[30vh] flex-col items-center justify-center text-center">
                  <Play className="mb-4 h-12 w-12 text-zinc-800" />
                  <p className="text-sm text-zinc-500">
                    Your Continue Watching list is empty.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {activeTab !== "all" && (
                <EditToolbar
                  isOwner={isOwner || false}
                  items={
                    activeTab === "watchlist"
                      ? watchlist
                      : activeTab === "favorites"
                        ? favorites
                        : ratings
                  }
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                  selectedItems={selectedItems}
                  handleSelectAll={handleSelectAll}
                  handleBulkDelete={handleBulkDelete}
                  isBulkDeleting={isBulkDeleting}
                />
              )}
              <MediaGridTab
                activeTab={activeTab}
                items={
                  activeTab === "all"
                    ? allItems
                    : activeTab === "watchlist"
                      ? watchlist
                      : activeTab === "favorites"
                        ? favorites
                        : ratings
                }
                isEditMode={isEditMode}
                selectedItems={selectedItems}
                handleToggleSelectItem={handleToggleSelectItem}
                setQuickViewMedia={setQuickViewMedia}
                openAuth={openAuth}
                fallbackIcon={getFallbackIcon()}
                emptyMessage={getEmptyMessage()}
              />
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

      {/* Friends List Dialog */}
      <FriendsDialog
        isOpen={showFriendsDialog}
        onOpenChange={setShowFriendsDialog}
        friendCount={profileData?.friendCount ?? 0}
        friends={profileData?.friends}
      />
    </div>
  );
}
