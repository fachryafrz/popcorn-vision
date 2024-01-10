"use client";

import React, { useContext, useEffect, useState } from "react";
import FilmPoster from "./FilmPoster";
import CastsList from "./CastsList";
import FilmInfo from "./FilmInfo";
import FilmOverview from "./FilmOverview";
import ShareModal from "./ShareModal";
import { EpisodeModal } from "./EpisodeModal";
import PersonModal from "./PersonModal";
import { DetailsContext } from "../context";

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

  const { episodeModal, personModal } = useContext(DetailsContext);

  useEffect(() => {
    if (episodeModal) {
      // document.getElementById(`episodeModal`).scrollTo(0, 0);
      document.getElementById(`episodeModal`).showModal();
    }

    if (personModal) {
      if (episodeModal) document.getElementById(`episodeModal`).close();
      document.getElementById(`personModal`).scrollTo(0, 0);
      document.getElementById(`personModal`).showModal();
    }
  }, [personModal, episodeModal]);

  return (
    <div className={`z-10 mb-4 mt-[30%] md:mt-[200px]`}>
      <div
        className={`mx-auto max-w-none grid grid-cols-1 md:grid-cols-12 lg:grid-cols-24 gap-4 px-4`}
        style={{
          gridTemplateRows: `auto [lastline]`,
        }}
      >
        {/* Poster */}
        <section className={`md:col-[1/4] lg:col-[1/6] lg:row-[1/3]`}>
          <div className={`flex h-full w-[50vw] md:w-auto mx-auto md:m-0`}>
            <FilmPoster
              film={film}
              videos={videos}
              images={images}
              reviews={reviews}
            />
          </div>
        </section>

        {/* Info */}
        <section className={`md:col-[4/13] lg:col-[6/20]`}>
          <FilmInfo
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            loading={loading}
            setLoading={setLoading}
          />
        </section>

        {/* Overview */}
        <section className={`md:col-[1/9] lg:col-[6/20]`}>
          <FilmOverview
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            loading={loading}
            setLoading={setLoading}
          />
        </section>

        {/* Casts & Credits */}
        <section
          className={`md:row-[2/5] md:col-[9/13] lg:col-[20/25] lg:row-[1/3]`}
        >
          {credits.cast.length > 0 && <CastsList credits={credits} />}
        </section>

        {/* Misc */}
        <section className={`col-span-full`}>
          <ShareModal />

          {isTvPage && episodeModal && (
            <EpisodeModal
              episode={episodeModal}
              person={personModal}
              loading={loading}
            />
          )}

          {personModal && (
            <PersonModal
              person={personModal}
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
      </div>
    </div>
  );
}
