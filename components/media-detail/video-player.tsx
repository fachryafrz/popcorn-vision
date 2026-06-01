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
}: VideoPlayerProps) {
  return (
    <div
      ref={playerSectionRef}
      className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/20 backdrop-blur-md shadow-2xl animate-in fade-in duration-700 scroll-mt-28"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-zinc-900/60 border-b border-zinc-800/80 text-sm">
        {/* Tabs */}
        <div className="flex gap-4">
          {trailerKey && (
            <button
              onClick={() => setActiveTab("trailer")}
              className={`text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                activeTab === "trailer"
                  ? "text-blue-500 border-blue-500"
                  : "text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              Trailer
            </button>
          )}
          <button
            onClick={() => setActiveTab("watch")}
            className={`text-sm font-bold pb-1 border-b-2 transition-all cursor-pointer ${
              activeTab === "watch"
                ? "text-blue-500 border-blue-500"
                : "text-zinc-400 border-transparent hover:text-white"
            }`}
          >
            Watch {mediaType === "tv" ? "TV Show" : "Movie"}
          </button>
        </div>
      </div>

      {/* Video Player Display Layout */}
      {activeTab === "trailer" ? (
        <div className="w-full aspect-video bg-black relative flex items-center justify-center">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
              title="Official Trailer"
              className="w-full h-full border-none"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="text-center text-zinc-500 flex flex-col items-center gap-2">
              <Film className="h-10 w-10 text-zinc-700" />
              <p className="text-sm font-semibold">No trailer video found on YouTube.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-full bg-zinc-950 overflow-hidden">
          {/* Player Frame */}
          <div className="w-full lg:w-2/3 aspect-video lg:aspect-auto lg:h-[60svh] bg-black">
            <iframe
              src={servers[selectedServer]?.source}
              title="Streaming Player"
              className="w-full h-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>

          {/* Servers & Episode selectors (Right Sidebar) */}
          <div className="w-full lg:w-1/3 p-6 bg-zinc-900/40 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col gap-5 overflow-y-auto lg:max-h-[60svh] scrollbar-thin">
            {/* TV Episode Selector */}
            {mediaType === "tv" && details && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850/80 space-y-3 shadow-inner">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tv className="h-3.5 w-3.5 text-blue-400" />
                  Episode Navigation
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Season</span>
                    <Select
                      value={String(season)}
                      onValueChange={(val) => {
                        setSeason(Number(val));
                        setEpisode(1);
                      }}
                    >
                      <SelectTrigger className="w-full bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white text-xs h-8 rounded-lg px-2.5 shadow-none focus:border-blue-500">
                        <SelectValue placeholder="Select Season" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg">
                        <SelectGroup>
                          {Array.from({ length: details?.number_of_seasons || 1 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i + 1)}
                              className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white hover:text-white text-xs"
                            >
                              Season {i + 1}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Episode</span>
                    <Select
                      value={String(episode)}
                      onValueChange={(val) => setEpisode(Number(val))}
                    >
                      <SelectTrigger className="w-full bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white text-xs h-8 rounded-lg px-2.5 shadow-none focus:border-blue-500">
                        <SelectValue placeholder="Select Episode" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-lg">
                        <SelectGroup>
                          {Array.from({
                            length:
                              details?.seasons?.find((s: Season) => s.season_number === season)
                                ?.episode_count || 10,
                          }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={String(i + 1)}
                              className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white hover:text-white text-xs"
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
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <Server className="h-3.5 w-3.5 text-blue-400" />
                Select Streaming Server
              </h4>

              <div className="flex flex-col gap-2">
                {servers.map((serv, index: number) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedServer(index)}
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group/btn cursor-pointer hover:bg-zinc-800/40 h-auto font-normal",
                      selectedServer === index
                        ? "bg-blue-600/10 border-blue-500 text-white hover:bg-blue-600/20"
                        : "bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Play
                        className={cn(
                          "h-3.5 w-3.5 transition-transform group-hover/btn:scale-110",
                          selectedServer === index
                            ? "text-blue-400 fill-blue-500/20"
                            : "text-zinc-500"
                        )}
                      />
                      <div>
                        <p className="font-semibold text-[11px] leading-tight text-left">
                          {serv.title}
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-0.5 text-left">
                          {serv.fast ? "Fast Server • " : ""}
                          {serv.ads ? "Contains Ads" : "No Ads"}
                        </p>
                      </div>
                    </div>
                    {serv.recommended && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-wider">
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
      <div className="p-4 bg-zinc-900/40 text-center text-xs text-zinc-400 border-t border-zinc-800/80">
        {activeTab === "watch"
          ? "Tip: Enable an ad-blocker extension in your browser to prevent popup ads from third-party streaming providers."
          : "Now displaying the official trailer. Click 'Watch Movie/Show' to stream."}
      </div>
    </div>
  );
}
