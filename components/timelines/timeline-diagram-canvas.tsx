"use client";

import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  STAR_WARS_DIAGRAM_NODES,
  DiagramNode,
} from "./star-wars-diagram-data";
import { DiagramNodeCard } from "./diagram-node-card";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TMDBMedia } from "@/lib/tmdb";
import QuickViewModal from "@/components/quick-view-modal";
import { toast } from "sonner";

interface TimelineDiagramCanvasProps {
  isLoggedIn: boolean;
  onAuthRequired: () => void;
  userDiaryMediaKeys?: Set<string>;
  onLogWatchConvex?: (node: DiagramNode) => Promise<void>;
  onRemoveWatchConvex?: (node: DiagramNode) => Promise<void>;
}

const GUEST_STORAGE_KEY = "queuebrick_star_wars_seen";

export function TimelineDiagramCanvas({
  isLoggedIn,
  onAuthRequired,
  userDiaryMediaKeys,
  onLogWatchConvex,
  onRemoveWatchConvex,
}: TimelineDiagramCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLegends, setShowLegends] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(true); // Overview (2108px) vs Detailed (5152px)
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Quick view state
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  // Guest storage for seen nodes
  const [guestSeenIds, setGuestSeenIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const saveGuestSeen = useCallback((ids: string[]) => {
    setGuestSeenIds(ids);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, []);

  // Filter nodes based on Legends switch
  const visibleNodes = useMemo(() => {
    return STAR_WARS_DIAGRAM_NODES.filter((node) => {
      if (!showLegends && node.canon === "legends") return false;
      return true;
    });
  }, [showLegends]);

  // Set of seen Node IDs
  const seenIdsSet = useMemo(() => {
    const set = new Set<string>();
    if (isLoggedIn && userDiaryMediaKeys) {
      STAR_WARS_DIAGRAM_NODES.forEach((node) => {
        if (userDiaryMediaKeys.has(`${node.mediaType}-${node.mediaId}`)) {
          set.add(node.id);
        }
      });
    } else {
      guestSeenIds.forEach((id) => set.add(id));
    }
    return set;
  }, [isLoggedIn, userDiaryMediaKeys, guestSeenIds]);

  const totalCount = visibleNodes.length;
  const seenCount = visibleNodes.filter((n) => seenIdsSet.has(n.id)).length;
  const progressPercent = totalCount > 0 ? (seenCount / totalCount) * 100 : 0;

  // Toggle Seen Handler
  const handleToggleSeen = async (node: DiagramNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isSeen = seenIdsSet.has(node.id);

    if (isLoggedIn) {
      if (isSeen && onRemoveWatchConvex) {
        await onRemoveWatchConvex(node);
      } else if (!isSeen && onLogWatchConvex) {
        await onLogWatchConvex(node);
      }
    } else {
      const next = isSeen
        ? guestSeenIds.filter((id) => id !== node.id)
        : [...guestSeenIds, node.id];
      saveGuestSeen(next);
      toast.success(isSeen ? `Unmarked ${node.title}` : `Marked ${node.title} as seen!`);
    }
  };

  // Quick View Handler
  const handleQuickView = (node: DiagramNode) => {
    setQuickViewMedia({
      id: node.mediaId,
      title: node.mediaType === "movie" ? node.title : undefined,
      name: node.mediaType === "tv" ? node.title : undefined,
      poster_path: node.customPosterPath || null,
      backdrop_path: null,
      media_type: node.mediaType,
      vote_average: 0,
      release_date: node.mediaType === "movie" ? `${node.releaseYear}-01-01` : undefined,
      first_air_date: node.mediaType === "tv" ? `${node.releaseYear}-01-01` : undefined,
      genre_ids: [],
      overview: node.overview || "",
      popularity: 0,
    });
  };

  // Discrete Two-State Zoom Toggle with Focal Preservation
  const toggleZoom = useCallback((targetState?: boolean, cursorClientX?: number) => {
    setIsZoomedIn((prev) => {
      const next = targetState !== undefined ? targetState : !prev;
      if (next === prev) return prev;

      const container = containerRef.current;
      if (container) {
        const currentWidth = prev ? 5152 : 2108;
        const nextWidth = next ? 5152 : 2108;
        const rect = container.getBoundingClientRect();
        const clientOffset = cursorClientX !== undefined ? cursorClientX : rect.width / 2;
        const focalX = container.scrollLeft + clientOffset;
        const ratio = focalX / currentWidth;
        const nextScrollLeft = ratio * nextWidth - clientOffset;

        // Instant scrollLeft update ensures element under cursor never jumps or slides
        requestAnimationFrame(() => {
          container.scrollLeft = Math.max(0, nextScrollLeft);
        });
      }

      return next;
    });
  }, []);

  // Direct mouse wheel zoom gesture detection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      // If scrolling vertically, trigger clean zoom toggle
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && Math.abs(e.deltaY) > 20) {
        e.preventDefault();

        if (wheelLockRef.current) return;
        wheelLockRef.current = true;

        if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = setTimeout(() => {
          wheelLockRef.current = false;
        }, 350);

        const rect = el.getBoundingClientRect();
        const clientX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));

        if (e.deltaY < 0) {
          toggleZoom(true, clientX);
        } else {
          toggleZoom(false, clientX);
        }
      }
    };

    el.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onNativeWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [toggleZoom]);

  // Mouse drag handlers for smooth canvas pan
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest(".group\\/node")) return;
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full min-h-screen bg-[#060709] text-zinc-100 overflow-hidden select-none flex flex-col font-sans">
      {/* ---------------------------------------------------- */}
      {/* Top Header Controls (Queuebrick Exact Style) */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full pt-16 sm:pt-20 pb-2 px-6 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <h1 className="whitespace-nowrap text-[17px] sm:text-[19px] font-bold tracking-tight text-white">
            Star Wars Timeline
          </h1>

          {/* Legends Toggle Pill */}
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              role="switch"
              aria-checked={showLegends}
              onClick={() => setShowLegends(!showLegends)}
              className="group flex items-center gap-2 h-7 rounded-full border border-zinc-700/60 bg-zinc-900/70 px-3 backdrop-blur-md transition-colors hover:border-zinc-500 shadow-sm"
            >
              <span className="whitespace-nowrap text-[12px] font-medium transition-colors text-zinc-300 group-hover:text-white">
                Legends
              </span>
              <span
                className={cn(
                  "relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors",
                  showLegends ? "bg-emerald-500" : "bg-zinc-700/60 group-hover:bg-zinc-600/70"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-0.5 size-3 rounded-full transition-[transform,background-color] duration-200 bg-white shadow-sm",
                    showLegends ? "translate-x-3.5" : "translate-x-0.5"
                  )}
                />
              </span>
            </button>
          </div>

          <span className="mt-1 hidden whitespace-nowrap text-[11px] text-zinc-400 sm:block">
            Scroll or pinch to zoom
          </span>
        </div>

        {/* Top Right Floating Zoom Controls */}
        <div className="absolute right-4 sm:right-6 top-16 sm:top-20 flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-full p-1 pointer-events-auto shadow-lg backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            disabled={!isZoomedIn}
            className="size-8 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-35"
            onClick={() => toggleZoom(false)}
            title="Zoom Out (Overview)"
          >
            <Minus className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={isZoomedIn}
            className="size-8 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-35"
            onClick={() => toggleZoom(true)}
            title="Zoom In (Detailed)"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Main Flowchart Canvas (Queuebrick 2108px vs 5152px) */}
      {/* ---------------------------------------------------- */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "relative grow w-full overflow-x-auto overflow-y-clip min-h-[630px] pb-36 pt-4",
          "scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <div
          className="relative mx-auto transition-opacity opacity-100 duration-500 origin-center"
          style={{
            width: isZoomedIn ? "5152px" : "2108px",
            height: "612px",
          }}
        >
          {/* Circuit SVGs (Exact Queuebrick paths for each mode) */}
          {!isZoomedIn ? (
            <svg
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              width="2108"
              height="612"
              fill="none"
            >
              <path d="M 34 300 H 1918" stroke="#3f3f46" strokeWidth="2" />
              <path d="M 1918 300 H 1988" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 7" opacity="0.8" />
              <path d="M 1938 293 V 307" stroke="#71717a" strokeWidth="1.5" />

              {/* Star Wars Tales Branch */}
              <g>
                <path d="M 422 300 C 372.25 300, 372.25 88, 322.5 88" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 322.5 88 H 690" stroke="#52525b" strokeWidth="1.5" opacity="0.85" strokeDasharray="2 4" />
              </g>

              {/* The Early Rebellion Branch */}
              <g>
                <path d="M 792 300 C 708.25 300, 708.25 512, 624.5 512" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 624.5 512 H 882" stroke="#52525b" strokeWidth="1.5" opacity="0.85" />
                <path d="M 882 512 C 904 512, 904 300, 926 300" stroke="#52525b" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 6" />
              </g>

              {/* The New Republic Branch */}
              <g>
                <path d="M 1250 300 C 1204 300, 1204 512, 1158 512" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 1158 512 H 1518" stroke="#52525b" strokeWidth="1.5" opacity="0.85" />
                <path d="M 1518 512 C 1540 512, 1540 300, 1562 300" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
              </g>

              {/* Visions Branch */}
              <g>
                <path d="M 1918 300 C 1914.25 300, 1914.25 88, 1910.5 88" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 1910.5 88 H 2078" stroke="#52525b" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.85" />
              </g>

              {/* Legends Branch */}
              {showLegends && (
                <g>
                  <path d="M 373 300 C 350 300, 350 540, 330 540 H 1400" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.8" />
                </g>
              )}
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              width="5152"
              height="612"
              fill="none"
            >
              <path d="M 97 294 H 4559" stroke="#3f3f46" strokeWidth="2" />
              <path d="M 4559 294 H 4717" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 7" opacity="0.8" />
              <path d="M 4579 287 V 301" stroke="#71717a" strokeWidth="1.5" />

              {/* Star Wars Tales Branch */}
              <g>
                <path d="M 925 294 C 899.75 294, 899.75 118, 874.5 118" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 874.5 118 H 1583" stroke="#52525b" strokeWidth="1.5" opacity="0.85" strokeDasharray="2 4" />
              </g>

              {/* The Early Rebellion Branch */}
              <g>
                <path d="M 2189 294 C 2148.75 294, 2148.75 470, 2108.5 470" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 2108.5 470 H 2531" stroke="#52525b" strokeWidth="1.5" opacity="0.85" />
                <path d="M 2531 470 C 2597 470, 2597 294, 2663 294" stroke="#52525b" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 6" />
              </g>

              {/* The New Republic Branch */}
              <g>
                <path d="M 3137 294 C 3108 294, 3108 470, 3079 470" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 3079 470 H 3795" stroke="#52525b" strokeWidth="1.5" opacity="0.85" />
                <path d="M 3795 470 C 3861 470, 3861 294, 3927 294" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
              </g>

              {/* Visions Branch */}
              <g>
                <path d="M 4559 294 C 4642.75 294, 4642.75 118, 4726.5 118" stroke="#52525b" strokeWidth="1.5" opacity="0.75" />
                <path d="M 4726.5 118 H 5059" stroke="#52525b" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.85" />
              </g>

              {/* Legends Branch */}
              {showLegends && (
                <g>
                  <path d="M 860 294 C 840 294, 840 540, 820 540 H 3600" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.8" />
                </g>
              )}
            </svg>
          )}

          {/* Section Category Badges (Positioned cleanly for each mode) */}
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#060709] px-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
            style={{
              left: isZoomedIn ? "952.75px" : "400.75px",
              top: isZoomedIn ? "118px" : "88px",
            }}
          >
            Star Wars Tales
          </span>

          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#060709] px-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
            style={{
              left: isZoomedIn ? "2201.75px" : "717.75px",
              top: isZoomedIn ? "470px" : "512px",
            }}
          >
            The early rebellion
          </span>

          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#060709] px-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
            style={{
              left: isZoomedIn ? "3161px" : "1240px",
              top: isZoomedIn ? "470px" : "512px",
            }}
          >
            The New Republic
          </span>

          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#060709] px-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
            style={{
              left: isZoomedIn ? "4774.75px" : "1958.75px",
              top: isZoomedIn ? "118px" : "88px",
            }}
          >
            Visions
          </span>

          <span
            className="absolute -translate-x-1/2 bg-[#060709] px-1 text-[9px] uppercase tracking-wider text-zinc-400"
            style={{
              left: isZoomedIn ? "4579px" : "1938px",
              top: isZoomedIn ? "272px" : "278px",
            }}
          >
            Today
          </span>

          {showLegends && (
            <span
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#060709] px-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500/80"
              style={{
                left: isZoomedIn ? "850px" : "360px",
                top: "540px",
              }}
            >
              Legends Shelf
            </span>
          )}

          {/* Render All Node Cards for current mode */}
          {visibleNodes.map((node) => (
            <DiagramNodeCard
              key={node.id}
              node={node}
              isZoomedIn={isZoomedIn}
              isSeen={seenIdsSet.has(node.id)}
              onToggleSeen={handleToggleSeen}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Sticky Bottom Floating Progress Dock (Queuebrick Exact Match) */}
      {/* ---------------------------------------------------- */}
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-6 z-30 flex justify-center pointer-events-none">
        <div
          className={cn(
            "relative w-full max-w-5xl rounded-2xl px-5 py-3.5 sm:py-4 transition-all duration-300 pointer-events-auto",
            "bg-[#111318]/90 border border-zinc-800/90 shadow-2xl backdrop-blur-xl",
            isDockMinimized ? "translate-y-12 opacity-80 hover:translate-y-0 hover:opacity-100" : "translate-y-0 opacity-100"
          )}
        >
          {/* Minimize toggle button */}
          <button
            type="button"
            aria-label={isDockMinimized ? "Expand progress" : "Minimize progress"}
            onClick={() => setIsDockMinimized(!isDockMinimized)}
            className="absolute -top-3 left-1/2 grid h-5 w-8 -translate-x-1/2 place-items-center rounded-full border border-zinc-700/80 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-500 shadow-md transition-colors"
          >
            {isDockMinimized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
            {/* Progress Counter & Bar */}
            <div className="flex w-full items-center gap-3 sm:w-auto sm:min-w-[240px] sm:flex-1">
              <span className="whitespace-nowrap text-[12px] tabular-nums text-zinc-300">
                You’ve seen <span className="font-semibold text-white">{seenCount}</span> of {totalCount}
              </span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full sm:max-w-[320px] bg-zinc-800/80">
                <span
                  className="block h-full rounded-full transition-all duration-300 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Description & Link */}
            <div className="min-w-0 sm:ml-auto">
              <p className="text-[11.5px] text-zinc-400 sm:text-right">
                Every film and show in the order the galaxy lived them. Tap a cover to mark it seen.{" "}
                <Link
                  href="/timelines"
                  className="whitespace-nowrap text-zinc-300 underline-offset-2 transition-colors hover:text-white hover:underline font-medium"
                >
                  All timelines
                </Link>
              </p>
            </div>

            {/* Sign in / Sign up CTA */}
            {!isLoggedIn && (
              <Button
                size="sm"
                className="h-8 w-full sm:w-auto shrink-0 rounded-lg bg-white hover:bg-zinc-200 text-black text-[13px] font-semibold px-4 shadow-sm transition-colors"
                onClick={onAuthRequired}
              >
                Sign up to save
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
          media={quickViewMedia}
        />
      )}
    </div>
  );
}


