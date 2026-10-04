"use client";

import { memo, useState, useMemo } from "react";
import { TimelineEdgeData, TimelineNodeData } from "@/types/timeline";
import { cn } from "@/lib/utils";

interface TimelineCanvasEdgesProps {
  universeId?: string;
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
  const ws = source.data.isAnchor ? 72 : 26;
  const wt = target.data.isAnchor ? 72 : 26;
  const hs = source.data.isAnchor ? 108 : 39;
  const ht = target.data.isAnchor ? 108 : 39;

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

function TimelineCanvasEdgesComponent({ universeId, edges, nodesMap }: TimelineCanvasEdgesProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const isMcu = universeId === "mcu";
  const isStarWars = universeId === "star-wars";

  const calculatedEdges = useMemo<CalculatedEdge[]>(() => {
    // If MCU or Star Wars, we render continuous background tracks
    if (isMcu || isStarWars) return [];

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
  }, [edges, nodesMap, isMcu, isStarWars]);

  return (
    <>
      {/* Continuous SVG Tracks for MCU (Height 900px, Spine Y=450, TVA Y=180, Multiverse Y=720) */}
      {isMcu && (
        <>
          <svg
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            width="9600"
            height="900"
            fill="none"
          >
            {/* Main Sacred Spine at Y=450 */}
            <path d="M 40 450 H 8600" stroke="#3f3f46" strokeWidth="2.5" />
            <path
              d="M 8600 450 H 9400"
              stroke="#3f3f46"
              strokeWidth="2.5"
              strokeDasharray="6 9"
              opacity="0.8"
            />
            {/* Today vertical tick */}
            <path d="M 8650 438 V 462" stroke="#71717a" strokeWidth="2" />

            {/* TVA Branch (Y=180, amber stroke, sweeping curve from Avengers 1) */}
            <g>
              <path
                d="M 1200 450 C 1600 450, 1800 180, 2150 180"
                stroke="#EAB308"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 2150 180 H 4200"
                stroke="#EAB308"
                strokeWidth="2"
                opacity="0.9"
              />
            </g>

            {/* Multiverse Branch (Y=720, sweeping curve from Loki) */}
            <g>
              <path
                d="M 2350 180 C 2420 180, 2450 720, 2550 720"
                stroke="#71717a"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 2550 720 H 3800"
                stroke="#71717a"
                strokeWidth="2"
                strokeDasharray="4 6"
                opacity="0.85"
              />
            </g>
          </svg>

          {/* Track Text Labels */}
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-2 text-[11px] font-bold uppercase tracking-wider text-amber-400 z-10 border border-amber-500/30 rounded-full"
            style={{ left: "2350px", top: "180px" }}
          >
            TVA · OUTSIDE TIME
          </span>
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300 z-10 border border-zinc-700/50 rounded-full"
            style={{ left: "2750px", top: "720px" }}
          >
            THE MULTIVERSE
          </span>
          <span
            className="pointer-events-none absolute -translate-x-1/2 bg-black px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 z-10 border border-zinc-800 rounded"
            style={{ left: "8650px", top: "418px" }}
          >
            TODAY
          </span>
        </>
      )}

      {/* Continuous SVG Tracks for Star Wars */}
      {isStarWars && (
        <>
          <svg
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            width="4400"
            height="900"
            fill="none"
          >
            {/* Main Spine at Y=450 */}
            <path d="M 40 450 H 4200" stroke="#3f3f46" strokeWidth="2.5" />

            {/* Top Track (Star Wars Tales at Y=180) */}
            <g>
              <path
                d="M 700 450 C 1000 450, 1100 180, 1350 180"
                stroke="#3B82F6"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 1350 180 H 2200"
                stroke="#3B82F6"
                strokeWidth="2"
                opacity="0.9"
              />
            </g>

            {/* Bottom Track (The New Republic / Rebellion at Y=720) */}
            <g>
              <path
                d="M 2200 450 C 2400 450, 2450 720, 2550 720"
                stroke="#71717a"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 2550 720 H 3600"
                stroke="#71717a"
                strokeWidth="2"
                opacity="0.9"
              />
            </g>
          </svg>

          {/* Star Wars Track Labels */}
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-2 text-[11px] font-bold uppercase tracking-wider text-sky-400 z-10 border border-sky-500/30 rounded-full"
            style={{ left: "1550px", top: "180px" }}
          >
            ··· STAR WARS TALES ···
          </span>
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300 z-10 border border-zinc-700/50 rounded-full"
            style={{ left: "2800px", top: "720px" }}
          >
            THE NEW REPUBLIC
          </span>
        </>
      )}

      {/* Dynamic Bezier Edge Layer for custom / community timelines */}
      {!isMcu && !isStarWars && (
        <>
          <svg
            className="absolute inset-0 overflow-visible pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            {calculatedEdges.map((edge) => {
              const isHovered = hoveredEdgeId === edge.id;
              const stroke = edge.strokeColor ?? "#3f3f46";
              const strokeWidth = isHovered ? 3 : 1.5;

              return (
                <g key={edge.id} className="transition-all duration-150">
                  <path
                    d={edge.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={24}
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setHoveredEdgeId(edge.id)}
                    onMouseLeave={() => setHoveredEdgeId(null)}
                  />
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

          {calculatedEdges.map((edge) => {
            if (!edge.label) return null;
            return (
              <span
                key={`label-${edge.id}`}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 z-10"
                style={{
                  left: `${edge.midX}px`,
                  top: `${edge.midY}px`,
                }}
              >
                {edge.label}
              </span>
            );
          })}
        </>
      )}
    </>
  );
}

export const TimelineCanvasEdges = memo(TimelineCanvasEdgesComponent);
