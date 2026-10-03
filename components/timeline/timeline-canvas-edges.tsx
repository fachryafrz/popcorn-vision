"use client";

import { memo, useState, useMemo } from "react";
import { TimelineEdgeData, TimelineNodeData } from "@/types/timeline";
import { cn } from "@/lib/utils";

interface TimelineCanvasEdgesProps {
  edges: TimelineEdgeData[];
  nodesMap: Map<string, TimelineNodeData>;
}

interface CalculatedEdge {
  id: string;
  path: string;
  midX: number;
  midY: number;
  label?: string;
  description?: string;
  branchVariant?: string;
  strokeColor?: string;
  isDashed?: boolean;
}

function calculateBezier(
  source: TimelineNodeData,
  target: TimelineNodeData,
  sourceHandle?: string,
  targetHandle?: string,
) {
  const ws = source.data.isAnchor ? 176 : 56;
  const wt = target.data.isAnchor ? 176 : 56;
  const hs = source.data.isAnchor ? 264 : 84;
  const ht = target.data.isAnchor ? 264 : 84;

  // Source center anchor
  let sx = source.position.x + ws;
  let sy = source.position.y;
  let dirX1 = 1;
  let dirY1 = 0;

  if (sourceHandle === "top") {
    sx = source.position.x + ws / 2;
    sy = source.position.y - hs / 2;
    dirX1 = 0;
    dirY1 = -1;
  } else if (sourceHandle === "bottom") {
    sx = source.position.x + ws / 2;
    sy = source.position.y + hs / 2;
    dirX1 = 0;
    dirY1 = 1;
  }

  // Target center anchor
  let tx = target.position.x;
  let ty = target.position.y;
  let dirX2 = -1;
  let dirY2 = 0;

  if (targetHandle === "target-top") {
    tx = target.position.x + wt / 2;
    ty = target.position.y - ht / 2;
    dirX2 = 0;
    dirY2 = -1;
  } else if (targetHandle === "target-bottom") {
    tx = target.position.x + wt / 2;
    ty = target.position.y + ht / 2;
    dirX2 = 0;
    dirY2 = 1;
  }

  // If both nodes are on the exact same horizontal line, draw a straight line
  if (Math.abs(sy - ty) < 2 && dirX1 === 1 && dirX2 === -1) {
    const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`;
    const midX = (sx + tx) / 2;
    const midY = sy;
    return { path, midX, midY };
  }

  // Smooth Sweeping Bezier Curve
  const dx = Math.abs(tx - sx);
  const offset = Math.max(dx * 0.45, 80);

  const cp1x = sx + dirX1 * offset;
  const cp1y = sy + dirY1 * offset;
  const cp2x = tx + dirX2 * offset;
  const cp2y = ty + dirY2 * offset;

  const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`;
  const midX = (sx + 3 * cp1x + 3 * cp2x + tx) / 8;
  const midY = (sy + 3 * cp1y + 3 * cp2y + ty) / 8;

  return { path, midX, midY };
}

function TimelineCanvasEdgesComponent({ edges, nodesMap }: TimelineCanvasEdgesProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const calculatedEdges = useMemo<CalculatedEdge[]>(() => {
    const list: CalculatedEdge[] = [];

    for (const edge of edges) {
      const sourceNode = nodesMap.get(edge.source);
      const targetNode = nodesMap.get(edge.target);
      if (!sourceNode || !targetNode) continue;

      const { path, midX, midY } = calculateBezier(
        sourceNode,
        targetNode,
        edge.sourceHandle,
        edge.targetHandle,
      );

      list.push({
        id: edge.id,
        path,
        midX,
        midY,
        label: edge.label,
        description: edge.description,
        branchVariant: edge.branchVariant,
        strokeColor: edge.strokeColor,
        isDashed: edge.isDashed,
      });
    }

    return list;
  }, [edges, nodesMap]);

  return (
    <>
      {/* Unified SVG Layer for All Curves */}
      <svg
        className="absolute inset-0 overflow-visible pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        {calculatedEdges.map((edge) => {
          const isHovered = hoveredEdgeId === edge.id;
          const isTva = edge.branchVariant === "tva";
          const isMultiverse = edge.branchVariant === "multiverse";

          let stroke = edge.strokeColor ?? "#3f3f46";
          let strokeWidth = isHovered ? 3 : 1.5;

          if (isTva) {
            stroke = isHovered ? "#FBBF24" : edge.strokeColor ?? "#EAB308";
            strokeWidth = isHovered ? 3.5 : 2;
          } else if (isMultiverse) {
            stroke = isHovered ? "#C084FC" : edge.strokeColor ?? "#A855F7";
            strokeWidth = isHovered ? 3 : 1.5;
          }

          return (
            <g key={edge.id} className="transition-all duration-150">
              {/* Invisible Wider Hit Area for Easy Hovering */}
              <path
                d={edge.path}
                fill="none"
                stroke="transparent"
                strokeWidth={24}
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={() => setHoveredEdgeId(edge.id)}
                onMouseLeave={() => setHoveredEdgeId(null)}
              />

              {/* Glowing Stroke on Hover */}
              {isHovered && (
                <path
                  d={edge.path}
                  fill="none"
                  stroke={isTva ? "#EAB308" : isMultiverse ? "#A855F7" : "#71717a"}
                  strokeWidth={6}
                  strokeOpacity={0.4}
                  className="pointer-events-none"
                />
              )}

              {/* Main Curve Line */}
              <path
                d={edge.path}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={edge.isDashed ? "5,5" : undefined}
                className="pointer-events-none transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Edge Label Badges & Tooltips Layer */}
      {calculatedEdges.map((edge) => {
        if (!edge.label) return null;
        const isHovered = hoveredEdgeId === edge.id;
        const isTva = edge.branchVariant === "tva";
        const isMultiverse = edge.branchVariant === "multiverse";

        return (
          <div
            key={`label-${edge.id}`}
            style={{
              position: "absolute",
              left: `${edge.midX}px`,
              top: `${edge.midY}px`,
              transform: "translate(-50%, -50%)",
            }}
            className="nodrag pointer-events-auto relative group z-20"
            onMouseEnter={() => setHoveredEdgeId(edge.id)}
            onMouseLeave={() => setHoveredEdgeId(null)}
          >
            {/* Pill Badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg border transition-all duration-200 cursor-pointer select-none",
                isTva
                  ? "bg-black/90 border-amber-500/70 text-amber-400 hover:scale-105"
                  : isMultiverse
                    ? "bg-black/90 border-purple-500/70 text-purple-400 hover:scale-105"
                    : "bg-black/90 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:scale-105",
                isHovered && "ring-2 ring-primary scale-105 shadow-xl",
              )}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              <span>{edge.label}</span>
            </div>

            {/* Hover Tooltip Card (Queuebrick Style) */}
            {edge.description && isHovered && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 shadow-2xl text-left pointer-events-none z-30 animate-in fade-in-0 duration-150">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isTva
                        ? "bg-amber-400"
                        : isMultiverse
                          ? "bg-purple-400"
                          : "bg-sky-400",
                    )}
                  />
                  <p
                    className={cn(
                      "text-[11px] font-black uppercase tracking-wider",
                      isTva
                        ? "text-amber-400"
                        : isMultiverse
                          ? "text-purple-400"
                          : "text-sky-400",
                    )}
                  >
                    {edge.label}
                  </p>
                </div>
                <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                  {edge.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export const TimelineCanvasEdges = memo(TimelineCanvasEdgesComponent);
