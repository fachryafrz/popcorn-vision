"use client";

import moment from "moment";
import { MediaDetails } from "./types";

interface InfoSidebarProps {
  mediaType: "movie" | "tv";
  details: MediaDetails;
  releaseDate: string;
  formatCurrency: (amount?: number) => string;
}

export default function InfoSidebar({
  mediaType,
  details,
  releaseDate,
  formatCurrency,
}: InfoSidebarProps) {
  return (
    <div className="border-zinc-850 sticky top-22 h-fit space-y-6 rounded-2xl border bg-zinc-900/10 p-6">
      <h3 className="border-zinc-805 border-b pb-2 text-base font-bold text-white">
        More Info
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {mediaType === "tv" && details && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Seasons
            </span>
            <span className="text-zinc-200">
              {details?.number_of_seasons || 0}
            </span>
          </div>
        )}
        {mediaType === "tv" && details && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Episodes
            </span>
            <span className="text-zinc-200">
              {details?.number_of_episodes || 0}
            </span>
          </div>
        )}
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Status
          </span>
          <span className="text-zinc-200">{details?.status || "N/A"}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            {mediaType === "tv" ? "First Aired" : "Release Date"}
          </span>
          <span className="text-zinc-200">
            {releaseDate
              ? moment(releaseDate).format("MMM Do, YYYY (dddd)")
              : "N/A"}
          </span>
        </div>

        {details?.budget !== undefined && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Budget
            </span>
            <span className="text-zinc-200">
              {formatCurrency(details.budget)}
            </span>
          </div>
        )}
        {details?.revenue !== undefined && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Revenue
            </span>
            <span className="text-zinc-200">
              {formatCurrency(details.revenue)}
            </span>
          </div>
        )}
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Original Language
          </span>
          <span className="text-zinc-200 uppercase">
            {details?.original_language || "en"}
          </span>
        </div>
      </div>
    </div>
  );
}
