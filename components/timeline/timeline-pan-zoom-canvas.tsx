"use client";

import {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { TimelineNodeData, TimelineEdgeData, TimelineMediaItem } from "@/types/timeline";
import { TimelineCanvasNode } from "./timeline-canvas-node";
import { TimelineCanvasEdges } from "./timeline-canvas-edges";

export interface TimelineCanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  resetView: () => void;
}

interface TimelinePanZoomCanvasProps {
  universeId?: string;
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  seenKeys: Set<string>;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
  isEditMode?: boolean;
}

export const TimelinePanZoomCanvas = forwardRef<TimelineCanvasRef, TimelinePanZoomCanvasProps>(
  function TimelinePanZoomCanvas(
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
    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

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

    // Expose control methods via ref
    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () => {
          transformComponentRef.current?.zoomIn(0.25, 250);
        },
        zoomOut: () => {
          transformComponentRef.current?.zoomOut(0.25, 250);
        },
        fitView: () => {
          transformComponentRef.current?.centerView(0.85, 350);
        },
        resetView: () => {
          transformComponentRef.current?.setTransform(40, -40, 0.85, 350);
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

        {/* Matrix Transform Viewport Engine (react-zoom-pan-pinch) */}
        <TransformWrapper
          ref={transformComponentRef}
          initialScale={0.85}
          initialPositionX={40}
          initialPositionY={-40}
          minScale={0.15}
          maxScale={3.0}
          limitToBounds={false}
          centerOnInit={false}
          smooth={true}
          wheel={{
            step: 0.1,
          }}
          pinch={{
            step: 5,
          }}
          panning={{
            velocityDisabled: false,
          }}
          doubleClick={{
            disabled: true,
          }}
        >
          <TransformComponent
            wrapperClass="!w-full !h-full select-none cursor-grab active:cursor-grabbing"
            contentClass="!w-auto !h-auto"
          >
            {/* 1:1 World Canvas Container */}
            <div
              className="relative mx-auto"
              style={{
                width: `${canvasWidth}px`,
                height: "900px",
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
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  },
);
