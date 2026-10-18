import type { Metadata } from "next";
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
  return (
    <main className="min-h-screen bg-zinc-950 py-16 text-zinc-300 md:py-24">
      <div className="mx-auto max-w-4xl p-4 pb-0 sm:p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <div className="text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 md:mx-0">
            <History className="h-6 w-6" />
          </div>
          <h1 className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Release Notes
          </h1>
        </div>

        {/* Connected Timeline Section */}
        <div className="relative">
          {CHANGELOG_MILESTONES.map((milestone, index) => {
            const isFirst = index === 0;
            const isLast = index === CHANGELOG_MILESTONES.length - 1;

            return (
              <div
                key={milestone.version}
                id={`v${milestone.version.replace(/\./g, "-")}`}
                className="relative flex gap-3.5 md:gap-5 group scroll-mt-20 md:scroll-mt-24"
              >
                {/* Timeline Axis Column */}
                <div className="relative flex w-7 shrink-0 justify-center">
                  {/* Continuous unbroken spine line connecting from first to last node */}
                  {CHANGELOG_MILESTONES.length > 1 && (
                    <div
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 mx-auto w-0.5 bg-zinc-900",
                        isFirst && "top-[34px] md:top-[38px] bottom-0",
                        !isFirst && !isLast && "top-0 bottom-0",
                        isLast && "top-0 h-[34px] md:h-[38px]"
                      )}
                    />
                  )}

                  {/* Node Dot (centered to match the card version badge) */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 mx-auto z-10 flex size-7 items-center justify-center bg-zinc-900 rounded-full top-[20px] md:top-[24px]"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full transition-all duration-300",
                        milestone.isLatest
                          ? "size-4.5 bg-primary ring-4 ring-primary/20 shadow-xs"
                          : "size-3.5 bg-zinc-950 border-2 border-zinc-700 group-hover:border-primary"
                      )}
                    >
                      {milestone.isLatest && (
                        <span className="size-1.5 rounded-full bg-zinc-950" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone Card Column */}
                <div className={cn("flex-1 min-w-0", !isLast && "pb-6 md:pb-8")}>
                  <ChangelogMilestoneCard
                    milestone={milestone}
                    defaultExpanded={isFirst}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
