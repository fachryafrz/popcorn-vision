"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Bookmark, Film, Loader2 } from "lucide-react";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "@/components/quick-view-modal";
import { TMDBMedia } from "@/lib/tmdb";

export default function WatchlistPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const loadingSession = session.isPending;

  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  // Fetch watchlist from Convex
  const watchlist = useQuery(api.watchlist.getWatchlist);

  if (loadingSession) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh] bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 text-white px-6 text-center">
        <Bookmark className="h-16 w-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Your Watchlist</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          Sign in to keep track of movies and TV series you want to watch.
        </p>
        <Button
          onClick={openAuth}
          className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-6 text-base cursor-pointer"
        >
          Sign In / Register
        </Button>
      </div>
    );
  }

  return (
    <div className="grow bg-zinc-950 text-white min-h-[80vh] py-24 px-6 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 border-b border-zinc-900 pb-6 mb-8">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Bookmark className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">My Watchlist</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            {watchlist ? watchlist.length : 0} title{watchlist?.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {!watchlist ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : watchlist.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
          <Film className="h-12 w-12 text-zinc-800" />
          <p className="text-zinc-400 text-sm font-medium">Your watchlist is currently empty.</p>
          <p className="text-zinc-600 text-xs">Explore the homepage and click the plus icon on any card to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {watchlist.map((item) => {
            // Adapt Convex watchlist database record format to TMDBMedia interface format for the Card
            const mediaItem: TMDBMedia = {
              id: Number(item.mediaId),
              media_type: item.mediaType as "movie" | "tv",
              title: item.title,
              name: item.title,
              poster_path: item.posterPath,
              vote_average: item.rating,
              release_date: item.releaseYear,
              popularity: 0,
              backdrop_path: "",
              genre_ids: [],
              overview: "",
            };
            return (
              <Card
                key={item._id}
                media={mediaItem}
                onQuickView={setQuickViewMedia}
                onAuthRequired={openAuth}
              />
            );
          })}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}
    </div>
  );
}
