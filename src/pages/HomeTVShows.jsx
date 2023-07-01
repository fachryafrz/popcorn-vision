import React from "react";
import { Helmet } from "react-helmet";

// Components
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";

export default function HomeTVShows({ today, endOfYear, thirtyDaysAgo, logo }) {
  return (
    <>
      {/* Helmet for meta tags */}
      <Helmet>
        {/* Meta tags */}
        <meta name="robots" content="index, archive" />
        <meta name="description" content={import.meta.env.VITE_APP_DESC} />
        <meta name="keywords" content={import.meta.env.VITE_APP_KEYWORDS} />
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />

        {/* Page title */}
        <title>{import.meta.env.VITE_APP_NAME} (TV)</title>

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
      <HomeSlider apiUrl="/discover/tv" date_gte={thirtyDaysAgo} />

      {/* On The Air */}
      <section id="onTheAir" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="On The Air"
          apiUrl="/discover/tv"
          date_gte={thirtyDaysAgo}
          date_lte={today}
        />
      </section>

      {/* Upcoming Series */}
      <section id="upcomingSeries">
        <FilmSlider
          logo={logo}
          title="Upcoming Series"
          apiUrl="/discover/tv"
          date_gte={today}
          date_lte={endOfYear}
        />
      </section>

      {/* Top Rated */}
      <section id="topRated">
        <FilmSlider
          logo={logo}
          title="Top Rated"
          apiUrl="/discover/tv"
          apiSortBy="vote_count.desc"
        />
      </section>

      {/* Trending */}
      <section id="trending">
        <Trending num={1} />
      </section>

      {/* Disney+ */}
      <section id="disney+" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="Disney+"
          apiUrl="/discover/tv"
          apiCompanies={2739}
        />
      </section>

      {/* Netflix */}
      <section id="netflix">
        <FilmSlider
          logo={logo}
          title="Netflix"
          apiUrl="/discover/tv"
          apiCompanies={213}
        />
      </section>

      {/* HBO */}
      <section id="hbo">
        <FilmSlider
          logo={logo}
          title="HBO"
          apiUrl="/discover/tv"
          apiCompanies={49}
        />
      </section>

      {/* Prime Video */}
      <section id="primevideo">
        <FilmSlider
          logo={logo}
          title="Prime Video"
          apiUrl="/discover/tv"
          apiCompanies={1024}
        />
      </section>

      {/* Hulu */}
      <section id="hulu">
        <FilmSlider
          logo={logo}
          title="Hulu"
          apiUrl="/discover/tv"
          apiCompanies={453}
        />
      </section>

      {/* Trending */}
      <section id="trending">
        <Trending num={2} />
      </section>

      {/* Genres */}
      <section id="actionAdventure" className="pt-[2rem]">
        <FilmSlider
          logo={logo}
          title="Action & Adventure"
          apiUrl="/discover/tv"
          apiGenres={`10759`}
        />
      </section>
      <section id="animation">
        <FilmSlider
          logo={logo}
          title="Animation"
          apiUrl="/discover/tv"
          apiGenres={`16`}
        />
      </section>
      <section id="comedy">
        <FilmSlider
          logo={logo}
          title="Comedy"
          apiUrl="/discover/tv"
          apiGenres={`35`}
        />
      </section>
      <section id="crime">
        <FilmSlider
          logo={logo}
          title="Crime"
          apiUrl="/discover/tv"
          apiGenres={`80`}
        />
      </section>
      <section id="documentary">
        <FilmSlider
          logo={logo}
          title="Documentary"
          apiUrl="/discover/tv"
          apiGenres={`99`}
        />
      </section>
      <section id="drama">
        <FilmSlider
          logo={logo}
          title="Drama"
          apiUrl="/discover/tv"
          apiGenres={`18`}
        />
      </section>
      <section id="family">
        <FilmSlider
          logo={logo}
          title="Family"
          apiUrl="/discover/tv"
          apiGenres={`10751`}
        />
      </section>
      <section id="mystery">
        <FilmSlider
          logo={logo}
          title="Mystery"
          apiUrl="/discover/tv"
          apiGenres={`9648`}
        />
      </section>
      <section id="romance">
        <FilmSlider
          logo={logo}
          title="Romance"
          apiUrl="/discover/tv"
          apiGenres={`10749`}
        />
      </section>
      <section id="realityShow">
        <FilmSlider
          logo={logo}
          title="Reality Show"
          apiUrl="/discover/tv"
          apiGenres={`10764`}
        />
      </section>
      <section id="scienceFiction">
        <FilmSlider
          logo={logo}
          title="Science Fiction"
          apiUrl="/discover/tv"
          apiGenres={`10765`}
        />
      </section>
      <section id="war">
        <FilmSlider
          logo={logo}
          title="War"
          apiUrl="/discover/tv"
          apiGenres={`10768`}
        />
      </section>
    </>
  );
}
