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
import { EpisodeModal } from "./EpisodeModal";
import PersonModal from "./PersonModal";
import ShareModal from "./ShareModal";

export default function FilmOverview({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
  episodeModal,
  setEpisodeModal,
  loading,
  setLoading,
  selectedPerson,
  setSelectedPerson,
  personModal,
  setPersonModal,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
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
        <FilmCollection
          film={film}
          episodeModal={episodeModal}
          setEpisodeModal={setEpisodeModal}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {reviews.results.length > 0 && (
        <FilmReviews reviews={reviews} film={film} />
      )}

      <ShareModal />

      {isTvPage && episodeModal && (
        <EpisodeModal
          episode={episodeModal}
          setEpisodeModal={setEpisodeModal}
          person={personModal}
          setPersonModal={setPersonModal}
          loading={loading}
        />
      )}

      {personModal && (
        <PersonModal
          person={personModal}
          setPersonModal={setPersonModal}
          loading={loading}
          episode={episodeModal}
        />
      )}

      <div
        role={`alert`}
        id={`featureNotAvailable`}
        className={`alert alert-error flex fixed w-[calc(100%-2rem)] sm:w-fit z-50 right-4 bottom-4 transition-all`}
        style={{
          transform: `translateY(calc(100% + 1rem))`,
        }}
      >
        <button
          onClick={() => {
            const alert = document.getElementById(`featureNotAvailable`);
            alert.style.transform = `translateY(calc(100% + 1rem))`;
          }}
        >
          <svg
            xmlns={`http://www.w3.org/2000/svg`}
            className={`stroke-current shrink-0 h-6 w-6`}
            fill={`none`}
            viewBox={`0 0 24 24`}
          >
            <path
              strokeLinecap={`round`}
              strokeLinejoin={`round`}
              strokeWidth={`2`}
              d={`M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z`}
            />
          </svg>
        </button>
        <span>Sorry! Feature not yet available.</span>
      </div>
    </div>
  );
}
