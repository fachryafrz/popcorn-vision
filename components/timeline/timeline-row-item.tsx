"use client";

import { useState } from "react";
import Link from "next/link";
import { TimelineSummaryItem } from "@/types/timeline";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { ArrowBigUp, GitBranch, ChevronRight } from "lucide-react";
import { TimelinePosterImage } from "./timeline-poster-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimelineRowItemProps {
  timeline: TimelineSummaryItem;
}

export function TimelineRowItem({ timeline }: TimelineRowItemProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

  const upvoteMutation = useMutation(api.timelines.upvoteTimeline);
  const [upvotes, setUpvotes] = useState(timeline.upvotesCount);
  const [isUpvoted, setIsUpvoted] = useState(timeline.isUpvoted);
  const [isVoting, setIsVoting] = useState(false);

  const primaryPoster =
    timeline.previewPosters && timeline.previewPosters.length > 0
      ? timeline.previewPosters[0]
      : null;

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      openAuth();
      return;
    }

    if (isVoting) return;

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
      setIsUpvoted(!nextUpvoted);
      setUpvotes(upvotes);
      toast.error("Failed to update upvote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Link
      href={`/timeline/${timeline.slug}`}
      className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Left: Poster thumbnail + Title + Description */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-md">
          <TimelinePosterImage
            src={primaryPoster}
            alt={timeline.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate">
              {timeline.name}
            </h4>
            {timeline.isOfficial && (
              <span className="shrink-0 rounded-md bg-red-950/90 border border-red-500/50 px-1.5 py-0.5 text-[8px] font-black uppercase text-red-200">
                Official
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5 max-w-xl">
            {timeline.description}
          </p>
        </div>
      </div>

      {/* Right: Badges + Upvote Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Category Pill */}
        <span className="hidden sm:inline-block rounded-md bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase text-zinc-200">
          {timeline.category ? timeline.category.replace("_", " & ") : "FILM & TV"}
        </span>

        {/* Branch Switch Pill */}
        {timeline.hasBranching && (
          <span className="hidden md:flex items-center gap-1 rounded-md bg-purple-950/70 border border-purple-500/50 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase text-purple-200">
            <GitBranch className="h-2.5 w-2.5" />
            <span>Branching</span>
          </span>
        )}

        {/* Stops Count */}
        <span className="text-xs font-semibold text-zinc-300">
          {timeline.nodeCount} {timeline.nodeCount === 1 ? "stop" : "stops"}
        </span>

        {/* Upvote Pill */}
        <button
          type="button"
          onClick={handleUpvote}
          aria-label={isUpvoted ? "Remove upvote" : "Upvote timeline"}
          className={cn(
            "flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black backdrop-blur-md border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isUpvoted
              ? "bg-primary text-white border-primary/80 shadow-primary/30"
              : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:text-white hover:border-zinc-500",
          )}
        >
          <ArrowBigUp className={cn("h-3.5 w-3.5", isUpvoted && "fill-white")} />
          <span>{upvotes}</span>
        </button>

        <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
      </div>
    </Link>
  );
}
