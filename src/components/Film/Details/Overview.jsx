/* eslint-disable @next/next/no-img-element */
"use client";

// React
import React from "react";
import { usePathname } from "next/navigation";

// Components
import FilmMedia from "./Media";
import FilmCollection from "./Collection";
import FilmReviews from "./Reviews";

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
  collection,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-col gap-6 text-white">
        {film.overview && (
          <div id="overview" className="flex flex-col gap-2 ">
            <h2 className="m-0 text-xl font-bold text-white">Overview</h2>
            <p className="text-gray-400 md:text-lg">{film.overview}</p>
          </div>
        )}

        {videos.results.length > 0 && images.backdrops.length > 0 && (
          <FilmMedia film={film} videos={videos} images={images.backdrops} />
        )}
      </div>

      {/* Collection */}
      {(isTvPage || film.belongs_to_collection) && (
        <FilmCollection film={film} collection={collection} />
      )}

      {/* Reviews */}
      {reviews.results.length > 0 && (
        <section className={`md:col-[1/9] lg:col-[7/20]`}>
          <FilmReviews reviews={reviews} film={film} />
        </section>
      )}
    </div>
  );
}
