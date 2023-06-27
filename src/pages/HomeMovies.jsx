import React, { useEffect } from "react";
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";
import { Helmet } from "react-helmet";
import AdComponent from "../components/AdComponent";

export default function HomeMovies({ today, thisYear }) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="index, archive" />
        <meta name="description" content={import.meta.env.VITE_APP_DESC} />
        <meta name="keywords" content={import.meta.env.VITE_APP_KEYWORDS} />
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />

        <title>{import.meta.env.VITE_APP_NAME}</title>

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

      <HomeSlider apiUrl="/discover/movie" apiUpcoming={today} />
      {/* <section id="genres">
                  <Genres />
                </section> */}
      <section id="nowPlaying" className="pt-[2rem]">
        <FilmSlider title="Now Playing" apiUrl="/movie/now_playing" />
      </section>
      <section id="upcoming">
        <FilmSlider
          title="Upcoming Movies"
          apiUrl="/movie/upcoming"
          apiUpcoming={today}
        />
      </section>
      <section id="topRated">
        <FilmSlider title="Top Rated" apiUrl="/movie/top_rated" />
      </section>
      {/* <section className="py-4">
        <AdComponent />
      </section> */}
      <section id="trending">
        <Trending num={1} />
      </section>
      <section className="pt-[2rem]">
        <FilmSlider
          title="Marvel Studios"
          apiUrl="/discover/movie"
          apiCompanies="420"
        />
      </section>
      <section>
        <FilmSlider
          title="DC Comics"
          apiUrl="/discover/movie"
          apiCompanies="429"
        />
      </section>
      <section>
        <FilmSlider
          title="Walt Disney Pictures"
          apiUrl="/discover/movie"
          apiCompanies="2"
        />
      </section>
      <section>
        <FilmSlider
          title="Universal Pictures"
          apiUrl="/discover/movie"
          apiCompanies="33"
        />
      </section>
      <section>
        <FilmSlider
          title="Paramount Pictures"
          apiUrl="/discover/movie"
          apiCompanies="4"
        />
      </section>
      <section>
        <FilmSlider
          title="20th Century Studios"
          apiUrl="/discover/movie"
          apiCompanies="25"
        />
      </section>
      <section>
        <FilmSlider
          title="Pixar Animation Studios"
          apiUrl="/discover/movie"
          apiCompanies="3"
        />
      </section>
      <section id="trending">
        <Trending num={2} />
      </section>
      <section>
        <FilmSlider title="Action" apiUrl="/discover/movie" apiGenres={`28`} />
      </section>
      <section>
        <FilmSlider title="Drama" apiUrl="/discover/movie" apiGenres={`18`} />
      </section>
      <section>
        <FilmSlider title="Comedy" apiUrl="/discover/movie" apiGenres={`35`} />
      </section>
      <section>
        <FilmSlider
          title="Mystery"
          apiUrl="/discover/movie"
          apiGenres={`9648`}
        />
      </section>
      <section>
        <FilmSlider
          title="Romance"
          apiUrl="/discover/movie"
          apiGenres={`10749`}
        />
      </section>
      <section>
        <FilmSlider title="Horror" apiUrl="/discover/movie" apiGenres={`27`} />
      </section>
      <section>
        <FilmSlider
          title="Science Fiction"
          apiUrl="/discover/movie"
          apiGenres={`878`}
        />
      </section>
    </>
  );
}
