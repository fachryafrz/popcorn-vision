"use client";

import { memo, useState } from "react";
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "@xyflow/react";
import { cn } from "@/lib/utils";

interface TimelineEdgeCustomData {
  branchVariant?: "sacred" | "tva" | "multiverse" | "secondary";
  strokeColor?: string;
  isDashed?: boolean;
  description?: string;
}

function TimelineBranchEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
  markerEnd,
}: EdgeProps) {
  const customData = (data ?? {}) as TimelineEdgeCustomData;
  const { branchVariant = "sacred", strokeColor, isDashed, description } = customData;
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine stroke color and glow style
  let stroke = strokeColor ?? "#52525b"; // zinc-600 default
  let glowColor = "transparent";

  if (branchVariant === "tva") {
    stroke = isHovered ? "#FBBF24" : strokeColor ?? "#EAB308";
    glowColor = isHovered ? "rgba(251, 191, 36, 0.6)" : "rgba(234, 179, 8, 0.35)";
  } else if (branchVariant === "multiverse") {
    stroke = isHovered ? "#C084FC" : strokeColor ?? "#A855F7";
    glowColor = isHovered ? "rgba(192, 132, 252, 0.6)" : "rgba(168, 85, 247, 0.35)";
  } else if (branchVariant === "secondary") {
    stroke = isHovered ? "#60A5FA" : strokeColor ?? "#38BDF8";
    glowColor = isHovered ? "rgba(96, 165, 250, 0.5)" : "rgba(56, 189, 248, 0.3)";
  }

  // Active hover glow on long lines
  if (isHovered && glowColor === "transparent") {
    glowColor = "rgba(161, 161, 170, 0.3)";
  }

  return (
    <>
      {/* Invisible wider hit-area path for easy hovering */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Background glow path */}
      {glowColor !== "transparent" && (
        <path
          d={edgePath}
          fill="none"
          stroke={glowColor}
          strokeWidth={isHovered ? 12 : 6}
          className="blur-xs pointer-events-none transition-all duration-300"
        />
      )}

      {/* Main Base Edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: isHovered ? 3.5 : branchVariant === "sacred" ? 2.5 : 2,
          strokeDasharray: isDashed ? "6,6" : undefined,
          transition: "stroke 0.3s ease, stroke-width 0.3s ease",
        }}
      />

      {/* Branch Label Badge & Interactive Popover Card */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan relative group z-30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Pill Badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg border transition-all duration-300 cursor-pointer select-none",
                branchVariant === "tva"
                  ? "bg-amber-950/90 border-amber-500/70 text-amber-300 shadow-amber-500/20 hover:scale-105 hover:bg-amber-900"
                  : branchVariant === "multiverse"
                    ? "bg-purple-950/90 border-purple-500/70 text-purple-300 shadow-purple-500/20 hover:scale-105 hover:bg-purple-900"
                    : "bg-zinc-900/95 border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:scale-105",
                isHovered && "ring-2 ring-primary/60 scale-105 shadow-xl",
              )}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              <span>{label}</span>
            </div>

            {/* Hover Tooltip Card (Queuebrick Style) */}
            {description && isHovered && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 rounded-xl bg-zinc-950/95 border border-zinc-800/90 p-3.5 shadow-2xl backdrop-blur-xl text-left animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      branchVariant === "tva"
                        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        : branchVariant === "multiverse"
                          ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
                          : "bg-sky-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
                    )}
                  />
                  <p
                    className={cn(
                      "text-[11px] font-black uppercase tracking-wider",
                      branchVariant === "tva"
                        ? "text-amber-400"
                        : branchVariant === "multiverse"
                          ? "text-purple-400"
                          : "text-sky-400",
                    )}
                  >
                    {label}
                  </p>
                </div>
                <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const TimelineBranchEdge = memo(TimelineBranchEdgeComponent);


