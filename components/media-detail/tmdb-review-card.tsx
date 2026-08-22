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
      <div className="flex items-start gap-3 rounded-2xl border border-teal-500/15 bg-teal-950/10 p-3.5 transition-all duration-300 hover:border-teal-500/30 hover:bg-teal-950/20">
        {/* Avatar */}
        <Avatar className="h-9 w-9 border border-teal-500/30 ring-2 ring-transparent transition-all duration-300 group-hover:ring-teal-500/20">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={displayName}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-teal-950/60 text-xs font-bold text-teal-300 border border-teal-800/40">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content Details */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-bold text-white">
                {displayName}
              </span>

              {username && username !== displayName && (
                <span className="text-xs text-zinc-500">
                  @{username}
                </span>
              )}

              {/* Distinct TMDB Badge */}
              <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-teal-400 uppercase">
                TMDB Review
              </span>

              {/* Rating Star Badge */}
              {rating !== null && rating !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
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
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-teal-400/80 transition-colors hover:bg-teal-500/10 hover:text-teal-300"
                title="View original review on TMDB"
              >
                <span className="hidden sm:inline">TMDB</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Review Text */}
          <div className="mt-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300/90">
            {displayedContent}
          </div>

          {/* Read More / Less Toggle */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-teal-400 transition-colors hover:text-teal-300"
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
