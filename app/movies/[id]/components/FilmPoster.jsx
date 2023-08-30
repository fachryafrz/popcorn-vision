/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import React from "react";

export default function FilmPoster({ film }) {
  return (
    <div className="hidden lg:flex flex-col gap-4 md:max-w-full self-start sticky top-20">
      <figure className="aspect-poster rounded-xl overflow-hidden shadow-2xl relative">
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

        <Image
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
          alt={film.title}
          width={500}
          height={500}
        />

        {film.vote_average > 0 && (
          <div
            className={`absolute top-0 left-0 font-semibold aspect-square grid place-items-center rounded-full border-2 w-11 m-2 bg-base-dark-gray bg-opacity-50 backdrop-blur-sm ${
              film.vote_average >= 1 && film.vote_average <= 3
                ? `border-primary-red`
                : film.vote_average >= 4 && film.vote_average <= 7
                ? `border-primary-yellow`
                : `border-green-500`
            }`}
          >
            {film.vote_average < 9.9
              ? film.vote_average.toFixed(1)
              : film.vote_average}
          </div>
        )}
      </figure>

      <div className={`grid grid-cols-2 gap-4`}>
        {film.production_companies.map(
          (item) =>
            item.logo_path !== null && (
              <Image
                key={item.id}
                src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                alt={item.name}
                title={item.name}
                className={`object-contain h-[50px] inline grayscale invert hover:grayscale-0 hover:invert-0 transition-all`}
                width={500}
                height={500}
              />
            )
        )}
      </div>
    </div>
  );
}
