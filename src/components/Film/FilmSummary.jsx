import React, { useCallback, useEffect, useState } from "react";
import TitleLogo from "./TitleLogo";
import { IonIcon } from "@ionic/react";
import { chevronForward, star } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchData, getFilmSeason } from "@/lib/fetch";
import { slugify } from "../../lib/slugify";
import { formatRuntime } from "../../lib/formatRuntime";
import { isPlural } from "../../lib/isPlural";
import Reveal from "../Layout/Reveal";

export default function FilmSummary({ film, genres, className, btnClass }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage]
  );

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);

  const filmGenres =
    film.genre_ids && genres
      ? film.genre_ids.map((genreId) =>
          genres.find((genre) => genre.id === genreId)
        )
      : [];

  return (
    <div
      className={`flex flex-col items-center md:items-start gap-2 lg:gap-2 md:max-w-[50%] lg:max-w-[40%] h-full justify-end [&_*]:z-10 text-white ${className}`}
    >
      <TitleLogo
        film={film}
        images={film.images?.logos.find((img) => img.iso_639_1 === "en")}
      />
      <div className="flex items-center justify-center flex-wrap gap-1 font-medium text-white">
        {film.vote_average > 0 && (
          <Reveal delay={0.1}>
            <div className="flex items-center gap-1 text-primary-yellow p-1 px-3 rounded-full bg-secondary bg-opacity-20 backdrop-blur-sm">
              <IonIcon icon={star} className="!w-5 h-full aspect-square" />
              <span className="!text-white">
                {film.vote_average.toFixed(1)}
              </span>
            </div>
          </Reveal>
        )}

        {!isTvPage ? (
          <Reveal delay={0.2}>
            <FilmRuntime film={film} />
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <FilmSeason film={film} />
          </Reveal>
        )}

        {film.genres?.slice(0, 1).map(
          (genre) =>
            genre && (
              <Reveal key={genre.id} delay={0.3}>
                <span
                  className={`block p-1 px-3 rounded-full bg-secondary bg-opacity-20 backdrop-blur-sm`}
                >
                  {genre.name}
                </span>
              </Reveal>
            )
        )}
      </div>

      <Reveal delay={0.1}>
        <p className="hidden md:line-clamp-2 lg:line-clamp-3">
          {film.overview}
        </p>
      </Reveal>

      <div className={`grid md:grid-cols-2 gap-2 mt-4 w-full`}>
        <Reveal delay={0.2} className={`[&_a]:w-full`}>
          <Link
            href={isItTvPage(
              `/movies/${film.id}-${slugify(film.title)}`,
              `/tv/${film.id}-${slugify(film.name)}`
            )}
            className={`btn btn-primary bg-opacity-40 border-none rounded-full hocus:bg-opacity-100 backdrop-blur ${btnClass}`}
          >
            Details
            <IonIcon
              icon={chevronForward}
              className="aspect-square text-base"
            />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

function FilmSeason({ film }) {
  const season = film.number_of_seasons;

  return (
    <div className="whitespace-nowrap flex items-center gap-1">
      <span
        className={`block p-1 px-3 rounded-full bg-secondary bg-opacity-20 backdrop-blur-sm`}
      >
        {`${season} ${isPlural({ text: "Season", number: season })}`}{" "}
      </span>
    </div>
  );
}

function FilmRuntime({ film }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`block p-1 px-3 rounded-full bg-secondary bg-opacity-20 backdrop-blur-sm`}
      >
        {`${formatRuntime(film.runtime)}`}{" "}
      </span>
    </div>
  );
}