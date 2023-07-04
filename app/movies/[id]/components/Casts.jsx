/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Casts({ actor, showAllActors }) {
  return (
    <div className="flex flex-col lg:flex-row text-center lg:text-start gap-2 items-center lg:items-start min-w-[120px]">
      <figure className="!w-[50px] !h-[50px] aspect-square rounded-full overflow-hidden flex-shrink-0">
        <div
          className={
            actor.profile_path === null
              ? `w-full h-full bg-base-dark-gray`
              : `hidden`
          }
        >
          <img
            loading="lazy"
            src={`/popcorn.png`}
            alt={process.env.APP_NAME}
            className={`object-contain`}
          />
        </div>

        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={actor.name}
        />
      </figure>
      <div className="w-full self-center">
        <h3
          title={actor.name}
          className={`font-medium lg:line-clamp-1 ${
            showAllActors && `!line-clamp-none`
          }`}
        >
          {actor.name}
        </h3>

        {actor.character !== "" && (
          <>
            <p
              className={`text-sm text-gray-400 lg:line-clamp-1 max-w-[120px] lg:max-w-none mx-auto lg:mx-0 before:content-['as'] before:mr-1 ${
                showAllActors && `!line-clamp-none`
              }`}
            >
              <span title={actor.character}>{actor.character}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
