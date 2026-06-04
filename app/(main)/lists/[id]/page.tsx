"use client";

import React, { useState, use, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Search,
  Loader2,
  Calendar,
  Trash2,
  ChevronLeft,
  UserPlus,
  X,
  Film,
  Heart,
  Star,
  Globe,
  Lock,
  MessageSquare,
  Edit2,
  ThumbsUp,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import QuickViewModal from "@/components/quick-view-modal";
import { useConfirm } from "@/components/ui/confirm-provider";
import { siteConfig } from "@/config/site";

interface ListCreator {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

interface CustomList {
  _id: Id<"customLists">;
  name: string;
  description?: string;
  createdById: string;
  createdAt: number;
  privacy: string;
  isCollaborative: boolean;
  isWatchlist?: boolean;
}

interface CustomListItem {
  _id: Id<"customListItems">;
  listId: Id<"customLists">;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  releaseYear: string;
  addedById: string;
  addedAt: number;
  addedByUser: {
    userId: string;
    username: string;
    name: string;
  } | null;
  watched?: boolean;
  watchedAt?: number;
  watchedById?: string;
  watchedByUser?: {
    userId: string;
    username: string;
    name: string;
  } | null;
  voteCount: number;
  userVote: number;
}

interface CustomListComment {
  _id: Id<"customListComments">;
  listId: Id<"customLists">;
  userId: string;
  content: string;
  createdAt: number;
  author: {
    userId: string;
    name: string;
    username: string;
    image?: string;
  };
}

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

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMedia[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);

  // Edit list states
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrivacy, setEditPrivacy] = useState<"public" | "private">(
    "public",
  );
  const [editCollab, setEditCollab] = useState(false);
  const [editWatchlist, setEditWatchlist] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Comment state
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Watchlist filter/sort state
  const [statusFilter, setStatusFilter] = useState<
    "all" | "watched" | "unwatched"
  >("all");
  const [sortBy, setSortBy] = useState<"recently_added" | "most_upvotes">(
    "most_upvotes",
  );

  // Search effect with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchMedia(searchQuery);
        setSearchResults(results.slice(0, 5));
      } catch {
        toast.error("Failed to search movies/TV shows");
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
          <Lock className="text-zinc-400 h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">This List is Private</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          You do not have permission to view this custom list. The creator has restricted access to list members and collaborators only.
        </p>
        <Button
          onClick={() => router.push("/lists")}
          className="mt-6 rounded-full font-bold bg-white text-black hover:bg-zinc-200"
        >
          Back to Custom Lists
        </Button>
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
      } else {
        return b.addedAt - a.addedAt;
      }
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
      setSearchQuery("");
      setSearchResults([]);
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

  const handleUpdateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      await updateListMutation({
        listId,
        name: editName.trim(),
        description: editDesc.trim() || undefined,
        privacy: editPrivacy,
        isCollaborative: editCollab,
        isWatchlist: editCollab ? editWatchlist : false,
      });
      toast.success("List updated!");
      setIsEditOpen(false);
    } catch {
      toast.error("Failed to update list");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteList = async () => {
    if (
      !(await confirm({
        title: "Delete List",
        description: "Are you sure you want to permanently delete this list? This cannot be undone.",
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await addCommentMutation({ listId, content: newComment.trim() });
      setNewComment("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
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
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {list.name}
              </h1>
              <div className="flex gap-1.5">
                {list.privacy === "public" ? (
                  <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                    <Globe className="h-3 w-3" /> Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                    <Lock className="h-3 w-3" /> Private
                  </span>
                )}
                {list.isCollaborative && (
                  <span className="text-primary border-primary/30 bg-primary/10 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold">
                    <Users className="h-3 w-3" /> Collaborative
                  </span>
                )}
                {list.isWatchlist && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
                    Watchlist
                  </span>
                )}
              </div>
            </div>
            {list.description && (
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
                {list.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created {new Date(list.createdAt).toLocaleDateString()}
              </span>
              {creator && (
                <span>
                  by{" "}
                  <Link
                    href={`/@/${creator.username}`}
                    className="font-bold text-zinc-400 hover:text-white"
                  >
                    @{creator.username}
                  </Link>
                </span>
              )}
              {list.isCollaborative && (
                <button
                  onClick={() => setIsMembersOpen(true)}
                  className="flex cursor-pointer items-center gap-1.5 font-semibold text-zinc-400 transition-colors hover:text-white"
                >
                  <Users className="h-3.5 w-3.5" />
                  {collaborators.length}{" "}
                  {collaborators.length === 1
                    ? "collaborator"
                    : "collaborators"}
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {/* Like list */}
            <Button
              variant="outline"
              onClick={handleToggleLike}
              className={`rounded-xl border-zinc-800 transition-all ${
                isLiked
                  ? "text-rose-450 border-rose-900/40 bg-rose-950/25 hover:bg-rose-950/40"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isLiked ? "fill-rose-450" : ""}`}
              />
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </Button>

            {/* Favorite list */}
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={`rounded-xl border-zinc-800 transition-all ${
                isFavorited
                  ? "text-yellow-450 border-yellow-900/40 bg-yellow-950/25 hover:bg-yellow-950/40"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <Star
                className={`mr-2 h-4 w-4 ${isFavorited ? "fill-yellow-455" : ""}`}
              />
              {isFavorited ? "Favorited" : "Favorite"}
            </Button>

            {/* Edit List Dialog (Owner only) */}
            {isOwner && (
              <Dialog
                open={isEditOpen}
                onOpenChange={(open) => {
                  setIsEditOpen(open);
                  if (open && detail?.list) {
                    setEditName(detail.list.name);
                    setEditDesc(detail.list.description || "");
                    setEditPrivacy(detail.list.privacy as "public" | "private");
                    setEditCollab(detail.list.isCollaborative);
                    setEditWatchlist(detail.list.isWatchlist || false);
                  }
                }}
              >
                <DialogTrigger
                  render={
                    <Button
                      variant="outline"
                      className="cursor-pointer gap-2 rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    >
                      <Edit2 className="h-4 w-4" /> Edit List
                    </Button>
                  }
                />
                <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Edit List Details
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateList} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-name"
                        className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                      >
                        List Name
                      </label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-xl border-zinc-800 bg-zinc-900 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-desc"
                        className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                      >
                        Description (Optional)
                      </label>
                      <Textarea
                        id="edit-desc"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="min-h-24 resize-none rounded-xl border-zinc-800 bg-zinc-900 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-privacy"
                        className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                      >
                        Privacy
                      </label>
                      <Select
                        value={editPrivacy}
                        onValueChange={(val) =>
                          setEditPrivacy(val as "public" | "private")
                        }
                      >
                        <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-white">
                          <SelectValue placeholder="Select privacy" />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-850 rounded-xl border bg-zinc-950 text-white">
                          <SelectGroup>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col justify-end space-y-2 pb-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="edit-collab"
                          checked={editCollab}
                          onCheckedChange={(checked) => {
                            setEditCollab(!!checked);
                            if (!checked) setEditWatchlist(false);
                          }}
                          className="border-zinc-800 bg-zinc-900"
                        />
                        <label
                          htmlFor="edit-collab"
                          className="cursor-pointer text-xs font-bold text-zinc-300 select-none"
                        >
                          Collaborative List
                        </label>
                      </div>
                      {editCollab && (
                        <div className="mt-1.5 flex items-center gap-2 pl-6">
                          <Checkbox
                            id="edit-watchlist"
                            checked={editWatchlist}
                            onCheckedChange={(checked) =>
                              setEditWatchlist(!!checked)
                            }
                            className="border-zinc-800 bg-zinc-900"
                          />
                          <label
                            htmlFor="edit-watchlist"
                            className="cursor-pointer text-xs font-bold text-zinc-300 select-none"
                          >
                            Watchlist Mode (Voting & Watched status)
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteList}
                        className="rounded-xl font-bold"
                      >
                        Delete List
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditOpen(false)}
                          className="text-zinc-450 rounded-xl border-zinc-800 hover:bg-zinc-900 hover:text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="rounded-xl bg-white font-bold text-black hover:bg-zinc-200"
                        >
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Invite Collaborator (Collaborative & Owner only) */}
            {list.isCollaborative && isOwner && (
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger
                  render={
                    <Button className="cursor-pointer gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-black hover:bg-zinc-200">
                      <UserPlus className="h-4 w-4" /> Add Collaborator
                    </Button>
                  }
                />
                <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add Collaborators
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
                    {friends.length === 0 ? (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        Add friends on {siteConfig.name} first to invite them to
                        collaborate!
                      </p>
                    ) : (
                      friends
                        .filter(
                          (friend) =>
                            !collaborators.some(
                              (c) => c.userId === friend.userId,
                            ),
                        )
                        .map((friend) => (
                          <div
                            key={friend.userId}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-zinc-800">
                                {friend.image && (
                                  <AvatarImage
                                    src={friend.image}
                                    alt={friend.name}
                                  />
                                )}
                                <AvatarFallback className="bg-primary text-xs font-bold text-white">
                                  {friend.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {friend.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  @{friend.username}
                                </p>
                              </div>
                            </div>

                            <Button
                              size="xs"
                              onClick={() =>
                                handleInvite(friend.userId, friend.name)
                              }
                              className="rounded-lg bg-white text-black hover:bg-zinc-200"
                            >
                              Add
                            </Button>
                          </div>
                        ))
                    )}
                    {friends.length > 0 &&
                      friends.filter(
                        (friend) =>
                          !collaborators.some(
                            (c) => c.userId === friend.userId,
                          ),
                      ).length === 0 && (
                        <p className="py-6 text-center text-sm text-zinc-500">
                          All your friends are already collaborators!
                        </p>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* View Members / Collaborators Dialog */}
      <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              List Collaborators
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
            {collaborators.map((collab) => {
              const isCollabCreator = collab.userId === creator?.userId;
              const canRemove =
                (isOwner && !isCollabCreator) ||
                collab.userId === currentUser?.id;
              return (
                <div
                  key={collab.userId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {collab.image && (
                        <AvatarImage src={collab.image} alt={collab.name} />
                      )}
                      <AvatarFallback className="bg-primary text-xs font-bold text-white">
                        {collab.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="flex items-center gap-1 text-sm font-bold text-white">
                        {collab.name}
                        {isCollabCreator && (
                          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-400 uppercase">
                            Owner
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        @{collab.username}
                      </p>
                    </div>
                  </div>

                  {canRemove && (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        handleRemoveMember(collab.userId, collab.name)
                      }
                      className="h-8 rounded-lg"
                    >
                      {collab.userId === currentUser?.id ? "Leave" : "Remove"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main list items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Add Item search (Owner and Collaborators only) */}
          {canModify && (
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-4 h-5 w-5 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value.trim()) {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="Search movies or TV shows to add..."
                  className="w-full rounded-2xl border-zinc-800 bg-zinc-900/40 py-6 pr-10 pl-12 text-base text-white transition-all placeholder:text-zinc-500 hover:bg-zinc-900/60 focus:bg-zinc-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-4 text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute right-0 left-0 z-35 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                  {searchResults.map((media) => {
                    const alreadyAdded = items.some(
                      (item) => String(item.mediaId) === String(media.id),
                    );
                    return (
                      <div
                        key={media.id}
                        className="flex items-center justify-between gap-4 rounded-xl p-2.5 transition-colors hover:bg-zinc-900"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {media.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                              alt={media.title || media.name}
                              className="border-zinc-850 h-14 w-10 rounded-lg border bg-zinc-900 object-cover"
                            />
                          ) : (
                            <div className="border-zinc-850 flex h-14 w-10 items-center justify-center rounded-lg border bg-zinc-900">
                              <Film className="text-zinc-650 h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {media.title || media.name}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {media.release_date
                                ? new Date(media.release_date).getFullYear()
                                : "N/A"}{" "}
                              •{" "}
                              {media.media_type === "tv"
                                ? "TV Series"
                                : "Movie"}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          disabled={alreadyAdded}
                          onClick={() => handleAddItem(media)}
                          className={`h-9 rounded-xl px-4 font-bold ${
                            alreadyAdded
                              ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                              : "bg-white text-black hover:bg-zinc-200"
                          }`}
                        >
                          {alreadyAdded ? "Added" : "Add"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              {searchLoading && (
                <div className="absolute top-3.5 right-12 z-35">
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                </div>
              )}
            </div>
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
                filteredAndSortedItems.map((item) => {
                  const tmdbMedia = {
                    id: Number(item.mediaId),
                    title: item.mediaType === "movie" ? item.title : undefined,
                    name: item.mediaType === "tv" ? item.title : undefined,
                    media_type: item.mediaType as "movie" | "tv",
                    poster_path: item.posterPath,
                    release_date: `${item.releaseYear}-01-01`,
                    popularity: 0,
                  } as TMDBMedia;

                  return (
                    <div
                      key={item._id}
                      className="group relative flex items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/10 p-4 transition-all hover:bg-zinc-900/30"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          onClick={() => setSelectedMedia(tmdbMedia)}
                          className="shrink-0 cursor-pointer hover:opacity-85"
                        >
                          {item.posterPath ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w154${item.posterPath}`}
                              alt={item.title}
                              className="border-zinc-850 h-20 w-14 rounded-2xl border bg-zinc-900 object-cover"
                            />
                          ) : (
                            <div className="border-zinc-850 flex h-20 w-14 items-center justify-center rounded-2xl border bg-zinc-900">
                              <Film className="text-zinc-650 h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => setSelectedMedia(tmdbMedia)}
                              className="group-hover:text-primary cursor-pointer truncate text-base font-extrabold text-white transition-colors"
                            >
                              {item.title}
                            </h4>
                            <span className="text-zinc-550 shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase">
                              {item.mediaType}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            {item.releaseYear} • Added by{" "}
                            <span className="font-bold text-zinc-400">
                              {item.addedByUser
                                ? `@${item.addedByUser.username}`
                                : "member"}
                            </span>
                          </p>
                          {list.isWatchlist && item.watched && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Watched by{" "}
                              {item.watchedByUser
                                ? `@${item.watchedByUser.username}`
                                : "member"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {list.isWatchlist && (
                          <>
                            {/* Vote Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleToggleVote(item.mediaId, item.mediaType)
                              }
                              className={`h-9 gap-1.5 rounded-xl border-zinc-800 px-3 text-xs font-bold transition-all ${
                                item.userVote === 1
                                  ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400"
                                  : "text-zinc-400 hover:bg-zinc-900"
                              }`}
                            >
                              <ThumbsUp
                                className={`h-3.5 w-3.5 ${item.userVote === 1 ? "fill-current" : ""}`}
                              />
                              <span>{item.voteCount}</span>
                            </Button>

                            {/* Watched Toggle (Collaborators/Owner only) */}
                            {canModify && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleToggleWatched(
                                    item.mediaId,
                                    item.mediaType,
                                  )
                                }
                                className={`h-9 gap-1.5 rounded-xl border-zinc-800 px-3 text-xs font-bold transition-all ${
                                  item.watched
                                    ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400"
                                    : "text-zinc-400 hover:bg-zinc-900"
                                }`}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>
                                  {item.watched ? "Watched" : "Watch"}
                                </span>
                              </Button>
                            )}
                          </>
                        )}

                        {canModify && (
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.mediaId,
                                item.mediaType,
                                item.title,
                              )
                            }
                            className="text-zinc-450 shrink-0 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition-all hover:scale-105 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 active:scale-95"
                            title="Remove title"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Sidebar Comments Section */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6">
            <h3 className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-lg font-bold">
              <MessageSquare className="text-primary h-5 w-5" /> Comments
            </h3>

            {/* Comment Form */}
            {isLoggedIn ? (
              <form onSubmit={handleAddComment} className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this list..."
                  className="min-h-16 resize-none rounded-xl border-zinc-800 bg-zinc-900 text-xs text-white placeholder:text-zinc-500"
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submittingComment}
                    className="h-8 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-zinc-200"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="py-2 text-center text-xs text-zinc-500">
                Sign in to post comments.
              </p>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">
                No comments yet. Start the conversation!
              </p>
            ) : (
              <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
                {comments.map((comment) => {
                  const isCommentAuthor = comment.userId === currentUser?.id;
                  const canDelete = isOwner || isCommentAuthor;

                  return (
                    <div
                      key={comment._id}
                      className="flex gap-3 border-b border-zinc-900/50 pb-3 text-xs"
                    >
                      <Avatar className="h-7 w-7 shrink-0 border border-zinc-800">
                        {comment.author.image && (
                          <AvatarImage
                            src={comment.author.image}
                            alt={comment.author.name}
                          />
                        )}
                        <AvatarFallback className="bg-zinc-850 text-[10px] font-bold text-zinc-400">
                          {comment.author.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-zinc-300">
                            {comment.author.name}{" "}
                            <span className="font-normal text-zinc-500">
                              @{comment.author.username}
                            </span>
                          </p>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-zinc-500 transition-colors hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="leading-normal whitespace-pre-wrap text-zinc-400">
                          {comment.content}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
