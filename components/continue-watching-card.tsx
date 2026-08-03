"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Trash2 } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { useState } from "react";

interface ContinueWatchingItem {
  _id: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  backdropPath?: string;
  episodeStillPath?: string;
  season?: number;
  episode?: number;
  updatedAt: number;
}

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  onRemoveSuccess?: () => void;
}

export default function ContinueWatchingCard({
  item,
  onRemoveSuccess,
}: ContinueWatchingCardProps) {
  const router = useRouter();
  const removeProgress = useMutation(api.continueWatching.removeProgress);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await removeProgress({
        mediaId: item.mediaId,
        mediaType: item.mediaType,
      });
      toast.success(`Removed "${item.title}" from Continue Watching`);
      onRemoveSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove progress");
    } finally {
      setIsDeleting(false);
    }
  };

  let rawImage = "/logo/popcorn.png";

  if (item.mediaType === "tv") {
    // TV Series: Prioritize episode still image, then backdrop, then poster
    const still = item.episodeStillPath || item.backdropPath || item.posterPath;
    if (still) {
      rawImage = `${process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500"}${still}`;
    }
  } else {
    // Movie: Prioritize backdrop image, then poster
    const backdrop = item.backdropPath || item.posterPath;
    if (backdrop) {
      rawImage = `${process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500"}${backdrop}`;
    }
  }

  const imagePath = rawImage;

  const relativeTime = moment(item.updatedAt).fromNow();

  return (
    <div
      onClick={() => {
        const queryParams = new URLSearchParams();
        queryParams.set("playTab", "watch");
        if (item.season !== undefined) {
          queryParams.set("season", String(item.season));
        }
        if (item.episode !== undefined) {
          queryParams.set("episode", String(item.episode));
        }
        router.push(`/${item.mediaType}/${item.mediaId}?${queryParams.toString()}`, { scroll: false });
      }}
      className="group relative flex w-full shrink-0 cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl transition-all duration-300 md:hover:-translate-y-1"
    >
      {/* Backdrop area (Landscape) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900">
        <img
          src={imagePath}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay with a Play button */}
        <div className="absolute inset-0 z-10 hidden items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <div className="shadow-primary/35 bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="rounded-full border border-zinc-700/30 bg-black/70 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-zinc-300 uppercase backdrop-blur-md">
            {item.mediaType === "tv" ? "TV Series" : "Movie"}
          </span>
        </div>

        {/* Delete button (trash icon) */}
        <button
          onClick={handleRemove}
          disabled={isDeleting}
          className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800/50 bg-black/60 text-zinc-400 backdrop-blur-md transition-colors hover:border-red-800/50 hover:bg-red-950/80 hover:text-red-400"
          title="Remove from Continue Watching"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Info / Metadata */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="group-hover:text-primary line-clamp-1 text-sm font-semibold text-white transition-colors">
          {item.title}
        </h3>

        {item.mediaType === "tv" && (
          <p className="text-primary text-xs font-bold">
            S{item.season} E{item.episode}
          </p>
        )}

        <p className="text-[10px] font-medium text-zinc-500">
          Watched {relativeTime}
        </p>
      </div>
    </div>
  );
}
