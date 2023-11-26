/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export default function FilmPoster({ film }) {
  let popcorn = `url(/popcorn.png)`;
  let filmPoster = `url(https://image.tmdb.org/t/p/w500${film.poster_path})`;

  return (
    <div className="sticky top-20 flex flex-col gap-4 h-fit w-full">
      <figure
        className={`aspect-poster rounded-xl overflow-hidden self-start shadow-xl relative w-full`}
        style={{
          backgroundImage: film.poster_path === null ? popcorn : filmPoster,
          backgroundSize: `cover`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `center`,
        }}
      >
        {film.vote_average > 0 && (
          <div
            className={`absolute top-0 left-0 m-2 p-1 bg-base-100 bg-opacity-50 backdrop-blur-sm rounded-full`}
          >
            <div
              className={`radial-progress text-sm font-semibold ${
                film.vote_average > 0 && film.vote_average < 3
                  ? `text-primary-red`
                  : film.vote_average >= 3 && film.vote_average < 7
                  ? `text-primary-yellow`
                  : `text-green-500`
              }`}
              style={{
                "--value": film.vote_average * 10,
                "--size": "36px",
                "--thickness": "3px",
              }}
            >
              <span className={`text-white`}>
                {film.vote_average < 9.9
                  ? film.vote_average.toFixed(1)
                  : film.vote_average}
              </span>
            </div>
          </div>
        )}
      </figure>
    </div>
  );
}
