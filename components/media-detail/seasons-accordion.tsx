import { RefObject } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { MediaDetails, SeasonDetails } from "./types";

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
  if (!details?.seasons || details.seasons.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800/40">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        Seasons
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {details.seasons.map((s) => {
          const posterUrl = s.poster_path
            ? `https://image.tmdb.org/t/p/w185${s.poster_path}`
            : "/logo/popcorn.png";
          const year = s.air_date
            ? new Date(s.air_date).getFullYear()
            : "N/A";
          return (
            <div
              key={s.id}
              onClick={() => handleSeasonClick(s.season_number)}
              className={cn(
                "group flex gap-3 border rounded-2xl p-2.5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5",
                expandedSeason === s.season_number
                  ? "bg-zinc-900 border-blue-500 shadow-lg shadow-blue-500/10"
                  : "bg-zinc-900/45 border-zinc-850 hover:border-zinc-800 hover:bg-zinc-900/80"
              )}
            >
              <div className="aspect-2/3 w-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0">
                <img
                  src={posterUrl}
                  alt={s.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 min-w-0 text-left flex flex-col justify-center font-medium">
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {s.name}
                </h4>
                <span className="text-[10px] text-zinc-400 font-semibold mt-1">
                  {s.episode_count || 0} Episode{s.episode_count !== 1 ? "s" : ""}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold mt-0.5">
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
          className="mt-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-md space-y-6 scroll-mt-24"
        >
          {seasonDetailsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-zinc-500 text-xs font-semibold">
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
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed italic">
                    &ldquo;{activeSeasonData.overview}&rdquo;
                  </p>
                )}
              </div>

              {/* Episodes List */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                  Episodes ({activeSeasonData.episodes?.length || 0})
                </h5>
                <div className="flex flex-col gap-4">
                  {activeSeasonData.episodes?.map((ep) => {
                    const stillUrl = ep.still_path
                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                      : "/logo/popcorn.png";
                    return (
                      <div
                        key={ep.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors"
                      >
                        {/* Still image / thumbnail */}
                        <div className="w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-zinc-950 shrink-0 relative group">
                          <img
                            src={stillUrl}
                            alt={ep.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/45 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSeason(activeSeasonData.season_number);
                                setEpisode(ep.episode_number);
                                scrollToPlayer("watch");
                              }}
                              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] h-7 px-3.5 cursor-pointer shadow-md"
                            >
                              Play S{activeSeasonData.season_number}E{ep.episode_number}
                            </Button>
                          </div>
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-blue-400">
                                Episode {ep.episode_number}
                              </span>
                              {ep.runtime && (
                                <span className="text-[9px] text-zinc-500 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                                  {ep.runtime}m
                                </span>
                              )}
                            </div>
                            <h6 className="text-xs font-extrabold text-white mt-1 truncate">
                              {ep.name}
                            </h6>
                            <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-3">
                              {ep.overview || "No overview available for this episode."}
                            </p>
                          </div>
                          {ep.air_date && (
                            <span className="text-[9px] text-zinc-500 font-semibold mt-3">
                              Air Date: {moment(ep.air_date).format("MMM Do YYYY")}
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
            <p className="text-zinc-500 text-xs">Failed to load episode details.</p>
          )}
        </div>
      )}
    </div>
  );
}
