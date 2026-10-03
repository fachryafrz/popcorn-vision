"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { TimelineUniverse, TimelineMediaItem, TimelineNodeData, TimelineEdgeData } from "@/types/timeline";
import { TimelineHeader } from "./timeline-header";
import { TimelineFooter } from "./timeline-footer";
import { TimelineCustomCanvas, TimelineCanvasRef } from "./timeline-custom-canvas";
import { AddMediaNodeModal } from "./add-media-node-modal";
import QuickViewModal from "@/components/quick-view-modal";
import { useQuickViewMediaState } from "@/hooks/use-query-modal-state";
import { TMDBMedia } from "@/lib/tmdb";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface TimelineClientProps {
  universe: TimelineUniverse;
}

export function TimelineClient({ universe: initialUniverse }: TimelineClientProps) {
  const canvasRef = useRef<TimelineCanvasRef>(null);
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;

  // Real-time query from Convex database
  const dbUniverse = useQuery(api.timelines.getTimeline, {
    slugOrId: initialUniverse.id,
  });

  const activeUniverse: TimelineUniverse = useMemo(() => {
    if (dbUniverse) {
      return {
        ...dbUniverse,
        nodes: dbUniverse.nodes as TimelineNodeData[],
        edges: dbUniverse.edges as TimelineEdgeData[],
      };
    }
    return initialUniverse;
  }, [dbUniverse, initialUniverse]);

  // Mutations
  const seedMutation = useMutation(api.timelines.seedOfficialTimelines);
  const saveCanvasMutation = useMutation(api.timelines.saveTimelineCanvas);
  const deleteTimelineMutation = useMutation(api.timelines.deleteTimeline);

  // Auto seed official timelines on mount
  useEffect(() => {
    seedMutation({ forceUpdate: false }).catch(() => {
      // Ignore background seeding errors
    });
  }, [seedMutation]);

  // Current user role & ownership
  const currentUserDoc = useQuery(api.users.getCurrentUser, isLoggedIn ? {} : "skip");
  const isOwner = useMemo(() => {
    if (!isLoggedIn || !currentUserId) return false;
    if (activeUniverse.creatorId === currentUserId) return true;
    const role = currentUserDoc?.role;
    return role === "owner" || role === "admin";
  }, [isLoggedIn, currentUserId, activeUniverse.creatorId, currentUserDoc?.role]);

  // Editor states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [isSavingCanvas, setIsSavingCanvas] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeFilterId, setActiveFilterId] = useState<string>(activeUniverse.defaultFilterId);
  const [quickViewMediaRef, setQuickViewMediaRef] = useQuickViewMediaState();

  // Sub-universes and Doomsday canon filter state
  const [enabledUniverses, setEnabledUniverses] = useState<Record<string, boolean>>({
    "x-men": true,
    "spider-man": true,
    "blade": true,
    "defenders": true,
    "venom": true,
    "fantastic-four": true,
    "daredevil-2003": true,
  });
  const [doomsdayCanonOnly, setDoomsdayCanonOnly] = useState<boolean>(false);
  const [showLegends, setShowLegends] = useState<boolean>(false);

  const handleToggleUniverse = useCallback((universeKey: string, enabled: boolean) => {
    setEnabledUniverses((prev) => ({
      ...prev,
      [universeKey]: enabled,
    }));
  }, []);

  // Convex diary query for authenticated users
  const userDiary = useQuery(api.diary.getUserDiary, isLoggedIn ? {} : "skip");
  const logWatchMutation = useMutation(api.diary.logWatch);
  const deleteDiaryMutation = useMutation(api.diary.deleteDiaryEntry);

  // Local state for guest seen tracking
  const [guestSeenSet, setGuestSeenSet] = useState<Set<string>>(new Set());

  // Set of watched media keys e.g. "movie-1771", "tv-84958"
  const seenKeys = useMemo(() => {
    if (isLoggedIn && userDiary) {
      return new Set(userDiary.map((item) => `${item.mediaType}-${item.mediaId}`));
    }
    return guestSeenSet;
  }, [isLoggedIn, userDiary, guestSeenSet]);

  // Open Quick View Modal
  const handleOpenQuickView = useCallback(
    (item: TimelineMediaItem) => {
      setQuickViewMediaRef({
        id: String(item.tmdbId),
        media_type: item.mediaType,
      });
    },
    [setQuickViewMediaRef],
  );

  // Toggle seen status
  const handleToggleSeen = useCallback(
    async (item: TimelineMediaItem) => {
      const mediaKey = `${item.mediaType}-${item.tmdbId}`;
      const isAlreadySeen = seenKeys.has(mediaKey);

      if (isLoggedIn) {
        try {
          if (isAlreadySeen && userDiary) {
            const entry = userDiary.find(
              (d) => d.mediaId === String(item.tmdbId) && d.mediaType === item.mediaType,
            );
            if (entry) {
              await deleteDiaryMutation({ diaryId: entry._id });
              toast.info(`Removed "${item.title}" from seen history`);
            }
          } else {
            await logWatchMutation({
              mediaId: String(item.tmdbId),
              mediaType: item.mediaType,
              title: item.title,
              posterPath: item.posterPath,
              releaseYear: item.releaseYear,
              watchedDate: Date.now(),
              rewatch: false,
            });
            toast.success(`Marked "${item.title}" as watched!`);
          }
        } catch {
          toast.error("Failed to update watch status");
        }
      } else {
        setGuestSeenSet((prev) => {
          const next = new Set(prev);
          if (isAlreadySeen) {
            next.delete(mediaKey);
            toast.info(`Removed "${item.title}" from guest history`);
          } else {
            next.add(mediaKey);
            toast.success(`Marked "${item.title}" as watched!`);
          }
          return next;
        });
      }
    },
    [isLoggedIn, seenKeys, userDiary, deleteDiaryMutation, logWatchMutation],
  );

  // Filter nodes according to active filter, universes, and doomsday canon
  const visibleNodes = useMemo<TimelineNodeData[]>(() => {
    return activeUniverse.nodes.filter((node) => {
      if (isEditMode) return true;

      // Filter Star Wars legends if not enabled
      if (activeUniverse.id === "star-wars" && !showLegends && node.data.canonType === "legends") {
        return false;
      }

      // Filter by sub-universe toggle if node has universeId
      if (node.data.universeId && enabledUniverses[node.data.universeId] === false) {
        return false;
      }

      // Filter by Doomsday canon toggle
      if (doomsdayCanonOnly && !node.data.isDoomsdayCanon) {
        return false;
      }

      if (activeFilterId === "all") return true;
      if (activeFilterId === "sacred") {
        return node.data.canonType === "sacred";
      }
      if (activeFilterId === "anchors") {
        return !!node.data.isAnchor;
      }
      if (activeFilterId === "tva") {
        return node.data.canonType === "tva";
      }
      if (activeFilterId === "multiverse") {
        return node.data.canonType === "multiverse" || node.data.canonType === "alternate";
      }
      if (activeFilterId === "skywalker") {
        return node.data.branchName === "Skywalker Saga";
      }
      if (activeFilterId === "mandoverse") {
        return node.data.branchName === "The Mandoverse" || node.data.canonType === "spinoff";
      }
      return true;
    });
  }, [activeUniverse.nodes, activeUniverse.id, isEditMode, showLegends, enabledUniverses, doomsdayCanonOnly, activeFilterId]);

  // Filter edges to only connect visible nodes
  const visibleEdges = useMemo<TimelineEdgeData[]>(() => {
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    return activeUniverse.edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
    );
  }, [activeUniverse.edges, visibleNodes]);

  // Add new media node from search modal (Edit mode)
  const handleAddMediaNode = useCallback(
    (mediaItem: TimelineMediaItem) => {
      let nextX = 100;
      let nextY = 300;

      if (activeUniverse.nodes.length > 0) {
        const rightmost = activeUniverse.nodes.reduce(
          (max, n) => (n.position.x > max.position.x ? n : max),
          activeUniverse.nodes[0],
        );
        nextX = rightmost.position.x + 230;
        nextY = rightmost.position.y;
      }

      const newNode: TimelineNodeData = {
        id: mediaItem.id,
        type: "mediaNode",
        position: { x: nextX, y: nextY },
        data: mediaItem,
      };

      activeUniverse.nodes.push(newNode);
      setHasUnsavedChanges(true);
      toast.success(`Added "${mediaItem.title}" to timeline!`);
    },
    [activeUniverse.nodes],
  );

  // Save canvas changes to Convex
  const handleSaveCanvas = useCallback(async () => {
    try {
      setIsSavingCanvas(true);
      await saveCanvasMutation({
        slugOrId: activeUniverse.id,
        nodes: activeUniverse.nodes,
        edges: activeUniverse.edges,
      });

      setHasUnsavedChanges(false);
      toast.success("Timeline canvas saved successfully!");
    } catch (err) {
      console.error("Failed to save canvas:", err);
      toast.error("Failed to save canvas changes");
    } finally {
      setIsSavingCanvas(false);
    }
  }, [activeUniverse, saveCanvasMutation]);

  // Delete dialog action
  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteTimelineMutation({ slugOrId: activeUniverse.id });
      toast.success("Timeline deleted successfully");
      window.location.href = "/timeline";
    } catch {
      toast.error("Failed to delete timeline");
      setIsDeleting(false);
    }
  }, [activeUniverse.id, deleteTimelineMutation]);

  // Quick view media object for modal
  const quickViewMedia = useMemo<TMDBMedia | null>(() => {
    if (!quickViewMediaRef) return null;
    const matchedItem = activeUniverse.nodes.find(
      (n) =>
        String(n.data.tmdbId) === quickViewMediaRef.id &&
        n.data.mediaType === quickViewMediaRef.media_type,
    )?.data;

    return {
      id: Number(quickViewMediaRef.id),
      title: matchedItem?.title ?? "",
      name: matchedItem?.title ?? "",
      media_type: quickViewMediaRef.media_type,
      poster_path: matchedItem?.posterPath ?? null,
      backdrop_path: null,
      vote_average: matchedItem?.rating ?? 0,
      genre_ids: [],
      overview: matchedItem?.description ?? "",
      popularity: 0,
    };
  }, [quickViewMediaRef, activeUniverse.nodes]);

  // Calculate seen count for current universe
  const totalUniverseItems = activeUniverse.nodes.length;
  const seenUniverseItems = useMemo(() => {
    return activeUniverse.nodes.filter((node) =>
      seenKeys.has(`${node.data.mediaType}-${node.data.tmdbId}`),
    ).length;
  }, [activeUniverse.nodes, seenKeys]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full bg-zinc-950 overflow-hidden">
      {/* Top Header Controls */}
      <TimelineHeader
        currentUniverse={activeUniverse}
        activeFilterId={activeFilterId}
        onFilterChange={setActiveFilterId}
        enabledUniverses={enabledUniverses}
        onToggleUniverse={handleToggleUniverse}
        doomsdayCanonOnly={doomsdayCanonOnly}
        onToggleDoomsdayCanon={setDoomsdayCanonOnly}
        showLegends={showLegends}
        onToggleLegends={setShowLegends}
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onFitView={() => canvasRef.current?.fitView()}
        isLoggedIn={isLoggedIn}
        isOwner={isOwner}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onOpenAddMedia={() => setIsAddMediaOpen(true)}
        onSaveCanvas={handleSaveCanvas}
        isSavingCanvas={isSavingCanvas}
        hasUnsavedChanges={hasUnsavedChanges}
        onDeleteTimeline={() => setDeleteConfirmOpen(true)}
      />

      {/* High-Performance 60-120fps Custom Pan-Zoom Canvas */}
      <TimelineCustomCanvas
        ref={canvasRef}
        nodes={visibleNodes}
        edges={visibleEdges}
        seenKeys={seenKeys}
        onToggleSeen={handleToggleSeen}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* Bottom Progress & Stats Footer */}
      <TimelineFooter
        seenCount={seenUniverseItems}
        totalCount={totalUniverseItems}
        isLoggedIn={isLoggedIn}
        universeDescription={activeUniverse.description}
      />

      {/* Add Media Node Modal (Editor) */}
      <AddMediaNodeModal
        isOpen={isAddMediaOpen}
        onClose={() => setIsAddMediaOpen(false)}
        onAddNode={handleAddMediaNode}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-white">Delete Timeline</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Are you sure you want to delete &quot;{activeUniverse.name}&quot;? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="h-9 px-4 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-300 hover:bg-zinc-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="h-9 px-5 rounded-full bg-red-600 hover:bg-red-500 text-xs font-bold text-white cursor-pointer shadow-lg shadow-red-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal integration */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMediaRef(null)}
        />
      )}
    </div>
  );
}
