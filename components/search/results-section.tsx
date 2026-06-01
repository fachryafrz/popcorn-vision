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
          <p className="mb-6 animate-pulse text-left text-sm text-zinc-500">
            Searching users…
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <UserSkeletonCard key={i} />
            ))}
          </div>
        </>
      );
    }

    if (hasQuery && (!userResults || userResults.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <Search className="h-7 w-7 text-zinc-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-300">
              No users found
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Try a different keyword or username.
            </p>
          </div>
        </div>
      );
    }

    if (!hasQuery) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <Search className="h-7 w-7 text-zinc-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-300">
              Looking for someone?
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Type a display name or username to start searching.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <p className="mb-6 text-left text-sm text-zinc-500">
          {userResults?.length} user{userResults?.length !== 1 ? "s" : ""} found
          for{" "}
          <span className="font-semibold text-zinc-300">
            &ldquo;{query}&rdquo;
          </span>
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <p className="mb-6 animate-pulse text-left text-sm text-zinc-500">
          Searching…
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (
    hasQuery &&
    results.length === 0 &&
    (activeType !== "all" || !userResults || userResults.length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
          <Search className="h-7 w-7 text-zinc-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-300">
            No results found
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different keyword or change the filter.
          </p>
        </div>
      </div>
    );
  }

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
          <Search className="h-7 w-7 text-zinc-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-300">
            What are you looking for?
          </p>
          <p className="mt-1 text-sm text-zinc-500">
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
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <h2 className="text-lg font-bold tracking-tight text-white">
                Film Enthusiasts
              </h2>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                {userResults.length}
              </span>
            </div>
            {userResults.length > 4 && (
              <button
                onClick={() => handleTypeChange("users")}
                className="cursor-pointer text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                View all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="mb-5 flex items-center gap-2">
              <Film className="h-4 w-4 text-zinc-400" />
              <h2 className="text-lg font-bold tracking-tight text-white">
                Movies & TV Shows
              </h2>
              <span className="rounded-full border border-zinc-700/60 bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                {results.length}
              </span>
            </div>
          )}
          {results.length > 0 ? (
            <>
              {activeType !== "all" && (
                <p className="mb-6 text-left text-sm text-zinc-500">
                  {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-zinc-300">
                    &ldquo;{query}&rdquo;
                  </span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
            activeType === "all" &&
            userResults &&
            userResults.length > 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 py-6 text-center">
                <p className="text-sm text-zinc-500">
                  No matching movies or TV shows found.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
