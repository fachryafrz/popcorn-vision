"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelinePosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
}

export function TimelinePosterImage({
  src,
  alt,
  className,
  containerClassName,
  loading = "lazy",
}: TimelinePosterImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageBase = process.env.NEXT_PUBLIC_API_IMAGE_300 ?? "https://image.tmdb.org/t/p/w300";
  const formattedSrc =
    src && src.startsWith("/") && !src.includes("placeholder")
      ? `${imageBase}${src}`
      : src;

  const showFallback = !formattedSrc || hasError;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-900 flex items-center justify-center select-none",
        containerClassName,
      )}
    >
      {showFallback ? (
        <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800">
          <Film className="h-6 w-6 text-zinc-500 mb-1" />
          <span className="text-[10px] font-bold text-zinc-400 line-clamp-2 px-1">
            {alt}
          </span>
        </div>
      ) : (
        <img
          src={formattedSrc}
          alt={alt}
          loading={loading}
          onError={() => setHasError(true)}
          className={cn("h-full w-full object-cover", className)}
        />
      )}
    </div>
  );
}
