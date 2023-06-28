import React from "react";
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function HomeTVShows({
  today,
  currentYear,
  endOfYear,
  firstDate,
}) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="index, archive" />
        <meta name="description" content={import.meta.env.VITE_APP_DESC} />
        <meta name="keywords" content={import.meta.env.VITE_APP_KEYWORDS} />
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />

        <title>{import.meta.env.VITE_APP_NAME} - TV</title>

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

      <HomeSlider
        apiUrl="/discover/tv"
        date_gte={currentYear}
        date_lte={today}
      />
      <section id="onTheAir" className="pt-[2rem]">
        <FilmSlider
          title="On The Air"
          apiUrl="/discover/tv"
          date_gte={firstDate}
          date_lte={today}
        />
      </section>
      <section id="upcomingSeries">
        <FilmSlider
          title="Upcoming Series"
          apiUrl="/discover/tv"
          date_gte={today}
          date_lte={endOfYear}
        />
      </section>
      <section id="topRated">
        <FilmSlider
          title="Top Rated"
          apiUrl="/discover/tv"
          apiSortBy="vote_count.desc"
        />
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
      <section id="actionAdventure">
        <FilmSlider
          title="Action & Adventure"
          apiUrl="/discover/tv"
          apiGenres={`10759,10762`}
        />
      </section>
      <section id="animation">
        <FilmSlider title="Animation" apiUrl="/discover/tv" apiGenres={`16`} />
      </section>
      <section id="comedy">
        <FilmSlider title="Comedy" apiUrl="/discover/tv" apiGenres={`35`} />
      </section>
      <section id="crime">
        <FilmSlider title="Crime" apiUrl="/discover/tv" apiGenres={`80`} />
      </section>
      <section id="documentary">
        <FilmSlider
          title="Documentary"
          apiUrl="/discover/tv"
          apiGenres={`99`}
        />
      </section>
      <section id="drama">
        <FilmSlider title="Drama" apiUrl="/discover/tv" apiGenres={`18`} />
      </section>
      <section id="family">
        <FilmSlider title="Family" apiUrl="/discover/tv" apiGenres={`10751`} />
      </section>
      <section id="mystery">
        <FilmSlider title="Mystery" apiUrl="/discover/tv" apiGenres={`9648`} />
      </section>
      <section id="romance">
        <FilmSlider title="Romance" apiUrl="/discover/tv" apiGenres={`10749`} />
      </section>
      <section id="realityShow">
        <FilmSlider
          title="Reality Show"
          apiUrl="/discover/tv"
          apiGenres={`10764`}
        />
      </section>
      <section id="scienceFiction">
        <FilmSlider
          title="Science Fiction"
          apiUrl="/discover/tv"
          apiGenres={`10765`}
        />
      </section>
      <section id="war">
        <FilmSlider title="War" apiUrl="/discover/tv" apiGenres={`10768`} />
      </section>
    </>
  );
}
