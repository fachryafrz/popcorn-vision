import React, { useEffect, useState } from "react";
import TitleLogo from "./TitleLogo";
import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFilmSeason } from "../api/route";
import { slugify } from "../lib/slugify";

export default function FilmSummary({ film, genres, className, btnClass }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const [loading, setLoading] = useState(true);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);
  const date = new Date(releaseDate);
  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleString("en-US", options);

  const filmGenres =
    film.genre_ids && genres
      ? film.genre_ids.map((genreId) =>
          genres.find((genre) => genre.id === genreId)
        )
      : [];

  return (
    <div
      className={`flex flex-col items-center md:items-start gap-2 lg:gap-2 md:max-w-[50%] lg:max-w-[50%] p-4 h-full justify-end [&_*]:z-10 text-white ${className}`}
    >
      <TitleLogo film={film} />
      <div className="flex items-center justify-center flex-wrap gap-1 font-medium text-white">
        <div className="flex items-center gap-1 text-primary-yellow">
          <IonIcon icon={star} className="!w-5 h-full aspect-square" />
          <span className="!text-white">{film.vote_average.toFixed(1)}</span>
        </div>
        <span>&bull;</span>
        {!isTvPage ? (
          <div className="whitespace-nowrap flex items-center gap-1">
            <span>{date.getFullYear()}</span>
          </div>
        ) : (
          <FilmSeason film={film} setLoading={setLoading} loading={loading} />
        )}
        <span>&bull;</span>
        {filmGenres &&
          filmGenres.slice(0, 1).map((genre) => {
            return <span key={genre.id}>{genre.name}</span>;
          })}
      </div>
      <p className="hidden md:line-clamp-2 lg:line-clamp-3">
        {film.overview}
      </p>
      <div className={`grid md:grid-cols-2 gap-2 mt-4 w-full`}>
        <Link
          href={isItTvPage(
            `/movies/${film.id}-${slugify(film.title)}`,
            `/tv/${film.id}-${slugify(film.name)}`
          )}
          className={`btn btn-primary bg-opacity-40 border-none rounded-full hocus:bg-opacity-100 backdrop-blur ${btnClass}`}
        >
          <IonIcon
            icon={informationCircleOutline}
            className="!w-5 h-full aspect-square"
          />
          Details
        </Link>
      </div>
    </div>
  );
}

function FilmSeason({ film, setLoading, loading }) {
  const [season, setSeason] = useState();

  useEffect(() => {
    getFilmSeason({ film }).then((res) => {
      setSeason(res);
      setLoading(false);
    });
  }, [film, setLoading]);

  return season && !loading ? (
    <div className="whitespace-nowrap flex items-center gap-1">
      <span>{`${season} Season${season > 1 ? `s` : ``}`} </span>
    </div>
  ) : (
    <div
      className={`h-[24px] w-[75px] animate-pulse bg-gray-400 bg-opacity-50 rounded-lg`}
    ></div>
  );
}
