/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ImagePovi from "@/components/Film/ImagePovi";

// Zustand
import { formatRating } from "@/lib/formatRating";
import { useSeasonPoster } from "@/zustand/seasonPoster";
import slug from "slug";

export default function FilmPoster({ film, videos, images, reviews }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const { poster: seasonPoster, setSeasonPoster } = useSeasonPoster();

  const [filmPoster] = seasonPoster;
  const [quickNav, setQuickNav] = useState([]);

  useEffect(() => {
    setSeasonPoster(() => [film.poster_path]); // Zustand
  }, [pathname]);

  useEffect(() => {
    const isWindowAvailable = typeof window !== "undefined";
    if (!isWindowAvailable) return;

    // NOTE: Can't use window.location.href
    const currentURL = `/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(
      film.title ?? film.name,
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
    <div className="sticky top-20 h-fit flex-1">
      <ImagePovi
        imgPath={filmPoster ?? film.poster_path}
        className={`relative mx-auto aspect-poster w-[60svw] self-start overflow-hidden rounded-xl bg-base-100 shadow-xl md:w-auto`}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${filmPoster ?? film.poster_path}`}
          alt={!isTvPage ? film.title : film.name}
          className={`object-cover transition-all`}
          draggable={false}
          width={300}
          height={450}
        />

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

      {/* {film.status !== "Released" && film.status !== "Returning Series" && (
          <span
            className={`btn pointer-events-none rounded-full border-transparent bg-primary-blue bg-opacity-10 text-primary-blue backdrop-blur-sm`}
          >
            {film.status !== "Canceled" &&
              film.status !== "Ended" &&
              film.status !== "Pilot" && (
                <span className="loading loading-infinity w-[2rem]"></span>
              )}

            {film.status}
          </span>
        )} */}

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
  );
}
