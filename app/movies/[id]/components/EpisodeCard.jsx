/* eslint-disable @next/next/no-img-element */
import { getEpisodeModal } from "@/app/api/route";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import React from "react";

export default function EpisodeCard({
  className,
  episode,
  imgPath,
  title,
  secondaryInfo,
  thirdInfo,
  setEpisodeModal,
  setLoading,
  filmID,
  overlay,
}) {
  return (
    <button
      onClick={() => {
        getEpisodeModal({
          filmID,
          season: episode.season_number,
          eps: episode.episode_number,
        }).then((res) => {
          setEpisodeModal(res);
          setLoading(false);

          setTimeout(() => {
            document.getElementById(`episodeModal`).scrollTo(0, 0);
            document.getElementById(`episodeModal`).showModal();
          }, 100);
        });
      }}
      className={`flex flex-col items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full h-full transition-all ${className}`}
    >
      <figure className="aspect-video rounded-lg overflow-hidden w-full relative">
        {imgPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${imgPath}`}
            alt={title}
            className={`pointer-events-none`}
          />
        ) : (
          <div className={`bg-base-100 w-full h-full grid place-items-center`}>
            <div
              style={{
                background: `url(/popcorn.png)`,
                backgroundSize: `contain`,
              }}
              className={`aspect-square h-full`}
            ></div>
          </div>
        )}

        {overlay && (
          <span
            className={`absolute top-0 left-0 m-2 p-1 px-2 text-sm font-medium bg-base-100 bg-opacity-[75%] backdrop-blur-sm rounded-full`}
          >
            {overlay}
          </span>
        )}
      </figure>
      <div className="flex flex-col gap-1 items-start w-full">
        <h3
          className="text-start line-clamp-1 lg:line-clamp-2 font-medium"
          title={title}
          style={{ textWrap: `balance` }}
        >
          {title}
        </h3>

        <div
          className={`flex items-center gap-1 text-xs text-gray-400 font-medium`}
        >
          {secondaryInfo}
        </div>

        {thirdInfo && (
          <div
            className={`flex items-center gap-1 text-xs text-gray-400 font-medium`}
          >
            {thirdInfo}
          </div>
        )}
      </div>
    </button>
  );
}
