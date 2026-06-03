"use client";

import React, { useState, use, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users,
  Search,
  Loader2,
  Calendar,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  UserPlus,
  X,
  Film,
  Activity,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import QuickViewModal from "@/components/quick-view-modal";

interface SharedWatchlistDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SharedWatchlistDetailPage({
  params,
}: SharedWatchlistDetailPageProps) {
  const { id } = use(params);
  const watchlistId = id as Id<"sharedWatchlists">;

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUser = session.data?.user;

  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);

  // Queries
  const detail = useQuery(
    api.sharedWatchlists.getWatchlistDetail,
    isLoggedIn && !isLeaving ? { watchlistId } : "skip",
  );

  // For invites, fetch current user's profile and friends
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
  const addTitleMutation = useMutation(api.sharedWatchlists.addTitle);
  const removeTitleMutation = useMutation(api.sharedWatchlists.removeTitle);
  const toggleWatchedMutation = useMutation(api.sharedWatchlists.toggleWatched);
  const toggleVoteMutation = useMutation(api.sharedWatchlists.toggleVote);
  const inviteMemberMutation = useMutation(api.sharedWatchlists.inviteMember);
  const removeMemberMutation = useMutation(api.sharedWatchlists.removeMember);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMedia[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unwatched" | "watched">("all");
  const [sortBy, setSortBy] = useState<"added" | "votes">("added");

  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

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

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <Users className="mb-4 h-16 w-16 text-zinc-700" />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Shared Watchlists
        </h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          Please sign in to access collaborative watchlists.
        </p>
      </div>
    );
  }

  if (detail === undefined) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const { watchlist, members, items, activities } = detail;
  const isOwner = watchlist.createdById === currentUser?.id;

  // Handlers
  const handleAddTitle = async (media: TMDBMedia) => {
    try {
      await addTitleMutation({
        watchlistId,
        mediaId: String(media.id),
        mediaType: media.media_type || "movie",
        title: media.title || media.name || "",
        posterPath: media.poster_path || "",
        releaseYear: media.release_date
          ? String(new Date(media.release_date).getFullYear())
          : "N/A",
      });
      toast.success(`Added ${media.title || media.name} to the watchlist`);
      setSearchQuery("");
      setSearchResults([]);
    } catch {
      toast.error("Failed to add title to watchlist");
    }
  };

  const handleRemoveTitle = async (
    mediaId: string,
    mediaType: string,
    title: string,
  ) => {
    if (!confirm(`Are you sure you want to remove ${title}?`)) return;
    try {
      await removeTitleMutation({ watchlistId, mediaId, mediaType });
      toast.success(`Removed ${title} from the watchlist`);
    } catch {
      toast.error("Failed to remove title");
    }
  };

  const handleToggleWatched = async (
    mediaId: string,
    mediaType: string,
    currentWatched: boolean,
  ) => {
    try {
      await toggleWatchedMutation({
        watchlistId,
        mediaId,
        mediaType,
        watched: !currentWatched,
      });
    } catch {
      toast.error("Failed to update watched status");
    }
  };

  const handleToggleVote = async (mediaId: string, mediaType: string) => {
    try {
      const isVoted = await toggleVoteMutation({
        watchlistId,
        mediaId,
        mediaType,
      });
      if (isVoted) {
        toast.success("Upvoted!");
      }
    } catch {
      toast.error("Failed to register vote");
    }
  };

  const handleInvite = async (userId: string, name: string) => {
    try {
      await inviteMemberMutation({ watchlistId, userId });
      toast.success(`Invited ${name} to the watchlist`);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to invite friend");
    }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    const isSelf = userId === currentUser?.id;
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this watchlist? (If you are the owner, the watchlist will be deleted entirely!)"
      : `Are you sure you want to remove ${name} from this watchlist?`;

    if (!confirm(confirmMsg)) return;

    if (isSelf) {
      setIsLeaving(true);
    }

    try {
      await removeMemberMutation({ watchlistId, userId });
      if (isSelf) {
        toast.success("You have left the watchlist");
        router.push("/shared-watchlists");
      } else {
        toast.success(`Removed ${name} from the watchlist`);
      }
    } catch {
      if (isSelf) {
        setIsLeaving(false);
      }
      toast.error("Failed to remove member");
    }
  };

  // Filter & sort items
  const filteredItems = items
    .filter((item) => {
      if (filter === "watched") return item.watched;
      if (filter === "unwatched") return !item.watched;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "votes") {
        if (b.votesCount !== a.votesCount) {
          return b.votesCount - a.votesCount;
        }
      }
      return b.addedAt - a.addedAt;
    });

  const getActorActivityText = (act: (typeof activities)[number]) => {
    const username = act.user ? `@${act.user.username}` : "Someone";
    switch (act.type) {
      case "create":
        return `${username} created the watchlist`;
      case "add_title":
        return `${username} added ${act.title}`;
      case "remove_title":
        return `${username} removed ${act.title}`;
      case "vote_title":
        return `${username} voted for ${act.title}`;
      case "watched_title":
        return `${username} marked ${act.title} as watched`;
      case "unwatched_title":
        return `${username} marked ${act.title} as unwatched`;
      case "join":
        return `${username} invited ${act.details || "a friend"}`;
      case "leave":
        return `${username} removed ${act.details || "a member"} / left the watchlist`;
      default:
        return `${username} performed an action`;
    }
  };

  const formatActivityTime = (ts: number) => {
    const diff = now - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="mx-auto min-h-[85vh] w-full max-w-7xl px-6 py-24 text-white sm:px-12 md:px-16">
      {/* Back Link */}
      <Link
        href="/shared-watchlists"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Shared Watchlists
      </Link>

      {/* Hero Header Card */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {watchlist.name}
            </h1>
            {watchlist.description && (
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
                {watchlist.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created {new Date(watchlist.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 font-semibold text-zinc-400 transition-colors hover:text-white"
              >
                <Users className="h-3.5 w-3.5" />
                {members.length} {members.length === 1 ? "member" : "members"}
              </button>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {/* Manage Members Dialog */}
            <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="cursor-pointer rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  >
                    View Members
                  </Button>
                }
              />
              <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Watchlist Members
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
                  {members.map((mem) => {
                    const isCreator = mem.userId === watchlist.createdById;
                    const canRemove =
                      (isOwner && !isCreator) || mem.userId === currentUser?.id;
                    return (
                      <div
                        key={mem.userId}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-zinc-800">
                            {mem.image && (
                              <AvatarImage src={mem.image} alt={mem.name} />
                            )}
                            <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                              {mem.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="flex items-center gap-1 text-sm font-bold text-white">
                              {mem.name}
                              {isCreator && (
                                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-zinc-400 uppercase">
                                  Owner
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-zinc-500">
                              @{mem.username}
                            </p>
                          </div>
                        </div>

                        {canRemove && (
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() =>
                              handleRemoveMember(mem.userId, mem.name)
                            }
                            className="h-8 rounded-lg"
                          >
                            {mem.userId === currentUser?.id
                              ? "Leave"
                              : "Remove"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            {/* Invite Friends Dialog */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger
                render={
                  <Button className="cursor-pointer gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-black hover:bg-zinc-200">
                    <UserPlus className="h-4 w-4" /> Invite Friend
                  </Button>
                }
              />
              <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Invite Friends
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
                  {friends.length === 0 ? (
                    <p className="py-6 text-center text-sm text-zinc-500">
                      Add friends on Popcorn Vision first to invite them here!
                    </p>
                  ) : (
                    friends
                      .filter(
                        (friend) =>
                          !members.some((m) => m.userId === friend.userId),
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
                            Invite
                          </Button>
                        </div>
                      ))
                  )}
                  {friends.length > 0 &&
                    friends.filter(
                      (friend) =>
                        !members.some((m) => m.userId === friend.userId),
                    ).length === 0 && (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        All your friends are already members!
                      </p>
                    )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main watchlist content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Add Title Search Container */}
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
                placeholder="Search movies or TV shows to add together..."
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

            {/* Live Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute right-0 left-0 z-30 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
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
                            {media.media_type === "tv" ? "TV Series" : "Movie"}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        disabled={alreadyAdded}
                        onClick={() => handleAddTitle(media)}
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
              <div className="absolute top-3.5 right-12 z-30">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          {/* Filtering and Sorting Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div className="flex gap-2">
              {(["all", "unwatched", "watched"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-all ${
                    filter === f
                      ? "border-white bg-white text-black"
                      : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold tracking-wider text-zinc-500 uppercase">
                Sort:
              </span>
              {(["added", "votes"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                    sortBy === s
                      ? "bg-blue-950/20 text-blue-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {s === "added" ? "Recently Added" : "Most Upvotes"}
                </button>
              ))}
            </div>
          </div>

          {/* Watchlist Titles list */}
          {filteredItems.length === 0 ? (
            <Card className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Film className="text-zinc-650 mb-4 h-12 w-12" />
                <h3 className="text-lg font-bold text-zinc-300">
                  No titles match filters
                </h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  Search and add titles above, or change your active status
                  filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
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
                    {/* Media details info */}
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
                            {item.addedBy
                              ? `@${item.addedBy.username}`
                              : "member"}
                          </span>
                        </p>

                        {/* Watched Badge */}
                        {item.watched && (
                          <div className="mt-2 flex w-fit items-center gap-1 rounded-lg bg-emerald-950/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Watched by{" "}
                            {item.watchedBy?.name || "member"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and voting */}
                    <div className="flex shrink-0 items-center gap-2">
                      {/* Watched status button */}
                      <button
                        onClick={() =>
                          handleToggleWatched(
                            item.mediaId,
                            item.mediaType,
                            item.watched,
                          )
                        }
                        className={`cursor-pointer rounded-xl border p-2.5 transition-all hover:scale-105 active:scale-95 ${
                          item.watched
                            ? "border-emerald-500 bg-emerald-600 text-white"
                            : "text-zinc-450 border-zinc-800 bg-zinc-900 hover:text-white"
                        }`}
                        title={
                          item.watched ? "Mark as unwatched" : "Mark as watched"
                        }
                      >
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </button>

                      {/* Vote/Upvote Button */}
                      <button
                        onClick={() =>
                          handleToggleVote(item.mediaId, item.mediaType)
                        }
                        className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 transition-all hover:scale-105 active:scale-95 ${
                          item.userVoted
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "text-zinc-450 border-zinc-800 bg-zinc-900 hover:text-white"
                        }`}
                        title="Upvote this title"
                      >
                        <Heart
                          className={`h-4.5 w-4.5 ${item.userVoted ? "fill-current" : ""}`}
                        />
                        {item.votesCount > 0 && (
                          <span className="text-xs font-black">
                            {item.votesCount}
                          </span>
                        )}
                      </button>

                      {/* Remove title button */}
                      <button
                        onClick={() =>
                          handleRemoveTitle(
                            item.mediaId,
                            item.mediaType,
                            item.title,
                          )
                        }
                        className="text-zinc-450 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition-all hover:scale-105 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 active:scale-95"
                        title="Remove title"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Activity Feed */}
        <div className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6">
            <h3 className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-lg font-bold">
              <Activity className="h-5 w-5 animate-pulse text-blue-400" />{" "}
              Contributor Activity
            </h3>

            {activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500">
                No recent activity. Actions taken on this watchlist will show up
                here.
              </p>
            ) : (
              <div className="max-h-[500px] space-y-4 overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act._id} className="flex gap-3 text-xs">
                    <Avatar className="h-7 w-7 shrink-0 border border-zinc-800">
                      {act.user?.image && (
                        <AvatarImage src={act.user.image} alt={act.user.name} />
                      )}
                      <AvatarFallback className="bg-zinc-850 text-[10px] font-bold text-zinc-400">
                        {act.user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <p className="leading-normal text-zinc-300">
                        {getActorActivityText(act)}
                      </p>
                      <span className="text-zinc-550 block text-[10px]">
                        {formatActivityTime(act.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
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
