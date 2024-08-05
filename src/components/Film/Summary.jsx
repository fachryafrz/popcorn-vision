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
import { formatRating } from "@/lib/formatRating";

export default function FilmSummary({ film, genres, className, btnClass }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage],
  );

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);

  return (
    <div
      className={`flex h-full flex-col items-center justify-end gap-2 text-white md:max-w-[50%] md:items-start lg:max-w-[40%] lg:gap-2 [&_*]:z-10 ${className}`}
    >
      <TitleLogo
        film={film}
        images={film.images?.logos.find((img) => img.iso_639_1 === "en")}
      />
      <div className="flex flex-wrap items-center justify-center gap-1 font-medium text-white">
        {film.vote_average > 0 && (
          <Reveal delay={0.1}>
            <Link
              href={`/search?vote_count=${film.vote_average.toFixed(1) * 10}..100`}
              className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-3 text-primary-yellow backdrop-blur-sm"
            >
              <IonIcon icon={star} className="aspect-square h-full !w-5" />
              <span className="!text-white">
                {formatRating(film.vote_average)}
              </span>
            </Link>
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
                <Link
                  href={
                    !isTvPage
                      ? `/search?with_genres=${genre.id}`
                      : `/tv/search?with_genres=${genre.id}`
                  }
                  className={`block rounded-full bg-secondary bg-opacity-20 p-1 px-3 backdrop-blur-sm`}
                >
                  {genre.name}
                </Link>
              </Reveal>
            ),
        )}
      </div>

      <Reveal delay={0.1}>
        <p className="hidden md:line-clamp-2 lg:line-clamp-3">
          {film.overview}
        </p>
      </Reveal>

      <div className={`mt-4 grid w-full gap-2 md:grid-cols-2`}>
        <Reveal delay={0.2} className={`[&_a]:w-full`}>
          <Link
            href={isItTvPage(
              `/movies/${film.id}-${slugify(film.title)}`,
              `/tv/${film.id}-${slugify(film.name)}`,
            )}
            className={`btn btn-primary rounded-full border-none bg-opacity-40 backdrop-blur hocus:bg-opacity-100 ${btnClass}`}
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
    <div className="flex items-center gap-1 whitespace-nowrap">
      <span
        className={`block rounded-full bg-secondary bg-opacity-20 p-1 px-3 backdrop-blur-sm`}
      >
        {`${season} ${isPlural({ text: "Season", number: season })}`}{" "}
      </span>
    </div>
  );
}

function FilmRuntime({ film }) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/search?with_runtime=${film.runtime}..300`}
        className={`block rounded-full bg-secondary bg-opacity-20 p-1 px-3 backdrop-blur-sm`}
      >
        {`${formatRuntime(film.runtime)}`}{" "}
      </Link>
    </div>
  );
}
