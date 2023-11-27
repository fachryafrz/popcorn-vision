/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function FilmPoster({ film }) {
  const pathname = usePathname();

  const isTvPage = (movie, tv) => {
    if (pathname.startsWith("/tv")) {
      return movie;
    } else {
      return tv;
    }
  };

  let popcorn = `/popcorn.png`;
  let filmPoster = `https://image.tmdb.org/t/p/w500${film.poster_path}`;

  return (
    <div className="sticky top-20 flex flex-col gap-4 h-fit w-full">
      <figure
        className={`aspect-poster rounded-xl overflow-hidden self-start shadow-xl relative w-full`}
        style={{
          backgroundImage: film.poster_path !== null ? filmPoster : `url(${popcorn})`,
          backgroundSize: film.poster_path === null ? `contain` : `cover` ,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `center`,
        }}
      >
        {film.poster_path !== null && (
          <img
            src={filmPoster}
            alt={isTvPage(film.title, film.name)}
            className={`pointer-events-none ${
              film.poster_path === null
                ? `object-contain bg-base-100`
                : `object-cover`
            }`}
          />
        )}

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
