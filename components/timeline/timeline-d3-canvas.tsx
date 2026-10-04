"use client";

import {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import * as d3 from "d3-selection";
import "d3-transition";
import { zoom as d3Zoom, zoomIdentity, ZoomBehavior } from "d3-zoom";
import { TimelineNodeData, TimelineEdgeData, TimelineMediaItem } from "@/types/timeline";
import { TimelineCanvasNode } from "./timeline-canvas-node";
import { TimelineCanvasEdges } from "./timeline-canvas-edges";

export interface TimelineCanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  resetView: () => void;
}

interface TimelineD3CanvasProps {
  universeId?: string;
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  seenKeys: Set<string>;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
  isEditMode?: boolean;
}

export const TimelineD3Canvas = forwardRef<TimelineCanvasRef, TimelineD3CanvasProps>(
  function TimelineD3Canvas(
    {
      universeId = "mcu",
      nodes,
      edges,
      seenKeys,
      onToggleSeen,
      onOpenQuickView,
    },
    ref,
  ) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const zoomBehaviorRef = useRef<ZoomBehavior<HTMLDivElement, unknown> | null>(null);

    // Calculate dynamic canvas world bounding box
    const canvasWidth = useMemo(() => {
      if (nodes.length === 0) return 4000;
      let maxX = 0;
      for (const node of nodes) {
        if (node.position.x > maxX) {
          maxX = node.position.x;
        }
      }
      return Math.max(maxX + 500, 4000);
    }, [nodes]);

    // Map of nodes by ID for edge connections
    const nodesMap = useMemo(() => {
      const map = new Map<string, TimelineNodeData>();
      for (const node of nodes) {
        map.set(node.id, node);
      }
      return map;
    }, [nodes]);

    // Initialize D3 Zoom on the viewport container
    useEffect(() => {
      if (!viewportRef.current) return;

      const viewport = d3.select(viewportRef.current);
      const vh = viewportRef.current.clientHeight || 620;
      const canvasH = 900;

      const zoom = d3Zoom<HTMLDivElement, unknown>()
        .scaleExtent([0.15, 3.5])
        .on("zoom", (event) => {
          if (contentRef.current && viewportRef.current) {
            const { x, k } = event.transform;
            const currentVh = viewportRef.current.clientHeight || 620;
            // Lock vertical position centered on spine to prevent vertical overflow on zoom in
            const boundedY = (currentVh - canvasH * k) / 2;
            contentRef.current.style.transform = `translate(${x}px, ${boundedY}px) scale(${k})`;
          }
        });

      zoomBehaviorRef.current = zoom;
      viewport.call(zoom);

      // Initial transform (centered on opening sequence with spine at eye level)
      const initialScale = 0.85;
      const initialY = (vh - canvasH * initialScale) / 2;
      const initialTransform = zoomIdentity.translate(60, initialY).scale(initialScale);
      viewport.call(zoom.transform, initialTransform);

      return () => {
        viewport.on(".zoom", null);
      };
    }, []);

    // Expose control methods via ref
    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () => {
          if (!viewportRef.current || !zoomBehaviorRef.current) return;
          d3.select(viewportRef.current)
            .transition()
            .duration(300)
            .call(zoomBehaviorRef.current.scaleBy, 1.3);
        },
        zoomOut: () => {
          if (!viewportRef.current || !zoomBehaviorRef.current) return;
          d3.select(viewportRef.current)
            .transition()
            .duration(300)
            .call(zoomBehaviorRef.current.scaleBy, 1 / 1.3);
        },
        fitView: () => {
          if (!viewportRef.current || !zoomBehaviorRef.current) return;
          const containerWidth = viewportRef.current.clientWidth || 1200;
          const vh = viewportRef.current.clientHeight || 620;
          const scale = Math.min(containerWidth / 1800, 0.85);
          const targetY = (vh - 900 * scale) / 2;
          const initialTransform = zoomIdentity.translate(40, targetY).scale(scale);
          d3.select(viewportRef.current)
            .transition()
            .duration(400)
            .call(zoomBehaviorRef.current.transform, initialTransform);
        },
        resetView: () => {
          if (!viewportRef.current || !zoomBehaviorRef.current) return;
          const vh = viewportRef.current.clientHeight || 620;
          const targetY = (vh - 900 * 0.85) / 2;
          const initialTransform = zoomIdentity.translate(60, targetY).scale(0.85);
          d3.select(viewportRef.current)
            .transition()
            .duration(400)
            .call(zoomBehaviorRef.current.transform, initialTransform);
        },
      }),
      [],
    );

    return (
      <div className="relative flex-1 w-full h-full max-h-[660px] my-auto bg-black overflow-hidden select-none">
        {/* Left & Right Edge Gradient Fade Masks (Queuebrick Style) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-8 bg-gradient-to-r from-black to-transparent sm:w-16"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-gradient-to-l from-black to-transparent sm:w-16"
        />

        {/* D3 Viewport Container */}
        <div
          ref={viewportRef}
          className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        >
          {/* D3 Matrix-Transformed World Canvas Container */}
          <div
            ref={contentRef}
            className="relative will-change-transform origin-top-left"
            style={{
              width: `${canvasWidth}px`,
              height: "900px",
              transform: "translate(60px, 0px) scale(0.85)",
            }}
          >
            {/* 1. SVG Layer for Continuous Spine & Sweeping Bezier Branches */}
            <TimelineCanvasEdges
              universeId={universeId}
              edges={edges}
              nodesMap={nodesMap}
            />

            {/* 2. HTML DOM Layer for Movie Cards */}
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
