"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import {
  Heart,
  MessageSquare,
  Trash2,
  Send,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";
import { toast } from "sonner";

interface ActivityUser {
  name: string;
  username: string;
  image?: string;
}

interface Activity {
  _id: Id<"activities">;
  userId: string;
  type: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  rating?: number;
  review?: string;
  season?: number;
  createdAt: number;
  user: ActivityUser;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
}

interface ActivityCardProps {
  activity: Activity;
  onRefresh?: () => void;
}

interface EnrichedComment {
  _id: Id<"activityComments">;
  activityId: Id<"activities">;
  userId: string;
  content: string;
  createdAt: number;
  user: {
    name: string;
    username: string;
    image?: string;
  };
}

export default function ActivityCard({
  activity,
  onRefresh,
}: ActivityCardProps) {
  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;
  const isLoggedIn = !!currentUserId;

  const likeMutation = useMutation(api.activities.likeActivity);
  const addCommentMutation = useMutation(api.activities.addComment);
  const deleteCommentMutation = useMutation(api.activities.deleteComment);

  // Fetch full details of activity (including comments) when comments are expanded
  const [showComments, setShowComments] = useState(false);
  const details = useQuery(
    api.activities.getActivityDetails,
    showComments ? { activityId: activity._id } : "skip",
  );

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to like activities");
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await likeMutation({ activityId: activity._id });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to comment");
      return;
    }
    const text = commentText.trim();
    if (!text) return;

    setIsSubmittingComment(true);
    try {
      await addCommentMutation({
        activityId: activity._id,
        content: text,
      });
      setCommentText("");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: Id<"activityComments">) => {
    try {
      await deleteCommentMutation({ commentId });
      toast.success("Comment deleted");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  // Helper to generate the text based on activity type
  const renderActivityText = () => {
    const displayName = (
      <Link
        href={`/@${activity.user.username}`}
        className="hover:text-primary font-bold text-white transition-colors"
      >
        {activity.user.name}
      </Link>
    );

    const mediaLink = (
      <Link
        href={`/${activity.mediaType}/${activity.mediaId}`}
        className="hover:text-primary inline-flex items-center gap-0.5 font-semibold text-zinc-200 italic transition-colors"
      >
        {activity.title}
        <ExternalLink className="inline h-3 w-3" />
      </Link>
    );

    switch (activity.type) {
      case "watchlist":
        return (
          <span>
            {displayName} added {mediaLink} to Watchlist
          </span>
        );
      case "favorite":
        return (
          <span>
            {displayName} favorited {mediaLink}
          </span>
        );
      case "rate":
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            {displayName} rated {mediaLink}
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              {activity.rating}/10
            </span>
          </span>
        );
      case "review":
        return (
          <span>
            {displayName} reviewed {mediaLink}
          </span>
        );
      case "completed_season":
        return (
          <span>
            {displayName} completed Season {activity.season} of {mediaLink}
          </span>
        );
      default:
        return (
          <span>
            {displayName} updated {mediaLink}
          </span>
        );
    }
  };

  const avatarFallback = activity.user.name
    ? activity.user.name.charAt(0).toUpperCase()
    : "?";
  const posterUrl = activity.posterPath
    ? `https://image.tmdb.org/t/p/w185${activity.posterPath}`
    : "/logo/popcorn.png";

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/50">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <Avatar className="h-10 w-10 border border-zinc-800/80 shadow-md">
          <AvatarImage src={activity.user.image} alt={activity.user.name} />
          <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        {/* Content Column */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm leading-normal text-zinc-300">
              {renderActivityText()}
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-zinc-500">
              {moment(activity.createdAt).fromNow()}
            </span>
          </div>

          {/* Optional Review Box */}
          {activity.type === "review" && activity.review && (
            <div className="border-primary mt-3 rounded-r-xl border-l-2 bg-zinc-950/40 px-3.5 py-2.5">
              {activity.rating && (
                <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-yellow-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{activity.rating}/10</span>
                </div>
              )}
              <p className="text-xs leading-relaxed whitespace-pre-wrap text-zinc-300 italic">
                &ldquo;{activity.review}&rdquo;
              </p>
            </div>
          )}

          {/* Media Info / Banner preview */}
          <div className="border-zinc-850/50 mt-4 flex max-w-md gap-3.5 rounded-xl border bg-zinc-950/20 p-2.5">
            <Link
              href={`/${activity.mediaType}/${activity.mediaId}`}
              className="aspect-2/3 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900"
            >
              <img
                src={posterUrl}
                alt={activity.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <div className="flex min-w-0 flex-col justify-center">
              <Link
                href={`/${activity.mediaType}/${activity.mediaId}`}
                className="hover:text-primary truncate text-xs font-bold text-white transition-colors"
              >
                {activity.title}
              </Link>
              <span className="mt-1 text-[10px] font-bold text-zinc-500 capitalize">
                {activity.mediaType === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-zinc-850/60 mt-5 flex items-center gap-6 border-t pt-3">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95",
                activity.isLikedByMe
                  ? "fill-rose-500 text-rose-500"
                  : "text-zinc-400 hover:text-rose-400",
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  activity.isLikedByMe && "fill-current",
                )}
              />
              <span>
                {activity.likesCount}{" "}
                {activity.likesCount === 1 ? "Like" : "Likes"}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:text-primary flex items-center gap-2 text-xs font-bold text-zinc-400 transition-all duration-300 hover:scale-105"
            >
              <MessageSquare className="h-4 w-4" />
              <span>
                {activity.commentsCount}{" "}
                {activity.commentsCount === 1 ? "Comment" : "Comments"}
              </span>
            </button>
          </div>

          {/* Comments Section (Expandable) */}
          {showComments && (
            <div className="border-zinc-850/45 mt-4 space-y-4 border-t pt-4">
              {/* Comment Input */}
              {isLoggedIn ? (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmittingComment}
                    className="focus:border-primary flex-1 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-200 transition-colors focus:outline-none"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="hover:bg-primary bg-primary h-8 rounded-xl px-3 text-[10px] font-bold"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                </form>
              ) : (
                <p className="text-center text-[10px] font-semibold text-zinc-500 italic">
                  Please log in to add comments.
                </p>
              )}

              {/* Comments list */}
              {!details ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                </div>
              ) : details.comments.length === 0 ? (
                <p className="py-2 text-center text-[10px] font-semibold text-zinc-500 italic">
                  No comments yet. Be the first!
                </p>
              ) : (
                <div className="flex max-h-60 flex-col gap-3 overflow-y-auto pr-1">
                  {details.comments.map((comment: EnrichedComment) => {
                    const cFallback = comment.user?.name
                      ? comment.user.name.charAt(0).toUpperCase()
                      : "?";
                    const isCommentOwner = comment.userId === currentUserId;
                    const isActivityOwner = activity.userId === currentUserId;

                    return (
                      <div
                        key={comment._id}
                        className="group/comment border-zinc-850/30 flex items-start gap-2.5 rounded-xl border bg-zinc-950/20 p-2.5"
                      >
                        <Avatar className="h-6 w-6 shrink-0 border border-zinc-800/80">
                          <AvatarImage
                            src={comment.user?.image}
                            alt={comment.user?.name}
                          />
                          <AvatarFallback className="bg-zinc-800 text-[9px] font-bold text-zinc-300">
                            {cFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-white">
                              {comment.user?.name}
                            </span>
                            <span className="text-[9px] font-semibold text-zinc-500">
                              {moment(comment.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed wrap-break-word text-zinc-300">
                            {comment.content}
                          </p>
                        </div>
                        {(isCommentOwner || isActivityOwner) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-0.5 text-zinc-500 transition-opacity group-hover/comment:opacity-100 hover:text-rose-500 md:opacity-0"
                            title="Delete comment"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
