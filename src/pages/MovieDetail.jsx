import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Swiper
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Components
import { MovieBackdrop } from "../components/MovieBackdrop";
import { MoviePoster } from "../components/MoviePoster";
import { SimilarMovies } from "../components/SimilarMovies";
import { CastsList } from "../sections/CastsList";
import { MovieOverview } from "../components/MovieOverview";

const MovieDetail = ({ id, logo }) => {
  // State variables
  const [movie, setMovie] = useState([]); // Stores the movie data
  const [genres, setGenres] = useState([]); // Stores the genres data
  const [reviews, setReviews] = useState([]); // Stores the reviews data
  const [loading, setLoading] = useState(true); // Indicates whether the data is loading or not
  const [recommendations, setRecommendations] = useState([]); // Stores the recommendations data
  const [backdrops, setBackdrops] = useState([]); // Stores the backdrop images data
  const [totalReviewPages, setTotalReviewPages] = useState(); // Stores the total number of review pages

  // Other variables
  const location = useLocation(); // Provides information about the current URL
  const isTvPage = location.pathname.startsWith("/tv"); // Indicates whether it's a TV page or not

  // API key for making requests
  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";

  // Parameters for the API request
  let params = {
    api_key: apiKey,
    append_to_response: "credits,videos",
  };

  // Update params if it's a TV page
  if (isTvPage) {
    params = {
      api_key: apiKey,
      append_to_response: "credits,videos",
    };
  }

  useEffect(() => {
    setLoading(true);

    // Fetch movie details
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
      } catch (error) {
        console.error(`Error fetching movie: ${error}`);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 250);
      }
    };

    // Fetch backdrops
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
        console.error(`Error fetching backdrops: ${error}`);
      }
    };

    // Fetch genres
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
        console.error(`Error fetching genres: ${error}`);
      }
    };

    // Fetch reviews
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
        console.error(`Error fetching reviews: ${error}`);
      }
    };

    // Fetch recommendations
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
        console.error(`Error fetching recommendations: ${error}`);
      }
    };

    // Trigger the fetch functions
    fetchRecommendations();
    fetchMovie();
    fetchGenres();
    fetchBackdrops();
    fetchReviews();
  }, [id]);

  // Determine the film release date based on whether it's a movie or TV show
  const filmReleaseDate = !isTvPage
    ? new Date(movie.release_date).getFullYear() // For movies, use the release_date
    : new Date(movie.last_air_date).getFullYear() ===
      new Date(movie.first_air_date).getFullYear()
    ? new Date(movie.first_air_date).getFullYear() // For TV shows with the same first and last air date, use the first_air_date
    : `${new Date(movie.first_air_date).getFullYear()}-${new Date(
        movie.last_air_date
      ).getFullYear()}`; // For TV shows with different first and last air dates, format the release date as a range

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
        }) - ${import.meta.env.VITE_APP_NAME} ${isTvPage && `(TV)`}`}</title>

        {/* Open Graph */}
        <meta property="og:site_name" content={import.meta.env.VITE_APP_NAME} />
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
          property="twitter:url"
          content={`${import.meta.env.VITE_APP_URL}/${
            !isTvPage ? `movies` : `tv`
          }/${movie.id}`}
        />
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
              totalReviewPages={totalReviewPages}
              setReviews={setReviews}
              params={params}
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
