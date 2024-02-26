/* eslint-disable @next/next/no-img-element */
import { getEpisodeModal } from "@/lib/fetch";
import React from "react";
import ImagePovi from "@/components/ImagePovi";

// Redux Toolkit
import { useSelector, useDispatch } from "react-redux";
import { setEpisode } from "@/redux/episodeSlice";

export default function EpisodeCard({
  className,
  episode,
  imgPath,
  title,
  secondaryInfo,
  thirdInfo,
  setLoading,
  filmID,
  overlay,
}) {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        getEpisodeModal({
          filmID,
          season: episode.season_number,
          eps: episode.episode_number,
        }).then((res) => {
          setLoading(false);

          // Redux Toolkit
          dispatch(setEpisode(episode));
        });
      }}
      className={`flex flex-col items-center gap-2 bg-secondary bg-opacity-10 backdrop-blur hocus:bg-opacity-30 p-2 rounded-xl w-full h-fit transition-all ${className}`}
    >
      <ImagePovi
        imgPath={imgPath && `https://image.tmdb.org/t/p/w500${imgPath}`}
        className={`aspect-video rounded-lg overflow-hidden w-full relative`}
      >
        {overlay && (
          <span
            className={`absolute top-0 left-0 m-2 p-1 px-2 text-sm font-medium bg-base-100 bg-opacity-[75%] backdrop-blur-sm rounded-full`}
          >
            {overlay}
          </span>
        )}
      </ImagePovi>

      <div className="flex flex-col gap-1 items-start w-full">
        <h3
          className="text-start line-clamp-1 lg:line-clamp-2 font-medium"
          title={title}
          style={{ textWrap: `balance` }}
        >
          {title}
        </h3>

        <div
          className={`flex items-center gap-1 text-xs text-gray-400 font-medium flex-wrap`}
        >
          {secondaryInfo}
        </div>

        {thirdInfo && (
          <div
            className={`flex items-center gap-1 text-xs text-gray-400 font-medium flex-wrap`}
          >
            {thirdInfo}
          </div>
        )}
      </div>
    </button>
  );
}
