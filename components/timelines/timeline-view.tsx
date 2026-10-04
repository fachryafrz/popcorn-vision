"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useUserLibrary } from "@/components/user-library-provider";
import { FranchiseTimeline, TimelineFilterState, TimelineNode } from "@/types/timeline";
import { TMDBMedia } from "@/lib/tmdb";
import { TimelineHeader } from "./timeline-header";
import { TimelineCanvas } from "./timeline-canvas";
import { TimelineProgressBar } from "./timeline-progress-bar";
import { TimelineDiagramCanvas } from "./timeline-diagram-canvas";
import { DiagramNode } from "./star-wars-diagram-data";
import QuickViewModal from "@/components/quick-view-modal";
import LogWatchModal from "@/components/log-watch-modal";
import { toast } from "sonner";

interface TimelineViewProps {
  timeline: FranchiseTimeline;
}

const GUEST_SEEN_STORAGE_PREFIX = "popcorn_timeline_seen_";

export function TimelineView({ timeline }: TimelineViewProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

  // Watch diary query for logged-in users
  const userDiary = useQuery(
    api.diary.getUserDiary,
    isLoggedIn ? {} : "skip"
  );

  const logWatchMutation = useMutation(api.diary.logWatch);
  const deleteDiaryEntryMutation = useMutation(api.diary.deleteDiaryEntry);

  // Set of media keys in user diary
  const userDiaryMediaKeys = useMemo(() => {
    if (!userDiary) return new Set<string>();
    return new Set(userDiary.map((e) => `${e.mediaType}-${e.mediaId}`));
  }, [userDiary]);

  // Handler for logging watch in Convex from Diagram
  const handleLogWatchConvex = async (node: DiagramNode) => {
    try {
      await logWatchMutation({
        mediaId: String(node.mediaId),
        mediaType: node.mediaType,
        title: node.title,
        posterPath: node.customPosterPath || "",
        releaseYear: String(node.releaseYear),
        watchedDate: Date.now(),
        rewatch: false,
      });
      toast.success(`Marked "${node.title}" as watched!`);
    } catch {
      toast.error("Failed to log watch entry");
    }
  };

  // Handler for unlogging watch in Convex from Diagram
  const handleRemoveWatchConvex = async (node: DiagramNode) => {
    const existing = userDiary?.find(
      (d) => d.mediaId === String(node.mediaId) && d.mediaType === node.mediaType
    );
    if (existing) {
      try {
        await deleteDiaryEntryMutation({ diaryId: existing._id });
        toast.success(`Removed "${node.title}" from watched`);
      } catch {
        toast.error("Failed to remove watch entry");
      }
    }
  };

  // If viewing Star Wars, render the exact Queuebrick Flowchart Diagram Canvas
  if (timeline.slug === "star-wars") {
    return (
      <TimelineDiagramCanvas
        isLoggedIn={isLoggedIn}
        onAuthRequired={openAuth}
        userDiaryMediaKeys={userDiaryMediaKeys}
        onLogWatchConvex={handleLogWatchConvex}
        onRemoveWatchConvex={handleRemoveWatchConvex}
      />
    );
  }

  // Fallback / standard multi-franchise canvas for other timelines
  return <GenericTimelineView timeline={timeline} />;
}

