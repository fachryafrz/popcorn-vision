"use client";

import { useMemo, forwardRef, useImperativeHandle } from "react";
import { TimelineNodeData, TimelineEdgeData, TimelineMediaItem } from "@/types/timeline";
import { useCanvasPanZoom } from "@/hooks/use-canvas-pan-zoom";
import { TimelineCanvasNode } from "./timeline-canvas-node";
import { TimelineCanvasEdges } from "./timeline-canvas-edges";

export interface TimelineCanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  resetView: () => void;
}

interface TimelineCustomCanvasProps {
  universeId?: string;
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  seenKeys: Set<string>;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
}

export const TimelineCustomCanvas = forwardRef<TimelineCanvasRef, TimelineCustomCanvasProps>(
  function TimelineCustomCanvas(
    { universeId, nodes, edges, seenKeys, onToggleSeen, onOpenQuickView },
    ref,
  ) {
    // Calculate total bounds of all nodes
    const bounds = useMemo(() => {
      if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 620 };
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const node of nodes) {
        const w = node.data.isAnchor ? 98 : 34;
        const h = node.data.isAnchor ? 108 : 39;
        if (node.position.x < minX) minX = node.position.x;
        if (node.position.y < minY) minY = node.position.y;
        if (node.position.x + w > maxX) maxX = node.position.x + w;
        if (node.position.y + h > maxY) maxY = node.position.y + h;
      }

      return { minX, minY, maxX, maxY };
    }, [nodes]);

    // Pan-Zoom Engine
    const {
      transform,
      containerRef,
      zoomIn,
      zoomOut,
      fitView,
      resetView,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    } = useCanvasPanZoom({
      initialX: 60,
      initialY: 100,
      initialScale: 0.95,
      minScale: 0.1,
      maxScale: 3.5,
    });

    // Expose control methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        zoomIn,
        zoomOut,
        fitView: () => fitView(bounds),
        resetView,
      }),
      [zoomIn, zoomOut, fitView, resetView, bounds],
    );

    // Map of nodes by ID for fast lookup
    const nodesMap = useMemo(() => {
      const map = new Map<string, TimelineNodeData>();
      for (const node of nodes) {
        map.set(node.id, node);
      }
      return map;
    }, [nodes]);

    return (
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative flex-1 w-full h-full bg-black overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* Left & Right Edge Gradient Fade Masks (Queuebrick Style) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-zinc-950 to-transparent sm:w-16"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-zinc-950 to-transparent sm:w-16"
        />

        {/* GPU Hardware-Accelerated World Layer (Fixed 620px Band Height) */}
        <div
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
            position: "absolute",
            left: 0,
            top: 0,
            width: "3200px",
            height: "620px",
          }}
          className="pointer-events-none"
        >
          {/* SVG Edge Curves & Track Labels */}
          <TimelineCanvasEdges
            universeId={universeId}
            edges={edges}
            nodesMap={nodesMap}
          />

          {/* Node Cards */}
          <div className="pointer-events-auto">
            {nodes.map((node) => {
              const isSeen = seenKeys.has(`${node.data.mediaType}-${node.data.tmdbId}`);
              return (
                <TimelineCanvasNode
                  key={node.id}
                  node={node}
                  isSeen={isSeen}
                  onToggleSeen={onToggleSeen}
                  onOpenQuickView={onOpenQuickView}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
