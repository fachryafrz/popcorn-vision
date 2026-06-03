import { RefObject, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { MediaDetails, SeasonDetails } from "./types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { toast } from "sonner";

interface SeasonsAccordionProps {
  details: MediaDetails;
  expandedSeason: number | null;
  seasonDetailsLoading: boolean;
  activeSeasonData: SeasonDetails | null;
  handleSeasonClick: (seasonNumber: number) => void;
  seasonDetailsRef: RefObject<HTMLDivElement | null>;
  setSeason: (season: number) => void;
  setEpisode: (episode: number) => void;
  scrollToPlayer: (tab: "trailer" | "watch") => void;
}

export default function SeasonsAccordion({
  details,
  expandedSeason,
  seasonDetailsLoading,
  activeSeasonData,
  handleSeasonClick,
  seasonDetailsRef,
  setSeason,
  setEpisode,
  scrollToPlayer,
}: SeasonsAccordionProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);
  const logSeasonCompletion = useMutation(api.activities.logSeasonCompletion);
  const [completingSeasons, setCompletingSeasons] = useState<
    Record<number, boolean>
  >({});

  const handleMarkCompleted = async (
    e: React.MouseEvent,
    seasonNumber: number,
  ) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuth();
      return;
    }

    setCompletingSeasons((prev) => ({ ...prev, [seasonNumber]: true }));
    try {
      await logSeasonCompletion({
        mediaId: String(details.id),
        mediaType: "tv",
        title: details.name || details.title || "",
        posterPath: details.poster_path || "",
        season: seasonNumber,
      });
      toast.success(`Marked Season ${seasonNumber} as completed!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark season as completed");
    } finally {
      setCompletingSeasons((prev) => ({ ...prev, [seasonNumber]: false }));
    }
  };

  if (!details?.seasons || details.seasons.length === 0) return null;

  return (
    <div className="space-y-4 border-t border-zinc-800/40 pt-4">
      <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
        Seasons
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {details.seasons.map((s) => {
          const posterUrl = s.poster_path
            ? `https://image.tmdb.org/t/p/w185${s.poster_path}`
            : "/logo/popcorn.png";
          const year = s.air_date ? new Date(s.air_date).getFullYear() : "N/A";
          const isCompleting = completingSeasons[s.season_number];

          return (
            <div
              key={s.id}
              onClick={() => handleSeasonClick(s.season_number)}
              className={cn(
                "group flex cursor-pointer gap-3 rounded-2xl border p-2.5 transition-all duration-300 hover:-translate-y-0.5",
                expandedSeason === s.season_number
                  ? "border-primary shadow-primary/10 bg-zinc-900 shadow-lg"
                  : "border-zinc-850 bg-zinc-900/45 hover:border-zinc-800 hover:bg-zinc-900/80",
              )}
            >
              <div className="aspect-2/3 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-950">
                <img
                  src={posterUrl}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center text-left font-medium">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="group-hover:text-primary truncate text-xs font-bold text-white transition-colors">
                    {s.name}
                  </h4>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handleMarkCompleted(e, s.season_number)}
                    className="h-5 w-5 shrink-0 rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-green-500"
                    title="Mark Completed"
                  >
                    {isCompleting ? (
                      <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <span className="mt-1 text-[10px] font-semibold text-zinc-400">
                  {s.episode_count || 0} Episode
                  {s.episode_count !== 1 ? "s" : ""}
                </span>
                <span className="mt-0.5 text-[9px] font-bold text-zinc-500">
                  {year}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Season Details & Episode List */}
      {expandedSeason !== null && (
        <div
          ref={seasonDetailsRef}
          className="mt-6 scroll-mt-24 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/15 p-6 backdrop-blur-md"
        >
          {seasonDetailsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="text-primary mb-2 h-8 w-8 animate-spin" />
              <p className="text-xs font-semibold text-zinc-500">
                Loading season details...
              </p>
            </div>
          ) : activeSeasonData ? (
            <div className="space-y-6">
              {/* Season Header info */}
              <div className="border-b border-zinc-800/80 pb-4">
                <h4 className="text-sm font-extrabold text-white">
                  {activeSeasonData.name}
                </h4>
                {activeSeasonData.overview && (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 italic">
                    &ldquo;{activeSeasonData.overview}&rdquo;
                  </p>
                )}
              </div>

              {/* Episodes List */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black tracking-wider text-zinc-500 uppercase">
                  Episodes ({activeSeasonData.episodes?.length || 0})
                </h5>
                <div className="flex flex-col gap-4">
                  {activeSeasonData.episodes?.map((ep) => {
                    const stillUrl = ep.still_path
                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                      : "/logo/popcorn.png";
                    const duration = moment.duration(ep.runtime, "minutes");
                    return (
                      <div
                        key={ep.id}
                        className="border-zinc-850 flex flex-col gap-4 rounded-xl border bg-zinc-900/20 p-4 transition-colors hover:bg-zinc-900/40 sm:flex-row"
                      >
                        {/* Still image / thumbnail */}
                        <div className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-zinc-950 sm:w-44">
                          <img
                            src={stillUrl}
                            alt={ep.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity group-hover:opacity-100 md:opacity-0">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSeason(activeSeasonData.season_number);
                                setEpisode(ep.episode_number);
                                scrollToPlayer("watch");
                              }}
                              className="hover:bg-primary bg-primary h-7 cursor-pointer rounded-full px-3.5 text-[10px] font-bold text-white shadow-md"
                            >
                              Play S{activeSeasonData.season_number} E
                              {ep.episode_number}
                            </Button>
                          </div>
                        </div>

                        {/* Episode Info */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary text-xs font-black">
                                Episode {ep.episode_number}
                              </span>
                              {ep.runtime && (
                                <span className="border-zinc-850 rounded border bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-zinc-500">
                                  {duration.hours() > 0
                                    ? `${duration.hours()}h `
                                    : ""}
                                  {duration.minutes() > 0
                                    ? `${duration.minutes()}m`
                                    : ""}
                                </span>
                              )}
                            </div>
                            <h6 className="mt-1 truncate text-xs font-extrabold text-white">
                              {ep.name}
                            </h6>
                            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                              {ep.overview ||
                                "No overview available for this episode."}
                            </p>
                          </div>
                          {ep.air_date && (
                            <span className="mt-3 text-[9px] font-semibold text-zinc-500">
                              Air Date:{" "}
                              {moment(ep.air_date).format("MMM Do YYYY")}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">
              Failed to load episode details.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
