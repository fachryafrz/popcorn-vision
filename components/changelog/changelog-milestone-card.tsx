"use client";

import React, { useState } from "react";
import moment from "moment";
import { Milestone, Calendar, ChevronDown, Tag } from "lucide-react";
import { ChangelogMilestone } from "@/data/changelog";
import { ChangelogBadge } from "./changelog-badge";
import { cn } from "@/lib/utils";

interface ChangelogMilestoneCardProps {
  milestone: ChangelogMilestone;
  className?: string;
  defaultExpanded?: boolean;
  collapsible?: boolean;
}

export function ChangelogMilestoneCard({
  milestone,
  className,
  defaultExpanded,
  collapsible = true,
}: ChangelogMilestoneCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(
    defaultExpanded ?? (milestone.isLatest ?? false)
  );
  const formattedDate = moment(milestone.releaseDate).format("MMMM D, YYYY");

  const toggleExpand = () => {
    if (!collapsible) return;
    setIsExpanded((prev) => !prev);
  };

  return (
    <article
      id={`v${milestone.version}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/70 transition-all hover:border-zinc-700 shadow-lg shadow-black/40",
        milestone.isLatest && "border-primary/40 ring-1 ring-primary/20 bg-zinc-950/90",
        className
      )}
    >
      {/* Interactive Header Row */}
      <div
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onClick={toggleExpand}
        onKeyDown={(e) => {
          if (collapsible && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            toggleExpand();
          }
        }}
        className={cn(
          "flex items-start justify-between gap-3 p-5 sm:p-6 transition-colors select-none",
          collapsible && "cursor-pointer hover:bg-zinc-900/40 focus-visible:outline-hidden focus-visible:bg-zinc-900/40"
        )}
      >
        <div className="flex-1 min-w-0 space-y-2">
          {/* Version & Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs sm:text-sm border border-zinc-800">
              <Tag className="size-3.5 text-primary" />
              <span>v{milestone.version}</span>
            </div>

            {milestone.isLatest && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary">
                Latest Release
              </span>
            )}

            {milestone.isMajor && !milestone.isLatest && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300">
                <Milestone className="h-3 w-3 text-primary" />
                Major Version
              </span>
            )}
          </div>

          {/* Release Title */}
          {milestone.title && (
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight leading-snug">
              {milestone.title}
            </h2>
          )}

          {/* Date Row */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-0.5">
            <Calendar className="size-3.5 shrink-0" />
            <time dateTime={milestone.releaseDate}>{formattedDate}</time>
          </div>
        </div>

        {/* Chevron Toggle Button */}
        {collapsible && (
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-all duration-200 mt-0.5",
              "group-hover:text-zinc-200 group-hover:bg-zinc-900"
            )}
            aria-label={isExpanded ? "Collapse release details" : "Expand release details"}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        )}
      </div>

      {/* Expanded Content Section */}
      {(!collapsible || isExpanded) && (
        <div className="border-t border-zinc-900 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 space-y-4">
          {/* Summary */}
          {milestone.summary && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {milestone.summary}
            </p>
          )}

          {/* Changes List */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Detailed Changes ({milestone.changes.length})
            </h3>

            <div className="space-y-2.5">
              {milestone.changes.map((change, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/40 transition-colors hover:bg-zinc-900/80"
                >
                  <div className="shrink-0 pt-0.5">
                    <ChangelogBadge type={change.type} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-200 leading-snug">
                      {change.title}
                    </p>
                    {change.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {change.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
