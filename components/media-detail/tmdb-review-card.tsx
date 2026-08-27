"use client";

import React, { useState } from "react";
import { TMDBReview, getTMDBAvatarUrl } from "@/lib/tmdb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TMDBReviewCardProps {
  review: TMDBReview;
}

export default function TMDBReviewCard({ review }: TMDBReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const avatarUrl = getTMDBAvatarUrl(review.author_details.avatar_path);
  const rating = review.author_details.rating;
  const displayName = review.author_details.name?.trim() || review.author || review.author_details.username || "TMDB Reviewer";
  const username = review.author_details.username || review.author;

  const contentThreshold = 360;
  const isLongContent = review.content.length > contentThreshold;
  const displayedContent =
    isLongContent && !isExpanded
      ? `${review.content.slice(0, contentThreshold).trim()}…`
      : review.content;

  const createdAtDate = review.created_at ? new Date(review.created_at) : null;
  const timeAgo =
    createdAtDate && !isNaN(createdAtDate.getTime())
      ? formatDistanceToNow(createdAtDate, { addSuffix: true })
      : null;

  return (
    <div className="group flex flex-col gap-1 transition-all duration-300">
      <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-zinc-900/10 p-3 transition-all duration-300 hover:border-zinc-800/30 hover:bg-zinc-900/30">
        {/* Avatar */}
        <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent transition-all duration-300 group-hover:ring-zinc-700/30">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={displayName}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-zinc-800 text-sm font-bold text-zinc-300">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content Details */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-white">
                {displayName}
              </span>

              {username && username !== displayName && (
                <span className="text-xs text-zinc-500">
                  @{username}
                </span>
              )}

              {/* TMDB Badge */}
              <span className="inline-flex items-center rounded-md border border-zinc-700/60 bg-zinc-800/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-zinc-300 uppercase">
                TMDB
              </span>

              {/* Rating Star Badge */}
              {rating !== null && rating !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {rating}/10
                </span>
              )}

              {timeAgo && (
                <>
                  <span className="text-xs font-semibold text-zinc-600">•</span>
                  <span
                    className="text-[11px] text-zinc-500"
                    title={createdAtDate?.toLocaleString()}
                  >
                    {timeAgo}
                  </span>
                </>
              )}
            </div>

            {/* External Link */}
            {review.url && (
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-white"
                title="View original review on TMDB"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Review Text */}
          <div className="mt-2 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300">
            {displayedContent}
          </div>

          {/* Read More / Less Toggle */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
              )}
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Read full review <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
