import { FranchiseTimeline } from "@/types/timeline";
import { starWarsTimeline } from "./star-wars";

export interface FranchiseSummary {
  slug: string;
  title: string;
  universe: string;
  tagline: string;
  itemCount: number;
  erasCount: number;
  backdropImage: string;
  themeColor: string;
  badge?: string;
}

export const ALL_TIMELINES: FranchiseTimeline[] = [
  starWarsTimeline,
];

export function getTimelineBySlug(slug: string): FranchiseTimeline | undefined {
  return ALL_TIMELINES.find((t) => t.slug === slug);
}

export function getAllTimelineSummaries(): FranchiseSummary[] {
  return ALL_TIMELINES.map((t) => ({
    slug: t.slug,
    title: t.title,
    universe: t.universe,
    tagline: t.tagline,
    itemCount: t.nodes.length,
    erasCount: t.eras.length,
    backdropImage: t.backdropImage,
    themeColor: t.themeColor,
    badge: t.slug === "star-wars" ? "Featured Saga" : undefined,
  }));
}
