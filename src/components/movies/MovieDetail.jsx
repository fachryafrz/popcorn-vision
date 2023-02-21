import { MovieBackdrop } from "./MovieBackdrop";
import { MoviePoster } from "./MoviePoster";
import { SimilarMovies } from "./SimilarMovies";
import { CastsList } from "./CastsList";
import { MovieOverview } from "./MovieOverview";
import axios from "axios";
import { useEffect, useState } from "react";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import logo from "/popcorn.png";

const MovieDetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            append_to_response: "credits,recommendations,reviews",
          },
        })
        .then((response) => {
          setMovie(response.data);
        });
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    document.title = `${movie.title} - Popcorn Prespective`;
  }, [movie]);

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get("https://api.themoviedb.org/3/genre/movie/list", {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        })
        .then((response) => {
          setGenres(response.data.genres);
        });
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            page: page,
          },
        })
        .then((response) => {
          setPage(response.data);
        });
    };

    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col bg-base-dark-gray text-white">
      {/* Movie Background/Backdrop */}
      <MovieBackdrop logo={logo} movie={movie} />
      <div className="z-10 -mt-[4rem] md:-mt-[14rem]">
        <div className="mx-auto max-w-7xl flex gap-4 lg:gap-8 px-4 pb-[2rem] md:pb-[5rem]">
          {/* Left */}
          <MoviePoster logo={logo} movie={movie} />
          {/* Middle */}
          <MovieOverview logo={logo} movie={movie} page={page} />
          {/* Right */}
          <CastsList logo={logo} movie={movie} />
        </div>
        {/* Similar */}
        <SimilarMovies logo={logo} movie={movie} genres={genres} />
      </div>
    </div>
  );
};

export default MovieDetail;
