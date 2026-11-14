"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, Layers, Star } from "lucide-react";
import {
  getCollectionDetails,
  TMDBCollectionDetails,
} from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import Card from "@/components/card";
import QuickViewModal from "@/components/quick-view-modal";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useQuickViewMediaState } from "@/hooks/use-query-modal-state";
import { Skeleton } from "@/components/ui/skeleton";

const BACKDROP_BASE =
  process.env.NEXT_PUBLIC_API_IMAGE_ORIGINAL ||
  "https://image.tmdb.org/t/p/original";
const POSTER_BASE =
  process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500";

interface CollectionDetailClientProps {
  id: string;
}

export default function CollectionDetailClient({
  id,
}: CollectionDetailClientProps) {
  const router = useRouter();
  const openAuth = useAuthModalStore((s) => s.open);
  const [quickViewMediaRef, setQuickViewMediaRef] = useQuickViewMediaState();

  const quickViewMedia = useMemo<TMDBMedia | null>(() => {
    if (!quickViewMediaRef) return null;
    return {
      id: Number(quickViewMediaRef.id),
      media_type: quickViewMediaRef.media_type,
      poster_path: null,
      backdrop_path: null,
      vote_average: 0,
      genre_ids: [],
      overview: "",
      popularity: 0,
    };
  }, [quickViewMediaRef]);

  const setQuickViewMedia = useCallback(
    (media: TMDBMedia | null) => {
      if (media) {
        setQuickViewMediaRef({
          id: String(media.id),
          media_type: media.media_type ?? "movie",
        });
      } else {
        setQuickViewMediaRef(null);
      }
    },
    [setQuickViewMediaRef],
  );
  const collectionId = Number(id);
  const isValidId = Number.isFinite(collectionId) && collectionId > 0;

  const [loaded, setLoaded] = useState<{
    id: string;
    data: TMDBCollectionDetails | null;
  } | null>(null);

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let active = true;
    getCollectionDetails(collectionId)
      .then((data) => {
        if (active) setLoaded({ id, data });
      })
      .catch(() => {
        if (active) setLoaded({ id, data: null });
      });

    return () => {
      active = false;
    };
  }, [id, collectionId, isValidId]);

  const isLoading = isValidId && loaded?.id !== id;
  const collection = isValidId && loaded?.id === id ? loaded.data : null;

  const sortedMovies = useMemo<TMDBMedia[]>(() => {
    if (!collection?.parts) return [];
    return [...collection.parts]
      .sort((a, b) => {
        const timeA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const timeB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return timeA - timeB;
      })
      .map((part) => ({
        id: part.id,
        title: part.title,
        name: part.title,
        poster_path: part.poster_path,
        backdrop_path: part.backdrop_path,
        media_type: "movie",
        vote_average: part.vote_average ?? 0,
        release_date: part.release_date ?? "",
        genre_ids: part.genre_ids ?? [],
        overview: part.overview ?? "",
        popularity: 0,
      }));
  }, [collection]);

  const averageRating = useMemo(() => {
    const rated = sortedMovies.filter((m) => (m.vote_average ?? 0) > 0);
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, m) => acc + (m.vote_average ?? 0), 0);
    return (sum / rated.length).toFixed(1);
  }, [sortedMovies]);

  if (isLoading) {
    return (
      <div className="bg-background text-foreground min-h-svh pb-20">
        <Skeleton className="h-[46svh] w-full rounded-none sm:h-[54svh]" />
        <div className="relative z-20 -mt-24 flex flex-col gap-8 px-6 sm:-mt-32 sm:px-12 lg:flex-row lg:gap-12 lg:px-20">
          <Skeleton className="hidden aspect-2/3 w-56 shrink-0 rounded-2xl xl:block" />
          <div className="flex-1 space-y-4 pt-6">
            <Skeleton className="h-10 w-80 rounded-lg" />
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-20 w-full max-w-3xl rounded-lg" />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 sm:px-12 md:grid-cols-4 lg:grid-cols-5 lg:px-20 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="bg-background text-foreground flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <Layers className="mb-4 h-12 w-12 text-zinc-600" />
        <h1 className="text-2xl font-bold text-white">Collection not found</h1>
        <p className="mt-2 text-sm text-zinc-400">
          We couldn&apos;t load details for this collection.
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const backdropUrl = collection.backdrop_path
    ? `${BACKDROP_BASE}${collection.backdrop_path}`
    : null;
  const posterUrl = collection.poster_path
    ? `${POSTER_BASE}${collection.poster_path}`
    : "/logo/v2/popcorn_cropped_transparent.png";

  return (
    <main className="bg-background text-foreground min-h-svh pb-20">
      {/* Hero Backdrop */}
      <div className="relative h-[46svh] w-full overflow-hidden bg-zinc-950 sm:h-[54svh]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={collection.name}
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        )}
        <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-black/30" />
        <div className="from-background/80 absolute inset-0 hidden bg-linear-to-r via-transparent to-transparent md:block" />

        <div className="absolute top-24 left-6 z-20 sm:left-12 lg:left-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-colors hover:bg-black/75 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </div>

      {/* Collection Header */}
      <div className="relative z-20 -mt-24 flex flex-col items-start gap-8 px-6 sm:-mt-32 sm:px-12 lg:flex-row lg:gap-12 lg:px-20">
        <div className="hidden w-56 shrink-0 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-2xl xl:block">
          <img
            src={posterUrl}
            alt={collection.name}
            className="aspect-2/3 w-full object-cover"
            draggable={false}
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 pt-2">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-md">
            <Layers className="text-primary h-3.5 w-3.5" />
            Movie Collection
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {collection.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-300">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1">
              <Film className="h-3.5 w-3.5 text-zinc-400" />
              {sortedMovies.length}{" "}
              {sortedMovies.length === 1 ? "Movie" : "Movies"}
            </span>
            {averageRating && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {averageRating} Avg
              </span>
            )}
          </div>

          {collection.overview && (
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {collection.overview}
            </p>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      <section className="mt-14 space-y-6 px-6 sm:px-12 lg:px-20">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Movies in this Collection
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedMovies.map((movie) => (
            <Card
              key={movie.id}
              media={movie}
              onQuickView={(media) => setQuickViewMedia(media)}
              onAuthRequired={() => openAuth()}
            />
          ))}
        </div>
      </section>

      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}
    </main>
  );
}
