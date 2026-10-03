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
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  seenKeys: Set<string>;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
}

export const TimelineCustomCanvas = forwardRef<TimelineCanvasRef, TimelineCustomCanvasProps>(
  function TimelineCustomCanvas(
    { nodes, edges, seenKeys, onToggleSeen, onOpenQuickView },
    ref,
  ) {
    // Calculate total bounds of all nodes
    const bounds = useMemo(() => {
      if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const node of nodes) {
        const w = node.data.isAnchor ? 176 : 112;
        const h = node.data.isAnchor ? 264 : 168;
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
      initialY: 180,
      initialScale: 0.65,
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
        className="relative flex-1 w-full h-full bg-[#08080a] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* GPU Hardware-Accelerated World Layer */}
        <div
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
            position: "absolute",
            left: 0,
            top: 0,
          }}
          className="w-full h-full pointer-events-none"
        >
          {/* SVG Edge Curves */}
          <TimelineCanvasEdges edges={edges} nodesMap={nodesMap} />

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
