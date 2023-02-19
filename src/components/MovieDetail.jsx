import axios from "axios";
import { useEffect, useState } from "react";

const MovieDetail = ({ id }) => {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        })
        .then((response) => {
          console.log(response.data);
          setMovie(response.data);
        });
    };

    fetchMovie();
  }, []);

  return (
    <div className="flex flex-col bg-base-dark-gray text-white">
      <figure className="max-h-[70vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="object-top"
        />
      </figure>
      <div className="z-10 -mt-[4rem] sm:-mt-[14rem]">
        <div className="mx-auto max-w-7xl flex gap-6 px-4 lg:px-[9rem] pb-[2rem] md:pb-[5rem]">
          <figure className="max-w-[200px] hidden md:block lg:max-w-[250px] aspect-poster rounded-xl overflow-hidden self-start sticky top-12">
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
              alt={movie.title}
            />
          </figure>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 items-center md:gap-0">
              <div className="min-w-fit">
                <figure className="max-w-[100px] md:hidden lg:max-w-[250px] aspect-poster rounded-lg overflow-hidden self-start">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                    alt={movie.title}
                  />
                </figure>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-3xl lg:text-5xl line-clamp-2 md:py-2">
                  {movie.title}
                </h1>
                <div className="text-gray-400 sm:hidden text-sm flex flex-wrap gap-1 items-center">
                  {new Date(movie.release_date).getFullYear()} &bull;{" "}
                  {`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}{" "}
                  &bull;{" "}
                  {movie.genres &&
                    movie.genres.map((genre) => {
                      return (
                        <span
                          key={genre.id}
                          className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray self-start"
                        >
                          {genre.name}
                        </span>
                      );
                    })}
                </div>
                <table className="max-w-fit hidden sm:block">
                  <tr>
                    <td className="pr-8 py-1 text-gray-400">Genre</td>
                    <td className="flex gap-1">
                      {movie.genres &&
                        movie.genres.map((genre) => {
                          return (
                            <span
                              key={genre.id}
                              className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray"
                            >
                              {genre.name}
                            </span>
                          );
                        })}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-8 py-1 text-gray-400">Runtime</td>
                    <td>{`${Math.floor(movie.runtime / 60)}h ${
                      movie.runtime % 60
                    }m`}</td>
                  </tr>
                  <tr>
                    <td className="pr-8 py-1 text-gray-400">Release Date</td>
                    <td>{new Date(movie.release_date).getFullYear()}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="prose text-white">
              <div className="flex flex-col gap-2 ">
                <h2 className="text-white m-0">Overview</h2>
                <p className="text-gray-400 text-lg">{movie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
