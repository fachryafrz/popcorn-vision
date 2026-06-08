import { RefObject } from "react";
import { Film, Tv, Server, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MediaDetails, Season } from "./types";

interface ServerSource {
  title: string;
  source: string;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
}

interface VideoPlayerProps {
  playerSectionRef: RefObject<HTMLDivElement | null>;
  mediaType: "movie" | "tv";
  details: MediaDetails;
  trailerKey: string | null;
  activeTab: "trailer" | "watch";
  setActiveTab: (tab: "trailer" | "watch") => void;
  selectedServer: number;
  setSelectedServer: (index: number) => void;
  season: number;
  setSeason: (season: number) => void;
  episode: number;
  setEpisode: (episode: number) => void;
  servers: ServerSource[];
  isUnreleased?: boolean;
}

export default function VideoPlayer({
  playerSectionRef,
  mediaType,
  details,
  trailerKey,
  activeTab,
  setActiveTab,
  selectedServer,
  setSelectedServer,
  season,
  setSeason,
  episode,
  setEpisode,
  servers,
  isUnreleased,
}: VideoPlayerProps) {
  return (
    <div
      ref={playerSectionRef}
      className="animate-in fade-in scroll-mt-28 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 shadow-2xl backdrop-blur-md duration-700"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-900/60 p-5 text-sm">
        {/* Tabs */}
        <div className="flex gap-4">
          {trailerKey && (
            <button
              onClick={() => setActiveTab("trailer")}
              className={`cursor-pointer border-b-2 pb-1 text-sm font-bold transition-all ${
                activeTab === "trailer"
                  ? "text-primary border-primary"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Trailer
            </button>
          )}
          <button
            onClick={() => setActiveTab("watch")}
            className={`cursor-pointer border-b-2 pb-1 text-sm font-bold transition-all ${
              activeTab === "watch"
                ? "text-primary border-primary"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Watch {mediaType === "tv" ? "TV Show" : "Movie"}
          </button>
        </div>
      </div>

      {/* Video Player Display Layout */}
      {activeTab === "trailer" ? (
        <div className="relative flex aspect-video w-full items-center justify-center bg-black">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
              title="Official Trailer"
              className="h-full w-full border-none"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-zinc-500">
              <Film className="h-10 w-10 text-zinc-700" />
              <p className="text-sm font-semibold">
                No trailer video found on YouTube.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col overflow-hidden bg-zinc-950 lg:flex-row">
          {/* Player Frame */}
          {isUnreleased ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center bg-black p-6 text-center text-zinc-500 lg:aspect-auto lg:h-[60svh] lg:w-2/3">
              <Tv className="mb-2.5 h-10 w-10 text-zinc-700" />
              <h5 className="text-sm font-bold text-zinc-300">
                Unreleased Content
              </h5>
              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                This title has not been officially released yet. Streaming will
                become available once it is released.
              </p>
            </div>
          ) : (
            <div className="aspect-video w-full bg-black lg:aspect-auto lg:h-[60svh] lg:w-2/3">
              <iframe
                src={servers[selectedServer]?.source}
                title="Streaming Player"
                className="h-full w-full border-none"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          )}

          {/* Servers & Episode selectors (Right Sidebar) */}
          <div className="flex w-full scrollbar-thin flex-col gap-5 overflow-y-auto border-t border-zinc-800 bg-zinc-900/40 p-6 lg:max-h-[60svh] lg:w-1/3 lg:border-t-0 lg:border-l">
            {/* TV Episode Selector */}
            {mediaType === "tv" && details && (
              <div className="border-zinc-850/80 space-y-3 rounded-2xl border bg-zinc-950 p-4 shadow-inner">
                <h4 className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  <Tv className="text-primary h-3.5 w-3.5" />
                  Episode Navigation
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">
                      Season
                    </span>
                    <Select
                      value={String(season)}
                      onValueChange={(val) => {
                        setSeason(Number(val));
                        setEpisode(1);
                      }}
                    >
                      <SelectTrigger className="focus:border-primary h-8 w-full rounded-lg border-zinc-800 bg-zinc-900 px-2.5 text-xs text-white shadow-none hover:bg-zinc-800">
                        <SelectValue placeholder="Select Season" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border border-zinc-800 bg-zinc-900 text-white">
                        <SelectGroup>
                          {Array.from({
                            length: details?.number_of_seasons || 1,
                          }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i + 1)}
                              className="text-xs hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                            >
                              Season {i + 1}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">
                      Episode
                    </span>
                    <Select
                      value={String(episode)}
                      onValueChange={(val) => setEpisode(Number(val))}
                    >
                      <SelectTrigger className="focus:border-primary h-8 w-full rounded-lg border-zinc-800 bg-zinc-900 px-2.5 text-xs text-white shadow-none hover:bg-zinc-800">
                        <SelectValue placeholder="Select Episode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border border-zinc-800 bg-zinc-900 text-white">
                        <SelectGroup>
                          {Array.from({
                            length:
                              details?.seasons?.find(
                                (s: Season) => s.season_number === season,
                              )?.episode_count || 10,
                          }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i + 1)}
                              className="text-xs hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                            >
                              Episode {i + 1}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Server Selection Buttons */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 px-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                <Server className="text-primary h-3.5 w-3.5" />
                Select Streaming Server
              </h4>

              <div className="flex flex-col gap-2">
                {servers.map((serv, index: number) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedServer(index)}
                    variant="ghost"
                    className={cn(
                      "group/btn flex h-auto w-full cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left font-normal transition-all hover:bg-zinc-800/40",
                      selectedServer === index
                        ? "border-primary bg-primary/10 hover:bg-primary/20 text-white"
                        : "border-zinc-850 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700 hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Play
                        className={cn(
                          "h-3.5 w-3.5 transition-transform group-hover/btn:scale-110",
                          selectedServer === index
                            ? "text-primary fill-primary/20"
                            : "text-zinc-500",
                        )}
                      />
                      <div>
                        <p className="text-left text-[11px] leading-tight font-semibold">
                          {serv.title}
                        </p>
                        <p className="mt-0.5 text-left text-[9px] text-zinc-500">
                          {serv.fast ? "Fast Server • " : ""}
                          {serv.ads ? "Contains Ads" : "No Ads"}
                        </p>
                      </div>
                    </div>
                    {serv.recommended && (
                      <span className="text-primary bg-primary/20 rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                        Recommended
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner underneath */}
      <div className="border-t border-zinc-800/80 bg-zinc-900/40 p-4 text-center text-xs text-zinc-400">
        {activeTab === "watch"
          ? "Tip: Enable an ad-blocker extension in your browser to prevent popup ads from third-party streaming providers."
          : "Now displaying the official trailer. Click 'Watch Movie/Show' to stream."}
      </div>
    </div>
  );
}
