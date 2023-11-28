"use client";

import React, { useState } from "react";
import FilmInfo from "./FilmInfo";
import FilmOverview from "./FilmOverview";
import axios from "axios";

export default function FilmInfoOverview({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
}) {
  const [episode, setEpisode] = useState([]);
  const [loading, setLoading] = useState(true);

  // const episodeModalRef = useRef();
  const fetchEpisodeModal = async (filmID, season, eps) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${filmID}/season/${season}/episode/${eps}`,
        {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        }
      );
      setLoading(false);
      setEpisode(res.data);
      document.getElementById(`episodeModal`).showModal();
    } catch (error) {
      console.error(`Errornya episode modal: ${error}`);
    }
  };

  return (
    <>
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
          loading={loading}
          fetchEpisodeModal={fetchEpisodeModal}
        />
      </section>
    </>
  );
}
