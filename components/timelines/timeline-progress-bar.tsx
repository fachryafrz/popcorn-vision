"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  Check,
} from "lucide-react";
import { TimelineNode } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TimelineProgressBarProps {
  nodes: TimelineNode[];
  seenNodeIds: Set<string>;
  onToggleSeen: (node: TimelineNode, e: React.MouseEvent) => void;
  onQuickView: (node: TimelineNode) => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

export function TimelineProgressBar({
  nodes,
  seenNodeIds,
  onToggleSeen,
  onQuickView,
  isLoggedIn,
  onAuthRequired,
}: TimelineProgressBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalCount = nodes.length;
  const seenCount = nodes.filter((n) => seenNodeIds.has(n.id)).length;
  const percentage = totalCount > 0 ? Math.round((seenCount / totalCount) * 100) : 0;

  return (
    <>
      {/* Floating Sticky Progress Bar */}
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md w-auto z-40">
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex flex-col gap-2.5 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {percentage}%
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">
                  You&apos;ve seen <span className="text-emerald-400 font-black">{seenCount}</span> of{" "}
                  <span className="text-zinc-300">{totalCount}</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  {percentage === 100
                    ? "🎉 All titles completed!"
                    : `${totalCount - seenCount} items remaining to watch`}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] px-2.5 rounded-lg bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
              onClick={() => setIsDrawerOpen(true)}
            >
              <span>Checklist</span>
              <ChevronUp className="size-3.5 ml-1" />
            </Button>
          </div>

          {/* Progress fill bar with glow */}
          <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {!isLoggedIn && (
            <p className="text-[10px] text-zinc-500 text-center">
              Tracking stored locally.{" "}
              <button
                type="button"
                onClick={onAuthRequired}
                className="text-amber-400 hover:underline font-medium"
              >
                Sign in
              </button>{" "}
              to sync with your Popcorn Diary.
            </p>
          )}
        </div>
      </div>

      {/* Checklist Dialog */}
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center justify-between">
              <span>Franchise Watch Checklist</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {seenCount} / {totalCount} ({percentage}%)
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Tap any entry to quickly mark it watched or preview its synopsis.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable list */}
          <div className="overflow-y-auto space-y-1.5 my-2 pr-1 max-h-[50vh] scrollbar-thin scrollbar-thumb-zinc-800">
            {nodes.map((node) => {
              const isSeen = seenNodeIds.has(node.id);
              return (
                <div
                  key={node.id}
                  className={cn(
                    "flex items-center justify-between gap-3 p-2 rounded-xl transition-colors duration-150 border",
                    isSeen
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-100"
                      : "bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900"
                  )}
                >
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer grow"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onQuickView(node);
                    }}
                  >
                    <span
                      className={cn(
                        "size-5 rounded-md flex items-center justify-center text-[10px] font-mono shrink-0",
                        isSeen
                          ? "bg-emerald-500 text-zinc-950 font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {node.chronologicalOrder}
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight flex items-center gap-1.5">
                        <span>{node.title}</span>
                        {node.canon === "legends" && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 uppercase font-extrabold">
                            Legends
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {node.inUniverseTime} • {node.releaseYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "size-8 p-0 rounded-lg",
                        isSeen
                          ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-600 hover:text-white"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      )}
                      onClick={(e) => onToggleSeen(node, e)}
                    >
                      <Check className="size-4 stroke-[2.5]" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
