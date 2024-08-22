/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { slugify } from "../../lib/slugify";
import ImagePovi from "./ImagePovi";
import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import { motion as m } from "framer-motion";
import { formatRuntime } from "../../lib/formatRuntime";
import Reveal from "../Layout/Reveal";
import { isPlural } from "../../lib/isPlural";
import debounce from "debounce";
import { formatRating } from "@/lib/formatRating";

export default function FilmCard({ film, isTvPage }) {
  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;
  const options = { year: "numeric", month: "short" };

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = debounce(() => setIsHovering(true), 250);
  const handleMouseLeave = () => {
    setIsHovering(false);
    handleMouseOver.clear();
  };

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  useEffect(() => {
    setIsHovering(false);
  }, []);

  return (
    <Link
      id="FilmCard"
      href={isItTvPage(
        `/movies/${film.id}-${slugify(film.title)}`,
        `/tv/${film.id}-${slugify(film.name)}`,
      )}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`relative`}
    >
      <ImagePovi
        imgPath={
          film.poster_path &&
          `https://image.tmdb.org/t/p/w300${film.poster_path}`
        }
        className={`relative aspect-poster overflow-hidden rounded-xl`}
      >
        {film.vote_average > 0 && (
          <div
            className={`absolute left-0 top-0 m-2 rounded-full bg-base-100 bg-opacity-50 p-1 backdrop-blur-sm`}
          >
            <div
              className={`radial-progress text-sm font-semibold ${
                film.vote_average > 0 && film.vote_average < 3
                  ? `text-primary-red`
                  : film.vote_average >= 3 && film.vote_average < 7
                    ? `text-primary-yellow`
                    : `text-green-500`
              }`}
              style={{
                "--value": film.vote_average * 10,
                "--size": "30px",
                "--thickness": "3px",
              }}
            >
              <span
                className={`after-content text-xs text-white`}
                data-after-content={formatRating(film.vote_average)}
              />
            </div>
          </div>
        )}
      </ImagePovi>

      <h3 className={`sr-only`}>{isItTvPage(film.title, film.name)}</h3>

      <FilmPreview
        film={film}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        isTvPage={isTvPage}
      />
    </Link>
  );
}

function FilmPreview({ film, genres, isHovering, isTvPage }) {
  const [loading, setLoading] = useState(true);
  const [titleLogo, setTitleLogo] = useState();
  const [filmDetails, setFilmDetails] = useState();
  const [releaseDate, setReleaseDate] = useState();
  const [filmRuntime, setFilmRuntime] = useState();

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage],
  );

  const fetchTitleLogo = useCallback(async () => {
    await fetchData({
      endpoint: `/${isItTvPage(`movie`, `tv`)}/${film.id}`,
      queryParams: {
        append_to_response: "images",
      },
    }).then((res) => {
      const { images } = res;
      setTitleLogo(images.logos.find((img) => img.iso_639_1 === "en"));
      setFilmDetails(res);
      setReleaseDate(isItTvPage(res.release_date, res.first_air_date));
      setFilmRuntime(isItTvPage(res.runtime, res.episode_run_time));
      setLoading(false);
    });
  }, [film, isItTvPage]);

  useEffect(() => {
    if (isHovering && window.innerWidth >= 1280) {
      fetchTitleLogo();
    }
  }, [fetchTitleLogo, isHovering]);

  return (
    !loading && (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        // transition={{ delay: isHovering ? 0.5 : 0 }}
        exit={{ opacity: 0 }}
        id="FilmPreview"
        className={`absolute left-1/2 top-1/2 z-[60] hidden w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-base-100 shadow-[rgba(0,0,0,0.5)_0px_2px_16px_0px] xl:block ${
          isHovering ? `pointer-events-auto` : `pointer-events-none`
        }`}
      >
        {/* Backdrop */}
        <ImagePovi
          imgPath={
            film.backdrop_path &&
            `https://image.tmdb.org/t/p/w92${film.backdrop_path}`
          }
          className={`relative z-0 aspect-[4/3] overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
        >
          {film.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/w780${film.backdrop_path}`}
              alt={isItTvPage(film.title, film.name)}
              className={`object-cover`}
              draggable={false}
              loading="lazy"
            />
          )}
        </ImagePovi>

        <div
          key={isHovering}
          className={`relative z-10 -mt-[75px] flex flex-col gap-2 p-3 pb-4`}
        >
          {/* Logo */}
          <section id="Logo" className={`flex h-[75px] items-end`}>
            {/* Logo Image */}
            {!loading && titleLogo && (
              <Reveal className={`h-full`} delay={0.1}>
                <figure className={`h-full`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w185${titleLogo.file_path}`}
                    alt={isItTvPage(film.title, film.name)}
                    title={isItTvPage(film.title, film.name)}
                    className={`max-w-[200px] object-contain`}
                    draggable={false}
                    loading="lazy"
                  />
                </figure>
              </Reveal>
            )}

            {/* Logo Text */}
            {!loading && !titleLogo && (
              <Reveal>
                <span
                  className={`before-content line-clamp-2 text-xl font-bold`}
                  style={{ textWrap: `balance` }}
                  data-before-content={isItTvPage(film.title, film.name)}
                />
              </Reveal>
            )}
          </section>

          {/* Info */}
          <section className="flex flex-wrap items-center gap-0.5 text-xs font-medium">
            {/* Rating */}
            {film.vote_average > 0 && !loading && (
              <Reveal delay={0.1}>
                <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 text-primary-yellow backdrop-blur-sm">
                  <IonIcon icon={star} className="" />
                  <span
                    className="before-content !text-white"
                    data-before-content={formatRating(film.vote_average)}
                  />
                </div>
              </Reveal>
            )}

            {/* Runtime */}
            {!isTvPage && filmRuntime > 0 && !loading && (
              <Reveal delay={0.15}>
                <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                  <span
                    className="before-content !text-white"
                    data-before-content={formatRuntime(filmRuntime)}
                  />
                </div>
              </Reveal>
            )}

            {/* Seasons */}
            {isTvPage && filmDetails?.number_of_seasons > 0 && !loading && (
              <Reveal delay={0.2}>
                <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                  <span
                    className="before-content !text-white"
                    data-before-content={`${filmDetails.number_of_seasons} ${isPlural(
                      {
                        text: `Season`,
                        number: filmDetails.number_of_seasons,
                      },
                    )}`}
                  />
                </div>
              </Reveal>
            )}

            {/* Genres */}
            {filmDetails?.genres.length > 0 && !loading && (
              <Reveal delay={0.25}>
                <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                  <span
                    className="before-content !text-white"
                    data-before-content={filmDetails?.genres[0]?.name}
                  />
                </div>
              </Reveal>
            )}
          </section>

          {/* Overview */}
          <section id="Overview">
            {!loading && film.overview ? (
              <Reveal delay={0.1}>
                <span
                  className={`before-content line-clamp-3 text-sm font-medium text-gray-400`}
                  data-before-content={film.overview}
                />
              </Reveal>
            ) : (
              <Reveal delay={0.1}>
                <span
                  className={`before-content line-clamp-4 text-sm font-medium text-gray-400`}
                  data-before-content={`No info.`}
                />
              </Reveal>
            )}
          </section>
        </div>
      </m.div>
    )
  );
}
