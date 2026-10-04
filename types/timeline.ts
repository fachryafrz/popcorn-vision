export type TimelineMediaType = "movie" | "tv";
export type CanonStatus = "canon" | "legends";

export interface TimelineNode {
  id: string;
  mediaId: number;
  mediaType: TimelineMediaType;
  title: string;
  releaseYear: number;
  chronologicalOrder: number;
  inUniverseTime: string;
  eraId: string;
  canon: CanonStatus;
  branch?: string;
  branchParentId?: string;
  customPosterPath?: string;
  overview?: string;
  duration?: string;
  seasonsCount?: number;
  tag?: string;
}

export interface TimelineEra {
  id: string;
  name: string;
  timeSpan: string;
  color: string;
  accentBorder: string;
  description?: string;
}

export interface FranchiseTimeline {
  slug: string;
  title: string;
  universe: string;
  tagline: string;
  description: string;
  backdropImage: string;
  logoImage?: string;
  themeColor: string;
  eras: TimelineEra[];
  nodes: TimelineNode[];
  supportsLegendsToggle: boolean;
  defaultFilter: {
    showLegends: boolean;
    mediaType: "all" | "movie" | "tv";
  };
}

export interface TimelineFilterState {
  showLegends: boolean;
  mediaType: "all" | "movie" | "tv";
  selectedEra: string | "all";
  searchQuery: string;
}
