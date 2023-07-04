import axios from "axios";
import React from "react";
import FilmBackdrop from "./components/FilmBackdrop";
import FilmPoster from "./components/FilmPoster";
import FilmOverview from "./components/FilmOverview";
import CastsList from "./components/CastsList";

async function getFilm(id, path) {
  const res = await axios.get(`${process.env.API_URL}/movie/${id}${path}`, {
    params: {
      api_key: process.env.API_KEY,
      language: "en",
    },
  });

  return res.data;
}

export default async function FilmDetail({ params }) {
  const { id } = params;

  const film = await getFilm(id);
  const credits = await getFilm(id, "/credits");
  const videos = await getFilm(id, "/videos");
  const images = await getFilm(id, "/images");
  const reviews = await getFilm(id, "/reviews");

  return (
    <>
      <div className="flex flex-col bg-base-dark-gray text-white">
        {/* Movie Background/Backdrop */}
        <FilmBackdrop film={film} />
        <div className="z-10 -mt-[10vh] md:-mt-[20vh] lg:-mt-[30vh] xl:-mt-[50vh]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-24 gap-4 px-4 pb-[2rem] md:pb-[5rem]">
            {/* Left */}
            <div className="lg:col-span-6">
              <FilmPoster film={film} />
            </div>
            {/* Middle */}
            <div className="lg:col-span-13">
              <FilmOverview
                film={film}
                videos={videos}
                images={images}
                reviews={reviews}
              />
            </div>
            {/* Right */}
            <div className="lg:col-span-5">
              {credits.cast.length > 0 && <CastsList credits={credits} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
