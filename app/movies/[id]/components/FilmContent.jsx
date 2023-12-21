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
        className={`mx-auto max-w-none grid grid-cols-1 md:grid-cols-12 lg:grid-cols-24 gap-4 px-4`}
        style={{
          gridTemplateRows: `auto [lastline]`,
        }}
      >
        {/* Poster */}
        <section className={`md:col-[1/4] lg:col-[1/6] lg:row-[1/3]`}>
          <div className={`flex h-full w-[50vw] md:w-auto mx-auto md:m-0`}>
            <FilmPoster film={film} />
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
            episodeModal={episodeModal}
            setEpisodeModal={setEpisodeModal}
            loading={loading}
            setLoading={setLoading}
            personModal={personModal}
            setPersonModal={setPersonModal}
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
            episodeModal={episodeModal}
            setEpisodeModal={setEpisodeModal}
            loading={loading}
            setLoading={setLoading}
            personModal={personModal}
            setPersonModal={setPersonModal}
          />
        </section>

        {/* Casts & Credits */}
        <section
          className={`md:row-[2/5] md:col-[9/13] lg:col-[20/25] lg:row-[1/3]`}
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
