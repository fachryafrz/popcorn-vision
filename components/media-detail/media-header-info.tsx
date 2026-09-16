"use client";

import { useState } from "react";
import { Star, Clock } from "lucide-react";
import type { Duration } from "moment";
import { MediaDetails, CrewItem, Creator } from "./types";
import ExpandableText from "../ui/expandable-text";

interface MediaHeaderInfoProps {
  details: MediaDetails;
  mediaType: "movie" | "tv";
  logoPath: string | null;
  certification: string | null;
  communityStats?: { totalRatings: number; averageRating: number } | null;
  rating: string;
  releaseYear: string | number;
  runtime: number | null;
  duration: Duration;
  directors: CrewItem[];
  creators: Creator[];
  onPersonClick: (id: number) => void;
}

export default function MediaHeaderInfo({
  details,
  mediaType,
  logoPath,
  certification,
  communityStats,
  rating,
  releaseYear,
  runtime,
  duration,
  directors,
  creators,
  onPersonClick,
}: MediaHeaderInfoProps) {
  const [logoError, setLogoError] = useState(false);

  const titleText = details?.title || details?.name || "";

  return (
    <div className="flex flex-1 flex-col items-start gap-4 text-left">
      {/* Genre Badges */}
      {details?.genres && details.genres.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {details.genres.map((g) => (
            <span
              key={g.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm"
            >
              {g.name}
            </span>
          ))}
        </div>
      )}

      {/* Logo or Title */}
      {logoPath && !logoError ? (
        <div className="relative mb-2 flex h-16 max-w-[85%] items-center sm:h-24 md:h-28">
          <img
            src={`https://image.tmdb.org/t/p/w500${logoPath}`}
            alt={titleText}
            className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"
            onError={() => setLogoError(true)}
            draggable={false}
          />
        </div>
      ) : (
        <h1 className="line-clamp-2 text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
          {titleText}
        </h1>
      )}

      {details?.tagline && (
        <p className="-mt-1 text-sm text-zinc-400 italic sm:text-base">
          &ldquo;{details.tagline}&rdquo;
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="border-primary/30 bg-primary rounded-full border px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
          {mediaType === "tv" ? "TV Series" : "Movie"}
        </span>
        {certification && (
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-black text-zinc-300 uppercase">
            Rated: {certification}
          </span>
        )}
        {(() => {
          const hasCommunity =
            communityStats && communityStats.totalRatings > 0;
          const displayRating = hasCommunity
            ? communityStats.averageRating.toFixed(
                communityStats.averageRating < 10 ? 1 : 0,
              )
            : rating;
          const sourceLabel = hasCommunity ? "Community" : "TMDB";
          return (
            <>
              <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>{displayRating}</span>
                <span className="ml-1 text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                  ({sourceLabel})
                </span>
              </div>
              {hasCommunity && (
                <span className="border-zinc-850 rounded-full border bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-500">
                  TMDB: {rating}
                </span>
              )}
            </>
          );
        })()}
        <span className="text-sm font-medium text-zinc-400">
          {releaseYear}
        </span>
        {runtime && (
          <div className="flex items-center gap-1 text-sm text-zinc-400">
            <Clock className="h-4 w-4" />
            <span>
              {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
              {duration.minutes() > 0 ? `${duration.minutes()}m` : ""}
            </span>
          </div>
        )}
      </div>

      {mediaType === "movie" && directors.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
            Directed By:
          </span>
          <span className="flex flex-wrap items-center gap-1 font-bold text-zinc-200">
            {directors.map((d, index) => (
              <span key={d.id}>
                <span
                  onClick={() => onPersonClick(d.id)}
                  role="button"
                  className="hover:text-primary cursor-pointer underline decoration-dotted transition-colors"
                >
                  {d.name}
                </span>
                {index < directors.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>
      )}
      {mediaType === "tv" && creators.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
            Created By:
          </span>
          <span className="flex flex-wrap items-center gap-1 font-bold text-zinc-200">
            {creators.map((c, index) => (
              <span key={c.id}>
                <span
                  onClick={() => onPersonClick(c.id)}
                  role="button"
                  className="hover:text-primary cursor-pointer underline decoration-dotted transition-colors"
                >
                  {c.name}
                </span>
                {index < creators.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>
      )}

      {details?.overview ? (
        <ExpandableText
          text={details.overview}
          clampLines={3}
          threshold={180}
          className="my-2 max-w-3xl"
          textClassName="text-sm leading-relaxed text-zinc-300 drop-shadow md:text-base"
          buttonClassName="text-zinc-400 hover:text-zinc-200"
        />
      ) : (
        <p className="my-2 max-w-3xl text-sm leading-relaxed text-zinc-400 italic md:text-base">
          No overview available.
        </p>
      )}
    </div>
  );
}
