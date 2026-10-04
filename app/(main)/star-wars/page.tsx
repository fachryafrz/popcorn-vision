import { Suspense } from "react";
import { Metadata } from "next";
import { starWarsTimeline } from "@/data/timelines/star-wars";
import { TimelineView } from "@/components/timelines/timeline-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Star Wars Chronological Timeline & Watch Order - Popcorn Vision",
  description:
    "Explore the complete Star Wars saga in canonical and legends chronological order. From the High Republic and Fall of the Jedi to the Rise of the First Order.",
  openGraph: {
    title: "Star Wars Chronological Timeline - Popcorn Vision",
    description: "Interactive galactic timeline and watch tracker for the entire Star Wars franchise.",
  },
};

export default function StarWarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
          <Loader2 className="size-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <TimelineView timeline={starWarsTimeline} />
    </Suspense>
  );
}
