"use client";

import { useState, useMemo, Suspense } from "react";
import { TMDBMedia } from "@/lib/tmdb";
import { TMDBCompanyDetails } from "@/lib/tmdb-actions";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import {
  ArrowLeft,
  Film,
  Tv,
  MapPin,
  Building2,
  Globe,
  ExternalLink,
  Info,
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/card";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyDetailClientProps {
  company: TMDBCompanyDetails;
  movies: TMDBMedia[];
  tvShows: TMDBMedia[];
}

type MediaFilter = "all" | "movie" | "tv";
type SortOption = "popularity" | "release_date" | "vote_average";

export default function CompanyDetailClient({
  company,
  movies,
  tvShows,
}: CompanyDetailClientProps) {
  const {
    open: openAuth,
    isOpen: isAuthOpen,
    close: closeAuth,
  } = useAuthModalStore();

  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  // Combine and deduplicate movies & tv shows
  const mergedMedia = useMemo(() => {
    const list: (TMDBMedia & { media_type: "movie" | "tv" })[] = [];
    const seen = new Set<string>();

    movies.forEach((m) => {
      const key = `movie-${m.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({ ...m, media_type: "movie" });
      }
    });

    tvShows.forEach((t) => {
      const key = `tv-${t.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({ ...t, media_type: "tv" });
      }
    });

    return list;
  }, [movies, tvShows]);

  // Filtered media list based on active media filter
  const filteredMedia = useMemo(() => {
    return mergedMedia.filter((item) => {
      if (mediaFilter === "movie") return item.media_type === "movie";
      if (mediaFilter === "tv") return item.media_type === "tv";
      return true;
    });
  }, [mergedMedia, mediaFilter]);

  // Sorted media list
  const sortedMedia = useMemo(() => {
    const mediaCopy = [...filteredMedia];
    return mediaCopy.sort((a, b) => {
      if (sortBy === "popularity") {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      if (sortBy === "vote_average") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === "release_date") {
        const dateA = a.release_date || a.first_air_date || "0000-00-00";
        const dateB = b.release_date || b.first_air_date || "0000-00-00";
        return dateB.localeCompare(dateA);
      }
      return 0;
    });
  }, [filteredMedia, sortBy]);

  // Count stats
  const movieCount = movies.length;
  const tvCount = tvShows.length;

  return (
    <div className="min-h-screen bg-black pt-20 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Company Profile Header */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl sm:p-8 md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            {/* Studio Logo */}
            <div className="flex aspect-[4/3] w-[220px] shrink-0 items-center justify-center rounded-2xl bg-white/95 p-6 shadow-2xl shadow-red-950/20">
              {company.logo_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                />
              ) : (
                <div className="flex flex-col items-center text-zinc-400">
                  <Building2 className="h-12 w-12 stroke-[1.5]" />
                  <span className="mt-2 text-center text-xs font-semibold text-zinc-600">
                    No Logo Available
                  </span>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {company.name}
                </h1>
                {company.origin_country && (
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 uppercase">
                    {company.origin_country}
                  </span>
                )}
              </div>

              {/* Meta information tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400 md:justify-start">
                {company.headquarters && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{company.headquarters}</span>
                  </div>
                )}

                {company.parent_company && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-zinc-400" />
                    <span>
                      Parent Company:{" "}
                      <Link
                        href={`/company/${company.parent_company.id}`}
                        className="font-medium text-red-400 hover:underline"
                      >
                        {company.parent_company.name}
                      </Link>
                    </span>
                  </div>
                )}

                {company.homepage && (
                  <a
                    href={company.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium text-zinc-300 transition hover:text-white"
                  >
                    <Globe className="h-4 w-4 text-blue-400" />
                    <span>Official Website</span>
                    <ExternalLink className="h-3 w-3 text-zinc-500" />
                  </a>
                )}
              </div>

              {/* Description */}
              {company.description ? (
                <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {company.description}
                </p>
              ) : (
                <p className="mt-5 text-sm text-zinc-500 italic">
                  No description available for this production company.
                </p>
              )}

              {/* Statistics */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5">
                  <Film className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-zinc-400">Movies:</span>
                  <span className="text-sm font-bold text-white">
                    {movieCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5">
                  <Tv className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-zinc-400">TV Shows:</span>
                  <span className="text-sm font-bold text-white">
                    {tvCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Media Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMediaFilter("all")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                mediaFilter === "all"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              All Titles ({mergedMedia.length})
            </button>
            <button
              onClick={() => setMediaFilter("movie")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                mediaFilter === "movie"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <Film className="h-4 w-4" />
              Movies ({movieCount})
            </button>
            <button
              onClick={() => setMediaFilter("tv")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                mediaFilter === "tv"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <Tv className="h-4 w-4" />
              TV Shows ({tvCount})
            </button>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Sort By:
            </span>
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger className="w-[180px] rounded-xl border-zinc-800 bg-zinc-900/80 text-sm text-zinc-200">
                <SelectValue>
                  {sortBy === "popularity" && "Popularity"}
                  {sortBy === "release_date" && "Release Date"}
                  {sortBy === "vote_average" && "Rating"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-200">
                <SelectGroup>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="release_date">Release Date</SelectItem>
                  <SelectItem value="vote_average">Rating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Media Catalog Grid */}
        {sortedMedia.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedMedia.map((item) => (
              <Card
                key={`${item.media_type}-${item.id}`}
                media={item}
                onQuickView={(media) => setQuickViewMedia(media)}
                onAuthRequired={() => openAuth()}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800/80 bg-zinc-900/20 py-20 text-center">
            <Info className="h-12 w-12 text-zinc-600" />
            <h3 className="mt-4 text-lg font-bold text-zinc-300">
              No titles found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              There are no productions available under this category.
            </p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewMedia}
        media={quickViewMedia}
        onClose={() => setQuickViewMedia(null)}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </div>
  );
}
