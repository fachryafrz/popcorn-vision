/* eslint-disable @next/next/no-img-element */
"use client";

// React
import React from "react";
import { usePathname } from "next/navigation";

// Components
import TitleLogo from "@/app/components/TitleLogo";
import FilmMedia from "./FilmMedia";
import FilmCollection from "./FilmCollection";
import FilmReviews from "./FilmReviews";
import FilmPoster from "./FilmPoster";
import FilmInfo from "./FilmInfo";

// Swiper
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";

export default function FilmOverview({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <div className="flex flex-col gap-6 self-start w-full">
      <div className="flex gap-4 flex-col items-center md:items-stretch md:flex-row lg:gap-0">
        <div className="w-[50vw] md:w-[35vw] lg:hidden">
          <FilmPoster film={film} />
        </div>
        <div className="flex flex-col items-center md:justify-center md:items-start gap-2 md:gap-0 w-full">
          {images.logos.length > 0 ? (
            <>
              <TitleLogo film={film} images={images} />

              <h1
                title={isItTvPage(film.title, film.name)}
                className="sr-only"
                itemProp="name"
              >
                {isItTvPage(film.title, film.name)}
              </h1>
            </>
          ) : (
            <h1
              title={isItTvPage(film.title, film.name)}
              className="max-w-fit font-bold text-3xl lg:text-5xl line-clamp-3 md:py-2 !leading-tight text-center md:text-start"
              itemProp="name"
              style={{ textWrap: `balance` }}
            >
              {isItTvPage(film.title, film.name)}
            </h1>
          )}

          <FilmInfo
            film={film}
            credits={credits}
            providers={providers}
            isTvPage={isTvPage}
          />
        </div>
      </div>
      <div className="text-white flex flex-col gap-6">
        {film.overview && (
          <div id="overview" className="flex flex-col gap-2 ">
            <h2 className="font-bold text-xl text-white m-0">Overview</h2>

            <p className="text-gray-400 md:text-lg">{film.overview}</p>
          </div>
        )}

        {videos.results.length > 0 && images.backdrops.length > 0 && (
          <FilmMedia videos={videos} images={images.backdrops} />
        )}

        {!isTvPage ? (
          film.belongs_to_collection !== null && <FilmCollection film={film} />
        ) : (
          <FilmCollection film={film} />
        )}

        {reviews.results.length > 0 && (
          <FilmReviews reviews={reviews} film={film} />
        )}
      </div>
    </div>
  );
}
