"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { TMDBReview } from "@/lib/tmdb";
import { getMediaReviews } from "@/lib/tmdb-actions";

// Modular Comments Sub-components
import { CommentType, SortOption } from "./comments/types";
import CommentComposer from "./comments/comment-composer";
import CommentNode from "./comments/comment-node";
import TMDBReviewsTab from "./comments/tmdb-reviews-tab";

interface CommentsSectionProps {
  mediaId: string;
  mediaType: string;
  mediaTitle?: string;
  mediaPosterPath?: string;
}

export default function CommentsSection({
  mediaId,
  mediaType,
  mediaTitle,
  mediaPosterPath,
}: CommentsSectionProps) {
  const [sorting, setSorting] = useState<SortOption>("best");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TMDB Reviews State
  const [tmdbReviews, setTmdbReviews] = useState<TMDBReview[]>([]);
  const [tmdbPage, setTmdbPage] = useState(1);
  const [tmdbTotalPages, setTmdbTotalPages] = useState(1);
  const [tmdbTotalResults, setTmdbTotalResults] = useState(0);
  const [isTmdbLoading, setIsTmdbLoading] = useState(true);
  const [isLoadingMoreTmdb, setIsLoadingMoreTmdb] = useState(false);

  // Authentication session
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;
  const authModal = useAuthModalStore();

  // Convex comment queries and mutations
  const comments = useQuery(api.comments.getComments, {
    mediaId,
    mediaType,
    sorting,
  }) as CommentType[] | undefined;

  const addCommentMutation = useMutation(api.comments.addComment);

  // Fetch TMDB Reviews on mount or when mediaId/mediaType changes
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialReviews() {
      if (!mediaId || (mediaType !== "movie" && mediaType !== "tv")) {
        setIsTmdbLoading(false);
        return;
      }

      setIsTmdbLoading(true);
      setTmdbPage(1);

      try {
        const data = await getMediaReviews(
          mediaType as "movie" | "tv",
          mediaId,
          1,
        );
        if (!isCancelled) {
          if (data) {
            setTmdbReviews(data.results || []);
            setTmdbTotalPages(data.total_pages || 1);
            setTmdbTotalResults(data.total_results || 0);
          } else {
            setTmdbReviews([]);
          }
        }
      } catch (err) {
        console.error("Failed to load TMDB reviews:", err);
      } finally {
        if (!isCancelled) setIsTmdbLoading(false);
      }
    }

    loadInitialReviews();

    return () => {
      isCancelled = true;
    };
  }, [mediaId, mediaType]);

  // Load more TMDB reviews
  const handleLoadMoreTmdb = async () => {
    if (isLoadingMoreTmdb || tmdbPage >= tmdbTotalPages) return;

    setIsLoadingMoreTmdb(true);
    const nextPage = tmdbPage + 1;

    try {
      const data = await getMediaReviews(
        mediaType as "movie" | "tv",
        mediaId,
        nextPage,
      );
      if (data && data.results) {
        setTmdbReviews((prev) => [...prev, ...data.results]);
        setTmdbPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more TMDB reviews:", err);
      toast.error("Failed to load additional reviews");
    } finally {
      setIsLoadingMoreTmdb(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      authModal.open();
      return;
    }
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentMutation({
        mediaId,
        mediaType,
        content: commentContent,
        mediaTitle,
        mediaPosterPath,
      });
      setCommentContent("");
      toast.success("Comment posted successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalComments = comments?.length || 0;
  const isInitialLoading = comments === undefined && isTmdbLoading;
  const hasNoItems = totalComments === 0 && tmdbReviews.length === 0;

  return (
    <div className="space-y-6 pt-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 border-b border-zinc-850 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">
              Discussion & Reviews
            </h3>
            <p className="text-xs text-zinc-400">
              {totalComments} community{" "}
              {totalComments === 1 ? "comment" : "comments"}
              {tmdbTotalResults > 0 &&
                ` • ${tmdbTotalResults} TMDB ${
                  tmdbTotalResults === 1 ? "review" : "reviews"
                }`}
            </p>
          </div>
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
          {(
            [
              { id: "best", label: "Best" },
              { id: "top", label: "Top" },
              { id: "latest", label: "Latest" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSorting(tab.id)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                sorting === tab.id
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Editor */}
      <div className="mb-10">
        {isLoggedIn ? (
          <CommentComposer
            value={commentContent}
            onChange={setCommentContent}
            onSubmit={handlePostComment}
            isSubmitting={isSubmitting}
            placeholder="What's on your mind? Mention others using @username…"
          />
        ) : (
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 text-center shadow-lg backdrop-blur-md">
            <h3 className="mb-1 text-base font-bold text-zinc-200">
              Connect with the Community
            </h3>
            <p className="mx-auto mb-4 max-w-sm text-xs text-zinc-500">
              Log in or register your account to write comments, reply to
              discussions, and like user reviews.
            </p>
            <Button
              onClick={() => authModal.open()}
              variant="default"
              size="sm"
              className="cursor-pointer rounded-xl bg-white font-bold text-black hover:bg-zinc-200"
            >
              Sign In to Participate
            </Button>
          </div>
        )}
      </div>

      {/* Render list of threaded comments & TMDB reviews */}
      {isInitialLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-1/4 rounded bg-zinc-800" />
                <div className="h-3 w-3/4 rounded bg-zinc-800/60" />
                <div className="h-3 w-1/2 rounded bg-zinc-800/40" />
              </div>
            </div>
          ))}
        </div>
      ) : hasNoItems ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 py-16 text-center">
          <MessageSquare className="mb-3 h-10 w-10 text-zinc-700" />
          <p className="text-sm font-medium text-zinc-400">
            No comments or reviews yet
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Community comments */}
          {comments &&
            comments.map((comment) => (
              <CommentNode
                key={comment._id}
                comment={comment}
                depth={0}
                currentUserId={currentUserId}
                mediaId={mediaId}
                mediaType={mediaType}
                mediaTitle={mediaTitle}
                mediaPosterPath={mediaPosterPath}
                onAuthRequired={() => authModal.open()}
              />
            ))}

          {/* TMDB Reviews */}
          <TMDBReviewsTab
            reviews={tmdbReviews}
            hasMore={tmdbPage < tmdbTotalPages}
            isLoadingMore={isLoadingMoreTmdb}
            totalResults={tmdbTotalResults}
            onLoadMore={handleLoadMoreTmdb}
          />
        </div>
      )}
    </div>
  );
}
