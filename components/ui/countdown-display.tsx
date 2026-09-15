"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import { Clock, Play } from "lucide-react";

export interface CountdownDisplayProps {
  targetDate: string | number | Date | null | undefined;
  variant?: "block" | "pill" | "badge" | "compact" | "minimal";
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export default function CountdownDisplay({
  targetDate,
  variant = "block",
  className,
  label,
  showIcon = true,
}: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, isEnded, isImminent, isMounted } =
    useCountdown(targetDate);

  if (!isMounted || !targetDate) {
    if (variant === "block") {
      return (
        <div
          className={cn(
            "grid grid-cols-4 gap-2 text-center",
            className,
          )}
        >
          {["Days", "Hours", "Mins", "Secs"].map((unit) => (
            <div
              key={unit}
              className="flex flex-col items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5 backdrop-blur-md"
            >
              <span className="text-xl font-black text-zinc-400 sm:text-2xl">
                --
              </span>
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                {unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-semibold text-zinc-400",
          className,
        )}
      >
        {showIcon && <Clock className="h-3.5 w-3.5" />}
        <span>Upcoming</span>
      </span>
    );
  }

  if (isEnded) {
    if (variant === "block") {
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400",
            className,
          )}
        >
          <Play className="h-4 w-4 fill-current" />
          <span className="text-sm font-bold tracking-wide">
            Now Available / Airing Today!
          </span>
        </div>
      );
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400",
          className,
        )}
      >
        <Play className="h-3 w-3 fill-current" />
        <span>Now Available</span>
      </span>
    );
  }

  // Format double digits
  const pad = (n: number) => String(n).padStart(2, "0");

  const statusTheme = isImminent
    ? {
        border: "border-amber-500/40",
        bg: "bg-amber-500/20",
        bgSubtle: "bg-amber-500/10",
        text: "text-amber-300",
        icon: "text-amber-400",
        unitText: "text-amber-400/80",
      }
    : {
        border: "border-primary/30",
        bg: "bg-primary/15",
        bgSubtle: "bg-primary/10",
        text: "text-primary",
        icon: "text-primary",
        unitText: "text-primary/70",
      };

  if (variant === "block") {
    const timeUnits = [
      { label: "Days", value: pad(days) },
      { label: "Hours", value: pad(hours) },
      { label: "Mins", value: pad(minutes) },
      { label: "Secs", value: pad(seconds) },
    ];

    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <span
            className={cn(
              "block text-[11px] font-bold tracking-wider uppercase",
              statusTheme.unitText,
            )}
          >
            {label}
          </span>
        )}
        <div className="grid grid-cols-4 gap-2 text-center">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className={cn(
                "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-2 sm:p-3 backdrop-blur-md transition-all",
                statusTheme.border,
                statusTheme.bgSubtle,
              )}
            >
              <span className="font-mono text-xl font-black tracking-tight text-white drop-shadow-sm sm:text-2xl md:text-3xl">
                {unit.value}
              </span>
              <span
                className={cn(
                  "text-[9px] font-bold tracking-wider uppercase sm:text-[10px]",
                  statusTheme.unitText,
                )}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "pill" || variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold backdrop-blur-md shadow-sm transition-colors",
          statusTheme.border,
          statusTheme.bg,
          statusTheme.text,
          className,
        )}
      >
        {showIcon && <Clock className={cn("h-3.5 w-3.5", isImminent && "animate-pulse")} />}
        <span className="font-mono">
          {days > 0
            ? `${days}d ${pad(hours)}h left`
            : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`}
        </span>
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors",
          statusTheme.border,
          statusTheme.bgSubtle,
          statusTheme.text,
          className,
        )}
      >
        {showIcon && <Clock className={cn("h-3.5 w-3.5", statusTheme.icon)} />}
        <span className="font-mono font-bold text-white">
          {days > 0 ? `${days}d ` : ""}
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </div>
    );
  }

  // minimal
  return (
    <span
      className={cn(
        "font-mono text-xs font-bold transition-colors",
        statusTheme.text,
        className,
      )}
    >
      {days > 0 ? `${days}d ` : ""}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
