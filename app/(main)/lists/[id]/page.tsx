"use client";

import React, { useState, use, useMemo, useCallback } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ChevronLeft,
  UserPlus,
  Film,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TMDBMedia } from "@/lib/tmdb";
import QuickViewModal from "@/components/quick-view-modal";
import { useQuickViewMediaState } from "@/hooks/use-query-modal-state";
import { useConfirm } from "@/components/ui/confirm-provider";

// Modular Custom Lists Sub-components
import {
  CustomList,
  CustomListItem,
  CustomListComment,
  ListCreator,
} from "@/components/custom-lists/types";
import ListHeader from "@/components/custom-lists/list-header";
import EditListDialog from "@/components/custom-lists/edit-list-dialog";
import ManageCollaboratorsDialog from "@/components/custom-lists/manage-collaborators-dialog";
import AddListItemSearch from "@/components/custom-lists/add-list-item-search";
import ListItemCard from "@/components/custom-lists/list-item-card";
import ListCommentsSection from "@/components/custom-lists/list-comments-section";

interface CustomListDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CustomListDetailPage({
  params,
}: CustomListDetailPageProps) {
  const { id } = use(params);
  const listId = id as Id<"customLists">;

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUser = session.data?.user;

  const router = useRouter();
  const confirm = useConfirm();

  // Queries
  const detail = useQuery(api.customLists.getListDetail, { listId }) as
    | {
        list: CustomList;
        creator: ListCreator | null;
        items: CustomListItem[];
        likeCount: number;
        isLiked: boolean;
        isFavorited: boolean;
        collaborators: ListCreator[];
        comments: CustomListComment[];
        unauthorized?: undefined;
      }
    | { unauthorized: true }
    | undefined;

  // Fetch current user's profile and friends for invites
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );
  const userSocialProfile = useQuery(
    api.social.getUserSocialProfile,
    isLoggedIn && currentUserProfile
      ? { username: currentUserProfile.username }
      : "skip",
  );
  const friends = userSocialProfile?.friends || [];

  // Mutations
  const addItemMutation = useMutation(api.customLists.addItem);
  const removeItemMutation = useMutation(api.customLists.removeItem);
  const updateListMutation = useMutation(api.customLists.updateList);
  const deleteListMutation = useMutation(api.customLists.deleteList);
  const inviteCollaboratorMutation = useMutation(
    api.customLists.inviteCollaborator,
  );
  const removeCollaboratorMutation = useMutation(
    api.customLists.removeCollaborator,
  );
  const toggleLikeMutation = useMutation(api.customLists.toggleLikeList);
  const toggleFavoriteMutation = useMutation(
    api.customLists.toggleFavoriteList,
  );
  const addCommentMutation = useMutation(api.customLists.addListComment);
  const deleteCommentMutation = useMutation(api.customLists.deleteListComment);
  const toggleItemWatchedMutation = useMutation(
    api.customLists.toggleItemWatched,
  );
  const toggleItemVoteMutation = useMutation(api.customLists.toggleItemVote);

  // Modal States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedMediaRef, setSelectedMediaRef] = useQuickViewMediaState();

  const selectedMedia = useMemo<TMDBMedia | null>(() => {
    if (!selectedMediaRef) return null;
    return {
      id: Number(selectedMediaRef.id),
      media_type: selectedMediaRef.media_type,
    } as TMDBMedia;
  }, [selectedMediaRef]);

  const setSelectedMedia = useCallback(
    (media: TMDBMedia | null) => {
      if (media) {
        setSelectedMediaRef({
          id: String(media.id),
          media_type: media.media_type || "movie",
        });
      } else {
        setSelectedMediaRef(null);
      }
    },
    [setSelectedMediaRef],
  );

  // Watchlist filter/sort state
  const [statusFilter, setStatusFilter] = useState<
    "all" | "watched" | "unwatched"
  >("all");
  const [sortBy, setSortBy] = useState<"recently_added" | "most_upvotes">(
    "most_upvotes",
  );

  if (detail === undefined) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if ("unauthorized" in detail && detail.unauthorized) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <Lock className="h-8 w-8 text-zinc-400" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
          This List is Private
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          You do not have permission to view this custom list. The creator has
          restricted access to list members and collaborators only.
        </p>
        <Link
          href="/lists"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-white px-6 font-bold text-black hover:bg-zinc-200"
        >
          Back to Custom Lists
        </Link>
      </div>
    );
  }

  const {
    list,
    creator,
    items,
    likeCount,
    isLiked,
    isFavorited,
    collaborators,
    comments,
  } = detail;

  const filteredAndSortedItems = [...items]
    .filter((item) => {
      if (!list.isWatchlist) return true;
      if (statusFilter === "watched") return !!item.watched;
      if (statusFilter === "unwatched") return !item.watched;
      return true;
    })
    .sort((a, b) => {
      if (!list.isWatchlist) return 0;
      if (sortBy === "most_upvotes") {
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        return b.addedAt - a.addedAt;
      }
      return b.addedAt - a.addedAt;
    });

  const isOwner = creator?.userId === currentUser?.id;
  const isCollaborator =
    list.isCollaborative &&
    (isOwner || collaborators.some((c) => c.userId === currentUser?.id));
  const canModify = isOwner || isCollaborator;

  // Handlers
  const handleAddItem = async (media: TMDBMedia) => {
    try {
      await addItemMutation({
        listId,
        mediaId: String(media.id),
        mediaType: media.media_type || "movie",
        title: media.title || media.name || "",
        posterPath: media.poster_path || "",
        releaseYear: media.release_date
          ? String(new Date(media.release_date).getFullYear())
          : "N/A",
      });
      toast.success(`Added ${media.title || media.name} to the list`);
    } catch {
      toast.error("Failed to add title to list");
    }
  };

  const handleRemoveItem = async (
    mediaId: string,
    mediaType: string,
    title: string,
  ) => {
    if (
      !(await confirm({
        title: "Remove Item",
        description: `Are you sure you want to remove ${title}?`,
        confirmText: "Remove",
      }))
    )
      return;
    try {
      await removeItemMutation({ listId, mediaId, mediaType });
      toast.success(`Removed ${title} from the list`);
    } catch {
      toast.error("Failed to remove title");
    }
  };

  const handleInvite = async (userId: string, name: string) => {
    try {
      await inviteCollaboratorMutation({ listId, userId });
      toast.success(`Sent collaborator invitation to ${name}`);
    } catch {
      toast.error("Failed to send collaborator invitation");
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    const isSelf = userId === currentUser?.id;
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this collaborative list?"
      : `Are you sure you want to remove ${name} from this list?`;

    if (
      !(await confirm({
        title: isSelf ? "Leave List" : "Remove Member",
        description: confirmMsg,
        confirmText: isSelf ? "Leave" : "Remove",
      }))
    )
      return;

    try {
      await removeCollaboratorMutation({ listId, userId });
      toast.success(
        isSelf ? "You have left the list" : `Removed ${name} from the list`,
      );
      if (isSelf) {
        router.push("/lists");
      }
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to like lists");
      return;
    }
    try {
      const liked = await toggleLikeMutation({ listId });
      toast.success(liked ? "Liked list!" : "Unliked list.");
    } catch {
      toast.error("Failed to toggle like");
    }
  };

  const handleToggleWatched = async (mediaId: string, mediaType: string) => {
    try {
      await toggleItemWatchedMutation({ listId, mediaId, mediaType });
    } catch {
      toast.error("Failed to update watched status");
    }
  };

  const handleToggleVote = async (mediaId: string, mediaType: string) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to vote");
      return;
    }
    try {
      await toggleItemVoteMutation({ listId, mediaId, mediaType });
    } catch {
      toast.error("Failed to toggle vote");
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to save lists to favorites");
      return;
    }
    try {
      const saved = await toggleFavoriteMutation({ listId });
      toast.success(
        saved ? "Saved list to favorites!" : "Removed from favorites.",
      );
    } catch {
      toast.error("Failed to toggle favorite");
    }
  };

  const handleUpdateList = async (data: {
    name: string;
    description: string;
    privacy: "public" | "private";
    isCollaborative: boolean;
    isWatchlist: boolean;
  }) => {
    try {
      await updateListMutation({
        listId,
        name: data.name,
        description: data.description || undefined,
        privacy: data.privacy,
        isCollaborative: data.isCollaborative,
        isWatchlist: data.isCollaborative ? data.isWatchlist : false,
      });
      toast.success("List updated!");
    } catch {
      toast.error("Failed to update list");
    }
  };

  const handleDeleteList = async () => {
    if (
      !(await confirm({
        title: "Delete List",
        description:
          "Are you sure you want to permanently delete this list? This cannot be undone.",
        confirmText: "Delete",
      }))
    )
      return;
    try {
      await deleteListMutation({ listId });
      toast.success("List deleted successfully!");
      router.push("/lists");
    } catch {
      toast.error("Failed to delete list");
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await addCommentMutation({ listId, content });
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId: Id<"customListComments">) => {
    if (
      !(await confirm({
        title: "Delete Comment",
        description: "Are you sure you want to delete this comment?",
        confirmText: "Delete",
      }))
    )
      return;
    try {
      await deleteCommentMutation({ commentId });
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mx-auto min-h-[85vh] w-full max-w-7xl px-6 py-24 text-white sm:px-12 md:px-16 lg:px-20">
      {/* Back Link */}
      <Link
        href="/lists"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Lists
      </Link>

      {/* Hero Header Card */}
      <ListHeader
        list={list}
        creator={creator}
        collaborators={collaborators}
        likeCount={likeCount}
        isLiked={isLiked}
        isFavorited={isFavorited}
        onToggleLike={handleToggleLike}
        onToggleFavorite={handleToggleFavorite}
        onOpenMembers={() => setIsMembersOpen(true)}
        actionSlot={
          <>
            {isOwner && (
              <EditListDialog
                list={list}
                onUpdate={handleUpdateList}
                onDelete={handleDeleteList}
              />
            )}
            {list.isCollaborative && isOwner && (
              <Button
                onClick={() => setIsInviteOpen(true)}
                className="cursor-pointer gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-black hover:bg-zinc-200"
              >
                <UserPlus className="h-4 w-4" /> Add Collaborator
              </Button>
            )}
          </>
        }
      />

      {/* Collaborators Dialogs */}
      <ManageCollaboratorsDialog
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        isMembersOpen={isMembersOpen}
        setIsMembersOpen={setIsMembersOpen}
        friends={friends}
        collaborators={collaborators}
        creator={creator}
        currentUserId={currentUser?.id}
        isOwner={isOwner}
        onInvite={handleInvite}
        onRemoveMember={handleRemoveMember}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main list items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Add Item search (Owner and Collaborators only) */}
          {canModify && (
            <AddListItemSearch items={items} onAddItem={handleAddItem} />
          )}

          {/* Watchlist Filter & Sort Options */}
          {list.isWatchlist && items.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {(["all", "unwatched", "watched"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-all ${
                      statusFilter === f
                        ? "bg-white font-extrabold text-black"
                        : "border border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Sort:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSortBy("recently_added")}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      sortBy === "recently_added"
                        ? "bg-primary/10 text-primary font-extrabold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Recently Added
                  </button>
                  <button
                    onClick={() => setSortBy("most_upvotes")}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      sortBy === "most_upvotes"
                        ? "bg-primary/10 text-primary font-extrabold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Most Upvotes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List items grid/list */}
          {items.length === 0 ? (
            <Card className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Film className="text-zinc-650 mb-4 h-12 w-12" />
                <h3 className="text-lg font-bold text-zinc-300">
                  This list is empty
                </h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  {canModify
                    ? "Search and add movies or TV shows above."
                    : "The curator hasn't added any titles yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-500 italic">
                  No titles match the selected filter.
                </p>
              ) : (
                filteredAndSortedItems.map((item) => (
                  <ListItemCard
                    key={item._id}
                    item={item}
                    isWatchlist={list.isWatchlist}
                    canModify={canModify}
                    onSelectMedia={setSelectedMedia}
                    onToggleVote={handleToggleVote}
                    onToggleWatched={handleToggleWatched}
                    onRemoveItem={handleRemoveItem}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar Comments Section */}
        <div className="space-y-6">
          <ListCommentsSection
            comments={comments}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUser?.id}
            isOwner={isOwner}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedMedia && (
        <QuickViewModal
          media={selectedMedia}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
