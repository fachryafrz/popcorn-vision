"use client";

import {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  ViewportPortal,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { TimelineNodeData, TimelineEdgeData, TimelineMediaItem } from "@/types/timeline";
import { TimelineMediaNode } from "./timeline-media-node";
import { TimelineCanvasEdges } from "./timeline-canvas-edges";

export interface TimelineCanvasRef {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  resetView: () => void;
}

interface TimelineFlowCanvasProps {
  universeId?: string;
  nodes: TimelineNodeData[];
  edges: TimelineEdgeData[];
  seenKeys: Set<string>;
  onToggleSeen?: (item: TimelineMediaItem) => void;
  onOpenQuickView?: (item: TimelineMediaItem) => void;
  isEditMode?: boolean;
}

const nodeTypes: NodeTypes = {
  mediaNode: TimelineMediaNode,
};

const edgeTypes: EdgeTypes = {};

function InnerFlowCanvas(
  {
    universeId,
    nodes: propNodes,
    edges: propEdges,
    seenKeys,
    onToggleSeen,
    onOpenQuickView,
    isEditMode = false,
  }: TimelineFlowCanvasProps,
  ref: React.ForwardedRef<TimelineCanvasRef>,
) {
  const { zoomIn, zoomOut, fitView: flowFitView, setViewport } = useReactFlow();

  // Convert timeline nodes to React Flow nodes with injected seen & click callbacks
  const initialNodes = useMemo<Node[]>(() => {
    return propNodes.map((n) => ({
      id: n.id,
      type: "mediaNode",
      position: { x: n.position.x, y: n.position.y - (n.data.isAnchor ? 57 : 39) },
      data: {
        ...n.data,
        isSeen: seenKeys.has(`${n.data.mediaType}-${n.data.tmdbId}`),
        onToggleSeen,
        onOpenQuickView,
      },
      draggable: isEditMode,
      selectable: isEditMode,
    }));
  }, [propNodes, seenKeys, onToggleSeen, onOpenQuickView, isEditMode]);

  // Convert timeline edges to React Flow edges
  const initialEdges = useMemo<Edge[]>(() => {
    return propEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      animated: e.animated,
      hidden: universeId === "mcu" || universeId === "star-wars", // Hide default edges for MCU & Star Wars since they use exact continuous SVG tracks
    }));
  }, [propEdges, universeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Synchronize prop changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Expose control methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomIn({ duration: 300 }),
      zoomOut: () => zoomOut({ duration: 300 }),
      fitView: () => flowFitView({ padding: 0.25, duration: 400 }),
      resetView: () => setViewport({ x: 60, y: 150, zoom: 0.85 }, { duration: 400 }),
    }),
    [zoomIn, zoomOut, flowFitView, setViewport],
  );

  // Map of nodes by ID for fast lookup
  const nodesMap = useMemo(() => {
    const map = new Map<string, TimelineNodeData>();
    for (const node of propNodes) {
      map.set(node.id, node);
    }
    return map;
  }, [propNodes]);

  return (
    <div className="relative flex-1 w-full h-full bg-zinc-950 overflow-hidden select-none">
      {/* Left & Right Edge Gradient Fade Masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-zinc-950 to-transparent sm:w-16"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-zinc-950 to-transparent sm:w-16"
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        minZoom={0.15}
        maxZoom={3.0}
        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={true}
        selectionOnDrag={false}
        elementsSelectable={isEditMode}
        nodesDraggable={isEditMode}
        nodesConnectable={isEditMode}
        defaultViewport={{ x: 60, y: 150, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        className="bg-zinc-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#27272a"
        />

        {/* Continuous SVG Background Tracks & Text Cut-Out Labels rendered inside Flow Viewport */}
        <ViewportPortal>
          <div
            className="pointer-events-none absolute left-0 top-0"
            style={{ width: "6000px", height: "620px" }}
          >
            <TimelineCanvasEdges
              universeId={universeId}
              edges={propEdges}
              nodesMap={nodesMap}
            />
          </div>
        </ViewportPortal>
      </ReactFlow>
    </div>
  );
}

const ForwardedInnerFlowCanvas = forwardRef(InnerFlowCanvas);

export const TimelineFlowCanvas = forwardRef<TimelineCanvasRef, TimelineFlowCanvasProps>(
  function TimelineFlowCanvas(props, ref) {
    return (
      <ReactFlowProvider>
        <ForwardedInnerFlowCanvas {...props} ref={ref} />
      </ReactFlowProvider>
    );
  },
);
