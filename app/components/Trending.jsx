/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";
import axios from "axios";
import FilmSummary from "./FilmSummary";
import { getFilm } from "../api/route";
import Reveal from "../lib/Reveal";
import ImagePovi from "./ImagePovi";

export default function Trending({ film, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const [loading, setLoading] = useState(true);
  const [filmPoster, setFilmPoster] = useState(film.poster_path);

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

  const filmTitle = !isTvPage ? film.title : film.name;
  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;

  useEffect(() => {
    const fetchFilmPoster = async () => {
      await getFilm({
        id: film.id,
        type: !isTvPage ? `movie` : `tv`,
        path: "/images",
        params: {
          include_image_language: "null",
        },
      }).then((res) => {
        let { posters } = res;

        if (!posters.length) {
          setFilmPoster(film.poster_path);
        } else {
          setFilmPoster(posters[0].file_path);
        }
      });
    };

    // fetchFilmPoster();
  }, [film, isTvPage]);

  return (
    <div className="px-4 mx-auto max-w-7xl">
      <h2 className="sr-only">{`Trending Movie`}</h2>
      {/* <Reveal> */}
      <div className="relative flex flex-col items-center md:flex-row gap-8 p-8 md:p-[3rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-black before:via-black before:via-30% before:opacity-[100%] before:invisible md:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t md:after:bg-gradient-to-r after:from-black">
        {/* Backdrop */}
        <ImagePovi
          imgPath={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
          className={`absolute inset-0 z-0 md:left-[30%] blur-md md:blur-0`}
        />

        {/* Poster */}
        <Reveal
          y={0}
          className={`h-full z-30 w-full sm:w-[300px] aspect-poster rounded-2xl overflow-hidden`}
        >
          <ImagePovi
            imgPath={
              film.poster_path &&
              `https://image.tmdb.org/t/p/w780${film.poster_path}`
            }
            className={`h-full`}
          />
        </Reveal>
        <div className="z-30 flex flex-col items-center text-center gap-2 md:max-w-[60%] lg:max-w-[50%] md:items-start md:text-start">
          <FilmSummary
            film={film}
            genres={genres}
            className={`!max-w-none`}
            btnClass={`btn-warning bg-opacity-[80%]`}
          />
        </div>
      </div>
      {/* </Reveal> */}
    </div>
  );
}
