import React from "react";
import { Helmet } from "react-helmet";

// Components
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";

export default function HomeMovies({ today, endOfYear, thirtyDaysAgo, logo }) {
  return (
    <>
      {/* Helmet for meta tags */}
      <Helmet>
        {/* Meta tags */}
        <meta name="robots" content="index, archive" />
        <meta name="title" content={import.meta.env.VITE_APP_NAME} />
        <meta name="description" content={import.meta.env.VITE_APP_DESC} />
        <meta name="keywords" content={import.meta.env.VITE_APP_KEYWORDS} />
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />

        {/* Page title */}
        <title>{import.meta.env.VITE_APP_NAME}</title>

        {/* Open Graph tags */}
        <meta property="og:site_name" content={import.meta.env.VITE_APP_NAME} />
        <meta property="og:title" content={import.meta.env.VITE_APP_NAME} />
        <meta
          property="og:description"
          content={import.meta.env.VITE_APP_DESC}
        />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_APP_URL}/popcorn.png`}
        />
        <meta property="og:url" content={import.meta.env.VITE_APP_URL} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Home Slider */}
      <HomeSlider apiUrl="/discover/movie" date_gte={thirtyDaysAgo} />

      {/* Now Playing */}
      <section id="nowPlaying" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="Now Playing"
          apiUrl="/discover/movie"
          date_gte={thirtyDaysAgo}
          date_lte={today}
        />
      </section>

      {/* Upcoming Movies */}
      <section id="upcoming">
        <FilmSlider
          logo={logo}
          title="Upcoming Movies"
          apiUrl="/discover/movie"
          date_gte={today}
          date_lte={endOfYear}
        />
      </section>

      {/* Top Rated */}
      <section id="topRated">
        <FilmSlider
          logo={logo}
          title="Top Rated"
          apiUrl="/discover/movie"
          apiSortBy="vote_count.desc"
        />
      </section>

      {/* Trending */}
      <section id="trending">
        <Trending num={1} />
      </section>

      {/* Marvel Studios */}
      <section id="marvelStudios" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="Marvel Studios"
          apiUrl="/discover/movie"
          apiCompanies="420"
        />
      </section>

      {/* DC Comics */}
      <section id="dcComics">
        <FilmSlider
          logo={logo}
          title="DC Comics"
          apiUrl="/discover/movie"
          apiCompanies="429"
        />
      </section>

      {/* Walt Disney Pictures */}
      <section id="waltDisneyPictures">
        <FilmSlider
          logo={logo}
          title="Walt Disney Pictures"
          apiUrl="/discover/movie"
          apiCompanies="2"
        />
      </section>

      {/* Universal Pictures */}
      <section id="universalPictures">
        <FilmSlider
          logo={logo}
          title="Universal Pictures"
          apiUrl="/discover/movie"
          apiCompanies="33"
        />
      </section>

      {/* Paramount Pictures */}
      <section className="paramountPictures">
        <FilmSlider
          logo={logo}
          title="Paramount Pictures"
          apiUrl="/discover/movie"
          apiCompanies="4"
        />
      </section>

      {/* 20th Century Studios */}
      <section id="20thCenturyStudios">
        <FilmSlider
          logo={logo}
          title="20th Century Studios"
          apiUrl="/discover/movie"
          apiCompanies="25"
        />
      </section>

      {/* Pixar Animation Studios */}
      <section id="pixarAnimationStudios">
        <FilmSlider
          logo={logo}
          title="Pixar Animation Studios"
          apiUrl="/discover/movie"
          apiCompanies="3"
        />
      </section>

      {/* Trending */}
      <section id="trending">
        <Trending num={2} />
      </section>

      {/* Genres */}
      <section id="action" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="Action"
          apiUrl="/discover/movie"
          apiGenres={`28`}
        />
      </section>
      <section id="drama">
        <FilmSlider
          logo={logo}
          title="Drama"
          apiUrl="/discover/movie"
          apiGenres={`18`}
        />
      </section>
      <section id="comedy">
        <FilmSlider
          logo={logo}
          title="Comedy"
          apiUrl="/discover/movie"
          apiGenres={`35`}
        />
      </section>
      <section id="mystery">
        <FilmSlider
          logo={logo}
          title="Mystery"
          apiUrl="/discover/movie"
          apiGenres={`9648`}
        />
      </section>
      <section id="romance">
        <FilmSlider
          logo={logo}
          title="Romance"
          apiUrl="/discover/movie"
          apiGenres={`10749`}
        />
      </section>
      <section id="horror">
        <FilmSlider
          logo={logo}
          title="Horror"
          apiUrl="/discover/movie"
          apiGenres={`27`}
        />
      </section>
      <section id="scienceFiction">
        <FilmSlider
          logo={logo}
          title="Science Fiction"
          apiUrl="/discover/movie"
          apiGenres={`878`}
        />
      </section>
    </>
  );
}
