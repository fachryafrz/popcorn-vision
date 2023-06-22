import React from "react";
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";

export default function HomeTVShows({ today, thisYear }) {
  return (
    <>
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
      <section id="trending">
        <Trending apiUrl="/trending/tv/day" />
      </section>
      <section className="pt-[2rem]">
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
      <section id="topRated">
        <FilmSlider title="Top Rated" apiUrl="/tv/top_rated" />
      </section>
    </>
  );
}
