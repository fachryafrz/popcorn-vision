import React from "react";
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function HomeTVShows({ today, thisYear }) {
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

      <HomeSlider apiUrl="/discover/tv" apiUpcoming={thisYear} />
      <section id="onTheAir" className="pt-[2rem]">
        <FilmSlider
          title="Discover New Series"
          apiUrl="/discover/tv"
          apiUpcoming={thisYear}
        />
      </section>
      <section>
        <FilmSlider
          title="Upcoming Series"
          apiUrl="/discover/tv"
          apiUpcoming={today}
        />
      </section>
      <section id="topRated">
        <FilmSlider title="Top Rated" apiUrl="/tv/top_rated" />
      </section>
      <section id="trending">
        <Trending num={1} />
      </section>
      <section id="disney+" className="pt-[2rem]">
        <FilmSlider title="Disney+" apiUrl="/discover/tv" apiCompanies={2739} />
      </section>
      <section id="netflix">
        <FilmSlider title="Netflix" apiUrl="/discover/tv" apiCompanies={213} />
      </section>
      <section id="hbo">
        <FilmSlider title="HBO" apiUrl="/discover/tv" apiCompanies={49} />
      </section>
      <section id="primevideo">
        <FilmSlider
          title="Prime Video"
          apiUrl="/discover/tv"
          apiCompanies={1024}
        />
      </section>
      <section id="hulu">
        <FilmSlider title="Hulu" apiUrl="/discover/tv" apiCompanies={453} />
      </section>
      <section id="trending">
        <Trending num={2} />
      </section>
      <section>
        <FilmSlider
          title="Action & Adventure"
          apiUrl="/discover/tv"
          apiGenres={`10759,10762`}
        />
      </section>
      <section>
        <FilmSlider title="Animation" apiUrl="/discover/tv" apiGenres={`16`} />
      </section>
      <section>
        <FilmSlider title="Comedy" apiUrl="/discover/tv" apiGenres={`35`} />
      </section>
      <section>
        <FilmSlider title="Crime" apiUrl="/discover/tv" apiGenres={`80`} />
      </section>
      <section>
        <FilmSlider
          title="Documentary"
          apiUrl="/discover/tv"
          apiGenres={`99`}
        />
      </section>
      <section>
        <FilmSlider title="Drama" apiUrl="/discover/tv" apiGenres={`18`} />
      </section>
      <section>
        <FilmSlider title="Family" apiUrl="/discover/tv" apiGenres={`10751`} />
      </section>
      <section>
        <FilmSlider title="Mystery" apiUrl="/discover/tv" apiGenres={`9648`} />
      </section>
      <section>
        <FilmSlider title="Romance" apiUrl="/discover/tv" apiGenres={`10749`} />
      </section>
      <section>
        <FilmSlider title="Reality" apiUrl="/discover/tv" apiGenres={`10764`} />
      </section>
      <section>
        <FilmSlider
          title="Science Fiction"
          apiUrl="/discover/tv"
          apiGenres={`10765`}
        />
      </section>
      <section>
        <FilmSlider title="War" apiUrl="/discover/tv" apiGenres={`10768`} />
      </section>
    </>
  );
}
