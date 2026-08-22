import { useState, useEffect, RefObject } from "react";
import {
  Film,
  Tv,
  Server,
  Play,
  Image as ImageIcon,
  ExternalLink,
  RectangleVertical,
} from "lucide-react";
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
import {
  MediaDetails,
  Season,
  VideoItem,
  MediaImagesData,
  TMDBImageItem,
} from "./types";

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
  videos?: VideoItem[];
  images?: MediaImagesData;
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
  videos = [],
  images,
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
  const youtubeVideos = (videos || []).filter(
    (v) => v.site?.toLowerCase() === "youtube" && v.key,
  );
  const backdrops = images?.backdrops || [];
  const posters = images?.posters || [];

  // Active Media Preview State (Left Frame)
  const [activeMediaMode, setActiveMediaMode] = useState<"video" | "image">(
    "video",
  );
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(
    trailerKey || (youtubeVideos.length > 0 ? youtubeVideos[0].key : null),
  );
  const [selectedImage, setSelectedImage] = useState<TMDBImageItem | null>(
    backdrops[0] || posters[0] || null,
  );

  // Active Media Sidebar Tab (Right Sidebar)
  const [sidebarMediaTab, setSidebarMediaTab] = useState<
    "videos" | "backdrops" | "posters"
  >("videos");

  // Sync default video key if trailerKey / videos change
  useEffect(() => {
    if (trailerKey) {
      setSelectedVideoKey(trailerKey);
      setActiveMediaMode("video");
    } else if (youtubeVideos.length > 0) {
      setSelectedVideoKey(youtubeVideos[0].key);
      setActiveMediaMode("video");
    } else if (backdrops.length > 0) {
      setSelectedImage(backdrops[0]);
      setActiveMediaMode("image");
      setSidebarMediaTab("backdrops");
    }
  }, [trailerKey, videos?.length, backdrops.length]);

  return (
    <div
      ref={playerSectionRef}
      className="animate-in fade-in scroll-mt-28 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 shadow-2xl backdrop-blur-md duration-700"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-900/60 p-5 text-sm">
        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("trailer")}
            className={`cursor-pointer border-b-2 pb-1 text-sm font-bold transition-all ${
              activeTab === "trailer"
                ? "text-primary border-primary"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Videos & Images
          </button>
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
        <div className="flex w-full flex-col overflow-hidden bg-zinc-950 lg:flex-row">
          {/* Main Media Preview Frame (Left 2/3) */}
          <div className="flex aspect-video w-full items-center justify-center bg-black lg:aspect-auto lg:h-[60svh] lg:w-2/3">
            {activeMediaMode === "video" ? (
              selectedVideoKey ? (
                <iframe
                  key={selectedVideoKey}
                  src={`https://www.youtube.com/embed/${selectedVideoKey}?autoplay=0&rel=0`}
                  title="Video Player"
                  className="h-full w-full border-none"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 text-center text-zinc-500">
                  <Film className="h-10 w-10 text-zinc-700" />
                  <p className="text-sm font-semibold">
                    No video available for this title.
                  </p>
                </div>
              )
            ) : selectedImage ? (
              <div className="relative flex h-full w-full items-center justify-center bg-zinc-950/80 p-4">
                <img
                  src={`https://image.tmdb.org/t/p/original${selectedImage.file_path}`}
                  alt="Media Image Preview"
                  className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                />
                {/* Full HD Link Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <a
                    href={`https://image.tmdb.org/t/p/original${selectedImage.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800"
                  >
                    <span>
                      Full HD ({selectedImage.width}×{selectedImage.height})
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-6 text-center text-zinc-500">
                <ImageIcon className="h-10 w-10 text-zinc-700" />
                <p className="text-sm font-semibold">No media selected.</p>
              </div>
            )}
          </div>

          {/* Videos & Images Gallery Sidebar (Right 1/3) */}
          <div className="flex w-full scrollbar-thin flex-col gap-4 overflow-y-auto border-t border-zinc-800 bg-zinc-900/40 p-4 lg:max-h-[60svh] lg:w-1/3 lg:border-t-0 lg:border-l">
            {/* Gallery Navigation Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
              <button
                onClick={() => setSidebarMediaTab("videos")}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
                  sidebarMediaTab === "videos"
                    ? "bg-zinc-800 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <Film className="h-3.5 w-3.5" />
                Videos
              </button>

              <button
                onClick={() => setSidebarMediaTab("backdrops")}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
                  sidebarMediaTab === "backdrops"
                    ? "bg-zinc-800 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Backdrops
              </button>

              <button
                onClick={() => setSidebarMediaTab("posters")}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
                  sidebarMediaTab === "posters"
                    ? "bg-zinc-800 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <RectangleVertical className="h-3.5 w-3.5" />
                Posters
              </button>
            </div>

            {/* Sub-tab 1: Videos List */}
            {sidebarMediaTab === "videos" && (
              <div className="max-h-[50svh] space-y-2 space-x-2 overflow-y-auto">
                {youtubeVideos.length === 0 ? (
                  <p className="py-8 text-center text-xs text-zinc-500 italic">
                    No videos available for this title.
                  </p>
                ) : (
                  youtubeVideos.map((video) => {
                    const isSelected =
                      activeMediaMode === "video" &&
                      selectedVideoKey === video.key;
                    return (
                      <button
                        key={video.key}
                        onClick={() => {
                          setSelectedVideoKey(video.key);
                          setActiveMediaMode("video");
                        }}
                        className={cn(
                          "group/vid flex w-[calc(100%-0.5rem)] cursor-pointer items-center gap-3 rounded-2xl border p-2.5 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-white"
                            : "border-zinc-800/80 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900",
                        )}
                      >
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                          <img
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name || "Video thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/vid:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play
                              className={cn(
                                "h-4 w-4",
                                isSelected
                                  ? "text-primary fill-primary"
                                  : "text-white",
                              )}
                            />
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-xs leading-snug font-semibold">
                            {video.name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="inline-block rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-bold text-zinc-400 uppercase">
                              {video.type || "Video"}
                            </span>
                            {video.official && (
                              <span className="text-primary text-[9px] font-bold">
                                Official
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Sub-tab 2: Backdrops Gallery */}
            {sidebarMediaTab === "backdrops" && (
              <div className="max-h-[50svh] space-y-2 space-x-2 overflow-y-auto">
                {backdrops.length === 0 ? (
                  <p className="py-8 text-center text-xs text-zinc-500 italic">
                    No backdrops available.
                  </p>
                ) : (
                  backdrops.map((img, idx) => {
                    const isSelected =
                      activeMediaMode === "image" &&
                      selectedImage?.file_path === img.file_path;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(img);
                          setActiveMediaMode("image");
                        }}
                        className={cn(
                          "group/img relative aspect-16/9 w-[calc(50%-0.5rem)] cursor-pointer overflow-hidden rounded-2xl border transition-all",
                          isSelected
                            ? "border-primary ring-primary/40 shadow-lg ring-2"
                            : "border-zinc-800/80 hover:border-zinc-700",
                        )}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                          alt="Backdrop"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        />
                        <div className="absolute right-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                          {img.width}×{img.height}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Sub-tab 3: Posters Gallery */}
            {sidebarMediaTab === "posters" && (
              <div className="max-h-[50svh] space-y-2 space-x-2 overflow-y-auto">
                {posters.length === 0 ? (
                  <p className="py-8 text-center text-xs text-zinc-500 italic">
                    No posters available.
                  </p>
                ) : (
                  posters.map((img, idx) => {
                    const isSelected =
                      activeMediaMode === "image" &&
                      selectedImage?.file_path === img.file_path;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(img);
                          setActiveMediaMode("image");
                        }}
                        className={cn(
                          "group/poster relative aspect-2/3 w-[calc(50%-0.5rem)] cursor-pointer overflow-hidden rounded-2xl border transition-all",
                          isSelected
                            ? "border-primary ring-primary/40 shadow-lg ring-2"
                            : "border-zinc-800/80 hover:border-zinc-700",
                        )}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                          alt="Poster"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/poster:scale-105"
                        />
                        <div className="absolute right-1.5 bottom-1.5 rounded-md bg-black/70 px-1 py-0.5 text-[8px] font-semibold text-white backdrop-blur-sm">
                          {img.width}×{img.height}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
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

              <div className="flex max-h-[50svh] flex-col gap-2 overflow-y-auto lg:max-h-none lg:overflow-y-clip">
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
          : "Explore official trailers, teasers, behind-the-scenes, and high-resolution backdrops & posters."}
      </div>
    </div>
  );
}
