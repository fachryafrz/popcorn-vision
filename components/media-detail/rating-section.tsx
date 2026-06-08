import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { MediaDetails } from "./types";
import { cn } from "@/lib/utils";

interface RatingSectionProps {
  details: MediaDetails;
  mediaType: "movie" | "tv";
  releaseYear: string;
  isLoggedIn: boolean;
  openAuth: () => void;
  userRating: number | null | undefined;
  rateMedia: (args: {
    mediaId: string;
    mediaType: "movie" | "tv";
    title: string;
    posterPath: string;
    rating: number;
    releaseYear: string;
  }) => Promise<unknown>;
  deleteRating: (args: {
    mediaId: string;
    mediaType: "movie" | "tv";
  }) => Promise<unknown>;
  isUnreleased?: boolean;
}

export default function RatingSection({
  details,
  mediaType,
  releaseYear,
  isLoggedIn,
  openAuth,
  userRating,
  rateMedia,
  deleteRating,
  isUnreleased,
}: RatingSectionProps) {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleClearRating = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteRating({ mediaId: String(details.id), mediaType });
      toast.success("Rating cleared successfully!");
    } catch (err) {
      console.error("Clear rating failed:", err);
      toast.error("Failed to clear rating");
    }
  };

  return (
    <div
      className={cn(
        "mt-6 flex max-w-sm flex-col gap-2",
        isUnreleased && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
        <span>
          {isUnreleased
            ? "Rating Unavailable (Unreleased)"
            : userRating
              ? "Your Rating"
              : "Rate this title"}
        </span>
        {userRating && !isUnreleased && (
          <button
            type="button"
            onClick={handleClearRating}
            className="cursor-pointer font-bold tracking-wide text-red-400 uppercase transition-colors hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, starIndex) => {
            const starValue = starIndex + 1;
            const displayRating = hoveredRating || userRating || 0;

            const handleRate = async (starValue: number) => {
              if (isUnreleased) return;
              if (!isLoggedIn) {
                openAuth();
                return;
              }
              try {
                await rateMedia({
                  mediaId: String(details.id),
                  mediaType,
                  title: details.title || details.name || "",
                  posterPath: details.poster_path || "",
                  rating: starValue,
                  releaseYear: releaseYear,
                });
                toast.success(`Rated ${starValue} / 10 successfully!`);
              } catch (err) {
                console.error("Rating failed:", err);
                toast.error("Failed to submit rating");
              }
            };

            return (
              <div
                className={cn(
                  "relative transition-transform duration-100",
                  isUnreleased
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:scale-110",
                )}
                key={starIndex}
                onMouseEnter={() =>
                  !isUnreleased && setHoveredRating(starValue)
                }
                onMouseLeave={() => !isUnreleased && setHoveredRating(0)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUnreleased) handleRate(starValue);
                }}
                title={
                  isUnreleased
                    ? "Cannot rate unreleased title"
                    : `Rate ${starValue} / 10`
                }
              >
                {/* Base Empty Star */}
                <Star className="h-5 w-5 text-zinc-700" />

                {/* Fully Filled Overlay */}
                {displayRating >= starValue && (
                  <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <span className="ml-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-sm font-black text-white">
          {isUnreleased
            ? "_ / 10"
            : hoveredRating
              ? `${hoveredRating} / 10`
              : userRating
                ? `${userRating} / 10`
                : "_ / 10"}
        </span>
      </div>
    </div>
  );
}
