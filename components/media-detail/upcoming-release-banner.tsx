"use client";

import CountdownDisplay from "@/components/ui/countdown-display";
import { useCountdown } from "@/hooks/use-countdown";
import { Calendar, CalendarClock } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

interface UpcomingReleaseBannerProps {
  releaseDate: string;
  mediaType: "movie" | "tv";
  className?: string;
}

export default function UpcomingReleaseBanner({
  releaseDate,
  mediaType,
  className,
}: UpcomingReleaseBannerProps) {
  const { isImminent, isEnded } = useCountdown(releaseDate);

  if (!releaseDate) return null;

  const targetTime = new Date(releaseDate).getTime();
  if (isNaN(targetTime)) {
    return null;
  }

  const formattedDate = moment(releaseDate).format("dddd, MMMM Do, YYYY");
  const isMovie = mediaType === "movie";

  const colorStyles = isEnded
    ? {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        badge: "border-emerald-500/40 bg-emerald-500/20 text-emerald-400",
        icon: "text-emerald-400",
      }
    : isImminent
      ? {
          border: "border-amber-500/30",
          bg: "bg-amber-500/10",
          badge: "border-amber-500/40 bg-amber-500/20 text-amber-400",
          icon: "text-amber-400",
        }
      : {
          border: "border-primary/30",
          bg: "bg-primary/10",
          badge: "border-primary/40 bg-primary/20 text-primary",
          icon: "text-primary",
        };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 shadow-xl backdrop-blur-md transition-all duration-300 sm:p-6",
        colorStyles.border,
        colorStyles.bg,
        className,
      )}
    >
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left info column */}
        <div className="space-y-1.5 text-left">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-black tracking-wide uppercase transition-colors",
              colorStyles.badge,
            )}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {isMovie ? "Upcoming Premiere" : "Series Premiere"}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 sm:text-sm">
            <Calendar className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", colorStyles.icon)} />
            <span>
              Releases on{" "}
              <strong className="text-zinc-200">{formattedDate}</strong>
            </span>
          </div>
        </div>

        {/* Right countdown column */}
        <div className="w-full shrink-0 lg:w-72">
          <CountdownDisplay
            targetDate={releaseDate}
            variant="block"
            label="Premiere Countdown"
          />
        </div>
      </div>
    </div>
  );
}
