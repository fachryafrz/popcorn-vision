"use client";

import React, { useState } from "react";
import FilmPoster from "./FilmPoster";
import CastsList from "./CastsList";
import FilmInfo from "./FilmInfo";
import FilmOverview from "./FilmOverview";
import axios from "axios";

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
  const [episode, setEpisode] = useState();
  const [selectedPerson, setSelectedPerson] = useState();

  const fetchEpisodeModal = async (filmID, season, eps) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tv/${filmID}/season/${season}/episode/${eps}`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
      setLoading(false);
      setEpisode(data);
      setTimeout(() => {
        document.getElementById(`episodeModal`).scrollTo(0, 0);
        document.getElementById(`episodeModal`).showModal();
      }, 50);
    } catch (error) {
      console.error(`Errornya episode modal: ${error}`);
    }
  };

  const fetchPersonModal = async (personID) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/${personID}`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
      setLoading(false);
      setSelectedPerson(data);
      setTimeout(() => {
        if (episode) document.getElementById(`episodeModal`).close();
        document.getElementById(`personModal`).scrollTo(0, 0);
        document.getElementById(`personModal`).showModal();
      }, 50);
    } catch (error) {
      console.error(`Errornya episode modal: ${error}`);
    }
  };

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
            episode={episode}
            setEpisode={setEpisode}
            loading={loading}
            setLoading={setLoading}
            fetchEpisodeModal={fetchEpisodeModal}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            fetchPersonModal={fetchPersonModal}
          />
        </section>

        {/* Overview */}
        <section className={`md:col-[1/10] lg:col-[7/20]`}>
          <FilmOverview
            film={film}
            videos={videos}
            images={images}
            reviews={reviews}
            credits={credits}
            providers={providers}
            episode={episode}
            setEpisode={setEpisode}
            loading={loading}
            setLoading={setLoading}
            fetchEpisodeModal={fetchEpisodeModal}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            fetchPersonModal={fetchPersonModal}
          />
        </section>

        {/* Casts & Credits */}
        <section className={`md:col-[10/13] lg:col-[20/25] lg:row-[1/3]`}>
          {credits.cast.length > 0 && (
            <CastsList credits={credits} fetchPersonModal={fetchPersonModal} />
          )}
        </section>
      </div>
    </div>
  );
}
