"use client";

import React from "react";
import { Search, Film, User } from "lucide-react";
import Card from "@/components/card";
import { TMDBMedia } from "@/lib/tmdb";
import { SearchUserResult, SearchType } from "./types";
import { SkeletonCard, UserSkeletonCard } from "./skeleton-card";
import { UserCard } from "./user-card";

interface ResultsSectionProps {
  activeType: SearchType;
  query: string;
  hasQuery: boolean;
  isUsersLoading: boolean;
  isPending: boolean;
  userResults: SearchUserResult[] | undefined;
  results: TMDBMedia[];
  isLoggedIn: boolean;
  openAuth: () => void;
  setQuickViewMedia: (media: TMDBMedia) => void;
  handleTypeChange: (type: SearchType) => void;
}

export function ResultsSection({
  activeType,
  query,
  hasQuery,
  isUsersLoading,
  isPending,
  userResults,
  results,
  isLoggedIn,
  openAuth,
  setQuickViewMedia,
  handleTypeChange,
}: ResultsSectionProps) {
  if (activeType === "users") {
    if (isUsersLoading) {
      return (
        <>
          <p className="text-zinc-500 text-sm mb-6 animate-pulse text-left">Searching users…</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <UserSkeletonCard key={i} />
            ))}
          </div>
        </>
      );
    }

    if (hasQuery && (!userResults || userResults.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Search className="h-7 w-7 text-zinc-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-300">No users found</p>
            <p className="text-zinc-500 text-sm mt-1">
              Try a different keyword or username.
            </p>
          </div>
        </div>
      );
    }

    if (!hasQuery) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Search className="h-7 w-7 text-zinc-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-300">Looking for someone?</p>
            <p className="text-zinc-500 text-sm mt-1">
              Type a display name or username to start searching.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <p className="text-zinc-500 text-sm mb-6 text-left">
          {userResults?.length} user{userResults?.length !== 1 ? "s" : ""} found for{" "}
          <span className="text-zinc-300 font-semibold">&ldquo;{query}&rdquo;</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {userResults?.map((user) => (
            <UserCard
              key={user.userId}
              user={user}
              onAuthRequired={openAuth}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </>
    );
  }

  if (isPending || (activeType === "all" && isUsersLoading)) {
    return (
      <>
        <p className="text-zinc-500 text-sm mb-6 animate-pulse text-left">Searching…</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (hasQuery && results.length === 0 && (activeType !== "all" || !userResults || userResults.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Search className="h-7 w-7 text-zinc-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-300">No results found</p>
          <p className="text-zinc-500 text-sm mt-1">
            Try a different keyword or change the filter.
          </p>
        </div>
      </div>
    );
  }

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Search className="h-7 w-7 text-zinc-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-300">What are you looking for?</p>
          <p className="text-zinc-500 text-sm mt-1">
            Start typing to search movies and TV shows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* User Results under "All" */}
      {activeType === "all" && userResults && userResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Film Enthusiasts</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {userResults.length}
              </span>
            </div>
            {userResults.length > 4 && (
              <button
                onClick={() => handleTypeChange("users")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                View all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {userResults.slice(0, 4).map((user) => (
              <UserCard
                key={user.userId}
                user={user}
                onAuthRequired={openAuth}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>
      )}

      {/* Media Results */}
      {(results.length > 0 || activeType !== "all") && (
        <div>
          {activeType === "all" && userResults && userResults.length > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <Film className="h-4 w-4 text-zinc-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Movies & TV Shows</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                {results.length}
              </span>
            </div>
          )}
          {results.length > 0 ? (
            <>
              {activeType !== "all" && (
                <p className="text-zinc-500 text-sm mb-6 text-left">
                  {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="text-zinc-300 font-semibold">&ldquo;{query}&rdquo;</span>
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {results.map((media) => (
                  <Card
                    key={`${media.media_type}-${media.id}`}
                    media={media}
                    onQuickView={setQuickViewMedia}
                    onAuthRequired={openAuth}
                  />
                ))}
              </div>
            </>
          ) : (
            activeType === "all" && userResults && userResults.length > 0 && (
              <div className="py-6 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                <p className="text-zinc-500 text-sm">No matching movies or TV shows found.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
