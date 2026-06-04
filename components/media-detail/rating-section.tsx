import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { MediaDetails } from "./types";

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
    <div className="mt-6 flex max-w-sm flex-col gap-2 bg-zinc-900/10 backdrop-blur-sm">
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
        <span>{userRating ? "Your Rating" : "Rate this title"}</span>
        {userRating && (
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
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, starIndex) => {
            const starPosition = starIndex + 1;
            const leftValue = starPosition * 2 - 1;
            const rightValue = starPosition * 2;

            const displayRating = hoveredRating || userRating || 0;

            const handleRate = async (starValue: number) => {
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
                toast.success(`Rated ${starValue / 2} stars successfully!`);
              } catch (err) {
                console.error("Rating failed:", err);
                toast.error("Failed to submit rating");
              }
            };

            return (
              <div
                className="relative transition-transform duration-100 hover:scale-110"
                key={starIndex}
              >
                {/* Base Empty Star */}
                <Star className="h-6 w-6 text-zinc-700" />

                {/* Half Filled Overlay */}
                {displayRating === leftValue && (
                  <div className="pointer-events-none absolute top-0 left-0 w-1/2 overflow-hidden">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
                )}

                {/* Fully Filled Overlay */}
                {displayRating >= rightValue && (
                  <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
                )}

                {/* Hover/Click Areas */}
                <div className="absolute inset-0 flex">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredRating(leftValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(leftValue);
                    }}
                    className="h-full w-1/2 cursor-pointer border-none bg-transparent p-0 outline-none"
                    title={`Rate ${leftValue / 2} stars`}
                  />
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredRating(rightValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(rightValue);
                    }}
                    className="h-full w-1/2 cursor-pointer border-none bg-transparent p-0 outline-none"
                    title={`Rate ${rightValue / 2} stars`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <span className="ml-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-sm font-black text-white">
          {hoveredRating ? `${hoveredRating / 2} / 5` : userRating ? `${userRating / 2} / 5` : "_ / 5"}
        </span>
      </div>
    </div>
  );
}

