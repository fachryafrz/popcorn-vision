import { MovieBackdrop } from "../components/MovieBackdrop";
import { MoviePoster } from "../components/MoviePoster";
import { SimilarMovies } from "../components/SimilarMovies";
import { CastsList } from "../sections/CastsList";
import { MovieOverview } from "../components/MovieOverview";
import axios from "axios";
import { useEffect, useState } from "react";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import logo from "/popcorn.png";
import { useLocation } from "react-router-dom";

const MovieDetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState();
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    append_to_response: "credits,recommendations,reviews,images,videos",
  };

  if (isTvPage) {
    params = {
      api_key: apiKey,
      append_to_response: "credits,recommendations,reviews,images,videos",
    };
  }

  useEffect(() => {
    setLoading(true);

    const fetchMovie = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/${!isTvPage ? `movie` : `tv`}/${id}`,
          {
            params,
          }
        )
        .then((response) => {
          setMovie(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    document.title = `${!isTvPage ? movie.title : movie.name} - ${
      import.meta.env.VITE_APP_NAME
    }`;
  }, [movie]);

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/genre/${
            !isTvPage ? `movie` : `tv`
          }/list`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        )
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
      <MovieBackdrop
        logo={logo}
        movie={movie}
        isTvPage={isTvPage}
        loading={loading}
      />
      <div className="z-10 -mt-[10vh] md:-mt-[20vh] lg:-mt-[30vh] xl:-mt-[50vh]">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-4 px-4 pb-[2rem] md:pb-[5rem]">
          {/* Left */}
          <div className="lg:col-span-3">
            <MoviePoster
              logo={logo}
              movie={movie}
              isTvPage={isTvPage}
              loading={loading}
            />
          </div>
          {/* Middle */}
          <div className="col-span-12 lg:col-span-7">
            <MovieOverview
              logo={logo}
              movie={movie}
              page={page}
              isTvPage={isTvPage}
              loading={loading}
            />
          </div>
          {/* Right */}
          <div className="col-span-12 lg:col-span-2">
            <CastsList
              logo={logo}
              movie={movie}
              isTvPage={isTvPage}
              loading={loading}
            />
          </div>
        </div>
        {/* Similar */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <SimilarMovies
            logo={logo}
            movie={movie}
            genres={genres}
            isTvPage={isTvPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetail;