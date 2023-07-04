/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export default function FilmPoster({ film }) {
  return (
    <div className="hidden lg:flex flex-col gap-2 md:max-w-full self-start sticky top-20">
      <figure className="aspect-poster rounded-xl overflow-hidden shadow-2xl">
        <div
          className={
            film.poster_path === null
              ? `w-full h-full bg-base-dark-gray flex items-center`
              : `hidden`
          }
        >
          <img
            loading="lazy"
            src={`/popcorn.png`}
            alt={process.env.APP_NAME}
            className="object-contain w-fit h-fit"
          />
        </div>

        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
          alt={film.title}
        />
      </figure>
    </div>
  );
}
