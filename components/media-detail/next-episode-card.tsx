"use client";

import { TMDBEpisodeToAir } from "./types";
import CountdownDisplay from "@/components/ui/countdown-display";
import { useCountdown } from "@/hooks/use-countdown";
import { Calendar, Tv, CalendarClock } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

interface NextEpisodeCardProps {
  episode: TMDBEpisodeToAir;
  className?: string;
}

export default function NextEpisodeCard({
  episode,
  className,
}: NextEpisodeCardProps) {
  const { isImminent, isEnded } = useCountdown(episode?.air_date);

  if (!episode || !episode.air_date) return null;

  const stillUrl = episode.still_path
    ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
    : null;

  const formattedAirDate = moment(episode.air_date).format(
    "dddd, MMMM Do, YYYY",
  );

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
        {/* Left Info Column */}
        <div className="flex flex-1 items-center gap-4">
          {stillUrl ? (
            <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 sm:block sm:w-44">
              <img
                src={stillUrl}
                alt={episode.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="border-primary/20 bg-primary/10 hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl border sm:flex">
              <Tv className="text-primary h-8 w-8" />
            </div>
          )}

          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-black tracking-wide uppercase transition-colors",
                  colorStyles.badge,
                )}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Next Episode
              </span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[11px] font-bold text-zinc-300">
                S{episode.season_number} E{episode.episode_number}
              </span>
            </div>

            <h3 className="line-clamp-1 text-lg font-bold text-white sm:text-xl">
              {episode.name
                ? `"${episode.name}"`
                : `Episode ${episode.episode_number}`}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className={cn("h-3.5 w-3.5", colorStyles.icon)} />
              <span>
                Airs on{" "}
                <strong className="text-zinc-200">{formattedAirDate}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Countdown Column */}
        <div className="w-full shrink-0 lg:w-72">
          <CountdownDisplay
            targetDate={episode.air_date}
            variant="block"
            label="Countdown to Airing"
          />
        </div>
      </div>
    </div>
  );
}
