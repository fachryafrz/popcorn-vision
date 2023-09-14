/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";
import Link from "next/link";
import React from "react";
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";

export default function Trending({ film, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  const filmGenres =
    film.genre_ids && genres
      ? film.genre_ids.map((genreId) =>
          genres.find((genre) => genre.id === genreId)
        )
      : [];

  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;
  const date = new Date(releaseDate);
  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleString("en-US", options);

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl">
      <h2 className="sr-only">{`Trending Movie`}</h2>
      <div className="relative flex flex-col items-center md:flex-row gap-8 p-8 md:p-[3rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-black before:via-black before:via-30% before:opacity-[100%] before:invisible md:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t md:after:bg-gradient-to-r after:from-black">
        <figure className="absolute inset-0 z-0 md:left-[30%] blur-md md:blur-0">
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
            alt={film.title}
            className={`object-top`}
          />
        </figure>
        <figure className="z-30 max-w-[300px] aspect-poster rounded-2xl overflow-hidden">
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w780${film.poster_path}`}
            alt={film.title}
          />
        </figure>
        <div className="z-30 flex flex-col items-center text-center gap-2 md:max-w-[60%] lg:max-w-[50%] md:items-start md:text-start">
          <div className="hidden md:block">
            <TitleLogo film={film} />
          </div>

          <div className="flex gap-1 items-center font-medium">
            <IonIcon icon={star} className="text-primary-yellow text-xl" />
            <span>{film.vote_average.toFixed(1)}</span>
            <span>&bull;</span>
            <time>{date.getFullYear()}</time>
            {filmGenres &&
              filmGenres.slice(0, 1).map((genre) => {
                return (
                  <>
                    <span>&bull;</span>
                    <span key={genre.id}>{genre.name}</span>
                  </>
                );
              })}
          </div>

          <p className="line-clamp-3">{film.overview}</p>

          <Link
            href={isItTvPage(
              `/movies/${film.id}-${slugify(film.title)}`,
              `/tv/${film.id}-${slugify(film.name)}`
            )}
            className="btn bg-primary-yellow text-black mt-4"
          >
            <IonIcon
              icon={informationCircleOutline}
              className="!w-5 h-full aspect-square"
            />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
