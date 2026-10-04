import React from "react";
import moment from "moment";
import { Milestone, Calendar } from "lucide-react";
import { ChangelogMilestone } from "@/data/changelog";
import { ChangelogBadge } from "./changelog-badge";
import { cn } from "@/lib/utils";

interface ChangelogMilestoneCardProps {
  milestone: ChangelogMilestone;
  className?: string;
}

export function ChangelogMilestoneCard({
  milestone,
  className,
}: ChangelogMilestoneCardProps) {
  const formattedDate = moment(milestone.releaseDate).format("MMMM D, YYYY");

  return (
    <article
      id={`v${milestone.version}`}
      className={cn(
        "group relative rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-6 sm:p-8 transition-all hover:border-zinc-700 shadow-lg shadow-black/40",
        milestone.isLatest && "border-amber-500/40 bg-zinc-950/90",
        className
      )}
    >
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
              v{milestone.version}
            </span>
          </div>

          {milestone.isLatest && (
            <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
              Latest Release
            </span>
          )}

          {milestone.isMajor && !milestone.isLatest && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
              <Milestone className="h-3 w-3 text-primary" />
              Major Version
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={milestone.releaseDate}>{formattedDate}</time>
        </div>
      </div>

      {/* Title & Summary */}
      <div className="mt-5 space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
          {milestone.title}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400">
          {milestone.summary}
        </p>
      </div>

      {/* Changes list */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Detailed Changes
        </h3>
        <ul className="divide-y divide-zinc-900">
          {milestone.changes.map((change, index) => (
            <li
              key={index}
              className="flex items-start gap-3 py-2.5 first:pt-1 last:pb-0"
            >
              <ChangelogBadge type={change.type} className="mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed text-zinc-300">
                {change.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
