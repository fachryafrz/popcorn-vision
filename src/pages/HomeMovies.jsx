import React from "react";
import FilmSlider from "../components/FilmSlider";
import HomeSlider from "../components/HomeSlider";
import Trending from "../components/Trending";

export default function HomeMovies({ today, thisYear }) {
  return (
    <>
      <HomeSlider
        apiUrl="/discover/movie"
        apiUpcoming={today}
        apiSortBy={`popularity.desc`}
      />
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
      <section id="trending">
        <Trending apiUrl={`/trending/movie/day`} />
      </section>
      <section className="pt-[2rem]">
        <FilmSlider
          title="Marvel Cinematic Universe"
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
      <section id="topRated">
        <FilmSlider title="Top Rated" apiUrl="/movie/top_rated" />
      </section>
    </>
  );
}