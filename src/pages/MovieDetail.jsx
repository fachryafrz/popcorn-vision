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
import { Helmet } from "react-helmet";

const MovieDetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [backdrops, setBackdrops] = useState([]);

  const [totalReviewPages, setTotalReviewPages] = useState();

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    append_to_response: "credits,videos",
  };

  if (isTvPage) {
    params = {
      api_key: apiKey,
      append_to_response: "credits,videos",
    };
  }

  useEffect(() => {
    setLoading(true);

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${id}`,
          {
            params: { ...params },
          }
        );
        setMovie(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(`Errornya movies: ${error}`);
      }
    };

    const fetchBackdrops = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${id}/images`,
          {
            params: {
              api_key: apiKey,
              include_image_language: "en",
            },
          }
        );
        setBackdrops(response.data.backdrops);
      } catch (error) {
        console.error(`Errornya backdrops: ${error}`);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/genre/${
            !isTvPage ? `movie` : `tv`
          }/list`,
          {
            params: {
              ...params,
            },
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error(`Errornya genres: ${error}`);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${id}/reviews`,
          {
            params: {
              ...params,
              page: 1,
            },
          }
        );
        setReviews(response.data.results);
        setTotalReviewPages(response.data.total_pages);
      } catch (error) {
        console.error(`Errornya reviews: ${error}`);
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${id}/reviews`,
          {
            params: {
              ...params,
              page: 2,
            },
          }
        );
        setReviews((prevReviews) => [...prevReviews, ...response.data.results]);
      } catch (error) {
        console.error(`Errornya reviews kedua: ${error}`);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${id}/recommendations`,
          {
            params: {
              ...params,
              page: 1,
            },
          }
        );
        setRecommendations(response.data.results);
      } catch (error) {
        console.error(`Errornya recommendations: ${error}`);
      }
    };

    fetchRecommendations();
    fetchMovie();
    fetchGenres();
    fetchBackdrops();
    fetchReviews();
  }, [id]);

  const filmReleaseDate = !isTvPage
    ? new Date(movie.release_date).getFullYear()
    : new Date(movie.last_air_date).getFullYear() ===
      new Date(movie.first_air_date).getFullYear()
    ? new Date(movie.first_air_date).getFullYear()
    : `${new Date(movie.first_air_date).getFullYear()}-${new Date(
        movie.last_air_date
      ).getFullYear()}`;

  return (
    <div className="flex flex-col bg-base-dark-gray text-white">
      <Helmet>
        {/* SEO */}
        <meta name="robots" content="index, archive" />
        <meta name="description" content={movie.overview} />
        <link
          rel="canonical"
          href={`${import.meta.env.VITE_APP_URL}/${
            !isTvPage ? `movies` : `tv`
          }/${movie.id}`}
        />

        {/* Page Title */}
        <title>{`${!isTvPage ? movie.title : movie.name} (${
          filmReleaseDate ? filmReleaseDate : `Coming soon`
        }) - ${import.meta.env.VITE_APP_NAME}`}</title>

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${!isTvPage ? movie.title : movie.name} (${
            filmReleaseDate ? filmReleaseDate : `Coming soon`
          }) - ${import.meta.env.VITE_APP_NAME}`}
        />
        <meta property="og:description" content={movie.overview} />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_API_IMAGE_URL_500}${
            movie.poster_path
          }`}
        />
        <meta
          property="og:image:alt"
          content={!isTvPage ? movie.title : movie.name}
        />
        <meta
          property="og:url"
          content={`${import.meta.env.VITE_APP_URL}/${
            !isTvPage ? `movies` : `tv`
          }/${movie.id}`}
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${!isTvPage ? movie.title : movie.name} (${
            filmReleaseDate ? filmReleaseDate : `Coming soon`
          }) - ${import.meta.env.VITE_APP_NAME}`}
        />
        <meta name="twitter:description" content={movie.overview} />
        <meta
          name="twitter:image"
          content={`${import.meta.env.VITE_API_IMAGE_URL_500}${
            movie.poster_path
          }`}
        />
        <meta
          name="twitter:image:alt"
          content={!isTvPage ? movie.title : movie.name}
        />
      </Helmet>

      {/* Movie Background/Backdrop */}
      <MovieBackdrop
        logo={logo}
        movie={movie}
        isTvPage={isTvPage}
        loading={loading}
      />
      <div className="z-10 -mt-[10vh] md:-mt-[20vh] lg:-mt-[30vh] xl:-mt-[50vh]">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-24 gap-4 px-4 pb-[2rem] md:pb-[5rem]">
          {/* Left */}
          <div className="lg:col-span-6">
            <MoviePoster
              logo={logo}
              movie={movie}
              isTvPage={isTvPage}
              loading={loading}
            />
          </div>
          {/* Middle */}
          <div className="lg:col-span-13">
            <MovieOverview
              logo={logo}
              movie={movie}
              isTvPage={isTvPage}
              loading={loading}
              reviews={reviews}
              backdrops={backdrops}
            />
          </div>
          {/* Right */}
          <div className="lg:col-span-5">
            {movie.credits && movie.credits.cast.length > 0 && (
              <CastsList
                logo={logo}
                movie={movie}
                isTvPage={isTvPage}
                loading={loading}
              />
            )}
          </div>
        </div>
        {/* Similar */}
        {recommendations && recommendations.length > 0 && (
          <SimilarMovies
            logo={logo}
            movie={movie}
            genres={genres}
            isTvPage={isTvPage}
            loading={loading}
            recommendations={recommendations}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
