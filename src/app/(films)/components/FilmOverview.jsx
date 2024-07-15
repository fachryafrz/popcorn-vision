/* eslint-disable @next/next/no-img-element */
"use client";

// React
import React from "react";
import { usePathname } from "next/navigation";

// Components
import FilmMedia from "./FilmMedia";
import FilmCollection from "./FilmCollection";
import FilmReviews from "./FilmReviews";

// Swiper
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import Reveal from "@/components/Layout/Reveal";

export default function FilmOverview({
  film,
  videos,
  images,
  reviews,
  collection,
  loading,
  setLoading,
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
            <Reveal>
              <h2 className="m-0 text-xl font-bold text-white">Overview</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-gray-400 md:text-lg">{film.overview}</p>
            </Reveal>
          </div>
        )}

        {videos.results.length > 0 && images.backdrops.length > 0 && (
          <FilmMedia videos={videos} images={images.backdrops} />
        )}
      </div>

      {/* Collection */}
      {isTvPage || film.belongs_to_collection !== null ? (
        <FilmCollection
          film={film}
          loading={loading}
          setLoading={setLoading}
          collection={collection}
        />
      ) : null}

      {/* Reviews */}
      {reviews.results.length > 0 && (
        <section className={`md:col-[1/9] lg:col-[7/20]`}>
          <FilmReviews reviews={reviews} film={film} />
        </section>
      )}
    </div>
  );
}
