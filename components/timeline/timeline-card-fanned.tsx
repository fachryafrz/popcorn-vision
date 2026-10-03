"use client";

import { useState } from "react";
import Link from "next/link";
import { TimelineSummaryItem } from "@/types/timeline";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { ArrowBigUp, GitBranch, Film } from "lucide-react";
import { TimelinePosterImage } from "./timeline-poster-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimelineCardFannedProps {
  timeline: TimelineSummaryItem;
}

export function TimelineCardFanned({ timeline }: TimelineCardFannedProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

  const upvoteMutation = useMutation(api.timelines.upvoteTimeline);
  const [upvotes, setUpvotes] = useState(timeline.upvotesCount);
  const [isUpvoted, setIsUpvoted] = useState(timeline.isUpvoted);
  const [isVoting, setIsVoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      openAuth();
      return;
    }

    if (isVoting) return;

    // Optimistic toggle
    const nextUpvoted = !isUpvoted;
    const nextCount = nextUpvoted ? upvotes + 1 : Math.max(0, upvotes - 1);
    setIsUpvoted(nextUpvoted);
    setUpvotes(nextCount);

    try {
      setIsVoting(true);
      const res = await upvoteMutation({ slugOrId: timeline.id });
      setIsUpvoted(res.isUpvoted);
      setUpvotes(res.upvotesCount);
    } catch {
      // Rollback on error
      setIsUpvoted(!nextUpvoted);
      setUpvotes(upvotes);
      toast.error("Failed to update upvote");
    } finally {
      setIsVoting(false);
    }
  };

  const posters =
    timeline.previewPosters && timeline.previewPosters.length > 0
      ? timeline.previewPosters.slice(0, 4)
      : [null];

  return (
    <Link
      href={`/timeline/${timeline.slug}`}
      className="group relative flex flex-col rounded-3xl bg-zinc-950/70 p-4 transition-all duration-300 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* 3D Fanned-Out Posters Showcase Area */}
      <div className="relative flex h-52 sm:h-56 w-full items-center justify-center overflow-visible select-none pt-2 pb-4">
        {/* Ambient Backlight Glow */}
        <div
          className="absolute inset-0 -bottom-4 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: timeline.accentColor || "#E50914" }}
        />

        {/* Upvote Pill Badge (Floating Top Left) */}
        <button
          type="button"
          onClick={handleUpvote}
          aria-label={isUpvoted ? "Remove upvote" : "Upvote timeline"}
          className={cn(
            "absolute bottom-2 left-2 z-30 flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isUpvoted
              ? "bg-primary text-white border-primary/80 shadow-primary/30 scale-105"
              : "bg-black/70 text-zinc-200 border-zinc-700/80 hover:text-white hover:border-zinc-500 hover:scale-105",
          )}
        >
          <ArrowBigUp className={cn("h-4 w-4", isUpvoted && "fill-white")} />
          <span>{upvotes}</span>
        </button>

        {/* Fanned Poster Layers */}
        <div className="relative flex items-center justify-center h-full w-full">
          {posters.map((poster, index) => {
            const total = posters.length;

            // Compute rotation & offset for 3D fan effect
            let rotateDeg = 0;
            let translateX = 0;
            let zIndex = 10 + index;

            if (total === 1) {
              rotateDeg = 0;
              translateX = 0;
            } else if (total === 2) {
              rotateDeg = index === 0 ? -6 : 6;
              translateX = index === 0 ? -18 : 18;
            } else if (total === 3) {
              if (index === 0) {
                rotateDeg = -10;
                translateX = -32;
              } else if (index === 1) {
                rotateDeg = 0;
                translateX = 0;
                zIndex = 20;
              } else {
                rotateDeg = 10;
                translateX = 32;
              }
            } else {
              // 4 posters
              if (index === 0) {
                rotateDeg = -12;
                translateX = -44;
              } else if (index === 1) {
                rotateDeg = -4;
                translateX = -14;
                zIndex = 18;
              } else if (index === 2) {
                rotateDeg = 4;
                translateX = 14;
                zIndex = 19;
              } else {
                rotateDeg = 12;
                translateX = 44;
              }
            }

            return (
              <div
                key={`${poster || "poster"}-${index}`}
                style={{
                  transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
                  zIndex,
                }}
                className={cn(
                  "absolute h-40 sm:h-44 w-28 sm:w-30 rounded-xl overflow-hidden shadow-2xl border border-zinc-800/80 bg-zinc-900 transition-all duration-500 ease-out",
                  "group-hover:scale-105 group-hover:border-zinc-600",
                )}
              >
                <TimelinePosterImage
                  src={poster}
                  alt={timeline.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-20 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Title & Metadata Bottom Section */}
      <div className="mt-2 flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-white group-hover:text-primary transition-colors truncate">
            {timeline.name}
          </h3>
          {timeline.isOfficial && (
            <span className="shrink-0 rounded-md bg-red-950/90 border border-red-500/50 px-2 py-0.5 text-[9px] font-black uppercase text-red-200">
              Official
            </span>
          )}
        </div>

        {/* Clean Inline Metadata */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 flex-wrap">
          <span className="flex items-center gap-1 font-semibold uppercase text-zinc-300">
            <Film className="h-3 w-3 text-zinc-400" />
            <span>{timeline.category ? timeline.category.replace("_", " & ").toUpperCase() : "FILM & TV"}</span>
          </span>
          <span className="text-zinc-400">·</span>
          <span className="font-semibold text-zinc-300">
            {timeline.nodeCount} {timeline.nodeCount === 1 ? "stop" : "stops"}
          </span>
          {timeline.hasBranching && (
            <>
              <span className="text-zinc-400">·</span>
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <GitBranch className="h-3 w-3 text-purple-400" />
                <span>Branching</span>
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
