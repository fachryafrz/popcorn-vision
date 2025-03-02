"use client";

import { useCallback } from "react";
import TitleLogo from "./TitleLogo";
import { IonIcon } from "@ionic/react";
import { chevronForward, star } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatRuntime } from "../../lib/formatRuntime";
import { formatRating } from "@/lib/formatRating";
import slug from "slug";
import pluralize from "pluralize";

export default function FilmSummary({
  film,
  className,
  btnClass,
  showButton = true,
  clampDescription = true,
}) {
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
      className={`flex h-full flex-col items-center justify-end gap-2 text-white md:max-w-[50%] md:items-start lg:max-w-[40%] lg:gap-2 ${className ? className : ``}`}
    >
      <TitleLogo
        film={film}
        images={film.images?.logos.find((img) => img.iso_639_1 === "en")}
      />
      <div className="flex flex-wrap items-center justify-center gap-1 font-medium text-white">
        {film.vote_average > 0 && (
          <Link
            href={`${!isTvPage ? `/search` : `/tv/search`}?rating=${formatRating(film.vote_average)}..10`}
            prefetch={false}
            className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-3 text-primary-yellow backdrop-blur-sm transition-all hocus:bg-opacity-50"
          >
            <IonIcon
              icon={star}
              style={{
                fontSize: 20,
              }}
            />
            <span className="!text-white">
              {formatRating(film.vote_average)}
            </span>
          </Link>
        )}

        {!isTvPage && !!film.runtime && <FilmRuntime film={film} />}

        {isTvPage && film.number_of_seasons && <FilmSeason film={film} />}

        {film.genres?.slice(0, 1).map(
          (genre) =>
            genre && (
              <Link
                key={genre.id}
                href={
                  !isTvPage
                    ? `/search?with_genres=${genre.id}`
                    : `/tv/search?with_genres=${genre.id}`
                }
                prefetch={false}
                className={`block rounded-full bg-secondary bg-opacity-20 p-1 px-3 backdrop-blur-sm transition-all hocus:bg-opacity-50`}
              >
                {genre.name}
              </Link>
            ),
        )}
      </div>

      <p
        aria-hidden
        className={
          clampDescription ? "hidden md:line-clamp-2 lg:line-clamp-3" : ""
        }
      >
        {film.overview}
      </p>

      {showButton && (
        <div className={`mt-4 grid w-full gap-2 md:grid-cols-2`}>
          <Link
            href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
            prefetch={false}
            className={`btn btn-primary rounded-full border-none bg-opacity-40 backdrop-blur hocus:bg-opacity-100 ${btnClass}`}
          >
            Details
            <IonIcon
              icon={chevronForward}
              style={{
                fontSize: 16,
              }}
            />
          </Link>
        </div>
      )}
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
        {pluralize("Season", season, true)}
      </span>
    </div>
  );
}

function FilmRuntime({ film }) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/search?with_runtime=${film.runtime}..300`}
        prefetch={false}
        className={`block rounded-full bg-secondary bg-opacity-20 p-1 px-3 backdrop-blur-sm transition-all hocus:bg-opacity-50`}
      >
        {`${formatRuntime(film.runtime)}`}{" "}
      </Link>
    </div>
  );
}
