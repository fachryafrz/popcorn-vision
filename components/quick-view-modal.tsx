"use client";

import { useEffect, useState } from "react";
import { TMDBMedia, ALL_GENRES } from "@/lib/tmdb";
import { getMediaDetails } from "@/lib/tmdb-actions";
import { streamingProviderList } from "@/lib/streamingProviderList";
import { X, Play, Star, Clock, Calendar, Film, Server } from "lucide-react";

interface MediaDetails {
  tagline?: string;
  runtime?: number;
  number_of_seasons?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
  seasons?: { season_number: number; episode_count: number }[];
}

interface WatchProviders {
  US?: {
    flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
  };
}

interface CastItem {
  id: number;
  profile_path: string | null;
  name: string;
  character: string;
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: TMDBMedia | null;
}

export default function QuickViewModal({ isOpen, onClose, media }: QuickViewModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [providers, setProviders] = useState<WatchProviders>({});
  const [cast, setCast] = useState<CastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "watch">("info");
  const [selectedServer, setSelectedServer] = useState<number>(0);
  
  // TV Show Season & Episode state
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    if (!media) return;
    
    // Reset state asynchronously to prevent React cascading renders warning
    Promise.resolve().then(() => {
      setLoading(true);
      setDetails(null);
      setActiveTab("info");
      setSeason(1);
      setEpisode(1);
      setSelectedServer(0);
    });

    getMediaDetails(media.media_type || "movie", String(media.id)).then((data) => {
      if (data) {
        setDetails(data.details);
        setProviders(data.watchProviders);
        setCast(data.credits?.cast?.slice(0, 5) || []);
      }
      setLoading(false);
    });
  }, [media]);

  if (!isOpen || !media) return null;

  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "N/A";
  const voteRating = media.vote_average ? media.vote_average.toFixed(1) : "0.0";
  const backdropUrl = media.backdrop_path
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_1280 || "https://image.tmdb.org/t/p/w1280"}${media.backdrop_path}`
    : "/logo/popcorn.png";

  const servers = streamingProviderList({
    media_type: media.media_type || "movie",
    id: String(media.id),
    season,
    episode,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-7xl h-[85vh] sm:h-[80vh] md:h-[85vh] flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 rounded-full bg-black/60 p-2 border border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">Fetching detailed information...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Left section: Backdrop & Watch player */}
            <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:h-full bg-black flex-shrink-0 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-zinc-900">
              {activeTab === "info" ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/20 z-10" />

                  {/* Quick play trailer/movie */}
                  <div className="relative z-20 flex flex-col items-center gap-4 text-center px-4">
                    <button
                      onClick={() => setActiveTab("watch")}
                      className="group flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/90 border border-blue-400 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:bg-blue-500"
                    >
                      <Play className="h-9 w-9 fill-current pl-1 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                    <h3 className="text-lg font-semibold tracking-wide uppercase text-blue-400">
                      Play Now
                    </h3>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col bg-zinc-950">
                  {/* Selector Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900 border-b border-zinc-800 text-sm">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-400" />
                      <select
                        value={selectedServer}
                        onChange={(e) => setSelectedServer(Number(e.target.value))}
                        className="bg-zinc-800 text-white border border-zinc-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                      >
                        {servers.map((serv: { title: string; recommended?: boolean }, index: number) => (
                          <option key={index} value={index}>
                            {serv.title} {serv.recommended ? "(Recommended)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TV Episodes selector */}
                    {media.media_type === "tv" && details && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-400">Season</span>
                          <select
                            value={season}
                            onChange={(e) => {
                              setSeason(Number(e.target.value));
                              setEpisode(1);
                            }}
                            className="bg-zinc-800 text-white border border-zinc-700 rounded px-1.5 py-0.5 outline-none"
                          >
                            {Array.from({ length: details.number_of_seasons || 1 }).map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-400">Episode</span>
                          <select
                            value={episode}
                            onChange={(e) => setEpisode(Number(e.target.value))}
                            className="bg-zinc-800 text-white border border-zinc-700 rounded px-1.5 py-0.5 outline-none"
                          >
                            {Array.from({
                              length:
                                details.seasons?.find((s: { season_number: number }) => s.season_number === season)
                                  ?.episode_count || 10,
                            }).map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Player frame */}
                  <div className="flex-1 w-full bg-black">
                    <iframe
                      src={servers[selectedServer].source}
                      className="w-full h-full border-none"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right section: Detailed metadata */}
            <div className="flex-1 md:h-full overflow-y-auto flex flex-col p-6 sm:p-8">
              {/* Tab Selector */}
              <div className="flex gap-4 border-b border-zinc-800 mb-6 pb-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
                    activeTab === "info"
                      ? "text-blue-500 border-blue-500"
                      : "text-zinc-400 border-transparent hover:text-white"
                  }`}
                >
                  Overview & Info
                </button>
                <button
                  onClick={() => setActiveTab("watch")}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
                    activeTab === "watch"
                      ? "text-blue-500 border-blue-500"
                      : "text-zinc-400 border-transparent hover:text-white"
                  }`}
                >
                  Watch Online
                </button>
              </div>

              {activeTab === "info" ? (
                <div className="space-y-6">
                  {/* Title & Stats */}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700/50 mb-3">
                      {media.media_type === "tv" ? "TV Series" : "Movie"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {media.title}
                    </h2>
                    <p className="text-zinc-500 italic mt-1 text-sm">{details?.tagline}</p>
                  </div>

                  {/* Metadata Indicators */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-zinc-300">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-white">{voteRating}</span>
                      <span className="text-zinc-500">({details?.vote_count || 0})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>{releaseYear}</span>
                    </div>
                    {details?.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span>{details.runtime} mins</span>
                      </div>
                    )}
                    {details?.number_of_seasons && (
                      <div className="flex items-center gap-1">
                        <Film className="h-4 w-4 text-zinc-400" />
                        <span>
                          {details.number_of_seasons} Season
                          {details.number_of_seasons > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {details?.genres?.map((g: { id: number; name: string }) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
                      >
                        {g.name}
                      </span>
                    )) ||
                      media.genre_ids.map((id) => (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
                        >
                          {ALL_GENRES[id] || "Genre"}
                        </span>
                      ))}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Overview
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed sm:text-base">
                      {media.overview || "No overview available."}
                    </p>
                  </div>

                  {/* Cast Grid */}
                  {cast.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                        Key Cast
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {cast.map((actor: { id: number; profile_path: string | null; name: string; character: string }) => {
                          const actorPic = actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "/logo/popcorn.png";
                          return (
                            <div key={actor.id} className="text-center flex flex-col items-center">
                              <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cover bg-center border border-zinc-800 shadow-md mb-1.5"
                                style={{ backgroundImage: `url(${actorPic})` }}
                              />
                              <span className="text-[10px] sm:text-xs font-medium text-white truncate w-full">
                                {actor.name}
                              </span>
                              <span className="text-[9px] text-zinc-500 truncate w-full">
                                {actor.character}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Watch Providers */}
                  {providers.US?.flatrate && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Streaming on (US)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {providers.US.flatrate.map((prov: { provider_id: number; provider_name: string; logo_path: string }) => (
                          <div
                            key={prov.provider_id}
                            className="group relative flex h-10 w-10 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                            title={prov.provider_name}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
                              alt={prov.provider_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                    Choose a provider server and configure season/episode settings for TV Shows in the left header toolbar. Use ad-blocker extensions to prevent popups from servers.
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {servers.map((serv, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedServer(index);
                          setActiveTab("watch");
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                          selectedServer === index
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Play className={`h-5 w-5 ${selectedServer === index ? "text-blue-400" : "text-zinc-500"}`} />
                          <div>
                            <p className="font-semibold text-sm">{serv.title}</p>
                            <p className="text-xs text-zinc-500">
                              {serv.fast ? "Fast Server • " : ""}
                              {serv.ads ? "Contains Ads" : "No Ads"}
                            </p>
                          </div>
                        </div>
                        {serv.recommended && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
