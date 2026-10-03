export type TimelineCanonType = "sacred" | "multiverse" | "tva" | "legacy" | "canon" | "spinoff" | "alternate" | "legends";

export interface TimelineMediaItem {
  [key: string]: unknown;
  id: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  releaseYear: string;
  chronologicalYear?: string;
  posterPath: string;
  rating?: number;
  isAnchor?: boolean;
  branchName?: string;
  universeId?: string;
  isDoomsdayCanon?: boolean;
  phase?: string;
  canonType: TimelineCanonType;
  description?: string;
}

export interface TimelineFilterOption {
  id: string;
  label: string;
  description?: string;
}

export interface TimelineNodeData {
  id: string;
  type?: "mediaNode" | "headerNode";
  position: { x: number; y: number };
  data: TimelineMediaItem;
}

export interface TimelineEdgeData {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  description?: string;
  animated?: boolean;
  strokeColor?: string;
  isDashed?: boolean;
  branchVariant?: "sacred" | "tva" | "multiverse" | "secondary";
}

export type TimelineCategory = "all" | "film_tv" | "scifi" | "horror" | "anime";

export interface TimelineUniverse {
  _id?: string;
  id: string; // slug or ID
  slug?: string;
  name: string;
  shortName: string;
  description: string;
  accentColor: string;
  category?: string;
  isOfficial?: boolean;
  creatorId?: string;
  creatorName?: string;
  creatorUsername?: string;
  privacy?: "public" | "private";
  upvotesCount?: number;
  isUpvoted?: boolean;
  previewPosters?: string[];
  filters: TimelineFilterOption[];
  defaultFilterId: string;
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  createdAt?: number;
  updatedAt?: number;
}

export interface TimelineSummaryItem {
  _id?: string;
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  accentColor: string;
  category?: string;
  isOfficial?: boolean;
  creatorId?: string;
  creatorName?: string;
  creatorUsername?: string;
  privacy?: "public" | "private";
  upvotesCount: number;
  isUpvoted: boolean;
  previewPosters: string[];
  nodeCount: number;
  hasBranching: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateTimelineInput {
  name: string;
  shortName: string;
  slug: string;
  description: string;
  accentColor: string;
  category?: string;
  privacy: "public" | "private";
}
