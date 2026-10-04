import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTimelineBySlug, ALL_TIMELINES } from "@/data/timelines";
import { TimelineView } from "@/components/timelines/timeline-view";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_TIMELINES.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const timeline = getTimelineBySlug(slug);

  if (!timeline) {
    return {
      title: "Timeline Not Found - Popcorn Vision",
    };
  }

  return {
    title: `${timeline.title} (Chronological Watch Order) - Popcorn Vision`,
    description: timeline.description,
    openGraph: {
      title: `${timeline.title} - Chronological Universe Map`,
      description: timeline.description,
    },
  };
}

export default async function FranchiseTimelinePage({ params }: PageProps) {
  const { slug } = await params;
  const timeline = getTimelineBySlug(slug);

  if (!timeline) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
          <Loader2 className="size-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <TimelineView timeline={timeline} />
    </Suspense>
  );
}
