"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import ActivityCard from "./activity-card";
import { Loader2, Globe, Users, Film, CheckCircle, Star, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All Activities", icon: Film },
  { id: "watchlist", label: "Watchlist", icon: Bookmark },
  { id: "rate", label: "Ratings", icon: Star },
  { id: "favorite", label: "Favorites", icon: Heart },
  { id: "review", label: "Reviews", icon: Film }, // reusing film for reviews
  { id: "completed_season", label: "Seasons", icon: CheckCircle },
];

export default function ActivityFeed() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const [scope, setScope] = useState<"global" | "friends">("global");
  const [activeFilter, setActiveFilter] = useState("all");

  const { results, status, loadMore } = usePaginatedQuery(
    api.activities.getFeed,
    {
      filter: activeFilter === "all" ? undefined : activeFilter,
      scope,
    },
    { initialNumItems: 10 }
  );

  const handleScopeChange = (newScope: "global" | "friends") => {
    if (newScope === "friends" && !isLoggedIn) {
      return; // disable switching to friends feed if not logged in
    }
    setScope(newScope);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Feed Title and Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            Activity Feed
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            See updates from friends and the popcorn community.
          </p>
        </div>

        {/* Global vs Friends scope toggle */}
        <div className="flex bg-zinc-950/60 rounded-xl p-1 border border-zinc-850/60 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => handleScopeChange("global")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
              scope === "global"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            Global
          </button>
          <button
            onClick={() => handleScopeChange("friends")}
            disabled={!isLoggedIn}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
              scope === "friends"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            )}
            title={!isLoggedIn ? "Log in to see friends activity" : "Friends Feed"}
          >
            <Users className="h-3.5 w-3.5" />
            Friends
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300",
                isActive
                  ? "border-blue-500/30 bg-blue-600/10 text-blue-400"
                  : "border-zinc-850 bg-zinc-900/20 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))
        ) : status === "LoadingMore" || status === "LoadingFirstPage" ? null : (
          <div className="flex flex-col items-center justify-center border border-zinc-800/40 bg-zinc-900/10 rounded-2xl py-16 px-4 text-center">
            <p className="text-sm font-semibold text-zinc-400">
              No activities found
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              {scope === "friends"
                ? "Your friends haven't shared any activities yet. Start adding friends or browse the Global feed!"
                : "No activities of this type are currently recorded."}
            </p>
          </div>
        )}

        {/* Loading and Infinite Scroll trigger */}
        {(status === "LoadingFirstPage" || status === "LoadingMore") && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-xs font-semibold text-zinc-500 mt-2">
              Loading activities...
            </span>
          </div>
        )}

        {status === "CanLoadMore" && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => loadMore(10)}
              variant="outline"
              size="sm"
              className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-bold rounded-xl px-5 text-xs h-9"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
