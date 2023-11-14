/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function FilmPoster({ film }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  
  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };
  
  return (
    <div className="sticky top-20 flex flex-col gap-1 h-fit">
      <figure className="aspect-poster rounded-xl overflow-hidden self-start shadow-xl relative">
        <div
          className={
            film.poster_path === null ? `w-full h-full bg-base-100` : `hidden`
          }
        >
          <img
            loading="lazy"
            src={`/popcorn.png`}
            alt={process.env.APP_NAME}
            className="object-contain"
          />
        </div>

        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
          alt={isItTvPage(film.title, film.name)}
          className={film.poster_path === null ? `hidden` : `block`}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w92${film.poster_path})`,
          }}
        />

        {/* {film.vote_average > 0 && (
                  <div
                    className={`absolute top-0 left-0 text-xs font-semibold aspect-square grid place-items-center rounded-full border-2 w-9 m-2 bg-base-100 bg-opacity-50 backdrop-blur-sm ${
                      film.vote_average >= 1 && film.vote_average <= 3
                        ? `border-primary-red`
                        : film.vote_average >= 4 && film.vote_average <= 7
                        ? `border-primary-yellow`
                        : `border-green-500`
                    }`}
                  >
                    {film.vote_average.toFixed(1)}
                  </div>
                )} */}

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
