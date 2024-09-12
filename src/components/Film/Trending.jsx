/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FilmSummary from "./Summary";
import Reveal from "../Layout/Reveal";
import ImagePovi from "./ImagePovi";
import { axios } from "@/lib/axios";

export default function Trending({ film, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const [filmDetails, setFilmDetails] = useState();

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage],
  );

  const filmTitle = !isTvPage ? film.title : film.name;
  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;

  const fetchFilmDetails = useCallback(async () => {
    await axios(`/${isItTvPage(`movie`, `tv`)}/${film.id}`, {
      params: { append_to_response: `images` },
    });
  }, [film, isItTvPage]);

  useEffect(() => {
    fetchFilmDetails();
  }, [fetchFilmDetails]);

  return (
    <div className="mx-auto max-w-7xl md:px-4">
      <h2 className="sr-only">{`Trending Movie`}</h2>
      {/* <Reveal> */}
      <div className="relative flex flex-col items-center gap-8 overflow-hidden p-8 before:invisible before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-black before:via-black before:via-30% before:opacity-[100%] after:absolute after:inset-0 after:z-20 after:bg-gradient-to-t after:from-black md:flex-row md:rounded-[3rem] md:p-[3rem] md:before:visible md:before:bg-gradient-to-r md:after:bg-gradient-to-r">
        {/* Backdrop */}
        <ImagePovi
          imgPath={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
          className={`absolute inset-0 z-0 blur-md md:left-[30%] md:blur-0`}
        />

        {/* Poster */}
        <Reveal
          y={0}
          className={`z-30 aspect-poster h-full w-full max-w-[300px] overflow-hidden rounded-2xl`}
        >
          <ImagePovi
            imgPath={
              film.poster_path &&
              `https://image.tmdb.org/t/p/w780${film.poster_path}`
            }
            className={`h-full`}
          />
        </Reveal>
        <div className="z-30 flex flex-col items-center gap-2 text-center md:max-w-[60%] md:items-start md:text-start lg:max-w-[50%]">
          {filmDetails && (
            <FilmSummary
              film={filmDetails}
              genres={genres}
              className={`!max-w-none`}
              btnClass={`btn-warning bg-opacity-[80%]`}
            />
          )}
        </div>
      </div>
      {/* </Reveal> */}
    </div>
  );
}
