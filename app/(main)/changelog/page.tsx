import type { Metadata } from "next";
import moment from "moment";
import { History } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CHANGELOG_MILESTONES } from "@/data/changelog";
import { ChangelogMilestoneCard } from "@/components/changelog/changelog-milestone-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Release Notes | ${siteConfig.name}`,
  description: `Discover all major feature milestones and release updates for ${siteConfig.name} since February 2023.`,
};

export default function ChangelogPage() {
  const latestMilestone = CHANGELOG_MILESTONES[0];
  const lastUpdatedFormatted = latestMilestone
    ? moment(latestMilestone.releaseDate).format("MMMM D, YYYY")
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 py-16 text-zinc-300 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <div className="text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 md:mx-0">
            <History className="h-6 w-6" />
          </div>
          <h1 className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Release Notes
          </h1>
          {lastUpdatedFormatted && (
            <p className="mt-2 text-sm text-zinc-500">
              Last Updated: {lastUpdatedFormatted}
            </p>
          )}
        </div>

        {/* Connected Timeline Section */}
        <div className="relative space-y-8 sm:space-y-10">
          {CHANGELOG_MILESTONES.map((milestone, index) => {
            const isFirst = index === 0;
            const isLast = index === CHANGELOG_MILESTONES.length - 1;

            return (
              <div
                key={milestone.version}
                className="group relative flex items-start gap-3 sm:gap-6"
              >
                {/* Vertical connecting line to the next milestone */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[44px] sm:top-[52px] -bottom-[76px] sm:-bottom-[92px] left-4 sm:left-6 w-px",
                      isFirst
                        ? "bg-linear-to-b from-amber-400 via-zinc-800 to-zinc-800"
                        : "bg-zinc-800"
                    )}
                  />
                )}

                {/* Timeline node on the line */}
                <div
                  aria-hidden="true"
                  className="relative z-10 mt-7 flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center"
                >
                  <div
                    className={cn(
                      "h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 bg-zinc-950 transition-all",
                      milestone.isLatest
                        ? "border-amber-400 bg-amber-400 ring-4 ring-amber-400/20 shadow-sm shadow-amber-400/40"
                        : milestone.isMajor
                        ? "border-primary bg-primary ring-4 ring-primary/20 shadow-sm shadow-primary/40"
                        : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500 group-hover:bg-zinc-800"
                    )}
                  />
                </div>

                {/* Milestone Card */}
                <div className="min-w-0 flex-1">
                  <ChangelogMilestoneCard milestone={milestone} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
