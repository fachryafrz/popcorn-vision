/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";
import Link from "next/link";
import React from "react";
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";

export default function Trending({ film }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;
  const date = new Date(releaseDate);
  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleString("en-US", options);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <div className="px-4 xl:px-[9rem]">
      <h2 className="sr-only">{`Trending Movie`}</h2>
      <div className="relative flex flex-col items-center md:flex-row gap-8 p-8 md:p-[3rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-black before:via-black before:opacity-[70%] before:invisible md:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t md:after:bg-gradient-to-r after:from-black">
        <figure className="absolute inset-0 z-0 blur-md md:blur-md">
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w780${film.backdrop_path}`}
            alt={film.title}
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
          {/* <h3 className="font-bold text-2xl md:text-3xl">
          {film.title} (
          {new Date(
            film.release_date : film.first_air_date
          ).getFullYear()}
          )
        </h3> */}

          <div className="hidden md:block">
            <TitleLogo film={film.id} isItTvPage={isItTvPage} />
          </div>

          <div className="flex gap-2 items-center">
            <IonIcon icon={star} className="text-primary-yellow text-xl" />
            <span className="text-lg font-bold">
              {Math.round(film.vote_average * 10) / 10}
            </span>
            <span>&bull;</span>
            <time className="text-lg font-bold">{date.getFullYear()}</time>
          </div>

          <p className="line-clamp-4">{film.overview}</p>

          <Link
            href={isItTvPage(`/movies/${film.id}`, `/tv/${film.id}`)}
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
