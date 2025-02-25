/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import ImagePovi from "@/components/Film/ImagePovi";

// Zustand
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function EpisodeCard({
  className,
  episode,
  imgPath,
  title,
  secondaryInfo,
  thirdInfo,
  overlay,
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      onClick={() => {
        router.replace(
          `${pathname}/?season=${episode.season_number}&episode=${episode.episode_number}`,
          { scroll: false },
        );
      }}
      // href={{
      //   pathname,
      //   query: { season: episode.season_number, episode: episode.episode_number },
      // }}
      className={`flex h-fit w-full flex-col items-center gap-2 rounded-xl bg-secondary bg-opacity-10 p-2 backdrop-blur transition-all hocus:bg-opacity-30 ${className}`}
    >
      <ImagePovi
        imgPath={imgPath}
        className={`relative aspect-video w-full overflow-hidden rounded-lg`}
      >
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={`https://image.tmdb.org/t/p/w780${imgPath}`}
          />
          <img
            src={`https://image.tmdb.org/t/p/w500${imgPath}`}
            loading="lazy"
            role="presentation"
            draggable={false}
            className="w-full"
            alt=""
            aria-hidden
            width={500}
            height={750}
          />
        </picture>

        {overlay && (
          <span
            className={`absolute left-0 top-0 m-2 rounded-full bg-base-100 bg-opacity-[75%] p-1 px-2 text-sm font-medium backdrop-blur-sm`}
          >
            {overlay}
          </span>
        )}
      </ImagePovi>

      <div className="flex w-full flex-col items-start gap-1">
        <h3 className="text-start font-medium" style={{ textWrap: `balance` }}>
          {title}
        </h3>

        <div
          className={`flex flex-wrap items-center gap-1 text-xs font-medium text-gray-400`}
        >
          {secondaryInfo}
        </div>

        {thirdInfo && (
          <div
            className={`flex flex-wrap items-center gap-1 text-xs font-medium text-gray-400`}
          >
            {thirdInfo}
          </div>
        )}
      </div>
    </button>
  );
}
