import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";

async function getFilms() {
  const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
    params: {
      api_key: process.env.API_KEY,
    },
  });

  return res.data;
}

export default async function HomeMovies() {
  const filmData = getFilms();

  const [films] = await Promise.all([filmData]);

  return (
    <>
      <h1 className="sr-only">{process.env.APP_NAME}</h1>
      <HomeSlider films={films} />
    </>
  );
}
