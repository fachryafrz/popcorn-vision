import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TimelineClient } from "@/components/timeline/timeline-client";
import { getTimelineUniverse, TIMELINE_UNIVERSES } from "@/config/timelines";

interface TimelineUniversePageProps {
  params: Promise<{ universeId: string }>;
}

export async function generateStaticParams() {
  return TIMELINE_UNIVERSES.map((universe) => ({
    universeId: universe.id,
  }));
}

export async function generateMetadata({
  params,
}: TimelineUniversePageProps): Promise<Metadata> {
  const { universeId } = await params;
  const universe = getTimelineUniverse(universeId);

  return {
    title: universe
      ? `${universe.name} Timeline | Popcorn Vision`
      : `${universeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Timeline | Popcorn Vision`,
    description:
      universe?.description ??
      "Explore the interactive chronological franchise timeline and multiverse branches on Popcorn Vision.",
  };
}

export default async function TimelineUniversePage({
  params,
}: TimelineUniversePageProps) {
  const { universeId } = await params;
  const universe =
    getTimelineUniverse(universeId) ?? {
      id: universeId,
      name: universeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      shortName: universeId.toUpperCase(),
      description: "Interactive franchise timeline and multiverse paths.",
      accentColor: "#E50914",
      defaultFilterId: "all",
      filters: [{ id: "all", label: "All Items" }],
      nodes: [],
      edges: [],
    };

  return (
    <div className="pt-16 sm:pt-20">
      <Suspense
        fallback={
          <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-zinc-950 text-zinc-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs font-semibold">Loading {universe.name} Timeline...</p>
            </div>
          </div>
        }
      >
        <TimelineClient universe={universe} />
      </Suspense>
    </div>
  );
}

