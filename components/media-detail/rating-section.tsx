import React from "react";
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
    <div className="mt-6 flex flex-col gap-2 bg-zinc-900/10 max-w-sm backdrop-blur-sm">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        <span>{userRating ? "Your Rating" : "Rate this title"}</span>
        {userRating && (
          <button
            type="button"
            onClick={handleClearRating}
            className="text-red-400 hover:text-red-300 font-bold tracking-wide uppercase transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, starIndex) => {
            const starPosition = starIndex + 1;
            const leftValue = starPosition * 2 - 1;
            const rightValue = starPosition * 2;

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
                className="relative hover:scale-110 transition-transform duration-100"
                key={starIndex}
              >
                {/* Base Empty Star */}
                <Star className="h-6 w-6 text-zinc-700" />

                {/* Half Filled Overlay */}
                {userRating === leftValue && (
                  <div className="absolute top-0 left-0 w-1/2 overflow-hidden pointer-events-none">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  </div>
                )}

                {/* Fully Filled Overlay */}
                {userRating && userRating >= rightValue && (
                  <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  </div>
                )}

                {/* Hover/Click Areas */}
                <div className="absolute inset-0 flex">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(leftValue);
                    }}
                    className="w-1/2 h-full cursor-pointer"
                    title={`Rate ${leftValue / 2} stars`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRate(rightValue);
                    }}
                    className="w-1/2 h-full cursor-pointer"
                    title={`Rate ${rightValue / 2} stars`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <span className="text-sm font-black text-white ml-2 bg-zinc-900/60 px-2 py-0.5 rounded-md border border-zinc-800">
          {userRating ? `${userRating / 2} / 5` : "_ / 5"}
        </span>
      </div>
    </div>
  );
}
