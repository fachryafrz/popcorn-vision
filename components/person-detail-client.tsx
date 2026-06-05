"use client";

import { useState, useMemo } from "react";
import { TMDBMedia, cleanMediaData, TMDBRawItem } from "@/lib/tmdb";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { ArrowLeft, Film, Tv, MapPin, Award, User, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/card";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
}

interface CreditItem extends TMDBRawItem {
  character?: string;
  job?: string;
  department?: string;
}


interface PersonCredits {
  cast: CreditItem[];
  crew: CreditItem[];
}

interface PersonDetailClientProps {
  person: TMDBPerson;
  credits: PersonCredits;
}

type MediaFilter = "all" | "movie" | "tv";
type RoleFilter = "all" | "cast" | "crew";
type SortOption = "popularity" | "release_date" | "vote_average";

export default function PersonDetailClient({
  person,
  credits,
}: PersonDetailClientProps) {
  const { open: openAuth, isOpen: isAuthOpen, close: closeAuth } = useAuthModalStore();
  // No-op

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  // Merge cast & crew details uniquely
  const mergedCredits = useMemo(() => {
    const seen = new Set<string>();
    const list: (TMDBMedia & { roleLabel: string; isCast: boolean; isCrew: boolean })[] = [];

    // Cast Credits
    if (credits?.cast) {
      credits.cast.forEach((item) => {
        const key = `${item.media_type || "movie"}-${item.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          const cleaned = cleanMediaData([item])[0];
          if (cleaned) {
            list.push({
              ...cleaned,
              roleLabel: item.character ? `as ${item.character}` : "Cast",
              isCast: true,
              isCrew: false,
            });
          }
        }
      });
    }

    // Crew Credits
    if (credits?.crew) {
      credits.crew.forEach((item) => {
        const key = `${item.media_type || "movie"}-${item.id}`;
        const existing = list.find((x) => `${x.media_type}-${x.id}` === key);
        if (existing) {
          existing.isCrew = true;
          if (item.job) {
            existing.roleLabel = `${existing.roleLabel} / ${item.job}`;
          }
        } else {
          seen.add(key);
          const cleaned = cleanMediaData([item])[0];
          if (cleaned) {
            list.push({
              ...cleaned,
              roleLabel: item.job || "Crew",
              isCast: false,
              isCrew: true,
            });
          }
        }
      });
    }

    return list;
  }, [credits]);

  // Filter & Sort
  const filteredAndSortedCredits = useMemo(() => {
    let result = [...mergedCredits];

    // Filter by Media Type
    if (mediaFilter !== "all") {
      result = result.filter((item) => item.media_type === mediaFilter);
    }

    // Filter by Role
    if (roleFilter === "cast") {
      result = result.filter((item) => item.isCast);
    } else if (roleFilter === "crew") {
      result = result.filter((item) => item.isCrew);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "popularity") {
        return b.popularity - a.popularity;
      }
      if (sortBy === "vote_average") {
        return b.vote_average - a.vote_average;
      }
      if (sortBy === "release_date") {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [mergedCredits, mediaFilter, roleFilter, sortBy]);

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : "/logo/popcorn.png";

  // Age calculation
  const age = useMemo(() => {
    if (!person.birthday) return null;
    const birth = moment(person.birthday);
    if (person.deathday) {
      const death = moment(person.deathday);
      return `${death.diff(birth, "years")} (Deceased)`;
    }
    return moment().diff(birth, "years");
  }, [person.birthday, person.deathday]);

  return (
    <main className="bg-background text-foreground min-h-svh pt-24 pb-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Profile Header Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] lg:gap-16">
          {/* Left Column: Photo & Details */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="border-zinc-800/80 aspect-2/3 w-full max-w-[280px] overflow-hidden rounded-2xl border bg-zinc-900 shadow-2xl">
              <img
                src={profileUrl}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-8 w-full space-y-4 text-sm text-zinc-300">
              <h3 className="border-zinc-850 border-b pb-2 text-base font-bold text-white">
                Personal Info
              </h3>

              {person.known_for_department && (
                <div>
                  <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Known For
                  </span>
                  <span className="text-zinc-200">{person.known_for_department}</span>
                </div>
              )}

              {person.birthday && (
                <div>
                  <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Birth Date
                  </span>
                  <span className="text-zinc-200">
                    {moment(person.birthday).format("MMM Do, YYYY")}
                    {age && ` (Age ${age})`}
                  </span>
                </div>
              )}

              {person.deathday && (
                <div>
                  <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Day of Death
                  </span>
                  <span className="text-zinc-200">
                    {moment(person.deathday).format("MMM Do, YYYY")}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div className="flex flex-col items-center md:items-start">
                  <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Place of Birth
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-zinc-200">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    {person.place_of_birth}
                  </span>
                </div>
              )}

              {person.popularity !== undefined && (
                <div>
                  <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                    Popularity Score
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-white">
                      {person.popularity.toFixed(1)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio & Filmography */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                {person.name}
              </h1>

              {person.biography && (
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-bold text-white">Biography</h3>
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-zinc-300 transition-all duration-300 sm:text-base",
                      !isBioExpanded && person.biography.length > 350 && "line-clamp-4",
                    )}
                  >
                    {person.biography}
                  </p>
                  {person.biography.length > 350 && (
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="mt-2 flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white"
                    >
                      {isBioExpanded ? (
                        <>
                          Show Less <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Read Full Bio <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filmography Section */}
            <div>
              <div className="border-zinc-800/80 mb-6 flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Filmography ({filteredAndSortedCredits.length})
                </h2>

                {/* Filters & Sorting controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Media Type Filter */}
                  <div className="flex items-center gap-1 rounded-xl bg-zinc-900/60 p-1 border border-zinc-800/40">
                    <button
                      onClick={() => setMediaFilter("all")}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        mediaFilter === "all" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setMediaFilter("movie")}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        mediaFilter === "movie" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      <Film className="h-3 w-3" /> Movies
                    </button>
                    <button
                      onClick={() => setMediaFilter("tv")}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        mediaFilter === "tv" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      <Tv className="h-3 w-3" /> TV
                    </button>
                  </div>

                  {/* Role Filter */}
                  <div className="flex items-center gap-1 rounded-xl bg-zinc-900/60 p-1 border border-zinc-800/40">
                    <button
                      onClick={() => setRoleFilter("all")}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        roleFilter === "all" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      Any Role
                    </button>
                    <button
                      onClick={() => setRoleFilter("cast")}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        roleFilter === "cast" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      Cast
                    </button>
                    <button
                      onClick={() => setRoleFilter("crew")}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        roleFilter === "crew" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      Crew
                    </button>
                  </div>

                  {/* Sorting */}
                  <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val as SortOption)}
                  >
                    <SelectTrigger className="h-8 rounded-lg border border-zinc-800/40 bg-zinc-900/60 px-2.5 text-xs font-semibold text-zinc-300 outline-none hover:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="release_date">Release Date</SelectItem>
                        <SelectItem value="vote_average">Rating</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid of movies/tv shows */}
              {filteredAndSortedCredits.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredAndSortedCredits.map((item) => (
                    <div key={`${item.media_type}-${item.id}`} className="flex flex-col gap-2">
                      <Card
                        media={item}
                        onQuickView={setQuickViewMedia}
                        onAuthRequired={openAuth}
                      />
                      {/* Character/Role label */}
                      {item.roleLabel && (
                        <span className="line-clamp-2 px-1 text-center text-[10px] leading-tight text-zinc-500" title={item.roleLabel}>
                          {item.roleLabel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center">
                  <User className="mb-2 h-8 w-8 text-zinc-600" />
                  <p className="text-sm text-zinc-400 font-semibold">No media matches the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </main>
  );
}
