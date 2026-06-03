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
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import QuickViewModal from "@/components/quick-view-modal";

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

  // Queries
  const detail = useQuery(
    api.customLists.getListDetail,
    { listId }
  ) as {
    list: CustomList;
    creator: ListCreator | null;
    items: CustomListItem[];
    likeCount: number;
    isLiked: boolean;
    isFavorited: boolean;
    collaborators: ListCreator[];
    comments: CustomListComment[];
  } | undefined;

  // Fetch current user's profile and friends for invites
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip"
  );
  const userSocialProfile = useQuery(
    api.social.getUserSocialProfile,
    isLoggedIn && currentUserProfile
      ? { username: currentUserProfile.username }
      : "skip"
  );
  const friends = userSocialProfile?.friends || [];

  // Mutations
  const addItemMutation = useMutation(api.customLists.addItem);
  const removeItemMutation = useMutation(api.customLists.removeItem);
  const updateListMutation = useMutation(api.customLists.updateList);
  const deleteListMutation = useMutation(api.customLists.deleteList);
  const addCollaboratorMutation = useMutation(api.customLists.addCollaborator);
  const removeCollaboratorMutation = useMutation(api.customLists.removeCollaborator);
  const toggleLikeMutation = useMutation(api.customLists.toggleLikeList);
  const toggleFavoriteMutation = useMutation(api.customLists.toggleFavoriteList);
  const addCommentMutation = useMutation(api.customLists.addListComment);
  const deleteCommentMutation = useMutation(api.customLists.deleteListComment);

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
  const [editPrivacy, setEditPrivacy] = useState<"public" | "private">("public");
  const [editCollab, setEditCollab] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Comment state
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);



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
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const { list, creator, items, likeCount, isLiked, isFavorited, collaborators, comments } = detail;

  const isOwner = creator?.userId === currentUser?.id;
  const isCollaborator = list.isCollaborative && (isOwner || collaborators.some((c) => c.userId === currentUser?.id));
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

  const handleRemoveItem = async (mediaId: string, mediaType: string, title: string) => {
    if (!confirm(`Are you sure you want to remove ${title}?`)) return;
    try {
      await removeItemMutation({ listId, mediaId, mediaType });
      toast.success(`Removed ${title} from the list`);
    } catch {
      toast.error("Failed to remove title");
    }
  };

  const handleInvite = async (userId: string, name: string) => {
    try {
      await addCollaboratorMutation({ listId, userId });
      toast.success(`Added ${name} as a collaborator`);
    } catch {
      toast.error("Failed to add collaborator");
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    const isSelf = userId === currentUser?.id;
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this collaborative list?"
      : `Are you sure you want to remove ${name} from this list?`;

    if (!confirm(confirmMsg)) return;

    try {
      await removeCollaboratorMutation({ listId, userId });
      toast.success(isSelf ? "You have left the list" : `Removed ${name} from the list`);
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

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to save lists to favorites");
      return;
    }
    try {
      const saved = await toggleFavoriteMutation({ listId });
      toast.success(saved ? "Saved list to favorites!" : "Removed from favorites.");
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
    if (!confirm("Are you sure you want to permanently delete this list? This cannot be undone.")) return;
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
    if (!confirm("Are you sure you want to delete this comment?")) return;
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
            <div className="flex flex-wrap gap-2 items-center">
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
                  <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-blue-950/20 px-2 py-0.5 text-[10px] font-extrabold text-blue-400">
                    <Users className="h-3 w-3" /> Collaborative
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
                  by <Link href={`/@/${creator.username}`} className="font-bold text-zinc-400 hover:text-white">@{creator.username}</Link>
                </span>
              )}
              {list.isCollaborative && (
                <button
                  onClick={() => setIsMembersOpen(true)}
                  className="flex cursor-pointer items-center gap-1.5 font-semibold text-zinc-400 transition-colors hover:text-white"
                >
                  <Users className="h-3.5 w-3.5" />
                  {collaborators.length} {collaborators.length === 1 ? "collaborator" : "collaborators"}
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
                isLiked ? "bg-rose-950/25 border-rose-900/40 text-rose-450 hover:bg-rose-950/40" : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-rose-450" : ""}`} />
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </Button>

            {/* Favorite list */}
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={`rounded-xl border-zinc-800 transition-all ${
                isFavorited ? "bg-yellow-950/25 border-yellow-900/40 text-yellow-450 hover:bg-yellow-950/40" : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <Star className={`mr-2 h-4 w-4 ${isFavorited ? "fill-yellow-455" : ""}`} />
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
                <DialogContent className="border border-zinc-800 bg-zinc-950 text-white rounded-3xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit List Details</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateList} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        List Name
                      </label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 text-white rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="edit-desc" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Description (Optional)
                      </label>
                      <Textarea
                        id="edit-desc"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 text-white rounded-xl min-h-24 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="edit-privacy" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          Privacy
                        </label>
                        <Select
                          value={editPrivacy}
                          onValueChange={(val) => setEditPrivacy(val as "public" | "private")}
                        >
                          <SelectTrigger className="w-full border border-zinc-800 bg-zinc-900 text-white rounded-xl p-2.5 text-sm h-10 flex justify-between items-center">
                            <SelectValue placeholder="Select privacy" />
                          </SelectTrigger>
                          <SelectContent className="border border-zinc-850 bg-zinc-950 text-white rounded-xl">
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pb-1">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="edit-collab"
                            checked={editCollab}
                            onCheckedChange={(checked) => setEditCollab(!!checked)}
                            className="border-zinc-800 bg-zinc-900"
                          />
                          <label htmlFor="edit-collab" className="text-xs font-bold text-zinc-300 select-none cursor-pointer">
                            Collaborative List
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
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
                          className="border-zinc-800 text-zinc-450 hover:bg-zinc-900 hover:text-white rounded-xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="bg-white text-black hover:bg-zinc-200 rounded-xl font-bold"
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
                    <DialogTitle className="text-xl font-bold">Add Collaborators</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
                    {friends.length === 0 ? (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        Add friends on Popcorn Vision first to invite them to collaborate!
                      </p>
                    ) : (
                      friends
                        .filter(
                          (friend) =>
                            !collaborators.some((c) => c.userId === friend.userId)
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
                                <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                                  {friend.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-white">{friend.name}</p>
                                <p className="text-xs text-zinc-500">@{friend.username}</p>
                              </div>
                            </div>

                            <Button
                              size="xs"
                              onClick={() => handleInvite(friend.userId, friend.name)}
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
                          !collaborators.some((c) => c.userId === friend.userId)
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
            <DialogTitle className="text-xl font-bold">List Collaborators</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
            {collaborators.map((collab) => {
              const isCollabCreator = collab.userId === creator?.userId;
              const canRemove = (isOwner && !isCollabCreator) || collab.userId === currentUser?.id;
              return (
                <div key={collab.userId} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {collab.image && (
                        <AvatarImage src={collab.image} alt={collab.name} />
                      )}
                      <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
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
                      <p className="text-xs text-zinc-500">@{collab.username}</p>
                    </div>
                  </div>

                  {canRemove && (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => handleRemoveMember(collab.userId, collab.name)}
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
                      (item) => String(item.mediaId) === String(media.id)
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
                              className="border border-zinc-850 h-14 w-10 rounded-lg bg-zinc-900 object-cover"
                            />
                          ) : (
                            <div className="border border-zinc-850 flex h-14 w-10 items-center justify-center rounded-lg bg-zinc-900">
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
                              • {media.media_type === "tv" ? "TV Series" : "Movie"}
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
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          )}

          {/* List items grid/list */}
          {items.length === 0 ? (
            <Card className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Film className="text-zinc-650 mb-4 h-12 w-12" />
                <h3 className="text-lg font-bold text-zinc-300">This list is empty</h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  {canModify ? "Search and add movies or TV shows above." : "The curator hasn't added any titles yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
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
                            className="border border-zinc-850 h-20 w-14 rounded-2xl bg-zinc-900 object-cover"
                          />
                        ) : (
                          <div className="border border-zinc-850 flex h-20 w-14 items-center justify-center rounded-2xl bg-zinc-900">
                            <Film className="text-zinc-650 h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => setSelectedMedia(tmdbMedia)}
                            className="cursor-pointer truncate text-base font-extrabold text-white transition-colors group-hover:text-blue-400"
                          >
                            {item.title}
                          </h4>
                          <span className="text-zinc-550 shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase">
                            {item.mediaType}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          Released {item.releaseYear} • Added by{" "}
                          <span className="font-bold text-zinc-400">
                            {item.addedByUser ? `@${item.addedByUser.username}` : "member"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {canModify && (
                      <button
                        onClick={() => handleRemoveItem(item.mediaId, item.mediaType, item.title)}
                        className="text-zinc-450 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition-all hover:scale-105 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 active:scale-95 shrink-0"
                        title="Remove title"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Comments Section */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
            <h3 className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-lg font-bold">
              <MessageSquare className="h-5 w-5 text-blue-400" /> Comments
            </h3>

            {/* Comment Form */}
            {isLoggedIn ? (
              <form onSubmit={handleAddComment} className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this list..."
                  className="border-zinc-800 bg-zinc-900 text-white rounded-xl placeholder:text-zinc-500 text-xs min-h-16 resize-none"
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submittingComment}
                    className="bg-white text-black hover:bg-zinc-200 text-xs py-1.5 px-3 h-8 rounded-xl font-bold"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-2">
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
                    <div key={comment._id} className="flex gap-3 text-xs border-b border-zinc-900/50 pb-3">
                      <Avatar className="h-7 w-7 shrink-0 border border-zinc-800">
                        {comment.author.image && (
                          <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        )}
                        <AvatarFallback className="bg-zinc-850 text-[10px] font-bold text-zinc-400">
                          {comment.author.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-zinc-300">
                            {comment.author.name}{" "}
                            <span className="text-zinc-500 font-normal">
                              @{comment.author.username}
                            </span>
                          </p>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-zinc-400 leading-normal whitespace-pre-wrap">{comment.content}</p>
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
