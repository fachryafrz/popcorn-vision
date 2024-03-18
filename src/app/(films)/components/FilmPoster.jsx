/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ImagePovi from "@/components/Film/ImagePovi";
import { slugify } from "@/lib/slugify";
import Reveal from "@/components/Layout/Reveal";

// Redux Toolkit
import { useSelector, useDispatch } from "react-redux";
import { setSeasonPoster } from "@/redux/slices/seasonPosterSlice";
import { formatRating } from "@/lib/formatRating";

export default function FilmPoster({ film, videos, images, reviews }) {
  const dispatch = useDispatch();

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const seasonPoster = useSelector((state) => state.seasonPoster.value);

  const [filmPoster, setFilmPoster] = useState(film.poster_path);
  const [quickNav, setQuickNav] = useState([]);

  useEffect(() => {
    dispatch(setSeasonPoster(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seasonPoster) {
      setFilmPoster(seasonPoster.poster_path);
    } else {
      setFilmPoster(film.poster_path);
    }
  }, [film, seasonPoster]);

  useEffect(() => {
    const isWindowAvailable = typeof window !== "undefined";
    if (!isWindowAvailable) return;

    // NOTE: Can't use window.location.href
    const currentURL = `/${!isTvPage ? `movies` : `tv`}/${film.id}-${slugify(
      !isTvPage ? film.title : film.name,
    )}`;

    if (film.overview) {
      setQuickNav([
        {
          name: "Overview",
          href: `${currentURL}#overview`,
        },
      ]);
    }

    if (videos.results.length || images.backdrops.length) {
      setQuickNav((prev) => [
        ...prev,
        {
          name: "Media",
          href: `${currentURL}#media`,
        },
      ]);
    }

    if (film.belongs_to_collection) {
      setQuickNav((prev) => [
        ...prev,
        {
          name: "Collection",
          href: `${currentURL}#collections`,
        },
      ]);
    }

    if (reviews.results.length) {
      setQuickNav((prev) => [
        ...prev,
        {
          name: "Reviews",
          href: `${currentURL}#reviews`,
        },
      ]);
    }
  }, [film, images, isTvPage, reviews, videos]);

  return (
    <Reveal key={filmPoster} y={0} className={`w-full`}>
      <div className="sticky top-20 flex w-full flex-col gap-4">
        <ImagePovi
          imgPath={filmPoster && `https://image.tmdb.org/t/p/w45${filmPoster}`}
          className={`relative aspect-poster w-full self-start overflow-hidden rounded-xl bg-base-100 shadow-xl`}
        >
          {filmPoster && (
            <img
              src={`https://image.tmdb.org/t/p/w500${filmPoster}`}
              alt={!isTvPage ? film.title : film.name}
              className={`pointer-events-none object-cover transition-all`}
            />
          )}

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
                  "--size": "36px",
                  "--thickness": "3px",
                }}
              >
                <span className={`text-white`}>
                  {formatRating(film.vote_average)}
                </span>
              </div>
            </div>
          )}
        </ImagePovi>

        {/* {quickNav.length && (
          <ul className={`hidden lg:flex gap-1 flex-wrap`}>
            {quickNav.map((link, i) => {
              return (
                <li key={i}>
                  <Link href={link.href} className={`btn btn-sm`}>{link.name}</Link>
                </li>
              );
            })}
          </ul>
        )} */}
      </div>
    </Reveal>
  );
}
