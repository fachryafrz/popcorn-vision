"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBReview } from "@/lib/tmdb";
import TMDBReviewCard from "@/components/media-detail/tmdb-review-card";

interface TMDBReviewsTabProps {
  reviews: TMDBReview[];
  hasMore: boolean;
  isLoadingMore: boolean;
  totalResults: number;
  onLoadMore: () => void;
}

export default function TMDBReviewsTab({
  reviews,
  hasMore,
  isLoadingMore,
  totalResults,
  onLoadMore,
}: TMDBReviewsTabProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <TMDBReviewCard key={review.id} review={review} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="cursor-pointer rounded-xl border-zinc-800 bg-zinc-900/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Loading more reviews…
              </>
            ) : (
              `Load more TMDB reviews (${reviews.length} of ${totalResults || reviews.length})`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