// Fallback Generic Timeline View
function GenericTimelineView({ timeline }: { timeline: FranchiseTimeline }) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);
  const { isWatchlisted: checkWatchlisted } = useUserLibrary();

  const [filters, setFilters] = useState<TimelineFilterState>({
    showLegends: timeline.defaultFilter.showLegends,
    mediaType: timeline.defaultFilter.mediaType,
    selectedEra: "all",
    searchQuery: "",
  });
  const [zoom, setZoom] = useState(1);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);
  const [logWatchNode, setLogWatchNode] = useState<TimelineNode | null>(null);

  const userDiary = useQuery(
    api.diary.getUserDiary,
    isLoggedIn ? {} : "skip"
  );

  const logWatchMutation = useMutation(api.diary.logWatch);
  const deleteDiaryEntryMutation = useMutation(api.diary.deleteDiaryEntry);

  const [guestSeenIds, setGuestSeenIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(`${GUEST_SEEN_STORAGE_PREFIX}${timeline.slug}`);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  const saveGuestSeen = useCallback((newIds: string[]) => {
    setGuestSeenIds(newIds);
    try {
      localStorage.setItem(
        `${GUEST_SEEN_STORAGE_PREFIX}${timeline.slug}`,
        JSON.stringify(newIds)
      );
    } catch {
      // ignore
    }
  }, [timeline.slug]);

  const seenNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (isLoggedIn && userDiary) {
      const diaryMediaKeys = new Set(
        userDiary.map((entry) => `${entry.mediaType}-${entry.mediaId}`)
      );
      timeline.nodes.forEach((node) => {
        if (diaryMediaKeys.has(`${node.mediaType}-${node.mediaId}`)) {
          set.add(node.id);
        }
      });
    } else {
      guestSeenIds.forEach((id) => set.add(id));
    }
    return set;
  }, [isLoggedIn, userDiary, guestSeenIds, timeline.nodes]);

  const filteredNodes = useMemo(() => {
    return timeline.nodes.filter((node) => {
      if (!filters.showLegends && node.canon === "legends") return false;
      if (filters.mediaType !== "all" && node.mediaType !== filters.mediaType) return false;
      if (filters.selectedEra !== "all" && node.eraId !== filters.selectedEra) return false;
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        if (
          !node.title.toLowerCase().includes(query) &&
          !node.branch?.toLowerCase().includes(query) &&
          !node.releaseYear.toString().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [timeline.nodes, filters]);

  const handleToggleSeen = async (node: TimelineNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrentlySeen = seenNodeIds.has(node.id);

    if (isLoggedIn) {
      if (isCurrentlySeen) {
        const existingEntry = userDiary?.find(
          (d) => d.mediaId === String(node.mediaId) && d.mediaType === node.mediaType
        );
        if (existingEntry) {
          try {
            await deleteDiaryEntryMutation({ diaryId: existingEntry._id });
            toast.success(`Removed "${node.title}" from watched`);
          } catch {
            toast.error("Failed to remove diary entry");
          }
        }
      } else {
        try {
          await logWatchMutation({
            mediaId: String(node.mediaId),
            mediaType: node.mediaType,
            title: node.title,
            posterPath: node.customPosterPath || "",
            releaseYear: String(node.releaseYear),
            watchedDate: Date.now(),
            rewatch: false,
          });
          toast.success(`Marked "${node.title}" as watched!`);
        } catch {
          toast.error("Failed to log watch entry");
        }
      }
    } else {
      const newIds = isCurrentlySeen
        ? guestSeenIds.filter((id) => id !== node.id)
        : [...guestSeenIds, node.id];
      saveGuestSeen(newIds);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <TimelineHeader
        timeline={timeline}
        filters={filters}
        onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
        zoom={zoom}
        onZoomChange={setZoom}
        onResetZoom={() => setZoom(1)}
        totalFilteredCount={filteredNodes.length}
      />

      <div className="grow">
        <TimelineCanvas
          timeline={timeline}
          filteredNodes={filteredNodes}
          seenNodeIds={seenNodeIds}
          zoom={zoom}
          onToggleSeen={handleToggleSeen}
          onQuickView={(node) => {
            setQuickViewMedia({
              id: node.mediaId,
              title: node.mediaType === "movie" ? node.title : undefined,
              name: node.mediaType === "tv" ? node.title : undefined,
              poster_path: node.customPosterPath || null,
              backdrop_path: null,
              media_type: node.mediaType,
              vote_average: 0,
              release_date: `${node.releaseYear}-01-01`,
              genre_ids: [],
              overview: node.overview || "",
              popularity: 0,
            });
          }}
          onLogWatch={(node) => setLogWatchNode(node)}
          onToggleWatchlist={() => {}}
          isWatchlisted={(id, type) => checkWatchlisted(id, type)}
        />
      </div>

      <TimelineProgressBar
        nodes={filteredNodes}
        seenNodeIds={seenNodeIds}
        onToggleSeen={handleToggleSeen}
        onQuickView={(node) => {
          setQuickViewMedia({
            id: node.mediaId,
            title: node.mediaType === "movie" ? node.title : undefined,
            name: node.mediaType === "tv" ? node.title : undefined,
            poster_path: node.customPosterPath || null,
            backdrop_path: null,
            media_type: node.mediaType,
            vote_average: 0,
            genre_ids: [],
            overview: node.overview || "",
            popularity: 0,
          });
        }}
        isLoggedIn={isLoggedIn}
        onAuthRequired={openAuth}
      />

      {quickViewMedia && (
        <QuickViewModal
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
          media={quickViewMedia}
        />
      )}

      {logWatchNode && (
        <LogWatchModal
          isOpen={!!logWatchNode}
          onClose={() => setLogWatchNode(null)}
          mediaId={String(logWatchNode.mediaId)}
          mediaType={logWatchNode.mediaType}
          title={logWatchNode.title}
          posterPath={logWatchNode.customPosterPath || ""}
          releaseYear={String(logWatchNode.releaseYear)}
          onSuccess={() => setLogWatchNode(null)}
        />
      )}
    </div>
  );
}
