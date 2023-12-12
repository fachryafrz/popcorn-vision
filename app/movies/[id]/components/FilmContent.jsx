"use client";

import React, { useState } from "react";
import FilmPoster from "./FilmPoster";
import CastsList from "./CastsList";
import FilmInfo from "./FilmInfo";
import FilmOverview from "./FilmOverview";
import axios from "axios";
import FilmReviews from "./FilmReviews";
import FilmCollection from "./FilmCollection";
import ShareModal from "./ShareModal";
import { EpisodeModal } from "./EpisodeModal";
import PersonModal from "./PersonModal";

export default function FilmContent({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
  isTvPage,
}) {
  const [loading, setLoading] = useState(true);
  const [episodeModal, setEpisodeModal] = useState();
  const [personModal, setPersonModal] = useState();

  return (
    <div
      className={`z-10 mb-4 mt-[30%] md:mt-[200px]`}
      itemScope
      itemType={
        !isTvPage ? "http://schema.org/Movie" : "http://schema.org/TVSeries"
      }
    >
      <div
        className={`mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 lg:grid-cols-24 gap-4 px-4`}
      >
        {/* Poster */}
        <section className={`md:col-[1/4] lg:col-[1/7] lg:row-[1/3]`}>
          <div className={`flex h-full w-[50vw] md:w-auto mx-auto md:m-0`}>
            <FilmPoster film={film} />
          </div>
        </section>

        {/* Info */}
        <section className={`md:col-[4/13] lg:col-[7/20]`}>
          <FilmInfo
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            episodeModal={episodeModal}
            setEpisodeModal={setEpisodeModal}
            loading={loading}
            setLoading={setLoading}
            personModal={personModal}
            setPersonModal={setPersonModal}
          />
        </section>

        {/* Overview */}
        <section className={`md:col-[1/9] lg:col-[7/20]`}>
          <FilmOverview
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            episodeModal={episodeModal}
            setEpisodeModal={setEpisodeModal}
            loading={loading}
            setLoading={setLoading}
            personModal={personModal}
            setPersonModal={setPersonModal}
          />
        </section>

        {/* Collection */}
        {film.belongs_to_collection && (
          <section className={`md:col-[1/9] lg:col-[7/20]`}>
            <FilmCollection
              film={film}
              episodeModal={episodeModal}
              setEpisodeModal={setEpisodeModal}
              loading={loading}
              setLoading={setLoading}
            />
          </section>
        )}

        {/* Reviews */}
        {reviews.results.length > 0 && (
          <section className={`md:col-[1/9] lg:col-[7/20]`}>
            <FilmReviews reviews={reviews} film={film} />
          </section>
        )}

        {/* Misc */}
        <section className={`md:col-[1/9] lg:col-[7/20]`}>
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
        </section>

        {/* Casts & Credits */}
        <section
          className={`row-[4/5] md:row-[2/5] md:col-[9/13] lg:col-[20/25] lg:row-[1/3]`}
        >
          {credits.cast.length > 0 && (
            <CastsList
              credits={credits}
              episodeModal={episodeModal}
              personModal={personModal}
              setPersonModal={setPersonModal}
            />
          )}
        </section>
      </div>
    </div>
  );
}
