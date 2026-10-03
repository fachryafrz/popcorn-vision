import { Suspense } from "react";
import { Metadata } from "next";
import { TimelinesHubClient } from "@/components/timeline/timelines-hub-client";

export const metadata: Metadata = {
  title: "Franchise & Universe Timelines | Popcorn Vision",
  description:
    "Explore chronological and multiverse timelines for Marvel, Star Wars, DC, MonsterVerse, and custom community universes.",
};

export default function TimelineHubPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Suspense
        fallback={
          <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center bg-black text-zinc-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs font-semibold">Loading Franchise Timelines...</p>
            </div>
          </div>
        }
      >
        <TimelinesHubClient />
      </Suspense>
    </div>
  );
}


